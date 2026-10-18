// Round 6: Staged's essay with Exhibition's gallery works. Each variant page sets body[data-fx] and its own CSS.
(() => {
  const C = window.CONTENT, S = window.STORY, rm = FX.rm;
  const fx = document.body.dataset.fx || "";
  const ch = (id) => S.chapters.find((c) => c.id === id);
  const P = (name) => window.PRODUCTS.find((p) => p.name === name);
  const img = (f, alt = "") => `<img src="../assets/${f}" alt="${alt}">`;
  const spur = C.events.find((e) => e.id === "spurhacks");

  // ---------- artworks ----------
  const ROUTE = "M70 320 H200 V130 H330";
  const ART = {
    dot: () => `<div class="piece"><svg viewBox="0 0 400 400" aria-hidden="true">
        <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" stroke-opacity="0.08"/></pattern></defs>
        <rect width="400" height="400" fill="url(#g)" style="color:var(--ink)"/>
        <path class="tx-route" d="${ROUTE}" pathLength="1"/>
        <g${rm ? ' transform="translate(330 130)"' : ""}>
          <circle r="34" fill="rgba(59,118,255,0.14)" stroke="rgba(59,118,255,0.4)">${rm ? "" : `<animate attributeName="r" values="24;40;24" dur="3s" repeatCount="indefinite"/>`}</circle>
          <circle r="10" fill="#3b76ff" stroke="#fff" stroke-width="4"/>
          ${rm ? "" : `<animateMotion path="${ROUTE}" dur="7s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;0.42;0.5;0.92;1" calcMode="linear"/>`}
        </g>
      </svg></div>`,
    tab: () => {
      const N = { you: [110, 190], sam: [290, 190], priya: [290, 320], jon: [110, 320] };
      const line = ([a, b]) => `<line x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" stroke="#0e7a54" stroke-width="3" stroke-linecap="round"/>`;
      const PAIR = [["sam", "you"], ["you", "priya"], ["jon", "you"], ["sam", "priya"], ["jon", "sam"], ["jon", "priya"]];
      const TAB = [["jon", "priya"], ["sam", "you"]];
      return `<div class="piece" style="background:#f3f0e8"><svg viewBox="0 0 400 400" aria-hidden="true">
        <text x="200" y="104" text-anchor="middle" fill="#0e7a54" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-weight="700" font-size="56">tab.</text>
        <g class="tabp-pair">${PAIR.map(line).join("")}<text x="200" y="372" text-anchor="middle" fill="#0e7a54" font-family="ui-monospace, monospace" font-size="14">6 payments</text></g>
        <g class="tabp-tab">${TAB.map(line).join("")}<text x="200" y="372" text-anchor="middle" fill="#0e7a54" font-family="ui-monospace, monospace" font-size="14">2 payments with tab</text></g>
        ${Object.entries(N).map(([n, [x, y]]) => `<circle cx="${x}" cy="${y}" r="20" fill="#f3f0e8" stroke="#0e7a54" stroke-width="3"/><text x="${x}" y="${y + 4}" text-anchor="middle" fill="#0e7a54" font-family="ui-monospace, monospace" font-size="11">${n}</text>`).join("")}
      </svg></div>`;
    },
    count: (to, pre = "", post = "") => `<div class="piece piece--type"><span data-count="${to}" data-pre="${pre}" data-post="${post}">${pre}${rm ? Number(to).toLocaleString("en-US") : 0}${post}</span></div>`,
    dots: () => `<div class="piece"><div><div class="dots" data-dots="12">${'<i></i>'.repeat(15)}</div><p class="dots-cap" data-dots-cap>${rm ? 12 : 0}/15</p></div></div>`,
    blank: (t) => `<div class="piece piece--blank"><i class="scan"></i><span>${t}</span></div>`,
    wave: () => `<div class="piece piece--wave"><div class="wave">${[...Array(24)].map((_, i) => `<i style="--i:${i}"></i>`).join("")}</div><span>on loan, returning soon</span></div>`,
  };

  // ---------- works, chapter by chapter ----------
  const W = (title, years, art, medium, dims, role, note, url) => ({ title, years, art, medium, dims, role, note, url });
  const WORKS = {
    engineer: [
      W("blue dot", "2025 to now", ART.dot(), "indoor positioning", "any building where gps gives up", "senior software engineer, mappedin", P("blue dot").what, P("blue dot").url),
      W("tab", "2026", ART.tab(), P("tab").stack, "254 commits, 70 pull requests in the first month", "side project", P("tab").what, P("tab").url),
      W("shopify cli + partner dashboard", "2022 to 2023", ART.count(1100000, "", "+"), P("shopify cli + partner dashboard").stack, "1.1M+ people a day", "software engineer, shopify", P("shopify cli + partner dashboard").what, P("shopify cli + partner dashboard").url),
    ],
    founder: [
      W("konfer", "2024 to now", img("spur-bbq-2.jpg", "SPUR x Konfer sign"), "people, product, a $350k+ budget", "14 organizers, 43 volunteers", "founder & ceo", "the team behind spurhacks, and the platform that ran it.", "https://konfer.ca"),
      W("spur innovation center", "2024 to 2025", ART.dots(), "$1M+ in startup investment", "50+ companies reviewed, 15 picked", "project manager", "12 of 15 startups hit their q1 okrs."),
      W("seahorse", "2024", ART.count(750, "$", "k"), P("seahorse").stack, "two live demos, $750k raised", "technical product lead, near", P("seahorse").what),
      W("untitled", "2026", ART.blank("not yet on view"), "undisclosed", "in progress", "founder", "a new company, in stealth. this wall is reserved."),
    ],
    stage: C.events.map((e) => W(e.name, e.date, img(e.photos[0], e.name),
      e.id === "spurhacks" ? "1,400+ people, broadcast av, three months" : "people, a venue, a run of show",
      e.stats.map(([b, s]) => `${b} ${s}`).join(", "),
      e.credits.filter(([r, n]) => n === "nausher rao" && !r.startsWith("budget")).map(([r]) => r).join(", "), e.blurb, e.url)),
    band: [W("the band", "ongoing", ART.wave(), "tba", "tba", "bandmate", C.band.line)],
  };
  const ALSO = ["spurhacks platform", "spur investor platform", "seahorse", "rfq dashboard"].map(P);

  let k = 0;
  const work = (w) => `
  <article class="work${k++ % 2 ? " flip" : ""}">
    <div class="art">${w.art}</div>
    <div class="wl">
      <span class="who">nausher rao</span>
      <span class="title">${w.title}<span>, ${w.years}</span></span>
      <dl><dt>medium </dt><dd>${w.medium}</dd><dt>dimensions </dt><dd>${w.dims}</dd><dt>role </dt><dd>${w.role}</dd></dl>
      <p class="note">${w.note}</p>
      ${w.title === "the band" ? `<span class="needed">content needed</span>` : ""}
      ${w.url ? `<p style="margin:10px 0 0"><a href="${w.url}" target="_blank" rel="noopener">visit ↗</a></p>` : ""}
    </div>
  </article>`;
  const head = (c, i) => `<header class="chapter-head"><span class="label-s">q${i + 1} / ${c.n}.</span><h2 class="chapter-title display">${c.title}</h2></header>`;
  const text = (c) => `<div class="text">${c.paras.map((p) => `<p>${p}</p>`).join("")}${c.needed ? `<p><span class="needed">content needed</span></p>` : ""}</div>`;
  const marquee = fx === "kinetic" ? `<div class="marquee" aria-hidden="true"><div>${[...C.events, ...C.events].map((e) => `<span>${e.name}</span><i>✦</i>`).join("")}</div></div>` : "";
  const name = `<span>nausher</span><span>rao</span>`;

  document.querySelector(".nav nav").innerHTML = S.chapters.map((c) => `<a href="#${c.id}">${c.n}.</a>`).join("");
  document.getElementById("app").innerHTML = `
  <section class="hero" id="top">
    <div class="spot" aria-hidden="true"></div>
    <p class="name name--lit display" aria-hidden="true">${name}</p>
    <h1 class="name name--base display">${name}</h1>
    <div class="hero-foot">
      <div><p class="headline">${S.headline[0]} <em>${S.headline[1]}</em></p><p class="dek label-s">${S.dek}. selected works inside.</p></div>
      <span class="label-s">scroll to begin</span>
    </div>
  </section>
  <div class="wrap">
    <p class="standfirst">${S.standfirst}</p>
    <ol class="contents">${S.chapters.map((c, i) => `<li><a href="#${c.id}"><span class="label-s">q${i + 1}</span><span class="n">${c.n}.</span><em>${c.title}</em><span class="label-s">${c.big || ""}</span></a></li>`).join("")}</ol>
  </div>
  ${["engineer", "founder", "stage", "band"].map((id, i) => {
    const c = ch(id);
    return `<section class="chapter" id="${id}">
      ${head(c, i)}${text(c)}
      ${c.pull ? `<p class="pull">${c.pull}</p>` : ""}
      ${id === "stage" ? marquee : ""}
      ${WORKS[id].map(work).join("")}
      ${id === "engineer" ? `<div class="also"><span class="label-s">also in the collection</span>${FX.built(ALSO)}</div>` : ""}
    </section>`;
  }).join("")}
  <section class="door" id="hi">
    <span class="numeral">v. say hi, and the house lights come up</span>
    <a class="door-mail display" href="mailto:${C.email}">${C.email}</a>
    <nav aria-label="Elsewhere"><a href="${C.links.github}" target="_blank" rel="noopener">github</a><a href="${C.links.linkedin}" target="_blank" rel="noopener">linkedin</a><a href="${C.links.letterboxd}" target="_blank" rel="noopener">letterboxd</a></nav>
  </section>
  <footer class="foot"><span>${C.education.degree}, ${C.education.school}</span><span>designed and built by nausher rao</span></footer>`;

  // Kinetic: essay paragraphs arrive word by word.
  if (fx === "kinetic" && !rm) {
    document.querySelectorAll(".text p, .standfirst").forEach((p) => {
      if (p.querySelector(".needed")) return;
      let i = 0;
      p.innerHTML = p.textContent.split(/(\s+)/).map((t) => (t.trim() ? `<span class="w" style="--i:${Math.min(i++, 60)}">${t}</span>` : t)).join("");
      p.classList.add("words");
    });
  }

  // ---------- motion ----------
  FX.spotlight(document.querySelector(".hero"));
  FX.cues(".chapter-head");

  const countUp = (el) => {
    const to = +el.dataset.count, pre = el.dataset.pre, post = el.dataset.post, t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v.toLocaleString("en-US") + post;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const fillDots = (box) => {
    const dots = [...box.querySelectorAll("i")], cap = box.parentElement.querySelector("[data-dots-cap]"), n = +box.dataset.dots;
    dots.slice(0, n).forEach((d, i) => setTimeout(() => { d.classList.add("on"); cap.textContent = `${i + 1}/15`; }, 200 + i * 110));
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
  }), { rootMargin: "0px 0px -15% 0px" });
  document.querySelectorAll(".work, .words, .also").forEach((el) => (rm ? el.classList.add("is-in") : io.observe(el)));
})();
