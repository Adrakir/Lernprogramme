"""Run with python browser_matrix.py chromium|webkit [live]."""
import sys
import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright, expect
from atelier_wege import pruefe_lernwege, pruefe_stationen

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

    page.goto(base + "#farbwerkstatt?thema=13")
    expect(page.get_by_label("Hinterster Hügel")).to_be_visible()
    page.goto(base + "farbduell.html")
    expect(page.get_by_label("Thema")).to_be_visible()
    page.locator("#start").click()
    expect(page.locator("[data-i]")).to_have_count(4)


def tab_to(page, target):
    """Exercise document tab order, including elements inside newly opened details."""
    for _ in range(220):
        if target.evaluate("(el)=>document.activeElement===el"):
            assert target.evaluate("(el)=>el.matches(':focus-visible')")
            return
        page.keyboard.press("Tab")
    raise AssertionError("Ziel in der Tabreihenfolge nicht erreichbar")

def check_green(page,base):
    page.goto(base+"#gruenversuch")
    expect(page.locator("#gruenLabor")).not_to_be_visible()
    page.locator("#gruenPlan").fill("Ein helles Grün für junge Blätter.")
    page.locator("#gruenStart").click()
    expect(page.locator("#gruenProbe")).to_have_css("background-color","rgb(56, 151, 95)")
    for field,value in {"gelbA":"1","blauA":"1","probeA":"Zu dunkel","aenderung":"Mehr Gelb","gelbB":"3","blauB":"1","wirkung":"B wirkt sonniger"}.items():
        page.locator("#"+field).fill(value)
    page.locator("#wahlProbe").select_option("B")
    expect(page.locator("#rezeptB")).to_have_text("3 Portionen Gelb + 1 Portion Blau")
    page.locator("#gruenVergleich").click()
    expect(page.locator("#gruenBilanz")).to_contain_text("B wirkt sonniger")
    page.goto(base+"#beobachten")
    expect(page.locator("#bogenEntdeckung")).to_contain_text("Mehr Gelb")
    page.locator("#bogenKriterien select").first.select_option(label="Selbstständig gezeigt")
    expect(page.locator("#bogenAuftrag")).to_contain_text("Verändere nur die Menge")
    page.locator("#bogenNotiz").fill("Begründet den Gelbanteil am zweiten Blatt.")
    page.locator("#bogenWerk").select_option(".2")
    expect(page.locator("#bogenNotiz")).to_have_value("")
    page.locator("#bogenNotiz").fill("Erklärt den dunklen Schatten.")
    page.evaluate("window.print=()=>{}")
    page.locator("#bogenDruck").click()
    expect(page.locator(".print-sheet")).to_contain_text("Erklärt den dunklen Schatten.")
    expect(page.locator(".print-sheet")).to_contain_text("Bild 2")
    page.evaluate("window.dispatchEvent(new Event('afterprint'))")
    page.locator("#bogenWerk").select_option("")
    expect(page.locator("#bogenNotiz")).to_have_value("Begründet den Gelbanteil am zweiten Blatt.")
    page.locator("#guestToggle").click()
    expect(page.locator("#bogenNotiz")).to_have_value("")
    page.goto(base+"#gruenversuch")
    expect(page.locator("#gruenPlan")).to_have_value("")
    page.locator("#gruenPlan").fill("Gastprobe")
    page.once("dialog",lambda dialog:dialog.accept())
    page.locator("#guestToggle").click()
    expect(page.locator("#gruenBilanz")).to_contain_text("B wirkt sonniger")
    page.goto(base+"#beobachten")
    expect(page.locator("#bogenNotiz")).to_have_value("Begründet den Gelbanteil am zweiten Blatt.")

    page.goto(base+"#unterricht")
    page.get_by_role("link",name="Zwei Grünrezepte an der Tafel").click()
    page.get_by_label("Stimmen für A").fill("12")
    page.get_by_label("Stimmen für B").fill("4")
    page.locator("#aufdecken").press("Enter")
    expect(page.locator("#tafelErgebnis")).to_contain_text("Rezept B: 4 Stimmen")

