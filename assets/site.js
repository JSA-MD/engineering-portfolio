(() => {
  const doc = document.documentElement;
  const language = document.querySelector('#language');
  const theme = document.querySelector('#theme');
  const styleChoices = [...document.querySelectorAll('[data-style-choice]')];
  const defaultStyle = styleChoices.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.styleChoice;
  const get = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const set = (key,value) => { try { localStorage.setItem(key,value); } catch {} };
  function applyLanguage(lang) {
    const selected = ['ko','en','ja'].includes(lang) ? lang : 'en';
    doc.lang = selected;
    document.querySelectorAll('[data-en][data-ko]').forEach(el => { el.textContent = el.getAttribute(`data-${selected}`); });
    language.value = selected;
    document.querySelector('.style-switch').setAttribute('aria-label', {ko:'디자인 스타일',en:'Design style',ja:'デザインスタイル'}[selected]);
    document.querySelector('.skip').textContent = {ko:'본문으로 건너뛰기',en:'Skip to content',ja:'本文へスキップ'}[selected];
    document.querySelector('.close-dialog').setAttribute('aria-label', {ko:'이미지 닫기',en:'Close image',ja:'画像を閉じる'}[selected]);
    const searchInput = document.querySelector('#career-search');
    if (searchInput) searchInput.placeholder = {ko:'회사·프로젝트 검색',en:'Search companies and projects',ja:'会社・プロジェクトを検索'}[selected];
    updateThemeLabel();
    if (typeof updateCareer === 'function') updateCareer();
  }
  function updateThemeLabel() {
    const next = doc.dataset.theme === 'dark' ? 'light' : 'dark';
    theme.textContent = doc.dataset.theme === 'dark' ? '☼' : '☾';
    theme.setAttribute('aria-label', doc.lang === 'ko' ? (next === 'light' ? '밝은 화면으로 전환' : '어두운 화면으로 전환') : doc.lang === 'ja' ? (next === 'light' ? 'ライトモードに切り替え' : 'ダークモードに切り替え') : `Switch to ${next} mode`);
  }
  function applyStyle(style) {
    doc.dataset.style = styleChoices.some(button => button.dataset.styleChoice === style) ? style : defaultStyle;
    styleChoices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.styleChoice === doc.dataset.style)));
    set('portfolio-style', doc.dataset.style);
  }
  applyStyle(doc.dataset.style);
  styleChoices.forEach(button => button.addEventListener('click', () => applyStyle(button.dataset.styleChoice)));
  language.addEventListener('change', () => { set('portfolio-language-choice-v2',language.value); applyLanguage(language.value); });
  theme.addEventListener('click', () => { doc.dataset.theme = doc.dataset.theme === 'dark' ? 'light' : 'dark'; set('portfolio-theme', doc.dataset.theme); updateThemeLabel(); });
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
      label.dataset.ja = expanded ? '経歴を閉じる' : '職務経歴をもっと見る';
      label.textContent = label.dataset[doc.lang];
      button.querySelector('[aria-hidden="true"]').textContent = expanded ? '↑' : '↓';
    });
  }
  historyToggles.forEach(button => button.addEventListener('click', () => setHistoryExpanded(button.getAttribute('aria-expanded') !== 'true')));
  const dialog = document.querySelector('#lightbox');
  document.querySelectorAll('.image-trigger').forEach(button => button.addEventListener('click', () => { const source = button.querySelector('img'); const target = dialog.querySelector('img'); target.src = source.dataset.full || source.src; target.alt = source.alt; dialog.showModal(); }));
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
    document.querySelector('#career-count').textContent = doc.lang === 'ko' ? `프로젝트 ${shown}개` : doc.lang === 'ja' ? `${shown}件のプロジェクト` : `${shown} project${shown === 1 ? '' : 's'}`;
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
  const savedLanguage = get('portfolio-language-choice-v2');
  const browserLanguage = (navigator.languages?.length ? navigator.languages : [navigator.language]).map(value => String(value || '').toLowerCase().split('-')[0]).find(value => ['ko','en','ja'].includes(value));
  applyLanguage(['ko','en','ja'].includes(savedLanguage) ? savedLanguage : (browserLanguage || 'en'));
})();
