(() => {
  const doc = document.documentElement;
  const language = document.querySelector('#language');
  const theme = document.querySelector('#theme');
  const menu = document.querySelector('#menu');
  const nav = document.querySelector('#navigation');
  const get = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const set = (key,value) => { try { localStorage.setItem(key,value); } catch {} };
  function applyLanguage(lang) {
    const selected = lang === 'ko' ? 'ko' : 'en';
    doc.lang = selected;
    document.querySelectorAll('[data-en][data-ko]').forEach(el => { el.textContent = el.getAttribute(`data-${selected}`); });
    language.textContent = selected === 'en' ? 'KO' : 'EN';
    language.setAttribute('aria-label', selected === 'en' ? 'Switch to Korean' : 'Switch to English');
    set('portfolio-language', selected);
  }
  applyLanguage(get('portfolio-language') || 'en');
  doc.dataset.theme = get('portfolio-theme') === 'light' ? 'light' : 'dark';
  language.addEventListener('click', () => applyLanguage(doc.lang === 'en' ? 'ko' : 'en'));
  theme.addEventListener('click', () => { doc.dataset.theme = doc.dataset.theme === 'dark' ? 'light' : 'dark'; set('portfolio-theme', doc.dataset.theme); });
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); });
  const dialog = document.querySelector('#lightbox');
  document.querySelectorAll('.image-trigger').forEach(button => button.addEventListener('click', () => { const source = button.querySelector('img'); const target = dialog.querySelector('img'); target.src = source.src; target.alt = source.alt; dialog.showModal(); }));
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.querySelectorAll('.architecture button').forEach(button => button.addEventListener('click', () => { const diagram=button.closest('.architecture'); diagram.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed','false')); button.setAttribute('aria-pressed','true'); diagram.nextElementSibling.textContent = doc.lang === 'ko' ? button.dataset.detailKo : button.dataset.detail; }));
})();