def check_werkstatt(page,base):
    page.goto(base+"#start")
    page.get_by_role("link",name="Farbwerkstatt entdecken").click()
    station=page.get_by_label("Station wählen")
    page.get_by_role("button",name="Bildstelle 1: Himmel").click()
    page.get_by_role("button",name="Bildstelle 4: Blätter").click()
    page.get_by_label("Mein Blick fällt zuerst").fill("Die Blätter leuchten vor dem dunklen Wald.")
    station.select_option("1")
    page.get_by_role("slider").press("End")
    expect(page.locator("#vergleichInfo")).to_contain_text("dasselbe Orange")
    station.select_option("2")
    for k in [0,4,8,2,6,10,1,3,5,7,9,11]:
        page.get_by_label("Farbstein", exact=True).select_option(str(k))
        page.get_by_role("button",name=str(k or 12)+" Uhr",exact=True).click()
    expect(page.locator("#legeMeldung")).to_contain_text("Alle zwölf")
    station.select_option("3")
    page.locator("textarea").first.fill("Mit Weiß wird mein Orange heller.")
    station.select_option("4")
    page.get_by_label("Himmel",exact=True).first.select_option("4")
    expect(page.locator("figure svg rect").first).to_have_attribute("fill","#547896")
    station.select_option("5")
    for name in ["Gelb","Rot","Blau","Orange"]: page.get_by_role("button",name=name,exact=True).click()
    expect(page.get_by_role("button",name="Orange",exact=True)).to_have_attribute("aria-pressed","false")
    station.select_option("6")
    page.locator("textarea").first.fill("Der Strich ist gut sichtbar.")
    station.select_option("7")
    page.get_by_label("3. Nachfragen").fill("Wolltest du den Blick auf den Weg lenken?")
    station.select_option("8")
    expect(page.get_by_role("link",name="Mischblatt als PDF öffnen")).to_have_attribute("href","mischblatt.pdf")
    station.select_option("0")
    expect(page.get_by_label("Mein Blick fällt zuerst")).to_have_value("Die Blätter leuchten vor dem dunklen Wald.")
    for i in range(9):
        station.select_option(str(i))
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth+1"), i

def check_tablet_export(browser, base):
    from tempfile import TemporaryDirectory
    context=browser.new_context(viewport={"width":820,"height":1180},has_touch=True,is_mobile=True)
    try:
        page=context.new_page()
        page.goto(base+"#lernpass")
        page.locator("#passTitle").fill("Blätter im Licht")
        page.locator("#passDate").fill("2026-11-24")
        with page.expect_download() as export:
            page.locator("#copyPass").tap()
        with TemporaryDirectory() as folder:
            path=Path(folder)/export.value.suggested_filename
            export.value.save_as(path)
            assert path.name=="2026-11-24_Blätter-im-Licht.txt"
            page.goto(path.resolve().as_uri())
            expect(page.locator("body")).to_contain_text("Blätter im Licht")
            expect(page.locator("body")).to_contain_text("2026-11-24")
    finally:
        context.close()

def check_learning_regressions(page, base):
    page.goto(base+"#lernweg")
    page.locator("#advanceGuide").click()
    page.reload()
    expect(page.locator("#stage h2")).to_have_text("Orange mischen")
    page.evaluate("""()=>localStorage.setItem('farbatelier.practiceV2',JSON.stringify({
        round:0,index:0,done:[false,true,false],errors:[0,0,0],values:[null,50,{}]
    }))""")
    page.reload()
    page.goto(base+"#praxis")
    expect(page.locator("#stage")).to_contain_text("1 von 3 Aufgaben gelöst")
    page.locator("#pResume").click()
    page.locator('[name="pickPractice"][value="0"]').check()
    for _ in range(2):
        page.locator("#verify").click()
    assert page.evaluate("JSON.parse(localStorage.getItem('farbatelier.practiceV2')).errors[0]") == 1
    page.goto(base+"#komplementaerfarben")
    for n in (0,10,25):
        page.locator(f'[data-preset="{n}"]').click()
        page.locator("#keep").click()
    page.locator("#sampleStudio > summary").click()
    left,right=page.locator(".compare-pair select").all()
    right.select_option("2")
    left.select_option("1")
    left.select_option("2")
    expect(right).to_have_value("1")
    page.get_by_role("button",name="Rezepte einblenden").click()
    page.locator('[data-sample-note="2"]').fill("Gedämpft")
    expect(page.locator(".compare-pair figcaption").first).to_contain_text("Gedämpft")

    page.goto(base+"#kreisstudio")
    page.get_by_role("button",name="Gegenfarben verbinden").click()
    page.reload()
    expect(page.locator("#tafelStart")).to_be_visible()
    field=page.locator("[data-segment='0']")
    field.press("Enter")
    field.press("Enter")
    expect(page.locator(".tafel-status")).to_contain_text("Startfarbe")
    field.press("ArrowRight")
    expect(page.locator("[data-segment='1']")).to_be_focused()
    page.goto(base+"#unterricht?teil=einstieg")
    page.locator("#uw-group").select_option(label="Sekundärfarbe")
    page.reload()
    expect(page.locator("#uw-group")).to_have_value("Sekundärfarbe")
    page.goto(base+"#unterricht?teil=abschluss")
    page.get_by_role("checkbox",name="Frage 1 mündlich beantwortet").check()
    page.reload()
    expect(page.get_by_role("checkbox",name="Frage 1 mündlich beantwortet")).to_be_checked()
    page.goto(base+"#familie")
    # Hit the painted centre of field 3 in the rendered SVG coordinate system.
    family_wheel=page.locator("#familySearchWheel svg")
    position=family_wheel.evaluate("""svg=>{
      const c=svg.querySelector('[data-family-field="2"] circle'),p=svg.createSVGPoint();
      p.x=c.cx.baseVal.value;p.y=c.cy.baseVal.value;
      const screen=p.matrixTransform(c.getScreenCTM()),box=svg.getBoundingClientRect();
      return {x:screen.x-box.left,y:screen.y-box.top};
    }""")
    family_wheel.click(position=position)
    expect(page.locator("#familyPick")).to_have_value("2")
    page.get_by_role("button",name="Zum nächsten Schritt").click()
    page.get_by_role("button",name="Zum nächsten Schritt").click()
    expect(page.locator("#familyAction")).to_contain_text("reines Orange")

