(() => {
  const doc = document.documentElement;
  const language = document.querySelector('#language');
  const theme = document.querySelector('#theme');
  const styleChoices = [...document.querySelectorAll('[data-style-choice]')];
  const defaultStyle = styleChoices.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.styleChoice;
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
    document.querySelector('.style-switch').setAttribute('aria-label', selected === 'ko' ? '디자인 스타일' : 'Design style');
    updateThemeLabel();
    set('portfolio-language', selected);
    if (typeof updateCareer === 'function') updateCareer();
  }
  function updateThemeLabel() {
    const next = doc.dataset.theme === 'dark' ? 'light' : 'dark';
    theme.textContent = doc.dataset.theme === 'dark' ? '☼' : '☾';
    theme.setAttribute('aria-label', doc.lang === 'ko' ? (next === 'light' ? '밝은 화면으로 전환' : '어두운 화면으로 전환') : `Switch to ${next} mode`);
  }
  function applyStyle(style) {
    doc.dataset.style = styleChoices.some(button => button.dataset.styleChoice === style) ? style : defaultStyle;
    styleChoices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.styleChoice === doc.dataset.style)));
    set('portfolio-style', doc.dataset.style);
  }
  applyStyle(doc.dataset.style);
  styleChoices.forEach(button => button.addEventListener('click', () => applyStyle(button.dataset.styleChoice)));
  language.addEventListener('click', () => applyLanguage(doc.lang === 'en' ? 'ko' : 'en'));
  theme.addEventListener('click', () => { doc.dataset.theme = doc.dataset.theme === 'dark' ? 'light' : 'dark'; set('portfolio-theme', doc.dataset.theme); updateThemeLabel(); });
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); }));
  const historyToggles = [...document.querySelectorAll('.home-career-toggle')];
  function setHistoryExpanded(expanded) {
    historyToggles.forEach(button => {
      const list = document.getElementById(button.getAttribute('aria-controls'));
      if (!list) return;
      list.hidden = !expanded;
      button.setAttribute('aria-expanded', String(expanded));
      const label = button.querySelector('[data-en][data-ko]');
      label.dataset.en = expanded ? 'Hide career history' : 'More career history';
      label.dataset.ko = expanded ? '이력사항 접기' : '이력사항 자세히 보기';
      label.textContent = label.dataset[doc.lang === 'ko' ? 'ko' : 'en'];
      button.querySelector('[aria-hidden="true"]').textContent = expanded ? '↑' : '↓';
    });
  }
  historyToggles.forEach(button => button.addEventListener('click', () => setHistoryExpanded(button.getAttribute('aria-expanded') !== 'true')));
  const dialog = document.querySelector('#lightbox');
  document.querySelectorAll('.image-trigger').forEach(button => button.addEventListener('click', () => { const source = button.querySelector('img'); const target = dialog.querySelector('img'); target.src = source.src; target.alt = source.alt; dialog.showModal(); }));
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.querySelectorAll('.architecture button').forEach(button => button.addEventListener('click', () => { const diagram=button.closest('.architecture'); diagram.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed','false')); button.setAttribute('aria-pressed','true'); diagram.nextElementSibling.textContent = doc.lang === 'ko' ? button.dataset.detailKo : button.dataset.detail; }));
  document.querySelectorAll('.video-launch').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.videoId;
    if (!/^[\w-]{11}$/.test(id || '')) return;
    const player = document.createElement('iframe');
    player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    player.title = button.dataset.videoTitle || 'Project video';
    player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    button.replaceWith(player);
  }));
  const search = document.querySelector('#career-search');
  const filters = [...document.querySelectorAll('[data-career-filter]')];
  let careerFilter = 'all';
  function updateCareer() {
    if (!search) return;
    const query = search.value.trim().toLocaleLowerCase();
    let shown = 0;
    document.querySelectorAll('[data-career-group]').forEach(group => {
      const company = group.querySelector('.career-group-header').textContent.toLocaleLowerCase();
      let groupCount = 0;
      group.querySelectorAll('.career-project').forEach(card => {
        const matchesText = !query || company.includes(query) || card.textContent.toLocaleLowerCase().includes(query);
        const matchesFilter = careerFilter !== 'video' || !!card.querySelector('.video-launch, iframe, video');
        card.hidden = !(matchesText && matchesFilter);
        if (!card.hidden) { groupCount++; shown++; }
      });
      group.hidden = groupCount === 0;
    });
    document.querySelector('.career-empty').hidden = shown !== 0;
    document.querySelector('#career-count').textContent = doc.lang === 'ko' ? `프로젝트 ${shown}개` : `${shown} project${shown === 1 ? '' : 's'}`;
  }
  if (search) {
    search.addEventListener('input', updateCareer);
    filters.forEach(button => button.addEventListener('click', () => {
      careerFilter = button.dataset.careerFilter;
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      updateCareer();
    }));
    updateCareer();
  }
  applyLanguage(get('portfolio-language') || 'en');
})();
