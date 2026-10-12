/* Shared tiles + behaviour for the Bento „liquid glass” variants. Needs ../shared.js (window.CV). */
(function () {
  "use strict";
  var C = window.CV, I = C.I, e = C.esc;

  function T(c) {
    var p = c.profile || {}, parts = String(p.name || "").split(" "), tel = C.tel(p), wa = C.wa(p);
    var t = {};
    t.profile = function (cls) {
      return '<section class="glass t profile ' + (cls || "") + '" data-in>' +
        (p.availability ? '<span class="status"><i></i>' + e(p.availability) + '</span>' : "") +
        '<h1 style="margin-top:18px">' + e(parts[0]) + ' <span>' + e(parts.slice(1).join(" ")) + '</span></h1>' +
        '<p class="role">' + e(p.title) + '</p><p class="tag">' + e(p.tagline) + '</p>' +
        '<div class="acts">' + (p.email ? '<a class="btn accent" href="mailto:' + e(p.email) + '">' + I.mail + 'Scrie-mi</a>' : "") +
        (tel ? '<a class="btn" href="tel:' + e(tel) + '">' + I.phone + 'Sună</a>' : "") +
        '<button class="btn" data-act="share">' + I.share + 'Distribuie</button>' +
        '<button class="btn" data-act="vcf">' + I.contact + 'Salvează</button></div></section>';
    };
    t.photo = function (cls, inner) {
      return '<section class="glass t photo ' + (cls || "") + '" data-in><img src="' + e(C.asset(p.photo)) + '" alt="' + e(p.name) + '" decoding="async" fetchpriority="high">' +
        (inner || (p.location ? '<span class="pillglass loc">' + I.pin + e(p.location) + '</span>' : "")) + '</section>';
    };
    t.now = function (cls) {
      var n = C.list(c.experience)[0]; if (!n) return "";
      return '<section class="glass t now ' + (cls || "") + '" data-in><p class="label"><b></b>Acum</p><h3>' + e(n.role) + '</h3>' +
        '<div class="co"><span class="lg"><img src="' + e(C.logo(n)) + '" alt="" onerror="this.remove()"><em>' + e(C.initials(n.company)) + '</em></span>' +
        '<div><b>' + e(n.company) + '</b><small>' + e(n.period) + '</small></div></div></section>';
    };
    t.stat = function (i, cls) {
      var s = C.list(c.stats)[i]; if (!s) return "";
      return '<section class="glass t num ' + (cls || "") + '" data-in><strong data-count="' + e(s.value) + '">' + e(s.value) + '</strong><span>' + e(s.label) + '</span></section>';
    };
    t.statsRow = function (cls) {
      return '<section class="glass t statsrow ' + (cls || "") + '" data-in>' + C.list(c.stats).map(function (s) {
        return '<div class="num"><strong data-count="' + e(s.value) + '">' + e(s.value) + '</strong><span>' + e(s.label) + '</span></div>';
      }).join("") + '</section>';
    };
    t.social = function (i, cls) {
      var s = C.list(c.social)[i]; if (!s) return "";
      var ig = /instagram/i.test(s.url + s.label), handle = (String(s.url).match(/instagram\.com\/([^/?#]+)/i) || [])[1];
      return '<a class="glass t soc press ' + (ig ? "ig " : "li ") + (cls || "") + '" data-in href="' + e(C.safeUrl(s.url)) + '" target="_blank" rel="noopener"><span class="go">' + I.arrow + '</span>' +
        C.socialIcon(s) + '<div><b>' + e(s.label) + '</b><small>' + (handle ? "@" + e(handle) : "Profil") + '</small></div></a>';
    };
    t.socials = function (cls) { return C.list(c.social).map(function (_, i) { return t.social(i, cls); }).join(""); };
    t.about = function (cls) {
      return c.about ? '<section class="glass t about ' + (cls || "") + '" id="despre" data-in><p class="label"><b></b>Despre</p>' + C.paragraphs(c.about) + '</section>' : "";
    };
    t.project = function (i, cls) {
      var pr = C.list(c.projects)[i]; if (!pr) return "";
      var img = C.cover(pr);
      return '<section class="glass proj press ' + (cls || "") + '" data-in data-p="' + i + '"><span class="go">' + I.arrow + '</span>' +
        '<div class="img"><b>' + e(C.initials(pr.title)) + '</b>' + (img ? '<img src="' + e(img) + '" alt="" loading="lazy" decoding="async" onerror="this.remove()">' : "") + '</div>' +
        '<div class="body"><h3>' + e(pr.title) + '</h3><p>' + e(pr.description) + '</p><div class="chips">' +
        C.list(pr.tags).map(function (x) { return "<span>" + e(x) + "</span>"; }).join("") + '</div></div></section>';
    };
    t.projects = function (cls) { return C.list(c.projects).map(function (_, i) { return t.project(i, cls); }).join(""); };
    t.xp = function (cls) {
      var xs = C.list(c.experience).concat(C.list(c.education).map(function (d) { return { role: d.title, company: d.institution, period: d.period, domain: d.domain, logo: d.logo }; }));
      return '<section class="glass t xp ' + (cls || "") + '" id="experienta" data-in><p class="label"><b></b>Experiență & educație</p><ol>' + xs.map(function (x) {
        var d = C.lines(x.description);
        return '<li><span class="lg"><img src="' + e(C.logo(x)) + '" alt="" onerror="this.remove()"><em>' + e(C.initials(x.company)) + '</em></span><div>' +
          '<h4>' + e(x.role) + '</h4><div class="meta">' + e(x.company) + ' · ' + e(x.period) + '</div>' +
          (d.length ? '<ul>' + d.map(function (l) { return "<li>" + e(l) + "</li>"; }).join("") + '</ul>' : "") + '</div></li>';
      }).join("") + '</ol></section>';
    };
    t.skills = function (cls) {
      return '<section class="glass t skills ' + (cls || "") + '" data-in><p class="label"><b></b>Competențe</p>' + C.list(c.skills).map(function (g) {
        return '<div class="grp"><h5>' + e(g.group) + '</h5><div class="chips">' + C.list(g.items).map(function (s) { return "<span>" + e(s) + "</span>"; }).join("") + '</div></div>';
      }).join("") + '</section>';
    };
    t.contact = function (cls) {
      return '<section class="glass t contact ' + (cls || "") + '" id="contact" data-in><p class="label">Contact</p><h2>Hai să ținem legătura.</h2><div class="rows">' +
        (p.email ? '<a href="mailto:' + e(p.email) + '">' + I.mail + e(p.email) + '<span>' + I.right + '</span></a>' : "") +
        (tel ? '<a href="tel:' + e(tel) + '">' + I.phone + e(p.phone) + '<span>' + I.right + '</span></a>' : "") +
        (wa ? '<a href="https://wa.me/' + e(wa) + '" target="_blank" rel="noopener">' + I.whatsapp + 'WhatsApp<span>' + I.right + '</span></a>' : "") +
        '</div></section>';
    };
    t.bar = function () {
      return '<header class="glass live bar"><a class="me" href="#"><img src="' + e(C.asset(p.photo)) + '" alt="">' + e(p.name) + '</a>' +
        '<div class="right"><nav><a href="#proiecte">Proiecte</a><a href="#experienta">Experiență</a><a class="cta" href="#contact">Contact</a></nav>' +
        '<button class="theme-btn" data-act="theme" aria-label="Schimbă tema (luminoasă / întunecată)">' +
        '<svg class="moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
        '<svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v3M12 19.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1.5 12h3M19.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>' +
        '</button></div></header>';
    };
    t.foot = function (name) { return '<footer class="foot"><span>© ' + new Date().getFullYear() + ' ' + e(p.name) + '</span><span>' + e(name) + '</span></footer>'; };
    return t;
  }

  function countUp(root) {
    var els = root.querySelectorAll("[data-count]");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return; io.unobserve(x.target);
        var el = x.target, raw = el.getAttribute("data-count"), m = raw.match(/^(\D*)(\d+)(.*)$/); if (!m) return;
        var to = +m[2], t0 = null;
        (function step(ts) { if (t0 === null) t0 = ts; var k = Math.min(1, (ts - t0) / 1800), v = 1 - Math.pow(1 - k, 3);
          el.textContent = m[1] + Math.round(to * v) + m[3]; if (k < 1) requestAnimationFrame(step); })(performance.now());
      });
    }, { threshold: .6 });
    els.forEach(function (el) { el.textContent = el.getAttribute("data-count").replace(/\d+/, "0"); io.observe(el); });
  }

  // light follows a fine pointer over the hovered tile only (no work at all on touch screens)
  function specular() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var el = null, rect = null, x = 0, y = 0, queued = false;
    function paint() { queued = false; if (el) { el.style.setProperty("--mx", (x - rect.left) + "px"); el.style.setProperty("--my", (y - rect.top) + "px"); } }
    addEventListener("pointermove", function (ev) {
      var g = ev.target.closest && ev.target.closest(".glass");
      if (g !== el) { el = g; rect = g ? g.getBoundingClientRect() : null; }
      if (!el) return;
      x = ev.clientX; y = ev.clientY;
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, { passive: true });
    addEventListener("scroll", function () { el = null; }, { passive: true });
  }

  function reveal(root) {
    var els = root.querySelectorAll("[data-in]");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach(function (x) { x.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -5% 0px", threshold: .05 });
    els.forEach(function (x, i) { x.style.setProperty("--i", i % 5); io.observe(x); });
  }

  function sheetFor(c) {
    var bg = document.createElement("div"); bg.className = "sheet-bg";
    var sh = document.createElement("section"); sh.className = "sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true");
    sh.innerHTML = '<div class="grab"></div><button class="x" aria-label="Închide">' + I.close + '</button><div class="sb"></div>';
    document.body.appendChild(bg); document.body.appendChild(sh);
    var body = sh.querySelector(".sb");
    function close() { sh.classList.remove("on"); bg.classList.remove("on"); }
    bg.onclick = close; sh.querySelector(".x").onclick = close;
    addEventListener("keydown", function (ev) { if (ev.key === "Escape") close(); });
    var y0 = null;
    sh.addEventListener("touchstart", function (ev) { y0 = sh.scrollTop <= 0 ? ev.touches[0].clientY : null; }, { passive: true });
    sh.addEventListener("touchend", function (ev) { if (y0 !== null && ev.changedTouches[0].clientY - y0 > 90) close(); y0 = null; });
    return function (i) {
      var pr = c.projects[i];
      var imgs = [C.asset(pr.image)].concat(C.list(pr.gallery).map(C.asset)).filter(Boolean);
      if (!imgs.length && C.shot(pr.link)) imgs.push(C.shot(pr.link));
      body.innerHTML = (imgs.length ? '<div class="gal">' + imgs.map(function (s) { return '<img src="' + e(s) + '" alt="" onerror="this.remove()">'; }).join("") + '</div>' : "") +
        '<h3>' + e(pr.title) + '</h3><div class="chips">' + C.list(pr.tags).map(function (x) { return "<span>" + e(x) + "</span>"; }).join("") + '</div>' +
        C.paragraphs(pr.details || pr.description) +
        (pr.link ? '<a class="btn accent" href="' + e(C.safeUrl(pr.link)) + '" target="_blank" rel="noopener">Deschide site-ul ' + I.arrow + '</a>' : "");
      sh.scrollTop = 0; sh.classList.add("on"); bg.classList.add("on");
    };
  }

  // Wires everything once a variant has written its markup into `root`.
  function wire(root, c) {
    var p = c.profile || {}, open = sheetFor(c);
    root.addEventListener("click", function (ev) {
      var a = ev.target.closest("[data-act]");
      if (a) {
        var act = a.getAttribute("data-act");
        if (act === "share") C.share(p); else if (act === "theme") toggleTheme(); else { C.vcard(p); C.toast("Contact descărcat ✓"); }
        return;
      }
      var pj = ev.target.closest("[data-p]"); if (pj) open(+pj.getAttribute("data-p"));
    });
    reveal(root); countUp(root); specular();
    return open;
  }

  // Light is the default; dark only when the visitor chooses it (the device setting is deliberately ignored).
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", t === "dark" ? "#13100e" : "#efe9e1");
  }
  function toggleTheme() {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", next); } catch (err) {}
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(function () { applyTheme(next); });
    else applyTheme(next);
  }
  applyTheme(document.documentElement.getAttribute("data-theme") || "light");

  window.GLASS = { tiles: T, wire: wire };
  document.body.insertAdjacentHTML("afterbegin", '<div class="blobs" aria-hidden="true"><i></i><i></i><i></i><i></i></div>');
})();