def check(page, base):
    page.goto(base)
    expect(page.locator("#startHub")).to_be_visible()
    expect(page.locator(".start-cards a")).to_have_count(3)
    page.locator(".start-cards a[href='#farbkreis']").click()
    expect(page.locator("#pick")).to_be_visible()
    page.locator("#backHome").click()
    expect(page.locator("#startHub")).to_be_visible()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(base + "#farbkreis")
    wheel = page.locator(".wheel")
    wheel.focus()
    page.keyboard.press("ArrowRight")
    expect(wheel).to_be_focused()
    page.locator("#areaMenu > summary").press("Enter")
    page.get_by_role("link",name="Komplementärfarben mischen",exact=True).press("Enter")
    page.locator("#pair").select_option("1")
    page.locator("#ratio").press("End")
    page.locator("#ratio").press("ArrowLeft")
    expect(page.locator("#ratio")).to_have_value("99")
    page.locator("#mixView").press("Enter")
    expect(page.locator("#mixView")).to_have_attribute("aria-pressed","true")
    page.locator("#keep").press("Enter")
    page.locator("[data-sample-note]").fill("Grün üben")
    page.locator("#areaMenu > summary").press("Enter")
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
    # A fresh keyboard-only walk, following the actual focus order.
    page.goto(base+"#farbkreis")
    tab_to(page,page.locator("#areaMenu > summary"))
    page.keyboard.press("Enter")
    tab_to(page, page.get_by_role("link",name="Mischlabor",exact=True))
    page.keyboard.press("Enter")
    tab_to(page,page.locator("#keep"))
    page.keyboard.press("Enter")
    tab_to(page,page.locator("#areaMenu > summary"))
    page.keyboard.press("Enter")
    tab_to(page,page.get_by_role("link",name="Lernpass",exact=True))
    page.keyboard.press("Enter")
    tab_to(page,page.locator("summary").filter(has_text="Partnerrätsel mit einer Farbprobe"))
    page.keyboard.press("Enter")
    # The current follow-up has no samples. Import one before trying the dialog.
    tab_to(page,page.locator("#importSample"))
    page.keyboard.press("Enter")
    tab_to(page,start)
    page.keyboard.press("Enter")
    expect(page.get_by_role("dialog")).to_be_visible()
    page.keyboard.press("Escape")
    expect(start).to_be_focused()
    if sys.argv[1]=="chromium":
        page.goto(base+"#familie")
        page.get_by_text("Farbkreis und drei Rezepte auf einem Blatt",exact=True).click()
        page.evaluate("window.print=()=>{}")
        page.locator("#familyPrint").click()
        pdf=page.pdf(format="A4",margin={"top":"12mm","bottom":"12mm"})
        assert len(re.findall(rb"/Type\s*/Page\b",pdf))==1, "Merkblatt umfasst mehrere Seiten"
    assert not errors, errors

if __name__=="__main__":
    server=ThreadingHTTPServer(("127.0.0.1",0),partial(SimpleHTTPRequestHandler,directory=folder))
    Thread(target=server.serve_forever,daemon=True).start()
    with sync_playwright() as p:
        browser=getattr(p,sys.argv[1]).launch()
        if "live" in sys.argv:
            live(browser.new_page(),"https://adrakir.github.io/Lernprogramme/farbatelier/")
        else:
            with browser.new_context() as wege:
                pruefe_lernwege(wege.new_page(),f"http://127.0.0.1:{server.server_port}/")
            for width in (390,1366):
                with browser.new_context(viewport={"width":width,"height":844}) as stationen:
                    pruefe_stationen(stationen.new_page(),f"http://127.0.0.1:{server.server_port}/")
            regression_context=browser.new_context()
            check_learning_regressions(regression_context.new_page(),f"http://127.0.0.1:{server.server_port}/")
            check_green(regression_context.new_page(),f"http://127.0.0.1:{server.server_port}/")
            regression_context.close()
            check_werkstatt(browser.new_page(viewport={"width":390,"height":844}),f"http://127.0.0.1:{server.server_port}/")
            check_tablet_export(browser,f"http://127.0.0.1:{server.server_port}/")
            for width,height in [(390,844),(820,1180),(1366,768)]:
                context=browser.new_context(viewport={"width":width,"height":height})
                check(context.new_page(),f"http://127.0.0.1:{server.server_port}/")
                context.close()
        browser.close()
    server.shutdown()
