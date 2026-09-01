<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>ihiker.org — 베이 지역 한인 산악회</title>
<meta name="description" content="샌프란시스코에서 몬트레이까지, 그리고 타호와 요세미티. 매주 주말 함께 걷는 열린 산악회입니다. 산행 일정, 후기, 가입 안내.">
<link rel="canonical" href="https://ihiker.org/">

<meta name="theme-color" content="#E7EAE3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#121814" media="(prefers-color-scheme: dark)">

<meta property="og:type" content="website">
<meta property="og:site_name" content="ihiker.org">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="ihiker.org — 베이 지역 한인 산악회">
<meta property="og:description" content="매주 주말 함께 걷는 열린 산악회. 산행 일정, 후기, 가입 안내.">
<meta property="og:url" content="https://ihiker.org/">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%232F5245'/%3E%3Cpath d='M4 25 L12 11 L17 19 L20 14 L28 25 Z' fill='%23E7EAE3'/%3E%3Ccircle cx='12' cy='11' r='2' fill='%23C9A54B'/%3E%3C/svg%3E">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@300;400;500;600&display=swap">

<style>
  /* ── Reset ─────────────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
  body, h1, h2, h3, h4, p, ol, ul, dl, dd, figure { margin: 0; }
  ol, ul { padding: 0; list-style: none; }
  img, svg { max-width: 100%; }
  button, input, select, textarea { font: inherit; }

  /* ── Light palette: coastal fog, bay laurel, dry-grass gold ───────── */
  :root {
    --ground:      #E7EAE3;
    --surface:     #F4F6F0;
    --surface-2:   #DDE1D8;
    --ink:         #1A231D;
    --ink-soft:    #3A473E;
    --muted:       #5F6D63;
    --hairline:    #C6CCBF;
    --accent:      #8A6410;   /* dry grass */
    --accent-soft: #C9A54B;
    --forest:      #2F5245;   /* serpentine ridge */
    --forest-soft: #6E8C7E;

    --sp: clamp(1.1rem, 3.5vw, 2rem);
    --max: 66rem;
    --radius: 3px;

    --f-display: "Hahmlet", "Nanum Myeongjo", Georgia, serif;
    --f-body: "IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif;
    --f-mono: "IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --ground:      #121814;
      --surface:     #1A221C;
      --surface-2:   #232D26;
      --ink:         #E3E8DF;
      --ink-soft:    #C3CCBF;
      --muted:       #8E9C92;
      --hairline:    #334036;
      --accent:      #D6A542;
      --accent-soft: #8A6E2C;
      --forest:      #8FB3A2;
      --forest-soft: #4C6A5C;
    }
  }

  :root[data-theme="dark"] {
    --ground:      #121814;
    --surface:     #1A221C;
    --surface-2:   #232D26;
    --ink:         #E3E8DF;
    --ink-soft:    #C3CCBF;
    --muted:       #8E9C92;
    --hairline:    #334036;
    --accent:      #D6A542;
    --accent-soft: #8A6E2C;
    --forest:      #8FB3A2;
    --forest-soft: #4C6A5C;
  }

  /* ── Base ──────────────────────────────────────────────────────────── */
  body {
    background: var(--ground);
    color: var(--ink);
    font-family: var(--f-body);
    font-weight: 350;
    font-size: 16px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    word-break: keep-all;
  }

  .wrap {
    max-width: var(--max);
    margin-inline: auto;
    padding-inline: var(--sp);
  }

  h1, h2, h3 {
    font-family: var(--f-display);
    font-weight: 600;
    line-height: 1.25;
    text-wrap: balance;
    letter-spacing: -0.01em;
  }

  a { color: inherit; }

  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 2px;
  }

  .skip {
    position: absolute;
    left: -9999px;
    top: 0;
    background: var(--forest);
    color: var(--ground);
    padding: 0.6rem 1rem;
    border-radius: 0 0 var(--radius) 0;
    text-decoration: none;
    z-index: 10;
  }
  .skip:focus { left: 0; }

  .eyebrow {
    font-family: var(--f-mono);
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* ── Masthead ──────────────────────────────────────────────────────── */
  .masthead {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.6rem 1.4rem;
    padding-block: 1.6rem 1.2rem;
    border-bottom: 1px solid var(--hairline);
  }
  .mark {
    font-family: var(--f-display);
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: 0.02em;
    text-decoration: none;
  }
  .mark span { color: var(--forest); }
  .masthead nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1.3rem;
    margin-left: auto;
    font-size: 0.82rem;
    color: var(--muted);
  }
  .masthead nav a {
    text-decoration: none;
    padding-bottom: 2px;
    border-bottom: 1px solid transparent;
    transition: color 0.15s, border-color 0.15s;
  }
  .masthead nav a:hover { color: var(--ink); border-bottom-color: var(--accent); }

  /* ── Hero ──────────────────────────────────────────────────────────── */
  .hero { padding-block: clamp(2.6rem, 8vw, 4.6rem) 0; }
  .hero h1 {
    font-size: clamp(2.1rem, 6.4vw, 3.7rem);
    font-weight: 700;
    margin-top: 0.9rem;
    max-width: 15ch;
  }
  .hero p.lede {
    margin-top: 1.2rem;
    max-width: 42ch;
    font-size: clamp(1rem, 2.2vw, 1.08rem);
    color: var(--ink-soft);
  }
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
    margin-top: 1.9rem;
  }
  .btn {
    display: inline-block;
    padding: 0.62rem 1.25rem;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    border-radius: var(--radius);
    border: 1px solid var(--forest);
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .btn-solid { background: var(--forest); color: var(--ground); }
  .btn-solid:hover { background: var(--ink); border-color: var(--ink); }
  .btn-ghost { color: var(--ink); border-color: var(--hairline); }
  .btn-ghost:hover { border-color: var(--forest); }

  /* ── Ridgeline ─────────────────────────────────────────────────────── */
  .ridge {
    margin-top: clamp(2.2rem, 6vw, 3.4rem);
    position: relative;
  }
  .ridge svg { display: block; width: 100%; height: auto; }
  /* SVG presentation attributes don't read custom properties — set them in CSS */
  .ridge .stop-top { stop-color: var(--forest); stop-opacity: 0.20; }
  .ridge .stop-bottom { stop-color: var(--forest); stop-opacity: 0.02; }
  .ridge .ridge-line { stroke: var(--forest); }
  .ridge .peak-dot { fill: var(--accent); }
  .ridge-labels {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.55rem;
    border-top: 1px solid var(--hairline);
    font-family: var(--f-mono);
    font-size: 0.63rem;
    letter-spacing: 0.05em;
    color: var(--muted);
    overflow-x: auto;
  }
  .ridge-labels span { white-space: nowrap; }
  .ridge-labels b { font-weight: 500; color: var(--ink-soft); }

  /* ── Sections ──────────────────────────────────────────────────────── */
  .section { padding-block: clamp(3rem, 8vw, 4.8rem); }
  .section-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4rem 1rem;
    margin-bottom: 2.2rem;
  }
  .section-head h2 { font-size: clamp(1.4rem, 3.6vw, 1.85rem); }
  .section-head .period {
    font-family: var(--f-mono);
    font-size: 0.74rem;
    letter-spacing: 0.06em;
    color: var(--forest);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .section-head p {
    margin-left: auto;
    font-size: 0.85rem;
    color: var(--muted);
    max-width: 34ch;
  }

  /* ── Schedule ──────────────────────────────────────────────────────── */
  .group { margin-bottom: 2.6rem; }
  .group:last-child { margin-bottom: 0; }
  .group-label {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: 0.35rem;
  }
  .group-label h3 {
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  .group-label .rule { flex: 1; height: 1px; background: var(--hairline); }
  .group-label .cadence {
    font-family: var(--f-mono);
    font-size: 0.68rem;
    color: var(--muted);
    white-space: nowrap;
  }

  .hike {
    display: grid;
    grid-template-columns: 5.4rem 1fr auto;
    gap: 0.35rem 1.3rem;
    align-items: baseline;
    padding: 1rem 0;
    border-bottom: 1px solid var(--hairline);
  }
  .hike:hover { background: color-mix(in srgb, var(--surface) 70%, transparent); }
  .hike .when {
    font-family: var(--f-mono);
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--forest);
    font-variant-numeric: tabular-nums;
  }
  .hike .when small {
    display: block;
    font-size: 0.68rem;
    font-weight: 400;
    color: var(--muted);
    margin-top: 0.1rem;
  }
  .hike .what { min-width: 0; }
  .hike .name {
    font-family: var(--f-display);
    font-size: 1.06rem;
    font-weight: 500;
    line-height: 1.35;
  }
  .hike .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.45rem 0.85rem;
    margin-top: 0.4rem;
    font-family: var(--f-mono);
    font-size: 0.72rem;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  .hike .meta .host { color: var(--ink-soft); }
  .hike .meta .host::before {
    content: "안내";
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    color: var(--muted);
    margin-right: 0.35rem;
  }

  /* difficulty meter — 3 bars, filled = grade */
  .grade { display: inline-flex; gap: 2px; align-items: flex-end; }
  .grade i {
    display: block;
    width: 3px;
    background: var(--surface-2);
    border-radius: 1px;
  }
  .grade i:nth-child(1) { height: 5px; }
  .grade i:nth-child(2) { height: 8px; }
  .grade i:nth-child(3) { height: 11px; }
  .grade i.on { background: var(--accent); }

  .hike .tag {
    justify-self: end;
    align-self: center;
    font-family: var(--f-mono);
    font-size: 0.64rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--forest);
    border: 1px solid var(--hairline);
    border-radius: 999px;
    padding: 0.2rem 0.62rem;
    white-space: nowrap;
  }
  .hike .tag.hot { color: var(--accent); border-color: var(--accent-soft); }

  @media (max-width: 40rem) {
    .hike { grid-template-columns: 4.6rem 1fr; }
    .hike .tag { grid-column: 2; justify-self: start; margin-top: 0.15rem; }
  }

  /* ── Reports ───────────────────────────────────────────────────────── */
  .reports {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    gap: 1px;
    background: var(--hairline);
    border-block: 1px solid var(--hairline);
  }
  .report {
    background: var(--ground);
    padding: 1.5rem 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }
  .report .kind {
    font-family: var(--f-mono);
    font-size: 0.64rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .report h3 { font-size: 1.02rem; font-weight: 500; }
  .report p {
    font-size: 0.86rem;
    color: var(--ink-soft);
    line-height: 1.65;
  }
  .report .by {
    margin-top: auto;
    padding-top: 0.8rem;
    font-family: var(--f-mono);
    font-size: 0.7rem;
    color: var(--muted);
  }

  /* ── Join ──────────────────────────────────────────────────────────── */
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 1.6rem;
  }
  .step { border-top: 2px solid var(--forest); padding-top: 1rem; }
  .step .num {
    font-family: var(--f-mono);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: var(--muted);
  }
  .step h3 { font-size: 1.05rem; margin-top: 0.3rem; }
  .step p {
    margin-top: 0.5rem;
    font-size: 0.87rem;
    color: var(--ink-soft);
  }

  /* ── Resources ─────────────────────────────────────────────────────── */
  .cols {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 2.4rem;
  }
  .linklist { display: flex; flex-direction: column; }
  .linklist h3 {
    font-size: 0.9rem;
    font-weight: 600;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid var(--hairline);
  }
  .linklist a {
    padding: 0.62rem 0;
    border-bottom: 1px solid var(--hairline);
    font-size: 0.87rem;
    text-decoration: none;
    color: var(--ink-soft);
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    transition: color 0.15s;
  }
  .linklist a:hover { color: var(--accent); }
  .linklist a::after {
    content: "↗";
    font-family: var(--f-mono);
    font-size: 0.72rem;
    color: var(--muted);
  }

  /* ── Footer ────────────────────────────────────────────────────────── */
  footer {
    border-top: 1px solid var(--hairline);
    padding-block: 2.6rem 3.4rem;
  }
  footer .about {
    max-width: 46ch;
    font-size: 0.88rem;
    color: var(--ink-soft);
  }
  footer .sig {
    margin-top: 1.2rem;
    font-family: var(--f-mono);
    font-size: 0.72rem;
    color: var(--muted);
  }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    * { transition: none !important; animation: none !important; }
  }
