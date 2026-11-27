"""End-to-end checks for the three start cards and the interactive art stations."""
import re

from playwright.sync_api import expect


def setze_regler(regler, wert):
    regler.press("Home")
    minimum = int(regler.get_attribute("min") or 0)
    for _ in range(wert-minimum):
        regler.press("ArrowRight")


def pruefe_lernwege(page, base):
    fehler = []
    page.on("pageerror", lambda error: fehler.append(str(error)))
    page.goto(base)
    karten = page.locator(".start-cards")
    karten.get_by_role("link", name="Farbkreis entdecken").click()
    page.get_by_text("Die drei Farbkreise nebeneinander vergleichen", exact=True).click()
    page.get_by_label("Farbton verfolgen").select_option("2")
    texte = page.locator(".spurreihe figcaption").all_text_contents()
    assert texte == ["Gelb · Rot", "Orange", "Gelb-Orange · Orange · Rot-Orange"]

    page.locator("#backHome").click()
    karten.get_by_role("link", name="Farben mischen").click()
    setze_regler(page.locator("#ratio"),25)
    page.locator("#keep").click()
    page.reload()
    expect(page.locator("#ratio")).to_have_value("25")
    expect(page.locator("[data-sample-note]")).to_have_count(1)
    page.locator("#guestToggle").click()
    expect(page.locator("[data-sample-note]")).to_have_count(0)
    page.once("dialog", lambda d: d.accept())
    page.locator("#guestToggle").click()
    expect(page.locator("[data-sample-note]")).to_have_count(1)

    page.locator("#theme").click()
    page.locator("#largeType").click()
    page.locator("#backHome").click()
    karten.get_by_role("link", name="Farbduell spielen").click()
    expect(page.locator("body")).to_have_class(re.compile(r"dark"))
    expect(page.locator("body")).to_have_class(re.compile("large-type"))
    page.get_by_label("Spielmodus").select_option("2")
    page.get_by_label("Thema").select_option("Bildwirkung")
    # The full topic pool always includes visual questions, regardless of shuffled order.
    length = page.locator("#size option").last.get_attribute("value")
    page.locator("#size").select_option(length)
    page.locator("#start").click()
    bilder = 0
    for i in range(int(length)):
        correct = page.evaluate("deck[round].k")
        if page.locator(".antwortbild").count():
            bilder += 1
            expect(page.locator(".antwortbild")).to_have_count(4)
            page.get_by_text("Bildbeschreibungen", exact=True).click()
            expect(page.locator("ol li")).to_have_count(4)
        page.locator("[data-i]").nth(correct).click()
        if i == 0:
            page.locator("#revise").click()
            page.locator("[data-i]").nth((correct+1) % 4).click()
        page.locator("[data-i]").nth((correct+1) % 4).click()
        page.locator("#revise").click()
        page.locator("[data-i]").nth(correct).click()
        page.locator("#reveal").click()
        expect(page.locator(".begruendung p")).not_to_be_empty()
        page.locator("#next").click()
    assert bilder == 4
    expect(page.locator("h2")).to_have_text("Team 2 gewinnt!")
    page.locator("#practice").click()
    expect(page.locator("main")).to_contain_text("Übungsfrage 1")
    assert not fehler, fehler


def pruefe_stationen(page, base):
    fehler = []
    page.on("pageerror", lambda error: fehler.append(str(error)))
    def station(n):
        page.goto(base + "#farbwerkstatt?thema=" + str(n))
        expect(page.get_by_label("Station wählen")).to_have_value(str(n))

    for n in range(15):
        station(n)
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), n
        page.get_by_text("Station teilen", exact=True).click()
        qr = page.locator("img.stations-qr")
        assert page.request.get(base + qr.get_attribute("src")).ok
        expect(page.get_by_label("Direktlink zu")).to_have_value("https://adrakir.github.io/Lernprogramme/farbatelier/#farbwerkstatt?thema=" + str(n))
    station(2)
    page.get_by_text("Frei legen und zwei Felder tauschen", exact=True).click()
    frei = page.get_by_role("group", name="Frei belegbare Felder")
    page.get_by_label("Freier Farbstein").select_option("3")
    frei.get_by_role("button", name="1 Uhr · frei", exact=True).click()
    page.get_by_label("Freier Farbstein").select_option("1")
    frei.get_by_role("button", name="3 Uhr · frei", exact=True).click()
    for pos, ton in [(1,"Rot-Orange"),(3,"Gelb-Orange")]:
        frei.get_by_role("button", name=f"{pos} Uhr · {ton}", exact=True).click()
    page.get_by_role("button",name="Meinen Kreis prüfen").click()
    expect(page.get_by_text("Alle gelegten Steine passen.", exact=False)).to_be_visible()
    station(4)
    wald = page.locator(".waldpaar > figure").first
    wald.get_by_label("Himmel",exact=True).select_option("4")
    wald.get_by_role("button",name="Variante ausprobieren").click()
    wald.get_by_label("Himmel",exact=True).select_option("5")
    expect(wald.locator(".waldvergleich svg rect").first).to_have_attribute("fill","#547896")
    expect(wald.locator(".waldvergleich svg rect").last).to_have_attribute("fill","#30364e")
    page.get_by_role("button",name="Graustufen-Lupe").click()
    expect(wald.locator(".waldgrafik").first).to_have_css("filter","grayscale(1)")
    page.reload()
    expect(wald.locator(".waldvergleich svg rect").first).to_have_attribute("fill","#547896")
    if page.viewport_size["width"] <= 550:
        wald.get_by_label("Bildteil",exact=True).select_option("2")
        expect(wald.get_by_label("Weg",exact=True)).to_be_visible()
        expect(wald.get_by_label("Himmel",exact=True)).to_be_hidden()
    station(7)
    page.get_by_text("Im eigenen Morgenwald eine Stelle kommentieren",exact=True).click()
    page.get_by_role("button",name="Kommentar zu Weg").click()
    page.get_by_label("Mein Kommentar zu Weg").fill("Der Weg fällt mir zuerst auf.")
    page.reload()
    page.get_by_role("button",name="Kommentar zu Weg").click()
    expect(page.get_by_label("Mein Kommentar zu Weg")).to_have_value("Der Weg fällt mir zuerst auf.")
    for n in [9,10]:
        station(n)
        setze_regler(page.get_by_label("Gelbe Portionen"),4)
        setze_regler(page.get_by_label("Rote Portionen"),2)
        page.get_by_role("button",name="Mischung prüfen").click()
        expect(page.locator("#werkInhalt")).to_contain_text("gelben Seite" if n == 9 else "Mengen sind verdoppelt")
    station(11)
    setze_regler(page.get_by_role("slider"),3)
    expect(page.locator("#werkInhalt")).to_contain_text("3 Portionen getrübte Mischung")
    station(12)
    page.get_by_role("slider").press("End")
    expect(page.locator(".flaechenplakat circle")).to_have_attribute("r","102")
    station(13)
    page.get_by_label("Hinterster Hügel").select_option("1")
    expect(page.locator(".ferne").last).to_have_attribute("fill","#b4c6d1")
    station(14)
    page.get_by_role("button",name="Blicktest starten").click()
    page.get_by_role("button",name="Schulfest",exact=True).click()
    page.get_by_role("button",name="Freitag · 15 Uhr",exact=True).click()
    expect(page.locator("#werkInhalt")).to_contain_text("Gesehen: zuerst Titel, dann Termin")
    assert not fehler, fehler
