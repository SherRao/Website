// Round 9: full-screen sticky panels that slide over each other, on a grid. Builds on round 7's pieces.
// Round 7 notes: body[data-fx] picks the reveal ("night", "aperture" or both);
// body[data-order="stage-first"] moves the photo mosaic right after "at a glance".
(() => {
  const C = window.CONTENT, S = window.STORY, rm = FX.rm;
  const order = document.body.dataset.order || "";
  const ch = (id) => S.chapters.find((c) => c.id === id);
  const P = (name) => window.PRODUCTS.find((p) => p.name === name);
  const img = (f, alt = "") => `<img src="../assets/${f}" alt="${alt}">`;
  const spur = C.events.find((e) => e.id === "spurhacks");

  // ---------- artworks (same pieces as round 6) ----------
  const ROUTE = "M70 320 H200 V130 H330";
  const ART = {
    dot: () => `<div class="piece"><svg viewBox="0 0 400 400" aria-hidden="true">
        <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#efe7dc" stroke-opacity="0.08"/></pattern></defs>
        <rect width="400" height="400" fill="url(#g)"/>
        <path class="tx-route" d="${ROUTE}" pathLength="1"/>
        <g${rm ? ' transform="translate(330 130)"' : ""}>
          <circle r="34" fill="rgba(59,118,255,0.14)" stroke="rgba(59,118,255,0.4)">${rm ? "" : `<animate attributeName="r" values="24;40;24" dur="3s" repeatCount="indefinite"/>`}</circle>
          <circle r="10" fill="#3b76ff" stroke="#fff" stroke-width="4"/>
          ${rm ? "" : `<animateMotion path="${ROUTE}" dur="7s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;0.42;0.5;0.92;1" calcMode="linear"/>`}
        </g></svg></div>`,
    tab: () => {
      const N = { you: [110, 190], sam: [290, 190], priya: [290, 320], jon: [110, 320] };
      const line = ([a, b]) => `<line x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" stroke="#0e7a54" stroke-width="3" stroke-linecap="round"/>`;
      const cap = (t) => `<text x="200" y="374" text-anchor="middle" fill="#0e7a54" font-family="ui-monospace, monospace" font-size="15">${t}</text>`;
      return `<div class="piece" style="background:#f3f0e8"><svg viewBox="0 0 400 400" aria-hidden="true">
        <text x="200" y="104" text-anchor="middle" fill="#0e7a54" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-weight="700" font-size="56">tab.</text>
        <g class="tabp-pair">${[["sam", "you"], ["you", "priya"], ["jon", "you"], ["sam", "priya"], ["jon", "sam"], ["jon", "priya"]].map(line).join("")}${cap("6 payments")}</g>
        <g class="tabp-tab">${[["jon", "priya"], ["sam", "you"]].map(line).join("")}${cap("2 payments with tab")}</g>
        ${Object.entries(N).map(([n, [x, y]]) => `<circle cx="${x}" cy="${y}" r="21" fill="#f3f0e8" stroke="#0e7a54" stroke-width="3"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#0e7a54" font-family="ui-monospace, monospace" font-size="11">${n}</text>`).join("")}
      </svg></div>`;
    },
    count: (to, pre = "", post = "") => `<div class="piece piece--type"><span data-count="${to}" data-pre="${pre}" data-post="${post}">${pre}${rm ? Number(to).toLocaleString("en-US") : 0}${post}</span></div>`,
    dots: () => `<div class="piece"><div><div class="dots" data-dots="12">${"<i></i>".repeat(15)}</div><p class="dots-cap" data-dots-cap>${rm ? 12 : 0}/15</p></div></div>`,
    blank: (t) => `<div class="piece piece--blank"><i class="scan"></i><span>${t}</span></div>`,
  };
  const wave = (n = 32) => `<div class="wave" aria-hidden="true">${[...Array(n)].map((_, i) => `<i style="--i:${i}"></i>`).join("")}</div>`;

  // ---------- works ----------
  const cell = (art, title, years, role, note, url, d = 0) => `
  <article class="cell">
    <div class="art rv" style="--d:${d}ms">${art}</div>
    <div class="wl"><span class="title">${title}<span>, ${years}</span></span><p class="role">${role}</p><p class="note">${note}</p>${url ? `<p class="note"><a href="${url}" target="_blank" rel="noopener">visit ↗</a></p>` : ""}</div>
  </article>`;
  const engineer = `<div class="row" style="--cols:3">
    ${cell(ART.dot(), "blue dot", "2025 to now", "senior software engineer, mappedin", P("blue dot").what, P("blue dot").url)}
    ${cell(ART.tab(), "tab", "2026", "side project", P("tab").what, P("tab").url, 120)}
    ${cell(ART.count(1100000, "", "+"), "shopify cli + partner dashboard", "2022 to 2023", "software engineer, shopify", "1.1M+ people a day on the partner dashboard; the cli runs in 850 apps a day.", P("shopify cli + partner dashboard").url, 240)}
  </div>
  <div class="also"><span class="label-s">also in the collection</span>${FX.built(["spurhacks platform", "spur investor platform", "seahorse", "rfq dashboard"].map(P))}</div>`;
  const founder = `<div class="row" style="--cols:4">
    ${cell(img("spur-bbq-2.jpg", "SPUR x Konfer sign"), "konfer", "2024 to now", "founder & ceo", "the team behind spurhacks, and the platform that ran it.", "https://konfer.ca")}
    ${cell(ART.dots(), "spur innovation center", "2024 to 2025", "project manager", "$1M+ invested; 12 of 15 startups hit their q1 okrs.", null, 120)}
    ${cell(ART.count(750, "$", "k"), "seahorse", "2024", "technical product lead, near", "privacy-first mental health app; the mvp helped raise $750k.", null, 240)}
    ${cell(ART.blank("not yet on view"), "untitled", "2026", "founder", "a new company, in stealth.", null, 360)}
  </div>`;

  // The stage: many photos, close together. Sizes vary so the big moments lead.
  const T = (f, cap, size = "") => ({ f, cap, size });
  const TILES = [
    T("spurhacks-2.jpg", "spurhacks 2025", "w4 h3"), T("spurhacks-6.jpg", "spurhacks 2025, camera + stage crew", "w2 h2"), T("hawkhacks-2.jpg", "hawkhacks 2024", "w2"),
    T("near-yacht-3.jpg", "collision yacht soirée 2024", "w2 h2"), T("spur-bbq-4.jpg", "spur bbq festival 2024", "w2"), T("spurhacks-4.jpg", "spurhacks 2025, doors open", "w2"),
    T("hawkhacks-4.jpg", "hawkhacks 2024", "w2 h2"), T("spur-bbq-3.jpg", "spur bbq festival 2024, pitch competition", "w2 h2"), T("near-yacht-1.jpg", "toronto from the yacht", "w2"),
    T("spurhacks-3.jpg", "spurhacks 2025, wayfinding", "w2"), T("hawkhacks-5.jpg", "hawkhacks 2024", "w2"), T("spur-bbq-6.jpg", "spur bbq festival 2024", "w2"),
    T("near-yacht-2.jpg", "collision yacht soirée 2024", "w2"), T("spurhacks-5.jpg", "blackberry campus, waterloo", "w2"),
  ];
  const stage = `<div class="mosaic">${TILES.map((t, i) => `<figure class="tile rv ${t.size}" style="--d:${(i % 6) * 70}ms" tabindex="0">${img(t.f, t.cap)}<figcaption>${t.cap}</figcaption></figure>`).join("")}</div>
  <div class="shows">${C.events.map((e) => `<a href="${e.url}" target="_blank" rel="noopener"><b>${e.name}</b><span>${e.date}<br>${e.stats.slice(0, 2).map(([b, s]) => `${b} ${s}`).join(", ")}</span></a>`).join("")}</div>`;

  const films = C.films.map((f) => `<li><span>${f.title} <small>${f.year}</small></span><span class="stars">${stars(f.rating)}</span></li>`).join("");
  const offHours = `<div class="wall">
    <div class="card c2"><span class="label-s">on repeat</span><h3>music i listen to</h3><p>live from spotify once it's connected: what's playing now, and what's been on repeat.</p>${wave()}<p><span class="needed">connect spotify</span></p></div>
    <div class="card c2"><span class="label-s">in the band</span><h3>music i make</h3><p>the band, what i play, and a couple of recordings.</p><p><span class="needed">content needed</span></p></div>
    <a class="card c2" href="${C.links.letterboxd}" target="_blank" rel="noopener" style="text-decoration:none"><span class="label-s">last watched</span><h3>films</h3><ul class="films">${films}</ul></a>
    <div class="card c3"><span class="label-s">through the lens</span><h3>photography</h3><p>pictures i've taken and pictures i love.</p><div class="frames"><i>photo</i><i>photo</i><i>photo</i></div><p><span class="needed">add photos</span></p></div>
    <div class="card c3"><span class="label-s">in the kitchen</span><h3>cooking</h3><p>what i've been cooking lately, and the one dish i'd make for you.</p><div class="chips"><span>a recipe</span><span>a photo</span><span>a go-to dish</span></div><p><span class="needed">content needed</span></p></div>
  </div>`;


  // ---------- page: one full-screen panel per chapter ----------
  // Each chapter has to fit one screen, so: one short paragraph, works in a single row, a smaller mosaic.
  const chips = `<div class="also-chips"><span class="label-s">also built</span>${["spurhacks platform", "spur investor platform", "seahorse", "rfq dashboard"].map(P).map((p) => p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.name}</a>` : `<span>${p.name}</span>`).join("")}</div>`;
  const engineerS = engineer.replace(/<div class="also">[\s\S]*$/, chips);
  const PT = [["spurhacks-2.jpg", "spurhacks 2025", "w4 h3"], ["spurhacks-6.jpg", "spurhacks 2025, camera + stage crew", "w2 h2"], ["near-yacht-3.jpg", "collision yacht soirée 2024", "w2 h2"],
    ["hawkhacks-2.jpg", "hawkhacks 2024", "w2"], ["spur-bbq-4.jpg", "spur bbq festival 2024", "w2"], ["spurhacks-4.jpg", "spurhacks 2025, doors open", "w2"],
    ["hawkhacks-4.jpg", "hawkhacks 2024", "w2"], ["spur-bbq-3.jpg", "spur bbq festival 2024, pitches", "w2"], ["near-yacht-1.jpg", "toronto from the yacht", "w2"]];
  const stageS = `<div class="mosaic">${PT.map(([f, cap, size], i) => `<figure class="tile rv ${size}" style="--d:${(i % 6) * 70}ms" tabindex="0">${img(f, cap)}<figcaption>${cap}</figcaption></figure>`).join("")}</div>
    <div class="shows-line">${C.events.map((e) => `<a href="${e.url}" target="_blank" rel="noopener"><b>${e.name}</b> ${e.stats[0][0]} ${e.stats[0][1]}</a>`).join("")}</div>`;
  const PANELS = [
    { id: "engineer", n: "i", title: "the engineer", text: "senior software engineer at mappedin, on the blue dot. before that: shopify, webisoft and magnet forensics. on the side, i build things like tab.", body: engineerS },
    { id: "stage", n: "ii", title: "the stage", text: ch("stage").paras[0], body: stageS },
    { id: "founder", n: "iii", title: "the founder", text: "founder & ceo of konfer, the team behind spurhacks. before that, pm at spur innovation center and technical product at near. right now: a new company, in stealth.", body: founder },
    { id: "off", n: "iv", title: "off hours", text: "the things i do when nobody's paying me: music, films, food, and photos.", body: offHours },
  ];
  const name = `<span>nausher</span><span>rao</span>`;
  const glance = `<div class="glance">
      <a href="${C.now.url}" target="_blank" rel="noopener"><span class="label-s">now</span><b>mappedin</b><span class="v">senior software engineer, blue dot</span></a>
      <a href="https://konfer.ca" target="_blank" rel="noopener"><span class="label-s">founder</span><b>konfer</b><span class="v">the team behind spurhacks</span></a>
      <div><span class="label-s">next</span><b>a new company</b><span class="v">in stealth</span></div>
      <a href="#stage"><span class="label-s">biggest show</span><b>1,400+ people</b><span class="v">spurhacks 2025, 291 projects</span></a>
      <a href="#engineer"><span class="label-s">built</span><b>${window.PRODUCTS.length} products</b><span class="v">including tab, new in 2026</span></a>
    </div>`;

  document.querySelector(".nav nav").innerHTML = PANELS.map((p) => `<a href="#${p.id}">${p.title}</a>`).join("") + `<a href="#hi">say hi</a>`;
  document.getElementById("app").innerHTML = `
  <section class="panel hero" id="top" style="--i:0">
    <div class="spot" aria-hidden="true"></div>
    <p class="name name--lit display" aria-hidden="true">${name}</p>
    <h1 class="name name--base display">${name}</h1>
    <div class="hero-foot">
      <p class="headline">${S.headline[0]} <em>${S.headline[1]}</em></p>
      <p class="intro">${C.intro}</p>
    </div>
    ${glance}
  </section>
  <div class="hold" aria-hidden="true"></div>
  ${PANELS.map((p, i) => `
  <section class="panel chapter" id="${p.id}" style="--i:${i + 1};view-timeline-name:--p${i + 1}">
    <div class="panel-in" style="animation-timeline:--p${i + 2}">
      <header class="chapter-head">
        <div><span class="label-s">${p.n}.</span><h2 class="chapter-title display">${p.title}</h2></div>
        <div class="chapter-text"><p>${p.text}</p></div>
      </header>
      <div class="panel-body">${p.body}</div>
    </div>
  </section>
  <div class="hold" aria-hidden="true"></div>`).join("")}
  <section class="panel door" id="hi" style="--i:${PANELS.length + 1};view-timeline-name:--p${PANELS.length + 1}">
    <div>
      <span class="label-s">say hi, and the house lights come up</span><br>
      <a class="door-mail display" href="mailto:${C.email}">${C.email}</a>
      <nav aria-label="Elsewhere"><a href="${C.links.github}" target="_blank" rel="noopener">github</a><a href="${C.links.linkedin}" target="_blank" rel="noopener">linkedin</a><a href="${C.links.letterboxd}" target="_blank" rel="noopener">letterboxd</a></nav>
      <p class="fine label-s">${C.education.degree}, ${C.education.school}. designed and built by nausher rao.</p>
    </div>
  </section>`;

  // ---------- motion ----------
  FX.spotlight(document.querySelector(".hero"));
  // A panel's title lights up once the panel has slid most of the way in.
  const cueIO = new IntersectionObserver((es) => es.forEach((e) => e.target.querySelector(".chapter-head").classList.toggle("is-on", e.intersectionRatio > 0.6)), { threshold: [0, 0.6, 1] });
  document.querySelectorAll(".panel.chapter").forEach((p) => (rm ? p.querySelector(".chapter-head").classList.add("is-on") : cueIO.observe(p)));
  const countUp = (el) => {
    const to = +el.dataset.count, pre = el.dataset.pre, post = el.dataset.post, t0 = performance.now();
    const step = (t) => { const p = Math.min(1, (t - t0) / 1600); el.textContent = pre + Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString("en-US") + post; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const fillDots = (box) => {
    const cap = box.parentElement.querySelector("[data-dots-cap]");
    [...box.querySelectorAll("i")].slice(0, +box.dataset.dots).forEach((d, i) => setTimeout(() => { d.classList.add("on"); cap.textContent = `${i + 1}/15`; }, 200 + i * 110));
  };
  if (rm) document.querySelectorAll("[data-dots] i").forEach((d, i) => i < 12 && d.classList.add("on"));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add("is-in");
    io.unobserve(el);
    if (rm) return;
    el.querySelectorAll("[data-count]").forEach(countUp);
    el.querySelectorAll("[data-dots]").forEach(fillDots);
  }), { rootMargin: "0px 0px -12% 0px" });
  document.querySelectorAll(".rv").forEach((el) => (rm ? el.classList.add("is-in") : io.observe(el)));
})();
