// Shared motion for the round 4 blends.
window.FX = (() => {
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Followspot: a soft circle of light that chases the cursor over the hero name.
  // The lit copy of the name sits exactly on top of the dim one and never moves; only its mask follows
  // the cursor. (Moving the copy inside a moving layer drifted out of line in some compositing setups.)
  // Expects, as direct children of the hero: a .spot glow, a .name--base heading and a .name--lit copy.
  const SPOT_CSS = `
.spot { position: absolute; left: 0; top: 0; z-index: 0; width: calc(var(--spot-r, 270px) * 2); height: calc(var(--spot-r, 270px) * 2); border-radius: 50%; pointer-events: none; opacity: 0; transition: opacity 700ms cubic-bezier(0.23, 1, 0.32, 1); will-change: transform, opacity; background: radial-gradient(closest-side, rgba(255, 230, 196, 0.13), rgba(255, 230, 196, 0.04) 65%, transparent); }
.name--lit { position: absolute; z-index: 2; margin: 0; padding: 0.3em 0.2em; pointer-events: none; user-select: none; opacity: 0; transition: opacity 700ms cubic-bezier(0.23, 1, 0.32, 1);
  -webkit-mask-image: radial-gradient(circle var(--spot-r, 270px) at var(--sx, -9999px) var(--sy, -9999px), #000 50%, rgba(0, 0, 0, 0.45) 76%, transparent 100%);
  mask-image: radial-gradient(circle var(--spot-r, 270px) at var(--sx, -9999px) var(--sy, -9999px), #000 50%, rgba(0, 0, 0, 0.45) 76%, transparent 100%); }
.is-lit > .spot, .is-lit > .name--lit { opacity: 1; }
.is-rm > .spot, .is-rm > .name--lit { display: none; }`;
  function spotlight(hero) {
    if (!document.getElementById("spot-css")) document.head.insertAdjacentHTML("beforeend", `<style id="spot-css">${SPOT_CSS}</style>`);
    const spot = hero.querySelector(".spot");
    const base = hero.querySelector(".name--base"), lit = hero.querySelector(".name--lit");
    // The copy is padded so tall letters aren't clipped by its mask; litX/litY are its padded corner.
    let raf = 0, last = 0, hovering = false, started = false, r = 270, litX = 0, litY = 0;
    let home = { x: 0, y: 0 }, target = { x: 0, y: 0 }, pos = { x: 0, y: 0 };
    const apply = () => {
      spot.style.transform = `translate3d(${pos.x - r}px, ${pos.y - r}px, 0)`;
      lit.style.setProperty("--sx", `${pos.x - litX}px`);
      lit.style.setProperty("--sy", `${pos.y - litY}px`);
    };
    function layout() {
      const hr = hero.getBoundingClientRect(), br = base.getBoundingClientRect();
      const cs = getComputedStyle(lit), pl = parseFloat(cs.paddingLeft), pt = parseFloat(cs.paddingTop);
      litX = br.left - hr.left - pl;
      litY = br.top - hr.top - pt;
      lit.style.left = litX + "px";
      lit.style.top = litY + "px";
      lit.style.width = br.width + pl * 2 + "px";
      r = spot.offsetWidth / 2;
      const w = Math.max(...[...base.children].map((s) => s.getBoundingClientRect().width));
      home = { x: br.left - hr.left + w * 0.45, y: br.top - hr.top + br.height * 0.5 };
      if (!hovering) target = { ...home };
      if (!started) pos = { ...target };
      apply();
    }
    function tick(t) {
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      const k = 1 - Math.exp(-dt / 110);
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      apply();
      if (Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3) raf = requestAnimationFrame(tick);
      else { raf = 0; last = 0; }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    // Re-measure whenever anything around the name could have moved it: resizes and late-loading fonts.
    new ResizeObserver(layout).observe(hero);
    document.fonts.load('900 100px "Antique Olive"').then(layout, layout);
    document.fonts.ready.then(layout);
    document.fonts.addEventListener("loadingdone", layout);
    if (rm) { hero.classList.add("is-rm"); return; }
    hero.addEventListener("pointermove", (e) => {
      const hr = hero.getBoundingClientRect();
      target = { x: e.clientX - hr.left, y: e.clientY - hr.top };
      hovering = true;
      kick();
    });
    hero.addEventListener("pointerleave", () => { hovering = false; target = { ...home }; kick(); });
    setTimeout(() => { hero.classList.add("is-lit"); started = true; }, 250);
  }

  // Adds `cls` the first time each element scrolls into view.
  function onceInView(selector, cls = "is-in") {
    const els = document.querySelectorAll(selector);
    if (rm) return els.forEach((el) => el.classList.add(cls));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -12% 0px" });
    els.forEach((el) => io.observe(el));
  }

  // Toggles `cls` while each element sits in the middle band of the screen, like a lighting cue.
  function cues(selector, cls = "is-on") {
    const els = document.querySelectorAll(selector);
    if (rm) return els.forEach((el) => el.classList.add(cls));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle(cls, e.isIntersecting)), { rootMargin: "-38% 0px -38% 0px" });
    els.forEach((el) => io.observe(el));
  }

  // "Things i've built" list. Layout lives here; each page sets the --b-* colours and fonts.
  const BUILT_CSS = `
.built { list-style: none; margin: 0; padding: 0; border-top: 2px solid var(--b-strong); }
.built-row { display: grid; grid-template-columns: 36px minmax(0, 0.9fr) minmax(0, 1.6fr) minmax(0, 0.8fr) 20px; gap: 20px; align-items: baseline; padding: 16px 0; border-bottom: 1px solid var(--b-rule); color: inherit; text-decoration: none; transition: opacity 150ms ease; }
.built:hover .built-row:not(:hover) { opacity: 0.45; }
.built-n { font-family: var(--b-mono); font-size: 11px; color: var(--b-accent); font-variant-numeric: tabular-nums; }
.built-name { font-size: 22px; line-height: 1.1; }
.built-tag { margin-left: 8px; padding: 1px 7px; border-radius: 999px; background: var(--b-accent); color: var(--b-on-accent); font: 600 10px/1.6 var(--b-mono); letter-spacing: 0.06em; text-transform: uppercase; font-style: normal; vertical-align: 4px; }
.built-what { font-size: 15px; line-height: 1.5; }
.built-stack { display: block; margin-top: 4px; font-family: var(--b-mono); font-size: 11px; color: var(--b-dim); }
.built-meta { font-size: 13px; line-height: 1.45; color: var(--b-dim); }
.built-go { justify-self: end; color: var(--b-accent); opacity: 0; transform: translate(-3px, 3px); transition: opacity 150ms ease, transform 150ms cubic-bezier(0.23, 1, 0.32, 1); }
a.built-row:hover .built-go, a.built-row:focus-visible .built-go { opacity: 1; transform: none; }
a.built-row:focus-visible { outline: 2px solid var(--b-accent); outline-offset: 2px; }
@media (max-width: 900px) {
  .built-row { grid-template-columns: 30px minmax(0, 1fr); gap: 4px 12px; }
  .built-what, .built-meta { grid-column: 2; }
  .built-go { display: none; }
}
@media (prefers-reduced-motion: reduce) { .built-row, .built-go { transition: none; } }`;
  function built(items) {
    if (!document.getElementById("built-css")) document.head.insertAdjacentHTML("beforeend", `<style id="built-css">${BUILT_CSS}</style>`);
    return `<ol class="built">${items.map((p, i) => {
      const inner = `
        <span class="built-n">${String(i + 1).padStart(2, "0")}</span>
        <span class="built-name">${p.name}${p.tag ? `<em class="built-tag">${p.tag}</em>` : ""}</span>
        <span class="built-what">${p.what}${p.stack ? `<span class="built-stack">${p.stack}</span>` : ""}</span>
        <span class="built-meta">${p.role}<br>${p.year}</span>
        <span class="built-go" aria-hidden="true">${p.url ? "↗" : ""}</span>`;
      return `<li>${p.url ? `<a class="built-row" href="${p.url}" target="_blank" rel="noopener">${inner}</a>` : `<div class="built-row">${inner}</div>`}</li>`;
    }).join("")}</ol>`;
  }

  return { rm, spotlight, onceInView, cues, built };
})();
