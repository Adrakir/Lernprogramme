"""Run keyboard, resume and download flows against the published single-file build."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

url = Path('../MatheKompass.html').resolve().as_uri()
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=os.getenv('CHROMIUM_PATH') or None)
    for width,height in [(390,844),(820,1180),(1440,900)]:
        page=browser.new_page(viewport={'width':width,'height':height},accept_downloads=True)
        page.goto(url+'#division')
        button=lambda name:page.get_by_role('button',name=name,exact=True)
        button('Geführt starten · 1248 : 6').click()
        for i,values in enumerate([[12,2,12,0],[4,0,0,4],[48,8,48,0],[208,0]]):
            inputs=page.locator('.ad-fields fieldset input')
            for j,v in enumerate(values):
                inputs.nth(j).fill(str(1 if (i,j)==(1,1) else v))
            button('Schritt prüfen').click()
            if i==1:
                expect(page.get_by_text('Passt es keinmal',exact=False)).to_be_visible()
                inputs.nth(1).fill('0')
                button('Schritt prüfen').click()
        expect(page.get_by_text('Alle Rechenschritte stimmen.',exact=False)).to_be_visible()
        button('Zur Divisionsübersicht').click()
        button('Probeklassenarbeit starten').click()
        button('Weiter').click()
        inputs=page.locator('.ad-fields fieldset input')
        inputs.first.fill('12')
        page.reload()
        button('Probeklassenarbeit fortsetzen').click()
        expect(page.get_by_text('PROBEKLASSENARBEIT · AUFGABE 2 VON 8')).to_be_visible()
        expect(page.locator('.ad-fields fieldset input').first).to_have_value('12')
        button('Zur Divisionsübersicht').click()
        with page.expect_download() as download:
            button('Drei Nachübungen als PDF').click()
        assert download.value.path().read_bytes().startswith(b'%PDF')
        page.goto(url+'#addition')
        button('Geführt starten · 587 + 268').click()
        fields=page.locator('.ad-grid input:enabled')
        fields.first.fill('5')
        fields.first.press('Enter')
        expect(fields.nth(1)).to_be_focused()
        page.goto(url+'#unterricht')
        with page.expect_download() as download:
            button('Fassung B mit Lösungen als PDF').click()
        assert download.value.path().read_bytes().startswith(b'%PDF')
        page.goto(url+'#familie')
        expect(page.get_by_role('heading',name='Die letzten sieben Tage')).to_be_visible()
        # Die Datei auf einem zweiten Gerät mit leerem Browserspeicher übernehmen.
        with page.expect_download() as backup:
            button('Gesamten Lernstand sichern').click()
        second = browser.new_page(viewport={'width':width,'height':height})
        second.goto(url+'#familie')
        second.locator('input[type=file]').set_input_files({
            'name':'Lernstand.json', 'mimeType':'application/json',
            'buffer':backup.value.path().read_bytes(),
        })
        expect(second.get_by_role('alert')).to_contain_text('Aufgabe 2 von 8')
        with second.expect_navigation():
            second.get_by_role('button',name='Ja, Sicherung laden').click()
        second.goto(url+'#division')
        second.get_by_role('button',name='Probeklassenarbeit fortsetzen').click()
        expect(second.locator('.ad-fields fieldset input').first).to_have_value('12')
        second.close()
        for fach in ['addition','subtraktion','multiplikation','division']:
            page.goto(url+'#'+fach)
            button('Kurzrunde starten').click()
            panel=page.locator('section').filter(has=page.get_by_role('heading',name='Kurzrunde mit drei Aufgaben'))
            for i in range(3):
                expect(panel.get_by_role('heading',name=f'Aufgabe {i+1} von 3')).to_be_visible()
                panel.get_by_role('textbox').fill('999998')
                panel.get_by_role('button',name='Ergebnis prüfen').click()
                expect(panel.get_by_role('status')).to_contain_text('Versuche es noch einmal')
                expect(panel.get_by_role('button',name='Korrektur prüfen')).to_be_disabled()
                panel.get_by_role('textbox').fill('999999')
                panel.get_by_role('button',name='Korrektur prüfen').click()
                panel.get_by_role('button',name='Runde auswerten' if i==2 else 'Nächste Kurzaufgabe').click()
            expect(panel.get_by_role('status')).to_contain_text('Noch üben: 3')
        page.close()
    browser.close()
print('Handy-, Tablet- und Desktop-Bedienwege bestanden.')
