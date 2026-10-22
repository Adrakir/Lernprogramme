'use strict';
(() => {
  const body = document.body;
  const bgInput = document.getElementById('background-color');
  const textInput = document.getElementById('text-color');
  const status = document.getElementById('color-contrast');
  const reset = document.getElementById('reset-colors');
  const theme = document.getElementById('theme');
  const key = 'wortwelt-colors-v1';
  const valid = color => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color);
  const variables = ['--bg', '--panel', '--panel2', '--text', '--muted', '--blue', '--line'];
  let colors = null;
  try {
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    if (stored && valid(stored.background) && valid(stored.text)) colors = stored;
  } catch {}
  function luminance(hex) {
    const channels = hex.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255);
    const linear = channels.map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
    return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
  }
  function ratio(background, text) {
    const a = luminance(background), b = luminance(text);
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  }
  function storage() {
    try {
      if (colors) localStorage.setItem(key, JSON.stringify(colors));
      else localStorage.removeItem(key);
    } catch {
      document.getElementById('color-storage').textContent = 'Die Farben gelten jetzt. Dieser Browser kann sie nicht für später speichern.';
    }
  }
  function apply() {
    body.classList.toggle('custom-colors', Boolean(colors));
    variables.forEach(variable => body.style.removeProperty(variable));
    if (colors) {
      ['--bg', '--panel', '--panel2'].forEach(variable => body.style.setProperty(variable, colors.background));
      ['--text', '--muted', '--blue', '--line'].forEach(variable => body.style.setProperty(variable, colors.text));
      body.style.colorScheme = luminance(colors.background) > .4 ? 'light' : 'dark';
    } else body.style.removeProperty('color-scheme');
    const computed = getComputedStyle(body);
    bgInput.value = colors ? colors.background : computed.getPropertyValue('--bg').trim();
    textInput.value = colors ? colors.text : computed.getPropertyValue('--text').trim();
    const contrast = ratio(bgInput.value, textInput.value);
    status.textContent = contrast >= 4.5
      ? `Kontrast ${contrast.toFixed(1)}:1 · ausreichend für normale Schrift.`
      : `Kontrast ${contrast.toFixed(1)}:1 · schwer lesbar. Wähle deutlich unterschiedliche Farben oder stelle die Standardfarben wieder her.`;
    status.dataset.low = String(contrast < 4.5);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', bgInput.value);
  }
  function changeColors() {
    colors = {background: bgInput.value, text: textInput.value};
    if (!valid(colors.background) || !valid(colors.text)) return;
    apply();
    storage();
  }
  bgInput.addEventListener('input', changeColors);
  textInput.addEventListener('input', changeColors);
  reset.addEventListener('click', () => { colors = null; storage(); apply(); });
  theme.addEventListener('change', () => { colors = null; storage(); apply(); });
  apply();
})();
