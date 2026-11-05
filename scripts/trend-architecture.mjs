// Architecture follows the implemented data collection, API and storage paths.
export function trendArchitecture({t,esc,ja}) {
  const txt=(x,y,en,ko,cls='node-label')=>`<text x="${x}" y="${y}" class="${cls}" data-en="${esc(en)}" data-ko="${esc(ko)}" data-ja="${esc(ja(en,ko))}">${esc(en)}</text>`;
  return `<section class="trend-system" aria-label="Trend Trading system architecture">
    <header><p class="eyebrow">SYSTEM ARCHITECTURE</p><h2>${t('How the system is connected','실제 시스템 구성과 데이터 흐름')}</h2><p>${t('The implemented collection, research, simulation and exchange integration paths.','실제 코드에 구현된 수집·저장·분석·모의매매·거래소 연동의 흐름입니다.')}</p></header>
    <div class="trend-system-scroll">
      <svg class="trend-system-svg" viewBox="0 0 1100 820" role="img" aria-labelledby="trend-diagram-title trend-diagram-desc" xmlns="http://www.w3.org/2000/svg">
        <title id="trend-diagram-title" data-en="Trend Trading system architecture" data-ko="Trend Trading 시스템 구성도" data-ja="${esc(ja('Trend Trading system architecture','Trend Trading 시스템 구성도'))}">Trend Trading system architecture</title>
        <desc id="trend-diagram-desc" data-en="Binance market data and CoinGecko rankings feed a scheduled collector, which stores candles in PostgreSQL and triggers backend refresh and steps. The React dashboard communicates with the FastAPI backend, which reads and writes PostgreSQL, runs research and paper trading, and optionally exchanges account information and orders with Binance." data-ko="바이낸스 시장 데이터와 CoinGecko 순위를 예약 수집해 PostgreSQL에 저장합니다. React 화면은 FastAPI 백엔드와 통신하며, 백엔드는 저장소를 읽고 쓰고 연구와 모의매매를 수행하며 설정에 따라 바이낸스 계좌·주문과 연동합니다." data-ja="${esc(ja('Binance market data and CoinGecko rankings feed a scheduled collector, which stores candles in PostgreSQL and triggers backend refresh and steps. The React dashboard communicates with the FastAPI backend, which reads and writes PostgreSQL, runs research and paper trading, and optionally exchanges account information and orders with Binance.','바이낸스 시장 데이터와 CoinGecko 순위를 예약 수집해 PostgreSQL에 저장합니다. React 화면은 FastAPI 백엔드와 통신하며, 백엔드는 저장소를 읽고 쓰고 연구와 모의매매를 수행하며 설정에 따라 바이낸스 계좌·주문과 연동합니다.'))}">Binance market data and CoinGecko rankings feed a scheduled collector, which stores candles in PostgreSQL and triggers backend refresh and steps. The React dashboard communicates with the FastAPI backend, which reads and writes PostgreSQL, runs research and paper trading, and optionally exchanges account information and orders with Binance.</desc>
        <defs><marker id="trend-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#78c6cf"/></marker></defs>
        <rect class="trend-diagram-bg" x="0" y="0" width="1100" height="820" rx="18"/>
        ${txt(30,42,'DATA SOURCES','외부 데이터','diagram-kicker')}${txt(365,42,'SCHEDULED COLLECTION','예약 수집','diagram-kicker')}${txt(790,42,'PERSISTENT STORAGE','저장소','diagram-kicker')}
        <path class="diagram-link" d="M270 120 H315 V160 H365"/><path class="diagram-link" d="M270 245 H315 V190 H365"/>
        <path class="diagram-link" d="M645 175 H790"/><path class="diagram-link" d="M505 270 V355"/>
        <path class="diagram-link diagram-both" d="M270 460 H365"/><path class="diagram-link diagram-both" d="M645 465 H735 V285 H930 V270"/>
        <path class="diagram-link diagram-both" d="M645 525 H720 V718 H790"/>
        <rect class="diagram-node" x="30" y="70" width="240" height="100" rx="12"/>
        ${txt(50,108,'Binance public data','바이낸스 공개 데이터','diagram-title')}${txt(50,139,'OHLCV · market prices','캔들 · 시장 가격','diagram-sub')}
        <rect class="diagram-node" x="30" y="195" width="240" height="100" rx="12"/>
        ${txt(50,233,'CoinGecko','CoinGecko','diagram-title')}${txt(50,264,'Market-cap rankings','시가총액 순위','diagram-sub')}
        <rect class="diagram-node diagram-node-accent" x="365" y="90" width="280" height="180" rx="12"/>
        ${txt(387,126,'launchd + collector','launchd + 데이터 수집기','diagram-title')}${txt(387,160,'Daily closed candles','일·주·월 마감 캔들','diagram-sub')}${txt(387,188,'Universe refresh and backfill','대상 종목 갱신 · 과거 데이터','diagram-sub')}${txt(387,238,'Python · scheduled job','Python · 예약 작업','diagram-foot')}
        <rect class="diagram-node" x="790" y="90" width="280" height="180" rx="12"/>
        ${txt(812,126,'PostgreSQL','PostgreSQL','diagram-title')}${txt(812,160,'Market candles · playbook','시장 캔들 · 플레이북','diagram-sub')}${txt(812,188,'Experiments · paper positions','실험 기록 · 모의 포지션','diagram-sub')}${txt(812,216,'Live positions · settings','실거래 원장 · 설정','diagram-sub')}
        ${txt(30,355,'WEB APPLICATION','사용자 화면','diagram-kicker')}${txt(365,327,'APPLICATION BACKEND','애플리케이션 백엔드','diagram-kicker')}
        <rect class="diagram-node" x="30" y="395" width="240" height="130" rx="12"/>
        ${txt(50,433,'React + Vite','React + Vite','diagram-title')}${txt(50,464,'Dashboard · research','대시보드 · 전략 연구','diagram-sub')}${txt(50,493,'Paper · P&L views','모의매매 · 손익 화면','diagram-sub')}
        <rect class="diagram-node diagram-node-accent" x="365" y="355" width="280" height="220" rx="12"/>
        ${txt(387,393,'FastAPI + Python','FastAPI + Python','diagram-title')}${txt(387,429,'Candle cache · indicators','캔들 캐시 · 지표 계산','diagram-sub')}${txt(387,457,'Backtests · experiments','백테스트 · 실험 기록','diagram-sub')}${txt(387,485,'Paper trading · monitoring','모의매매 · 운영 감시','diagram-sub')}${txt(387,513,'Live integration · controls','실거래 연동 · 제어','diagram-sub')}${txt(387,547,'REST API','REST API','diagram-foot')}
        <rect class="diagram-node" x="790" y="650" width="280" height="135" rx="12"/>
        ${txt(812,687,'Binance Spot / Futures','바이낸스 현물 / 선물','diagram-title')}${txt(812,718,'Account & order API','계좌 조회 · 주문 API','diagram-sub')}${txt(812,748,'Live integration when enabled','활성화 시 실거래 연동','diagram-sub')}
        ${txt(666,161,'STORE','저장','diagram-link-label')}${txt(513,316,'REFRESH / STEPS','갱신 · 단계 실행','diagram-link-label')}${txt(283,446,'HTTP','HTTP','diagram-link-label')}${txt(744,445,'READ / WRITE','읽기 · 기록','diagram-link-label')}${txt(733,640,'API','API','diagram-link-label')}
      </svg>
    </div>
    <div class="trend-system-notes"><p>${t('The scheduler collects and stores market data, then requests cache refresh and subsequent processing.','예약 수집기가 시장 데이터를 저장하고 캐시 갱신과 후속 처리를 요청합니다.')}</p><p>${t('The backend connects research and paper trading to stored data; live exchange operations are conditional on configuration and safeguards.','백엔드는 저장 데이터를 이용해 연구와 모의매매를 수행하며, 실거래 연동은 설정과 안전 조건에 따라 동작합니다.')}</p><p><strong>${t('AI-assisted development','AI 협업 개발')}</strong> ${t('Claude Code and Codex support implementation, experiments and review.','Claude Code와 Codex를 구현·실험·검토에 활용합니다.')}</p></div>
  </section>`;
}
