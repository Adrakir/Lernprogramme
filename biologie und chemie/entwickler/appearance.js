(() => {
  'use strict';
  const key = 'chemie-display-brightness-v1';
  const input = document.getElementById('chemBrightness');
  const output = document.getElementById('chemBrightnessValue');
  function apply(value) {
    const number = Number(value);
    const brightness = Number.isFinite(number) ? Math.min(100, Math.max(60, number)) : 100;
    input.value = String(brightness);
    output.value = brightness + ' %';
    document.documentElement.style.setProperty('--chem-display-dim', String(1 - brightness / 100));
    return brightness;
  }
  let saved = null;
  try { saved = localStorage.getItem(key); } catch {}
  apply(saved === null ? 100 : saved);
  input.addEventListener('input', () => {
    const brightness = apply(input.value);
    try { localStorage.setItem(key, String(brightness)); } catch {}
  });
})();

(() => {
  'use strict';
  const key = 'chemie-display-size-v1';
  const input = document.getElementById('chemSize');
  const output = document.getElementById('chemSizeValue');
  function apply(value) {
    const parsed = Number(value);
    const size = Number.isFinite(parsed) ? Math.min(150, Math.max(85, parsed)) : 100;
    input.value = String(size);
    output.value = size + ' %';
    document.documentElement.style.setProperty('--chem-app-size', String(size / 100));
    return size;
  }
  let saved = null;
  try { saved = localStorage.getItem(key); } catch {}
  apply(saved === null ? 100 : saved);
  input.addEventListener('input', () => {
    const size = apply(input.value);
    try { localStorage.setItem(key, String(size)); } catch {}
  });
})();

(() => {
  'use strict';
  const select = document.getElementById('chemTheme');
  const sync = () => {
    select.value = document.body.classList.contains('lc-theme-dark') ? 'dark' : 'light';
  };
  select.addEventListener('change', () => window.LernCockpit.setTheme(select.value));
  document.addEventListener('chemistry:theme', sync);
  sync();
})();
