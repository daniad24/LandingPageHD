/* „WOW” layer for Bento 1: intro, 3D tilt, expanding cards, live „Acum”, scroll progress, magnetic buttons,
   confetti and skill bubbles. Needs shared.js (CV) and glass.js (GLASS). Only transform/opacity are animated. */
(function () {
  "use strict";
  var C = window.CV, G = window.GLASS, I = C.I, e = C.esc;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var html = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (err) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (err) {} }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- 1. Intro: only on the very first visit ---------- */
  function intro(c) {
    if (reduce || get("introSeen")) return;
    set("introSeen", "1");
    var p = c.profile || {}, first = String(p.name || "").split(" ")[0], name = String(p.name || "");
    var chars = name.split("").map(function (ch, i) {
      return '<span style="--c:' + i + '"' + (i > first.length ? ' class="last"' : "") + ">" + e(ch) + "</span>";
    }).join("");
    var el = document.createElement("div");
    el.className = "intro"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<div class="in-wrap"><div class="in-photo"><img src="' + e(C.asset(p.photo)) + '" alt=""></div><h2>' + chars + "</h2><p>" + e(p.title) + "</p></div>" +
      "<small>" + G.L("introHint") + "</small>";
    document.body.appendChild(el);
    html.classList.add("intro-on");
    var done = false;
    function out() {
      if (done) return; done = true;
      el.classList.add("out"); html.classList.remove("intro-on");
      setTimeout(function () { el.remove(); }, 900);
    }
    el.addEventListener("pointerdown", out);
    addEventListener("keydown", out, { once: true });
    setTimeout(out, 2600);
  }

  /* ---------- 2. Tilt: gyroscope on phones, the hovered tile on desktop ---------- */
  var tiles = [], tio = null, gyro = false, gx = 0, gy = 0, base = null, hovered = null, hx = 0, hy = 0, looping = false;
  function tiltMount(root, sig) {
    if (reduce) return;
    var grid = root.querySelector(".grid"); grid.classList.add("tilt-on");
    tiles = [];
    var els = grid.querySelectorAll(":scope > .glass:not(.swipe):not(.cf)");
    els.forEach(function (el) { el.classList.add("tiltable"); el._t = { x: 0, y: 0 }; });
    if (!("IntersectionObserver" in window)) return;
    // only tiles on screen take part; they join after their entrance animation has finished
    tio = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var el = x.target, i = tiles.indexOf(el);
        if (x.isIntersecting && i < 0) {
          el._k = clamp(340 / (x.boundingClientRect.width || 340), .35, 1);
          tiles.push(el);
          clearTimeout(el._join); el._join = setTimeout(function () { if (tiles.indexOf(el) > -1) { el.classList.add("tr"); kick(); } }, 900);
        } else if (!x.isIntersecting && i > -1) {
          tiles.splice(i, 1); clearTimeout(el._join); el.classList.remove("tr"); el._t.x = el._t.y = 0;
          el.style.removeProperty("--rx"); el.style.removeProperty("--ry");
        }
      });
    });
    els.forEach(function (el) { tio.observe(el); });
    sig.addEventListener("abort", function () { tio.disconnect(); tiles = []; hovered = null; });
  }
  function kick() { if (!looping) { looping = true; requestAnimationFrame(frame); } }
  function frame() {
    var moving = false;
    for (var i = 0; i < tiles.length; i++) {
      var el = tiles[i], s = el._t, tx = 0, ty = 0;
      if (!el.classList.contains("tr")) continue;
      if (gyro) { tx = gx; ty = gy; } else if (el === hovered) { tx = hx; ty = hy; }
      s.x += (tx - s.x) * .14; s.y += (ty - s.y) * .14;
      if (Math.abs(tx - s.x) > .001 || Math.abs(ty - s.y) > .001) moving = true;
      var k = el._k * 5.5;
      el.style.setProperty("--ry", (s.x * k).toFixed(2) + "deg");
      el.style.setProperty("--rx", (-s.y * k).toFixed(2) + "deg");
      if (gyro) { el.style.setProperty("--sx", (s.x * 24).toFixed(1) + "%"); el.style.setProperty("--sy", (s.y * 24).toFixed(1) + "%"); }
    }
    if (moving) requestAnimationFrame(frame); else looping = false;
  }
  function onOrient(ev) {
    if (ev.beta == null || ev.gamma == null) return;
    var b = ev.beta, g = ev.gamma, ang = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
    if (ang === 90) { var t = b; b = -g; g = t; } else if (ang === -90 || ang === 270) { var u = b; b = g; g = -u; }
    if (!base) base = { b: b, g: g };
    // the neutral position slowly follows the way the phone is held, so any angle feels „level”
    base.b += (b - base.b) * .006; base.g += (g - base.g) * .006;
    gx = clamp((g - base.g) / 16, -1, 1); gy = clamp((b - base.b) / 16, -1, 1);
    if (!gyro) { gyro = true; html.classList.add("tilting"); }
    kick();
  }
  function startGyro() { addEventListener("deviceorientation", onOrient, { passive: true }); }
  function tiltInit() {
    if (reduce || fine || !("DeviceOrientationEvent" in window)) return;
    var DOE = window.DeviceOrientationEvent;
    if (typeof DOE.requestPermission !== "function") { startGyro(); return; }
    // iOS asks for permission, and only after a tap
    if (get("tiltNo")) return;
    var chip = document.createElement("button");
    chip.className = "tilt-chip"; chip.type = "button";
    chip.innerHTML = "✦ " + G.L("tilt") + ' <i aria-label="' + G.L("close") + '">✕</i>';
    document.body.appendChild(chip);
    setTimeout(function () { chip.classList.add("show"); }, get("introSeen") ? 2800 : 1500);
    var hide = setTimeout(function () { chip.classList.remove("show"); }, 14000);
    chip.addEventListener("click", function (ev) {
      clearTimeout(hide); chip.classList.remove("show");
      if (ev.target.closest("i")) { set("tiltNo", "1"); return; }
      DOE.requestPermission().then(function (r) { if (r === "granted") startGyro(); else set("tiltNo", "1"); }).catch(function () {});
    });
  }

  /* ---------- 3. Card → full page (FLIP) ---------- */
  var xv = null, xvSrc = null, xvOpen = false;
  function xvBuild() {
    if (xv) return;
    var bg = document.createElement("div"); bg.className = "xv-bg";
    var sh = document.createElement("div"); sh.className = "xv"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-modal", "true"); sh.style.display = "none";
    sh.innerHTML = '<div class="xv-scroll"><div class="xv-content"></div></div>';
    var x = document.createElement("button"); x.className = "xv-close"; x.type = "button";
    document.body.appendChild(bg); document.body.appendChild(sh); document.body.appendChild(x);
    xv = { bg: bg, sh: sh, x: x, scroll: sh.firstChild, content: sh.firstChild.firstChild };
    bg.onclick = xvClose; x.onclick = xvClose;
    addEventListener("keydown", function (ev) { if (ev.key === "Escape") xvClose(); });
    addEventListener("popstate", function () { if (xvOpen) xvShut(); });
    // pull down from the top to close
    var y0 = null, dy = 0;
    xv.scroll.addEventListener("touchstart", function (ev) { y0 = xv.scroll.scrollTop <= 0 ? ev.touches[0].clientY : null; dy = 0; }, { passive: true });
    xv.scroll.addEventListener("touchmove", function (ev) {
      if (y0 === null) return;
      dy = ev.touches[0].clientY - y0;
      if (dy <= 0) { dy = 0; sh.style.transform = ""; return; }
      sh.classList.remove("anim");
      sh.style.transform = "translate3d(0," + (dy * .55) + "px,0) scale(" + (1 - Math.min(dy, 400) / 2200) + ")";
    }, { passive: true });
    xv.scroll.addEventListener("touchend", function () {
      if (y0 === null) return; y0 = null;
      if (dy > 110) xvClose();
      else { sh.classList.add("anim"); sh.style.transform = ""; }
    });
  }
  function flip(from, to) {
    var sx = from.width / to.width, sy = from.height / to.height;
    return { t: "translate3d(" + (from.left - to.left) + "px," + (from.top - to.top) + "px,0) scale(" + sx + "," + sy + ")", sx: sx, sy: sy };
  }
  function xvOpenFrom(src, inner) {
    xvBuild(); if (xvOpen) return;
    xvOpen = true; xvSrc = src;
    var sh = xv.sh;
    xv.x.setAttribute("aria-label", G.L("close")); xv.x.innerHTML = I.close;
    xv.content.innerHTML = inner; xv.scroll.scrollTop = 0;
    sh.classList.remove("anim", "ready"); sh.style.opacity = ""; sh.style.display = "block";
    var to = sh.getBoundingClientRect(), from = src.getBoundingClientRect(), r = parseFloat(getComputedStyle(src).borderTopLeftRadius) || 24;
    if (!reduce) {
      var m = flip(from, to);
      sh.style.transform = m.t; sh.style.borderRadius = (r / m.sx) + "px / " + (r / m.sy) + "px";
      sh.offsetWidth; // commit the start state
      sh.classList.add("anim");
    }
    sh.style.transform = ""; sh.style.borderRadius = "";
    src.style.visibility = "hidden";
    xv.bg.classList.add("on"); xv.x.classList.add("on");
    requestAnimationFrame(function () { sh.classList.add("ready"); });
    html.style.overflow = "hidden";
    history.pushState({ xv: 1 }, "");
  }
  function xvClose() { if (!xvOpen) return; if (history.state && history.state.xv) history.back(); else xvShut(); }
  function xvShut() {
    if (!xvOpen) return; xvOpen = false;
    var sh = xv.sh, src = xvSrc;
    sh.classList.remove("ready"); xv.bg.classList.remove("on"); xv.x.classList.remove("on");
    var dragT = sh.style.transform;
    sh.classList.remove("anim"); sh.style.transform = "";
    var to = sh.getBoundingClientRect(), from = src && src.isConnected ? src.getBoundingClientRect() : null;
    sh.style.transform = dragT; sh.offsetWidth;
    sh.classList.add("anim");
    if (!reduce && from && from.width && from.bottom > 0 && from.top < innerHeight) {
      var m = flip(from, to), r = parseFloat(getComputedStyle(src).borderTopLeftRadius) || 24;
      sh.style.transform = m.t; sh.style.borderRadius = (r / m.sx) + "px / " + (r / m.sy) + "px";
    } else { sh.style.transform = "translate3d(0,40px,0) scale(.94)"; sh.style.opacity = "0"; }
    setTimeout(function () {
      sh.style.display = "none"; sh.style.transform = ""; sh.style.borderRadius = ""; sh.style.opacity = ""; sh.classList.remove("anim");
      if (src) src.style.visibility = ""; html.style.overflow = ""; xv.content.innerHTML = "";
    }, reduce ? 0 : 560);
  }
  function host(u) { return String(u || "").replace(/^https?:\/\//, "").replace(/\/.*$/, ""); }
  function chips(arr) { return C.list(arr).length ? '<div class="chips">' + C.list(arr).map(function (x) { return "<span>" + e(x) + "</span>"; }).join("") + "</div>" : ""; }
  function projectPage(pr) {
    var imgs = [C.asset(pr.image)].concat(C.list(pr.gallery).map(C.asset)).filter(Boolean);
    if (!imgs.length && C.shot(pr.link)) imgs.push(C.shot(pr.link));
    return '<div class="xv-hero"><span class="ph">' + e(C.initials(pr.title)) + "</span>" +
      (imgs[0] ? '<img src="' + e(imgs[0]) + '" alt="" onerror="this.remove()" style="position:relative">' : "") + "</div>" +
      (imgs.length > 1 ? '<div class="xv-gal">' + imgs.slice(1).map(function (s) { return '<img src="' + e(s) + '" alt="" loading="lazy" onerror="this.remove()">'; }).join("") + "</div>" : "") +
      '<div class="xv-body"><div class="kicker">' + G.L("projects") + (pr.link ? " · " + e(host(pr.link)) : "") + "</div>" +
      "<h2>" + e(pr.title) + "</h2>" + chips(pr.tags) + C.paragraphs(pr.details || pr.description) +
      (pr.link ? '<a class="btn accent" href="' + e(C.safeUrl(pr.link)) + '" target="_blank" rel="noopener">' + G.L("open") + " " + I.arrow + "</a>" : "") + "</div>";
  }
  function xpPage(x, kicker) {
    var d = C.lines(x.description);
    return '<div class="xv-body" style="padding-top:calc(30px + env(safe-area-inset-top))"><div class="kicker"><span class="lg"><img src="' + e(C.logo(x)) + '" alt="" onerror="this.remove()"><em>' + e(C.initials(x.company)) + "</em></span>" +
      e(kicker) + "</div><h2>" + e(x.role) + "</h2><p><b style=\"color:var(--text)\">" + e(x.company) + "</b> · " + e(x.period) + "</p>" +
      (d.length ? "<ul>" + d.map(function (l) { return "<li>" + e(l) + "</li>"; }).join("") + "</ul>" : "") +
      (x.domain ? '<a class="btn" href="https://' + e(host(x.domain)) + '" target="_blank" rel="noopener">' + I.globe + G.L("website") + "</a>" : "") + "</div>";
  }
  function xpItems(c) {
    return C.list(c.experience).concat(C.list(c.education).map(function (d) { return { role: d.title, company: d.institution, period: d.period, domain: d.domain, logo: d.logo, description: d.description }; }));
  }
  function expandMount(root, c) {
    var items = xpItems(c), nExp = C.list(c.experience).length;
    root.querySelectorAll(".xp > ol > li").forEach(function (li, i) {
      li.classList.add("xv-item"); li.setAttribute("role", "button"); li.tabIndex = 0;
      li.addEventListener("click", function () { xvOpenFrom(li, xpPage(items[i], i < nExp ? G.L("xpShort") : G.L("xp"))); });
      li.addEventListener("keydown", function (ev) { if (ev.key === "Enter") li.click(); });
    });
    var now = root.querySelector(".now");
    if (now && items[0]) {
      now.classList.add("press"); now.setAttribute("role", "button"); now.tabIndex = 0;
      now.addEventListener("click", function () { xvOpenFrom(now, xpPage(items[0], G.L("now"))); });
    }
  }

  /* ---------- 4. Live „Acum”: Bucharest time + weather ---------- */
  var WX = {
    ro: { 0: "Senin", 1: "Mai mult senin", 2: "Parțial noros", 3: "Înnorat", 45: "Ceață", 51: "Burniță", 61: "Ploaie", 71: "Ninsoare", 80: "Averse", 95: "Furtună" },
    en: { 0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Cloudy", 45: "Fog", 51: "Drizzle", 61: "Rain", 71: "Snow", 80: "Showers", 95: "Thunderstorm" }
  };
  function wxKey(code) {
    code = +code;
    if (code <= 3) return code; if (code < 51) return 45; if (code < 61) return 51; if (code < 71) return 61;
    if (code < 80) return 71; if (code < 95) return code >= 85 ? 71 : 80; return 95;
  }
  function wxIcon(k, day) { return { 0: day ? "☀️" : "🌙", 1: day ? "🌤️" : "🌙", 2: "⛅", 3: "☁️", 45: "🌫️", 51: "🌦️", 61: "🌧️", 71: "❄️", 80: "🌦️", 95: "⛈️" }[k]; }
  var wxCache = null;
  function weather() {
    if (wxCache && Date.now() - wxCache.t < 30 * 60 * 1000) return Promise.resolve(wxCache);
    try { var s = JSON.parse(sessionStorage.getItem("wx") || "null"); if (s && Date.now() - s.t < 30 * 60 * 1000) { wxCache = s; return Promise.resolve(s); } } catch (err) {}
    return fetch("https://api.open-meteo.com/v1/forecast?latitude=44.43&longitude=26.10&current=temperature_2m,weather_code,is_day&timezone=Europe%2FBucharest")
      .then(function (r) { return r.json(); }).then(function (j) {
        var cur = j.current || {};
        if (cur.temperature_2m == null) throw new Error("no weather");
        wxCache = { t: Date.now(), temp: cur.temperature_2m, code: cur.weather_code, day: cur.is_day !== 0 };
        try { sessionStorage.setItem("wx", JSON.stringify(wxCache)); } catch (err) {}
        return wxCache;
      });
  }
  function nowMount(root, sig, lang) {
    var now = root.querySelector(".now"); if (!now) return;
    now.insertAdjacentHTML("beforeend", '<div class="live"><span><i class="dotlive"></i><b data-clock></b></span><span data-wx hidden></span></div>' +
      (reduce ? "" : '<span class="ring" aria-hidden="true"><b></b></span>'));
    var clock = now.querySelector("[data-clock]"), wx = now.querySelector("[data-wx]");
    var fmt = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "ro-RO", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Bucharest" });
    function tick() { clock.textContent = fmt.format(new Date()) + " " + G.L("inCity"); }
    function paintWx() {
      weather().then(function (w) {
        var k = wxKey(w.code);
        wx.textContent = wxIcon(k, w.day) + " " + Math.round(w.temp) + "°C";
        wx.title = (WX[lang] || WX.ro)[k] || ""; wx.hidden = false;
      }).catch(function () {});
    }
    tick(); paintWx();
    var a = setInterval(tick, 15000), b = setInterval(paintWx, 30 * 60 * 1000);
    sig.addEventListener("abort", function () { clearInterval(a); clearInterval(b); });
  }

  /* ---------- 5. Scroll progress (JS fallback where scroll timelines are missing) ---------- */
  function progressInit() {
    var bar = document.createElement("div"); bar.className = "progress"; bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    if (window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()")) return;
    var q = false;
    function paint() { q = false; var max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")"; }
    addEventListener("scroll", function () { if (!q) { q = true; requestAnimationFrame(paint); } }, { passive: true });
    paint();
  }

  /* ---------- 7. Desktop: magnetic buttons, cursor light, tile tilt ---------- */
  function pointerInit() {
    if (!fine || reduce) return;
    var glow = document.createElement("div"); glow.className = "cursor-glow"; glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
    var px = 0, py = 0, q = false, mag = null, mr = null, tr = null;
    function paint() {
      q = false;
      glow.style.transform = "translate3d(" + px + "px," + py + "px,0)";
      if (mag) {
        var dx = px - (mr.left + mr.width / 2), dy = py - (mr.top + mr.height / 2);
        mag.style.translate = clamp(dx * .3, -10, 10).toFixed(1) + "px " + clamp(dy * .35, -8, 8).toFixed(1) + "px";
      }
      if (hovered && tr) { hx = clamp((px - tr.left) / tr.width * 2 - 1, -1, 1); hy = clamp((py - tr.top) / tr.height * 2 - 1, -1, 1); kick(); }
    }
    addEventListener("pointermove", function (ev) {
      if (ev.pointerType !== "mouse") return;
      px = ev.clientX; py = ev.clientY;
      glow.classList.add("on");
      var t = ev.target.closest ? ev.target : null;
      var m = t && t.closest(".magnet");
      if (m !== mag) { if (mag) { mag.classList.remove("pull"); mag.style.translate = ""; } mag = m; if (m) { m.classList.add("pull"); mr = m.getBoundingClientRect(); } }
      var h = t && t.closest(".tiltable.tr");
      if (h !== hovered) { hovered = h; tr = h ? h.getBoundingClientRect() : null; kick(); }
      if (!q) { q = true; requestAnimationFrame(paint); }
    }, { passive: true });
    addEventListener("scroll", function () { if (hovered) tr = hovered.getBoundingClientRect(); if (mag) mr = mag.getBoundingClientRect(); }, { passive: true });
    document.addEventListener("mouseleave", function () { glow.classList.remove("on"); hovered = null; kick(); });
  }
  function magnetMount(root) {
    if (!fine || reduce) return;
    root.querySelectorAll(".btn, .theme-btn, .bar nav .cta").forEach(function (el) { el.classList.add("magnet"); });
  }

  /* ---------- 8. Confetti on „Salvează contact” ---------- */
  function confetti(from) {
    if (reduce) return;
    var r = from.getBoundingClientRect(), ox = r.left + r.width / 2, oy = r.top + r.height / 2;
    var cv = document.createElement("canvas"), dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
    cv.className = "confetti"; cv.width = W * dpr; cv.height = H * dpr; document.body.appendChild(cv);
    var x = cv.getContext("2d"); x.scale(dpr, dpr);
    var cols = ["#f97316", "#fbbf24", "#ea580c", "#22c55e", "#3b82f6", "#ec4899", "#a855f7"], ps = [];
    for (var i = 0; i < 130; i++) {
      var a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.15, v = 6 + Math.random() * 10;
      ps.push({ x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, w: 5 + Math.random() * 6, h: 3 + Math.random() * 5, r: Math.random() * 6.3, vr: (Math.random() - .5) * .45, c: cols[i % cols.length] });
    }
    var t0 = performance.now(), last = t0;
    (function f(now) {
      var dt = Math.min(2.5, (now - last) / 16.67), k = (now - t0) / 1900; last = now;
      x.clearRect(0, 0, W, H); x.globalAlpha = k > .65 ? Math.max(0, 1 - (k - .65) / .35) : 1;
      for (var j = 0; j < ps.length; j++) {
        var p = ps[j], d = Math.pow(.982, dt);
        p.vy += .3 * dt; p.vx *= d; p.vy *= d; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.scale(1, Math.cos(p.r * 1.7));
        x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore();
      }
      if (k < 1) requestAnimationFrame(f); else cv.remove();
    })(t0);
  }

  /* ---------- 9. Skill bubbles ---------- */
  var COLS = [["#fdba74", "#ea580c"], ["#c4b5fd", "#7c3aed"], ["#5eead4", "#0d9488"], ["#f9a8d4", "#db2777"]];
  function bubblesMount(page, c, sig) {
    var groups = C.list(c.skills);
    if (reduce || !page || !groups.length) return null;
    page.innerHTML = '<div class="bub-legend">' + groups.map(function (g, i) { return '<span><i style="background:' + COLS[i % 4][1] + '"></i>' + e(g.group) + "</span>"; }).join("") +
      '</div><div class="bubbles" role="list"></div><p class="bub-hint">' + G.L("bubHint") + "</p>";
    var box = page.querySelector(".bubbles"), W = box.clientWidth || 320, H = box.clientHeight || 320, bs = [];
    groups.forEach(function (g, gi) {
      C.list(g.items).forEach(function (s) { bs.push({ s: s, g: gi, r: clamp(28 + String(s).length * 1.3, 32, 56) }); });
    });
    // size the bubbles so they fill ~42% of the box, whatever the screen
    // the longest word must fit on one line inside its circle; then everything is scaled to fill ~40% of the box
    function sizes(f) {
      return bs.reduce(function (a, b) {
        var word = Math.max.apply(null, String(b.s).split(/\s+/).map(function (w) { return w.length; }));
        var fs = clamp(b.r * f * .3, 9.5, 13);
        var len = String(b.s).length;
        b.r0 = Math.max(b.r * f, (word * .6 * fs + 10) / 1.7, Math.sqrt(len * .6 * fs * fs * 1.3) / 1.3 + 6);
        b.fs = clamp(Math.min((b.r0 * 1.7 - 10) / (word * .6), (b.r0 - 6) * 1.3 / Math.sqrt(len * .6 * 1.3)), 9.5, 13);
        return a + Math.PI * b.r0 * b.r0;
      }, 0);
    }
    var f = 1.2;
    for (var n = 0; n < 12 && sizes(f) > .4 * W * H; n++) f *= .93;
    var cx = W / 2, cy = H / 2, ring = Math.min(W, H) * .2;
    bs.forEach(function (b, i) {
      b.r = b.r0;
      var a = (b.g / groups.length) * Math.PI * 2 - Math.PI / 2;
      if (W > H * 1.4) { b.ax = W * (b.g + 1) / (groups.length + 1); b.ay = cy; } // wide box: groups side by side
      else { b.ax = cx + Math.cos(a) * ring; b.ay = cy + Math.sin(a) * ring; }
      b.x = clamp(b.ax + (Math.random() - .5) * 80, b.r, W - b.r); b.y = clamp(b.ay + (Math.random() - .5) * 80, b.r, H - b.r);
      b.vx = 0; b.vy = 0; b.p = 0;
      var el = document.createElement("div"); el.className = "bub"; el.setAttribute("role", "listitem"); el.textContent = b.s;
      el.style.width = el.style.height = (b.r * 2).toFixed(1) + "px";
      el.style.fontSize = b.fs.toFixed(1) + "px";
      el.style.background = "radial-gradient(circle at 32% 26%, " + COLS[b.g % 4][0] + ", " + COLS[b.g % 4][1] + " 72%)";
      el.style.transform = "translate3d(" + (b.x - b.r) + "px," + (b.y - b.r) + "px,0) scale(0)";
      b.el = el; el._b = b; box.appendChild(el);
    });
    var active = false, visible = false, running = false, still = 0, drag = null, popped = false, last = 0;
    function step(now) {
      if (!active || !visible) { running = false; return; }
      var dt = clamp((now - (last || now)) / 16.67, .5, 2.5); last = now;
      var energy = 0, i, j, a, b;
      for (i = 0; i < bs.length; i++) {
        a = bs[i];
        if (a === drag) continue;
        a.vx += (a.ax - a.x) * .0016 * dt; a.vy += (a.ay - a.y) * .0016 * dt;
        var damp = Math.pow(.93, dt); a.vx *= damp; a.vy *= damp;
        a.x += a.vx * dt; a.y += a.vy * dt;
      }
      for (var it = 0; it < 2; it++) {
        for (i = 0; i < bs.length; i++) {
          a = bs[i];
          for (j = i + 1; j < bs.length; j++) {
            b = bs[j];
            var dx = b.x - a.x, dy = b.y - a.y, min = a.r + b.r + 2, d2 = dx * dx + dy * dy;
            if (d2 >= min * min) continue;
            var d = Math.sqrt(d2) || .01, o = (min - d) / 2, nx = dx / d, ny = dy / d;
            var wa = a === drag ? 0 : b === drag ? 2 : 1, wb = b === drag ? 0 : a === drag ? 2 : 1;
            a.x -= nx * o * wa; a.y -= ny * o * wa; b.x += nx * o * wb; b.y += ny * o * wb;
            var rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (rv < 0) { var imp = rv * .5; if (wa) { a.vx += imp * nx; a.vy += imp * ny; } if (wb) { b.vx -= imp * nx; b.vy -= imp * ny; } }
          }
          if (a !== drag) {
            if (a.x < a.r) { a.x = a.r; a.vx = Math.abs(a.vx) * .5; } if (a.x > W - a.r) { a.x = W - a.r; a.vx = -Math.abs(a.vx) * .5; }
            if (a.y < a.r) { a.y = a.r; a.vy = Math.abs(a.vy) * .5; } if (a.y > H - a.r) { a.y = H - a.r; a.vy = -Math.abs(a.vy) * .5; }
          }
        }
      }
      for (i = 0; i < bs.length; i++) {
        a = bs[i]; energy += a.vx * a.vx + a.vy * a.vy;
        if (a.p < 1) a.p = Math.min(1, a.p + .045 * dt);
        var q = a.p - 1, sc = a.p <= 0 ? 0 : a.p < 1 ? 1 + 2.7 * q * q * q + 1.7 * q * q : 1; // ease-out-back pop
        a.el.style.transform = "translate3d(" + (a.x - a.r).toFixed(1) + "px," + (a.y - a.r).toFixed(1) + "px,0)" + (sc !== 1 ? " scale(" + sc.toFixed(3) + ")" : "");
      }
      still = energy < .01 && !drag && bs[bs.length - 1].p >= 1 ? still + 1 : 0;
      if (still > 40) { running = false; return; }
      requestAnimationFrame(step);
    }
    function wake() { still = 0; if (!running && active && visible) { running = true; last = 0; requestAnimationFrame(step); } }
    var io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; wake(); });
    io.observe(box);
    var ox = 0, oy = 0, lx = 0, ly = 0, moved = 0, rect = null;
    box.addEventListener("pointerdown", function (ev) {
      var el = ev.target.closest(".bub"); if (!el) return;
      drag = el._b; rect = box.getBoundingClientRect(); moved = 0;
      ox = ev.clientX - rect.left - drag.x; oy = ev.clientY - rect.top - drag.y; lx = ev.clientX; ly = ev.clientY;
      el.setPointerCapture(ev.pointerId); wake();
    });
    box.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var nx = clamp(ev.clientX - rect.left - ox, drag.r, W - drag.r), ny = clamp(ev.clientY - rect.top - oy, drag.r, H - drag.r);
      drag.vx = (nx - drag.x); drag.vy = (ny - drag.y); drag.x = nx; drag.y = ny;
      moved += Math.abs(ev.clientX - lx) + Math.abs(ev.clientY - ly); lx = ev.clientX; ly = ev.clientY;
      wake();
    });
    function up() {
      if (!drag) return;
      var b = drag; drag = null;
      if (moved < 6) {
        // a tap pushes the neighbours away
        bs.forEach(function (o) {
          if (o === b) return;
          var dx = o.x - b.x, dy = o.y - b.y, d = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.max(0, 1 - d / 220) * 9;
          o.vx += dx / d * k; o.vy += dy / d * k;
        });
      }
      b.vx = clamp(b.vx, -18, 18); b.vy = clamp(b.vy, -18, 18); wake();
    }
    box.addEventListener("pointerup", up); box.addEventListener("pointercancel", up);
    addEventListener("resize", function () { W = box.clientWidth || W; H = box.clientHeight || H; wake(); }, { signal: sig });
    sig.addEventListener("abort", function () { io.disconnect(); active = false; });
    return {
      setActive: function (on) {
        active = on;
        if (on && !popped) { popped = true; bs.forEach(function (b, i) { b.p = -i * .07; }); }
        wake();
      }
    };
  }

  /* ---------- wiring ---------- */
  var inited = false;
  function init(c, opts) {
    if (inited) return; inited = true;
    if (!(opts && opts.noIntro)) intro(c); tiltInit(); progressInit(); pointerInit();
    G.onSave = confetti;
  }
  // called after every render (first load + language switch)
  function mount(root, c, sig, lang) {
    tiltMount(root, sig); expandMount(root, c); nowMount(root, sig, lang); magnetMount(root);
    var bub = bubblesMount(root.querySelector(".sw-page.skills"), c, sig);
    return {
      page: function (i) { if (bub) bub.setActive(i === 1); },
      openProject: function (src, pr) { xvOpenFrom(src, projectPage(pr)); }
    };
  }
  window.WOW = { init: init, mount: mount, confetti: confetti };
})();
