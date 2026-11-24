"""Visual regression smoke tests for guided mathematics illustrations."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

url=Path('../MatheKompass.html').resolve().as_uri()
OPERATIONS=['addition','subtraktion','multiplikation','division']
SIZES=['laenge','masse','zeit','geld','flaeche','volumen']
MODULES=['data','numbers','round','mental','line','units','stats','arithmetic','divisibility','geometry','measure','fractions','decimals','angles','symmetry','solids']
with sync_playwright() as pw:
    engine=os.environ.get('MATHE_BROWSER','chromium')
    browser=getattr(pw,engine).launch(executable_path=os.environ.get('CHROMIUM_PATH') or None)
    for width,height in [(390,844),(1280,900)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        page.set_default_timeout(9000)
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        for fach in OPERATIONS:
            page.goto(url+'#'+fach)
            studio=page.locator('.tk-studio')
            expect(studio).to_have_count(1)
            expect(studio.locator('.tk-step-indicator')).to_contain_text('1 VON 3')
            studio.get_by_role('button',name='Nächster Bildschritt').click()
            expect(studio.locator('.tk-step-indicator')).to_contain_text('2 VON 3')
            studio.get_by_role('button',name='Nächster Bildschritt').click()
            expect(studio.locator('.tk-step-indicator')).to_contain_text('3 VON 3')
            studio.get_by_role('button',name='Noch einmal').click()
            expect(studio.locator('.tk-step-indicator')).to_contain_text('1 VON 3')
            # the guided exercise must still open normally
            page.get_by_role('button',name='Geführt starten',exact=False).click()
            expect(page.locator('.tk-studio')).to_have_count(1)
        for bereich in SIZES:
            page.goto(url+'#g-'+bereich)
            studio=page.locator('.tk-studio.tk-size')
            expect(studio).to_have_count(1)
            slider=studio.locator('input[type=range]').first
            expect(slider).to_be_visible()
            slider.focus()
            slider.press('End')
            expect(studio.locator('.tk-live')).not_to_be_empty()
            expect(studio.locator('svg, .tk-money').first).to_be_visible()
            page.locator('.gw-intro button').first.click()
            if page.locator('.gw-phases button').count() == 0:
                print('Diagnose Größen-Station',bereich,'URL',page.url,
                      'Stationen',page.locator('.gw-station').count(),
                      'Intro',page.locator('.gw-intro').count(),
                      'Navigation',page.locator('.gw-phases').count(),
                      'Inhalt',page.locator('main').inner_text()[:950],flush=True)
            page.locator('.gw-phases button').nth(1).click()
            expect(page.locator('.gw-phase .tk-studio.tk-size')).to_have_count(1)
        for fach in MODULES:
            page.goto(url+'#'+fach)
            page.locator('[role=tab][data-state=inactive]').filter(has_text='Verstehen').first.click() if fach=='mental' else None
            page.locator('.lesson-phases button').nth(1).click()
            expect(page.locator('.lesson .tk-studio')).to_have_count(1)
            images=page.locator('.lesson .tk-studio svg')
            expect(images).not_to_have_count(0)
        assert not errors, errors
        page.close()
    browser.close()
print(engine, 'Bilder-Schulungen der vier Rechenarten, sechs Größenbereiche und 16 Lernmodule funktionieren.')
