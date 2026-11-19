"""Browser regression tests. Run with python -m unittest discover -s tests."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait


class FarbatelierTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        root = Path(__file__).resolve().parents[1]
        folder = root / "dist" if (root / "dist").is_dir() else root
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=folder))
        Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.addClassCleanup(cls.server.server_close)
        cls.addClassCleanup(cls.server.shutdown)

    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--headless=new")
        self.browser = webdriver.Chrome(options=options)
        self.addCleanup(self.browser.quit)
        self.base = f"http://127.0.0.1:{self.server.server_port}/"
        self.wait = WebDriverWait(self.browser, 10)

    def visit(self, route, ready):
        self.browser.get(self.base + "#" + route)
        self.wait.until(lambda _: self.browser.find_element(By.ID, ready))

    def el(self, id):
        return self.browser.find_element(By.ID, id)

    def test_sample_snapshot_keeps_note_and_recipe(self):
        self.visit("komplementaerfarben", "keep")
        self.browser.find_element(By.CSS_SELECTOR, '[data-preset="25"]').click()
        self.el("keep").click()
        self.browser.find_element(By.CSS_SELECTOR, "[data-sample-note]").send_keys("Mein Vergleich")
        self.visit("lernpass", "importSample")
        self.visit("komplementaerfarben", "keep")
        self.browser.find_element(By.CSS_SELECTOR, "[data-remove]").click()
        self.visit("lernpass", "importSample")
        self.assertIn("75 % Orange + 25 % Blau · Mein Vergleich", self.el("reportSamples").text)

    def test_guest_isolation(self):
        self.visit("lernpass", "plan")
        self.el("plan").send_keys("Persönliche Frage")
        self.el("guestToggle").click()
        self.wait.until(lambda _: "beenden" in self.el("guestToggle").text)
        self.assertEqual(self.el("plan").get_attribute("value"), "")
        self.el("plan").send_keys("Gastfrage")
        self.el("guestToggle").click()
        self.browser.switch_to.alert.accept()
        self.wait.until(lambda _: self.el("plan").get_attribute("value") == "Persönliche Frage")
        self.el("guestToggle").click()
        self.wait.until(lambda _: "beenden" in self.el("guestToggle").text)
        self.assertEqual(self.el("plan").get_attribute("value"), "")

    def test_brush_and_percent(self):
        self.visit("komplementaerfarben", "brushMix")
        self.browser.find_element(By.CSS_SELECTOR, '[data-preset="25"]').click()
        self.assertEqual([self.el("brush"+n).get_attribute("value") for n in "01"], ["3", "1"])
        self.browser.find_element(By.CSS_SELECTOR, '[data-preset="10"]').click()
        self.assertIn("nächstes Rezept", self.el("brushAnswer").get_attribute("textContent"))
        self.browser.find_element(By.XPATH, "//summary[.='Mit Pinselportionen mischen']").click()
        self.el("brushMix").click()
        self.assertEqual(self.el("ratio").get_attribute("value"), "25")

    def test_quiz_resume_preserves_feedback(self):
        self.visit("quiz", "feedback")
        self.browser.find_element(By.CSS_SELECTOR, '[data-choice="1"]').click()
        self.browser.refresh()
        self.wait.until(lambda _: self.el("resume")).click()
        self.assertIn("Versuche es noch einmal", self.el("feedback").text)
        self.browser.find_element(By.CSS_SELECTOR, '[data-choice="0"]').click()
        self.el("next").click()
        self.browser.refresh()
        self.wait.until(lambda _: self.el("resume"))
        self.assertIn("Frage 2 von 10", self.el("stage").text)


if __name__ == "__main__":
    unittest.main()
