/* BACK TO HOME — site interactions */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  let io;
  const P = window.BTH_PROGRAMS || [];
  const M = window.BTH_MENTORS || [];
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const pin = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const initials = (n) => n.replace(/^Dr\.\s*/, "").split(" ").map((w) => w[0]).slice(0, 2).join("");

  /* Header */
  const header = $(".site-header");
  const toTop = $(".to-top");
  let ticking = false, lastA, lastB;
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY, a = y > 30, b = y > 700;
    if (a !== lastA) { header && header.classList.toggle("scrolled", a); lastA = a; }
    if (b !== lastB) { toTop && toTop.classList.toggle("show", b); lastB = b; }
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  $(".menu-btn")?.addEventListener("click", () => document.body.classList.toggle("menu-open"));
  $$(".nav a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $$("[data-year]").forEach((e) => (e.textContent = new Date().getFullYear()));

  /* Sector explorer (tabs) */
  const sx = $(".sx");
  if (sx) {
    const tabs = $$(".sx-tab", sx), panes = $$(".sx-pane", sx);
    const show = (i, focus) => {
      tabs.forEach((t, j) => { t.classList.toggle("active", j === i); t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
      panes.forEach((p, j) => {
        p.hidden = j !== i;
        if (j === i) { p.classList.remove("fade-swap"); void p.offsetWidth; p.classList.add("fade-swap"); }
      });
      if (focus) tabs[i].focus();
      if (matchMedia("(max-width:900px)").matches) tabs[i].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    };
    tabs.forEach((t, i) => {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener("click", () => show(i));
      t.addEventListener("keydown", (e) => {
        const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); show((i + k + tabs.length) % tabs.length, true); }
      });
    });
  }

  /* Program card */
  const progCard = (p, i = 0) => `
    <article class="prog reveal d${(i % 3) + 1}" data-cat="${esc(p.category)}">
      <div class="prog-top">
        <span class="k">${esc(p.category)}</span>
        <h3>${esc(p.name)}</h3>
      </div>
      <div class="prog-body">
        <p style="margin:0;color:var(--ink-2)">${esc(p.tagline)}</p>
        <div class="meta"><span class="chip">⏱ ${esc(p.duration)}</span><span class="chip">◎ ${esc(p.mode)}</span><span class="chip gold">${esc(p.level)}</span></div>
        <ul>${p.outcomes.slice(0, 3).map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
        <div class="prog-foot">
          <a class="link" href="program.html?id=${p.id}">View program ${arrow}</a>
          <a class="btn btn-green btn-sm" href="apply.html?program=${p.id}">Apply</a>
        </div>
      </div>
    </article>`;

  const mentorCard = (m, i = 0) => `
    <article class="mentor reveal d${(i % 4) + 1}">
      <div class="avatar" aria-hidden="true">${initials(m.name)}</div>
      <h3>${esc(m.name)}</h3>
      <div class="role">${esc(m.role)}</div>
      <p>${esc(m.bio)}</p>
      <div class="tags">${m.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="loc">${pin} ${esc(m.base)} · ${esc(m.exp)} experience</div>
    </article>`;

  // Home previews
  const homeProg = $("#home-programs");
  if (homeProg) homeProg.innerHTML = P.slice(0, 3).map(progCard).join("");
  const homeMent = $("#home-mentors");
  if (homeMent) homeMent.innerHTML = M.slice(0, 4).map(mentorCard).join("");

  // Programs page + filters
  const allProg = $("#all-programs");
  if (allProg) {
    const cats = ["All", ...new Set(P.map((p) => p.category))];
    const f = $("#prog-filters");
    f.innerHTML = cats.map((c, i) => `<button class="${i ? "" : "active"}" data-f="${esc(c)}">${esc(c)}</button>`).join("");
    const draw = (c) => {
      allProg.innerHTML = P.filter((p) => c === "All" || p.category === c).map(progCard).join("");
      observe();
    };
    f.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      $$("button", f).forEach((x) => x.classList.toggle("active", x === b));
      draw(b.dataset.f);
    });
    draw("All");
  }

  // Mentors page
  const allMent = $("#all-mentors");
  if (allMent) {
    const lead = M.find((m) => m.lead) || M[0];
    const feat = $("#lead-mentor");
    if (feat)
      feat.innerHTML = `
      <div><div class="avatar" aria-hidden="true">${initials(lead.name)}</div></div>
      <div>
        <span class="eyebrow">Lead Mentor</span>
        <h2 style="margin-bottom:.2rem">${esc(lead.name)}</h2>
        <div style="color:var(--gold-600);font-weight:600">${esc(lead.role)} · ${esc(lead.base)}</div>
        <blockquote>"Your years in the Gulf were not a pause in your life. They were your preparation. Now let's put them to work back home."</blockquote>
        <p style="color:var(--ink-2)">${esc(lead.bio)} He leads the entrepreneurship track and chairs the mentor panel at every Kerala Immersion Day.</p>
        <div class="mentor-tags">${lead.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      </div>`;
    allMent.innerHTML = M.filter((m) => m !== lead).map(mentorCard).join("");
  }

  // Program detail
  const detail = $("#program-detail");
  if (detail) {
    const id = new URLSearchParams(location.search).get("id");
    const p = P.find((x) => x.id === id) || P[0];
    document.title = `${p.name} | BACK TO HOME`;
    $("#pd-cat").textContent = p.category;
    $("#pd-name").textContent = p.name;
    $("#pd-crumb").textContent = p.name;
    $("#pd-tag").textContent = p.tagline;
    detail.innerHTML = `
      <div>
        <h2>Program overview</h2>
        <p class="lead">${esc(p.summary)}</p>
        <div class="quote-card no-mark" style="padding:1.6rem 2rem;margin:1.6rem 0"><p style="font-size:1.1rem;margin:0"><b style="color:var(--gold-600)">Ideal for:</b> ${esc(p.idealFor)}</p></div>
        <h2>What you will achieve</h2>
        <div class="outcomes">${p.outcomes.map((o) => `<div>${esc(o)}</div>`).join("")}</div>
        <h2>Curriculum</h2>
        <div class="modules">${p.modules.map((m) => `<div class="module"><div><h3>${esc(m.t)}</h3><p>${esc(m.d)}</p></div></div>`).join("")}</div>
        <h2>How it works</h2>
        <div class="timeline">
          <div class="t-item"><span class="wk">Step 1</span><h3>Apply & discovery call</h3><p>Share your background. We'll schedule a short call to understand your goals.</p></div>
          <div class="t-item"><span class="wk">Step 2</span><h3>Join your cohort</h3><p>Attend live sessions, work on practical assignments and meet your mentors.</p></div>
          <div class="t-item"><span class="wk">Step 3</span><h3>Build your plan</h3><p>Every session moves your personal plan forward, so you finish with something concrete.</p></div>
          <div class="t-item"><span class="wk">Step 4</span><h3>Ongoing support</h3><p>Stay connected to the BACK TO HOME community, network and mentors after the program.</p></div>
        </div>
      </div>
      <aside class="side-card">
        <div class="price">${esc(p.fee)} <small>${esc(p.feeNote)}</small></div>
        <ul class="kv">
          <li><span>Duration</span><b>${esc(p.duration)}</b></li>
          <li><span>Format</span><b>${esc(p.mode)}</b></li>
          <li><span>Cohort size</span><b>${esc(p.cohort)}</b></li>
          <li><span>Level</span><b>${esc(p.level)}</b></li>
          <li><span>Next intake</span><b>${esc(p.start)}</b></li>
        </ul>
        <a class="btn btn-gold" href="apply.html?program=${p.id}">Apply for this program ${arrow}</a>
        <a class="btn btn-outline" href="programs.html">See all programs</a>
      </aside>`;
    const others = $("#pd-others");
    if (others) others.innerHTML = P.filter((x) => x.id !== p.id).slice(0, 3).map(progCard).join("");
  }

  /* Framework stepper */
  const fw = $("#framework");
  if (fw) {
    const steps = JSON.parse($("#fw-data").textContent);
    const nav = $(".steps-nav", fw), panel = $(".step-panel", fw);
    let cur = 0, timer;
    nav.innerHTML = steps.map((s, i) => `<button data-i="${i}"><b>${String(i + 1).padStart(2, "0")}</b><span>${s.t}</span></button>`).join("");
    const show = (i) => {
      cur = (i + steps.length) % steps.length;
      const s = steps[cur];
      $$("button", nav).forEach((b, j) => b.classList.toggle("active", j === cur));
      panel.innerHTML = `<div class="fade-swap">
        <div class="big">${String(cur + 1).padStart(2, "0")}</div>
        <span class="tag">${s.k}</span>
        <h3>${s.t}</h3>
        <p>${s.d}</p>
        <div class="step-cols">
          <div><h4>Focus</h4><ul>${s.f.map((x) => `<li>${x}</li>`).join("")}</ul></div>
          <div><h4>You walk away with</h4><ul>${s.o.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        </div>
        <div class="step-ctrl">
          <button data-d="-1" aria-label="Previous step"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button data-d="1" aria-label="Next step"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>
          <div class="bar"><i style="width:${((cur + 1) / steps.length) * 100}%"></i></div>
        </div></div>`;
    };
    nav.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { show(+b.dataset.i); stop(); } });
    panel.addEventListener("click", (e) => { const b = e.target.closest("[data-d]"); if (b) { show(cur + +b.dataset.d); stop(); } });
    let userStopped = false;
    const stop = () => { userStopped = true; clearInterval(timer); timer = null; };
    // autoplay only while the framework is on screen
    const fwBox = nav.closest(".framework") || panel;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !timer && !userStopped) timer = setInterval(() => show(cur + 1), 7000);
        else if (!en.isIntersecting && timer) { clearInterval(timer); timer = null; }
      }, { threshold: 0.25 }).observe(fwBox);
    }
    show(0);
  }

  /* Counters */
  const counters = $$("[data-count]");
  const countIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || "";
    let t0; const step = (t) => { t0 ??= t; const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); countIO.unobserve(el);
  }), { threshold: 0.6 });
  counters.forEach((c) => countIO.observe(c));

  /* Word-by-word heading reveal */
  const splitWords = (el) => {
    let n = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const i = document.createElement("span"); i.textContent = part;
            i.style.transitionDelay = (0.05 + Math.min(n++, 12) * 0.035).toFixed(3) + "s";
            w.appendChild(i); frag.appendChild(w);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && c.tagName !== "BR") walk(c);
      });
    };
    walk(el);
    el.classList.add("split-words", "reveal");
  };
  $$(".hero h1, .page-hero h1, .section-head h2, .cta h2").forEach(splitWords);

  /* Reveal on scroll */
  function observe() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((e) => e.classList.add("in")); return; }
    io = io || new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    const vh = window.innerHeight;
    $$(".reveal:not(.in)").forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) requestAnimationFrame(() => e.classList.add("in"));
      else io.observe(e);
    });
  }

  /* Preloader (first visit per session only), then start reveals */
  const root = document.documentElement;
  if (root.classList.contains("first-visit")) {
    const t0 = performance.now();
    let fired = false;
    const done = () => { if (fired) return; fired = true; setTimeout(() => { root.classList.add("loaded"); observe(); }, Math.max(0, 450 - (performance.now() - t0))); };
    // don't wait for every image/font: show the page as soon as fonts are ready (max 1.2s)
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(done);
    setTimeout(done, 1200);
  } else observe();

  /* Apply form: multi-step */
  const form = $("#apply-form");
  if (form) {
    const sel = $("#program", form);
    sel.innerHTML = `<option value="">Select a program</option>` + P.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("") + `<option value="not-sure">Not sure yet, guide me</option><option value="mentor">I want to become a mentor</option>`;
    const pre = new URLSearchParams(location.search).get("program");
    if (pre) sel.value = pre;
    const steps = $$(".fstep", form), bars = $$(".progress span", form.parentElement);
    let s = 0;
    const go = (n) => {
      s = n;
      steps.forEach((x, i) => x.classList.toggle("active", i === s));
      bars.forEach((b, i) => b.classList.toggle("on", i <= s));
      form.parentElement.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const valid = (step) => {
      let ok = true;
      $$("[required]", step).forEach((inp) => {
        const f = inp.closest(".field") || inp.closest(".consent");
        let good = inp.type === "checkbox" ? inp.checked : inp.value.trim() !== "";
        if (good && inp.type === "email") good = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value);
        if (good && inp.type === "tel") good = /^[+\d][\d\s-]{6,}$/.test(inp.value);
        f && f.classList.toggle("err", !good);
        if (!good) ok = false;
      });
      return ok;
    };
    form.addEventListener("click", (e) => {
      const n = e.target.closest("[data-next]"), b = e.target.closest("[data-back]");
      if (n && valid(steps[s])) go(s + 1);
      if (b) go(s - 1);
    });
    form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("err"));
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!valid(steps[s])) return;
      const data = Object.fromEntries(new FormData(form).entries());
      /* ---- CONNECT YOUR BACKEND HERE ----
         e.g. Formspree:  set data-endpoint="https://formspree.io/f/XXXX" on the form
         or a Google Apps Script / your own API. */
      const ep = form.dataset.endpoint;
      if (ep) { try { await fetch(ep, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) }); } catch (err) { console.warn(err); } }
      form.style.display = "none";
      bars.forEach((b) => b.classList.add("on"));
      const ok = $(".success");
      $("#success-name").textContent = (data.fullName || "").split(" ")[0] || "friend";
      ok.classList.add("show");
    });
  }

  /* Newsletter */
  $$(".news").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const b = $("button", f); b.textContent = "Joined ✓"; $("input", f).value = "";
  }));
})();
