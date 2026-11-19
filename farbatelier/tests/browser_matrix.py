"""Run with python browser_matrix.py chromium|webkit [live]."""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright, expect

root = Path(__file__).resolve().parents[1]
folder = root / "dist" if (root / "dist").is_dir() else root

def live(page, base):
    response = page.goto(base + "#lernpass")
    assert response.ok
    expect(page.locator("#passTitle")).to_be_visible()
    for src in page.locator("script[src]").evaluate_all("(scripts)=>scripts.map(s=>s.src)"):
        assert page.request.get(src).ok, src
    pdf = page.request.get(base + "lernheft.pdf")
    assert pdf.ok and pdf.body().startswith(b"%PDF")
    for route, selector in [("farbkreis",".wheel"),("kreisstudio",".tafel-kreis"),("familie","#familyRound"),("unterricht","#stage h2")]:
        page.goto(base + "#" + route)
        expect(page.locator(selector).first).to_be_visible()

def check(page, base):
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(base + "#farbkreis")
    wheel = page.locator(".wheel")
    wheel.focus()
    page.keyboard.press("ArrowRight")
    expect(wheel).to_be_focused()
    page.get_by_role("link",name="Komplementärfarben mischen",exact=True).press("Enter")
    page.locator("#pair").select_option("1")
    page.locator("#ratio").press("End")
    page.locator("#ratio").press("ArrowLeft")
    expect(page.locator("#ratio")).to_have_value("99")
    page.locator("#mixView").press("Enter")
    expect(page.locator("#mixView")).to_have_attribute("aria-pressed","true")
    page.locator("#keep").press("Enter")
    page.locator("[data-sample-note]").fill("Grün üben")
    page.get_by_role("link",name="Lernpass",exact=True).press("Enter")
    page.locator("#passTitle").fill("Grüne Probe")
    page.locator("#passDate").fill("2026-11-20")
    page.locator("#reportFields input[type=checkbox]").first.check()
    page.locator("input[name=reference]").first.check()
    page.get_by_text("Partnerrätsel mit einer Farbprobe",exact=True).press("Enter")
    start=page.get_by_role("button",name="Rezept verdecken und Rätsel starten")
    start.press("Enter")
    expect(page.get_by_role("dialog")).to_be_visible()
    page.keyboard.press("Escape")
    expect(start).to_be_focused()
    with page.expect_download() as download:
        page.locator("#copyPass").press("Enter")
    assert download.value.suggested_filename == "2026-11-20_Grüne-Probe.txt"
    text=download.value.path().read_text(encoding="utf-8")
    for phrase in ["Mündlich besprochen","Referenzprobe","Grün üben","2026-11-20"]:
        assert phrase in text, phrase
    page.evaluate("window.print=()=>{}")
    page.locator("#printPass").press("Enter")
    content=page.locator(".print-sheet").text_content()
    assert content.count("Grün üben")==1 and "Referenzprobe" in content and "Mündlich besprochen" in content
    page.evaluate("window.dispatchEvent(new Event('afterprint'))")
    assert page.evaluate("names.length===12 && names.every((_,i)=>opposite(opposite(i))===i && opposite(i)===(i+6)%12 && comps.some(([a,b])=>(a===i&&b===opposite(i))||(b===i&&a===opposite(i))))")
    # Each possible interrupted write must leave the complete original accessible.
    for step in range(1,5):
        page.reload()
        page.get_by_text("Folgeversuch und frühere Versuche",exact=True).click()
        page.evaluate("""step=>{let count=0;const write=Storage.prototype.setItem;
          Storage.prototype.setItem=function(key,value){if(++count===step)throw Error('Speicher voll');return write.call(this,key,value)}}""",step)
        page.locator("#follow").click()
        page.reload()
        expect(page.locator("#passTitle")).to_have_value("Grüne Probe")
        expect(page.locator("#reportSamples")).to_contain_text("Grün üben")
    page.get_by_text("Folgeversuch und frühere Versuche",exact=True).click()
    page.locator("#follow").click()
    expect(page.locator("#passTitle")).to_have_value("")
    page.evaluate("""()=>{const b=JSON.parse(localStorage.getItem('farbatelier.recordBook'));
      b.archive.unshift(null);localStorage.setItem('farbatelier.recordBook',JSON.stringify(b))}""")
    page.reload()
    expect(page.locator("#archive")).to_contain_text("Grüne Probe")
    expect(page.locator("#archive")).to_contain_text("beschädigter")
    for route in ["familie","unterricht","kreisstudio","komplementaerfarben"]:
        page.goto(base+"#"+route)
        expect(page.locator("#stage h2").first).to_be_visible()
        overflow = page.evaluate("""() => Array.from(document.querySelectorAll('#stage *')).filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>[e.tagName,e.id,e.className?.baseVal||e.className,Math.round(e.getBoundingClientRect().right)]).slice(0,10)""")
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth+1"), (route,overflow)
    assert not errors, errors

if __name__=="__main__":
    server=ThreadingHTTPServer(("127.0.0.1",0),partial(SimpleHTTPRequestHandler,directory=folder))
    Thread(target=server.serve_forever,daemon=True).start()
    with sync_playwright() as p:
        browser=getattr(p,sys.argv[1]).launch()
        if "live" in sys.argv:
            live(browser.new_page(),"https://adrakir.github.io/Lernprogramme/farbatelier/")
        else:
            for width,height in [(390,844),(820,1180),(1366,768)]:
                context=browser.new_context(viewport={"width":width,"height":height})
                check(context.new_page(),f"http://127.0.0.1:{server.server_port}/")
                context.close()
        browser.close()
    server.shutdown()
