"""Regressionstest für die visuell-interaktiven Lernmodelle und den Dunkelmodus."""
import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

url = Path('../MatheKompass.html').resolve().as_uri()
with sync_playwright() as pw:
    engine = os.getenv('MATHE_BROWSER', 'chromium')
    browser = getattr(pw, engine).launch(executable_path=os.getenv('CHROMIUM_PATH') or None)
    for width, height in [(390, 844), (820, 1180), (1440, 900)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(url + '#home')
        expect(page.get_by_role('heading', name='Nicht nur rechnen. Mathe sehen.')).to_be_visible()
        expect(page.locator('.ev-card')).to_have_count(3)

        point = page.locator('#ev-position')
        point.focus()
        point.press('Home')
        point.press('ArrowRight')
        expect(page.locator('.ev-numbers')).to_contain_text('5')
        expect(page.locator('.ev-card').first.locator('.ev-insight')).to_contain_text('links von 50')

        total = page.locator('#ev-total')
        total.focus()
        total.press('Home')
        expect(total).to_have_value('2')
        expect(page.locator('.ev-pizza path')).to_have_count(2)

        minutes = page.locator('#ev-minutes')
        minutes.focus()
        minutes.press('End')
        expect(minutes).to_have_value('180')
        expect(page.locator('.ev-card').last.locator('.ev-insight')).to_contain_text('3 volle Stunden und 0 Minuten')

        toggle = page.locator('#mk-theme-toggle')
        expect(toggle).to_be_visible()
        toggle.click()
        expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
        page.reload()
        expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
        expect(page.locator('.ev-card')).to_have_count(3)
        toggle.click()
        expect(page.locator('html')).to_have_attribute('data-theme', 'light')
        page.get_by_role('link', name='Brüche üben').click()
        expect(page).to_have_url(re.compile(r'#fractions$'))
        assert not errors, errors
        page.close()
    browser.close()
print(engine, 'Visuelle Mini-Labore, Smartphone-Ansicht, Links und Dunkelmodus geprüft.')