</style>
</head>
<body>

<a class="skip" href="#schedule">본문으로 건너뛰기</a>

<div class="wrap">

  <header class="masthead">
    <a class="mark" href="/">ihiker<span>.org</span></a>
    <nav aria-label="주 메뉴">
      <a href="#schedule">산행 일정</a>
      <a href="#reports">산행 후기</a>
      <a href="#join">가입 안내</a>
      <a href="#info">준비 정보</a>
    </nav>
  </header>

  <section class="hero">
    <div class="eyebrow">San Francisco — Monterey · Tahoe · Yosemite</div>
    <h1>산이 좋아서, 매주 갑니다.</h1>
    <p class="lede">
      샌프란시스코에서 몬트레이까지 이어지는 해안 산맥, 그리고 동쪽의 타호와 요세미티.
      바쁜 일상을 잠시 내려놓고 함께 걷는 열린 산악회입니다. 성별·나이·직업과 상관없이
      누구나 오실 수 있습니다.
    </p>
    <div class="hero-actions">
      <a class="btn btn-solid" href="#schedule">이번 달 산행 보기</a>
      <a class="btn btn-ghost" href="#join">처음 오시나요?</a>
    </div>

    <div class="ridge" aria-hidden="true">
      <svg viewBox="0 0 1200 150" preserveAspectRatio="none" role="presentation">
        <defs>
          <linearGradient id="ridgeFill" x1="0" y1="0" x2="0" y2="1">
            <stop class="stop-top" offset="0%"/>
            <stop class="stop-bottom" offset="100%"/>
          </linearGradient>
        </defs>
        <path fill="url(#ridgeFill)" stroke="none"
          d="M0,132 L38,124 L74,127 L112,108 L150,116 L186,96 L214,101 L248,74 L282,88 L318,80 L352,95 L390,66 L422,78 L458,54 L492,70 L528,44 L560,58 L596,30 L628,47 L664,36 L700,61 L734,50 L770,76 L806,64 L840,86 L876,72 L910,97 L946,84 L982,104 L1018,92 L1054,113 L1090,101 L1126,121 L1162,110 L1200,128 L1200,150 L0,150 Z"/>
        <path class="ridge-line" fill="none" stroke-width="1.4" stroke-linejoin="round"
          d="M0,132 L38,124 L74,127 L112,108 L150,116 L186,96 L214,101 L248,74 L282,88 L318,80 L352,95 L390,66 L422,78 L458,54 L492,70 L528,44 L560,58 L596,30 L628,47 L664,36 L700,61 L734,50 L770,76 L806,64 L840,86 L876,72 L910,97 L946,84 L982,104 L1018,92 L1054,113 L1090,101 L1126,121 L1162,110 L1200,128"/>
        <circle class="peak-dot" cx="596" cy="30" r="3.2"/>
      </svg>
      <div class="ridge-labels">
        <span><b>후다트</b> 800ft</span>
        <span><b>퍼리시마</b> 1,600ft</span>
        <span><b>미션피크</b> 2,517ft</span>
        <span><b>클라우즈 레스트</b> 9,930ft</span>
        <span><b>글렌 패스</b> 11,978ft</span>
      </div>
    </div>
  </section>

  <!-- ── Schedule ──────────────────────────────────────────────────── -->
  <section class="section" id="schedule">
    <div class="section-head">
      <h2>산행 일정</h2>
      <span class="period">2026년 9월</span>
      <p>참가는 각 산행 글에 댓글로 컨펌해 주세요. 카풀과 뒷풀이는 현장에서 정합니다.</p>
    </div>

    <div class="group">
      <div class="group-label">
        <h3>주말 산행</h3>
        <div class="rule"></div>
        <div class="cadence">토요일 · 일요일 · 오전 8시 30분</div>
      </div>

      <div class="hike">
        <div class="when">09/12<small>토</small></div>
        <div class="what">
          <div class="name">퍼리시마 크릭 레드우즈</div>
          <div class="meta">
            <span>8.4 mi</span>
            <span>+1,600 ft</span>
            <span class="grade" title="난이도 중"><i class="on"></i><i class="on"></i><i></i></span>
            <span class="host">JB</span>
          </div>
        </div>
        <div class="tag">정기</div>
      </div>

      <div class="hike">
        <div class="when">09/13<small>일</small></div>
        <div class="what">
          <div class="name">미션 피크</div>
          <div class="meta">
            <span>6.0 mi</span>
            <span>+2,200 ft</span>
            <span class="grade" title="난이도 중"><i class="on"></i><i class="on"></i><i></i></span>
            <span class="host">산초</span>
          </div>
        </div>
        <div class="tag">정기</div>
      </div>

      <div class="hike">
        <div class="when">09/19<small>토</small></div>
        <div class="what">
          <div class="name">후다트 카운티 파크</div>
          <div class="meta">
            <span>5.2 mi</span>
            <span>+1,100 ft</span>
            <span class="grade" title="난이도 하"><i class="on"></i><i></i><i></i></span>
            <span class="host">파피</span>
            <span>초보 환영</span>
          </div>
        </div>
        <div class="tag">정기</div>
      </div>

      <div class="hike">
        <div class="when">09/26<small>토</small></div>
        <div class="what">
          <div class="name">헨리 카웰 SP — 폴 크릭 유닛</div>
          <div class="meta">
            <span>7.1 mi</span>
            <span>+1,300 ft</span>
            <span class="grade" title="난이도 중"><i class="on"></i><i class="on"></i><i></i></span>
            <span class="host">창공</span>
          </div>
        </div>
        <div class="tag">정기</div>
      </div>

      <div class="hike">
        <div class="when">09/27<small>일</small></div>
        <div class="what">
          <div class="name">플레젠튼 릿지 리저널 파크</div>
          <div class="meta">
            <span>7.5 mi</span>
            <span>+1,500 ft</span>
            <span class="grade" title="난이도 중"><i class="on"></i><i class="on"></i><i></i></span>
            <span class="host">산초</span>
          </div>
        </div>
        <div class="tag">정기</div>
      </div>
    </div>

    <div class="group">
      <div class="group-label">
        <h3>특별 산행</h3>
        <div class="rule"></div>
        <div class="cadence">백팩킹 · 캠핑 · 원정</div>
      </div>

      <div class="hike">
        <div class="when">09/03<small>목 – 일</small></div>
        <div class="what">
          <div class="name">미네랄 킹 → Sawtooth Pass 3박 4일</div>
          <div class="meta">
            <span>29.3 mi</span>
            <span>+7,800 ft</span>
            <span class="grade" title="난이도 상"><i class="on"></i><i class="on"></i><i class="on"></i></span>
            <span class="host">파피</span>
            <span>퍼밋 확보 · 정원 6명</span>
          </div>
        </div>
        <div class="tag hot">마감 임박</div>
      </div>

      <div class="hike">
        <div class="when">09/05<small>토 – 일</small></div>
        <div class="what">
          <div class="name">테나야 호수 – 클라우즈 레스트 – 요세미티 밸리</div>
          <div class="meta">
            <span>14.6 mi</span>
            <span>+2,400 ft</span>
            <span class="grade" title="난이도 상"><i class="on"></i><i class="on"></i><i class="on"></i></span>
            <span class="host">휴먼</span>
            <span>1박 캠핑 · 셔틀 예약 완료</span>
          </div>
        </div>
        <div class="tag">캠핑</div>
      </div>
    </div>
  </section>

  <!-- ── Reports ───────────────────────────────────────────────────── -->
  <section class="section" id="reports">
    <div class="section-head">
      <h2>산행 후기</h2>
      <p>다녀온 산행은 사진과 함께 짧게라도 남겨 주세요. 다음 사람에게 그대로 지도가 됩니다.</p>
    </div>

    <div class="reports">
      <article class="report">
        <div class="kind">백팩킹</div>
        <h3>레이 레이크스 루프 3박 4일</h3>
        <p>글렌 패스를 넘던 날 아침이 제일 추웠습니다. 물은 어디서든 구할 수 있었고,
           곰통은 꽉 채워도 4일치가 겨우 들어갑니다. 다음 팀을 위해 캠프 자리 좌표를 정리해 두었습니다.</p>
        <div class="by">휴먼 · 8월 21–24일</div>
      </article>

      <article class="report">
        <div class="kind">주말 산행</div>
        <h3>안 와 본 사람은 있어도 한 번만 온 사람은 없다</h3>
        <p>여덟 분이 아주 액티브하게 걸었고, 끝나고는 식혜와 수박으로 뒷풀이를 했습니다.
           후다트는 한여름에도 그늘이 깊어서 오후 산행으로도 무리가 없습니다.</p>
        <div class="by">휴먼 · 8월 29일</div>
      </article>

      <article class="report">
        <div class="kind">백팩킹</div>
        <h3>커시드럴 호수에서 클라우즈 레스트까지</h3>
        <p>첫날은 선라이즈 레이크, 둘째 날은 리틀 요세미티 밸리에서 묵었습니다.
           퍼밋은 커시드럴 레이크스(871번)로 잡았고, 온라인 매진 이후에도 자리가 났습니다.</p>
        <div class="by">파피 · 7월 11–13일</div>
      </article>
    </div>
  </section>

  <!-- ── Join ──────────────────────────────────────────────────────── -->
  <section class="section" id="join">
    <div class="section-head">
      <h2>함께 하는 방법</h2>
      <p>회비는 없습니다. 산행마다 카풀 기름값과 퍼밋 비용만 나눠 냅니다.</p>
    </div>

    <div class="steps">
      <div class="step">
        <div class="num">STEP 01</div>
        <h3>가입 인사 남기기</h3>
        <p>어느 동네에 사는지, 어떤 산행을 해 보셨는지 한두 줄이면 충분합니다.
           닉네임 하나 정해서 오시면 됩니다.</p>
      </div>
      <div class="step">
        <div class="num">STEP 02</div>
        <h3>산행 세 번 참여</h3>
        <p>주말 산행이 가장 무난합니다. 처음이라면 후다트처럼
           짧고 그늘 깊은 코스부터 오시는 걸 권합니다.</p>
      </div>
      <div class="step">
        <div class="num">STEP 03</div>
        <h3>정회원 등업</h3>
        <p>세 번 이후 운영진이 등업 공지를 올립니다.
           특별 산행 신청과 회원 장터를 이용하실 수 있습니다.</p>
      </div>
    </div>
  </section>

  <!-- ── Info ──────────────────────────────────────────────────────── -->
  <section class="section" id="info">
    <div class="section-head">
      <h2>준비 정보</h2>
      <p>특별 산행은 퍼밋이 먼저입니다. 인기 구간은 6개월 전에 열립니다.</p>
    </div>

    <div class="cols">
      <div class="linklist">
        <h3>Wilderness Permit</h3>
        <a href="https://www.nps.gov/yose/planyourvisit/wildpermits.htm" target="_blank" rel="noopener">요세미티 국립공원</a>
        <a href="https://www.fs.usda.gov/main/inyo/passes-permits/recreation" target="_blank" rel="noopener">인요 국유림</a>
        <a href="https://www.nps.gov/seki/planyourvisit/wilderness_permits.htm" target="_blank" rel="noopener">킹스캐니언 · 세쿼이아</a>
      </div>

      <div class="linklist">
        <h3>캠핑장 예약</h3>
        <a href="https://www.recreation.gov" target="_blank" rel="noopener">recreation.gov — 국립공원</a>
        <a href="https://www.reservecalifornia.com" target="_blank" rel="noopener">ReserveCalifornia — 주립공원</a>
        <a href="https://www.ebparks.org/camping" target="_blank" rel="noopener">이스트베이 리저널 파크</a>
      </div>

      <div class="linklist">
        <h3>기본 준비물</h3>
        <a href="#schedule">물 2L · 행동식 · 헤드램프</a>
        <a href="#schedule">레이어링 — 해안은 오후에 안개가 듭니다</a>
        <a href="#schedule">틱 예방 — 긴바지와 하산 후 확인</a>
      </div>
    </div>
  </section>

  <footer>
    <p class="about">
      ihiker는 열린 산악회를 지향합니다. 각 회원의 자발적인 참여와 봉사로 운영되며,
      정해진 리더도 의무도 없습니다. 산이 좋으면 그것으로 충분합니다.
    </p>
    <div class="sig">ihiker.org · 회원 일동 · San Francisco Bay Area</div>
  </footer>

</div>

</body>
</html>
