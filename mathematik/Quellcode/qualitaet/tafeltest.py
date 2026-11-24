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
        page.keyboard.press('Escape')
        expect(dialog).not_to_be_visible()
    page.goto(url+'#division')
    page.get_by_role('button', name='Kurzrunde starten').tap()
    panel = page.locator('section').filter(has=page.get_by_role('heading', name='Kurzrunde mit drei Aufgaben'))
    x,y = map(int,re.search(r'(\d+) : (\d+)',panel.inner_text()).groups())
    field = panel.get_by_role('textbox')
    field.fill('0')
    panel.get_by_role('button',name='Ergebnis prüfen').tap()
    expect(panel.get_by_role('status')).to_contain_text('Zehnerstelle')
    expect(panel.get_by_role('status')).not_to_contain_text(str(x//y))
    field.fill(str(x//y))
    panel.get_by_role('button',name='Korrektur prüfen').tap()
    expect(panel.get_by_role('status')).to_contain_text('Richtig gerechnet')
    record = page.evaluate("JSON.parse(localStorage.getItem('mathe-kompass-lernbelege-v1')).at(-1)")
    assert record['status']=='hilfe' and record['ersterVersuch'] is False and record['hinweise']
    browser.close()
print(engine, 'Tafelmodelle und zweiter Versuch geprüft.')
