"""Test the classroom models and retry feedback using touch and keyboard."""
import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

url = Path('../MatheKompass.html').resolve().as_uri()
with sync_playwright() as pw:
    engine = os.getenv('MATHE_BROWSER', 'chromium')
    browser = getattr(pw, engine).launch(executable_path=os.getenv('CHROMIUM_PATH') or None)
    page = browser.new_page(**pw.devices['iPad (gen 7)'])
    page.goto(url+'#unterricht')
    dialog = page.get_by_role('dialog')
    for title, action, expected in [
        ('Übertrag zeigen', 'Zehn bündeln', '1 Zehner und 3 Einer'),
        ('Punktefeld zerlegen', 'Nach zehn Spalten teilen', 'links 10 Spalten'),
        ('Minuten bündeln', 'Menge in min erhöhen', '60 min'),
    ]:
        page.get_by_role('button', name=title).tap()
        expect(dialog).to_be_visible()
        reveal = dialog.get_by_role('button', name='Ergebnis einblenden')
        expect(reveal).to_have_attribute('aria-expanded', 'false')
        dialog.get_by_role('button', name=action).tap()
        expect(dialog).to_contain_text(expected)
        reveal.tap()
        expect(dialog.get_by_role('button', name='Ergebnis ausblenden')).to_have_attribute('aria-expanded', 'true')
        dialog.get_by_role('button', name='Modell zurücksetzen').tap()
        expect(reveal).to_be_visible()
        if title == 'Übertrag zeigen':
            for second, total in [(1,9),(2,10),(3,11)]:
                dialog.get_by_label('Zweiter Summand').select_option(str(second))
                expect(reveal).to_be_visible()
                reveal.tap()
                expect(dialog).to_contain_text(f'8 + {second} = {total}')
        elif title == 'Punktefeld zerlegen':
            dialog.get_by_role('combobox',name='Reihen',exact=True).select_option('7')
            dialog.get_by_role('combobox',name=re.compile('^Spalten')).select_option('16')
            reveal.tap()
            expect(dialog).to_contain_text('70 + 42 = 112')
        else:
            dialog.get_by_label('Start in Minuten').select_option('119')
            dialog.get_by_role('button',name=action).tap()
            reveal.tap()
            expect(dialog).to_contain_text('2 h und 0 min')
        page.keyboard.press('Escape')
        expect(dialog).not_to_be_visible()
    page.goto(url+'#division')
    page.get_by_role('button', name='Kurzrunde starten').tap()
    panel = page.locator('section').filter(has=page.get_by_role('heading', name='Kurzrunde mit drei Aufgaben'))
    x,y = map(int,re.search(r'(\d+) : (\d+)',panel.inner_text()).groups())
    field = panel.get_by_role('textbox')
    legacy={'tag':'2026-01-01','ziel':'Frühere Aufgabe','aufgabe':'9 + 1','status':'selbst','wiederholung':False}
    page.evaluate("(b)=>localStorage.setItem('mathe-kompass-lernbelege-v1',JSON.stringify([b]))",legacy)
    field.fill('0')
    panel.get_by_role('button',name='Ergebnis prüfen').tap()
    expect(panel.get_by_role('status')).to_contain_text('Zehnerstelle')
    expect(panel.get_by_role('status')).not_to_contain_text(str(x//y))
    field.fill(str(x//y))
    panel.get_by_role('button',name='Korrektur prüfen').tap()
    expect(panel.get_by_role('status')).to_contain_text('Richtig gerechnet')
    record = page.evaluate("JSON.parse(localStorage.getItem('mathe-kompass-lernbelege-v1')).at(-1)")
    assert record['status']=='hilfe' and record['ersterVersuch'] is False and record['hinweise']
    records = lambda: page.evaluate("JSON.parse(localStorage.getItem('mathe-kompass-lernbelege-v1'))")
    assert len(records()) == 2 and records()[0] == legacy and record['versuche'] == 2
    panel.get_by_role('button',name='Nächste Kurzaufgabe').tap()
    for i in [1,2]:
        field.fill('999999')
        panel.get_by_role('button',name='Ergebnis prüfen').tap()
        field.fill('999998')
        panel.get_by_role('button',name='Korrektur prüfen').tap()
        panel.get_by_role('button',name='Nächste Kurzaufgabe' if i==1 else 'Runde auswerten').tap()
    panel.get_by_role('button',name='Eine ähnliche Aufgabe üben · Die Null im Quotienten eintragen').tap()
    nx,ny = map(int,re.search(r'(\d+) : (\d+)',panel.inner_text()).groups())
    assert nx//ny != x//y
    field.fill(str(nx//ny))
    panel.get_by_role('button',name='Ergebnis prüfen').tap()
    panel.get_by_role('button',name='Zur Rundenauswertung').tap()
    expect(panel).to_contain_text('Nachübung: selbstständig gelöst')
    assert len(records()) == 5 and records()[-1]['wiederholung'] and records()[0] == legacy
    browser.close()
print(engine, 'Tafelmodelle und zweiter Versuch geprüft.')
