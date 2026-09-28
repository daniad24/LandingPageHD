(function () {
  "use strict";

  var ICONS = {
    phone: '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.4 11.4 0 0 1-4.4-3.9c-.3-.5-1.1-1.5-1.1-2.8s.7-2 1-2.3a1 1 0 0 1 .7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6a8 8 0 0 0 1.5 1.8 7.3 7.3 0 0 0 2.1 1.3c.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.2 1.2z"/></svg>',
    globe: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.9a15.6 15.6 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.5 1.1-2.8 1.9-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16zM8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.3 6.7 8 8zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.5-1.1 2.8-1.9 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6zm1.7-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
    contact: '<svg viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/></svg>',
    download: '<svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.3 18.3V10H5.7v8.3zM7 8.9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11.3 9.4v-4.6c0-2.4-1.3-3.5-3-3.5a2.6 2.6 0 0 0-2.4 1.3V10h-2.5v8.3h2.5v-4.4c0-1.1.2-2.2 1.6-2.2s1.4 1.3 1.4 2.3v4.3z"/></svg>',
    github: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3zm5 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z"/></svg>'
  };

  ICONS.instagram = '<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 3.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.3-.1-4s0-3 .1-4C3.9 5.3 5.2 4 8 3.9c1 0 1.3-.1 4-.1zM12 2c-2.7 0-3.1 0-4.1.1C4.3 2.2 2.2 4.3 2.1 7.9 2 8.9 2 9.3 2 12s0 3.1.1 4.1c.1 3.6 2.2 5.7 5.8 5.8 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c3.6-.1 5.7-2.2 5.8-5.8.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c-.1-3.6-2.2-5.7-5.8-5.8C15.1 2 14.7 2 12 2z"/></svg>';
  ICONS.facebook = '<svg viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1 0-2 2-2h1.5V2.1A21 21 0 0 0 14.6 2C12 2 10 3.7 10 6.7v2.8H7v4h3V22h4z"/></svg>';
  ICONS.tiktok = '<svg viewBox="0 0 24 24"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z"/></svg>';
  ICONS.x = '<svg viewBox="0 0 24 24"><path d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>';
  ICONS.chevron = '<svg viewBox="0 0 24 24"><path d="M8.6 16.6 10 18l6-6-6-6-1.4 1.4 4.6 4.6z"/></svg>';

  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function get(obj, path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function list(v) { return Array.isArray(v) ? v : []; }
  function safeUrl(u) {
    u = String(u || "").trim();
    return /^(javascript|data|vbscript):/i.test(u.replace(/\s/g, "")) ? "" : u;
  }
  function socialIcon(label, url) {
    var l = (String(label) + " " + String(url)).toLowerCase();
    var keys = ["linkedin", "github", "instagram", "facebook", "tiktok"];
    for (var i = 0; i < keys.length; i++) if (l.indexOf(keys[i]) > -1) return ICONS[keys[i]];
    if (/(^|\W)(x\.com|twitter)/.test(l)) return ICONS.x;
    return ICONS.globe;
  }
  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).filter(Boolean)
      .map(function (p) { return "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>"; }).join("");
  }
  function toggleSection(id, isEmpty) { var s = document.getElementById(id); if (s) s.classList.toggle("empty", isEmpty); }

  function vcard(p) {
    var parts = String(p.name || "").trim().split(/\s+/);
    var last = parts.length > 1 ? parts.pop() : "";
    var lines = ["BEGIN:VCARD", "VERSION:3.0", "N:" + last + ";" + parts.join(" ") + ";;;", "FN:" + (p.name || "")];
    if (p.title) lines.push("TITLE:" + p.title);
    if (p.phone) lines.push("TEL;TYPE=CELL:" + p.phone);
    if (p.email) lines.push("EMAIL;TYPE=INTERNET:" + p.email);
    if (p.website) lines.push("URL:" + p.website);
    if (p.location) lines.push("ADR;TYPE=WORK:;;;" + p.location + ";;;");
    lines.push("END:VCARD");
    return lines.join("\r\n");
  }
  function saveContact(p) {
    var blob = new Blob([vcard(p)], { type: "text/vcard;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (p.name || "contact").replace(/\s+/g, "_") + ".vcf";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast("Contact descărcat ✓");
  }
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  // ---- animations ----
  function observeReveals() {
    var els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || reduceMotion) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }
  function countUp(el) {
    var raw = el.getAttribute("data-value"), m = raw.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
    if (!m || reduceMotion) { el.textContent = raw; return; }
    var target = parseFloat(m[2].replace(",", ".")), start = null, dur = 3500;
    (function step(t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / dur), eased = 1 - Math.pow(1 - k, 3);
      el.textContent = m[1] + Math.round(target * eased) + m[3];
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  function observeCounters() {
    var els = document.querySelectorAll("[data-value]");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.textContent = e.getAttribute("data-value"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---- carousel ----
  function setupCarousel(track, count) {
    var slides = track.querySelectorAll(".slide");
    var dots = $("#dots"), counter = $("#counter"), navBtns = document.querySelectorAll("#carouselNav .round-btn");
    var single = count < 2;
    dots.innerHTML = single ? "" : Array.prototype.map.call(slides, function (_, i) {
      return '<button aria-label="Proiectul ' + (i + 1) + '"></button>';
    }).join("");
    $("#carouselNav").classList.toggle("empty", single);
    var current = 0;

    function goTo(i) {
      i = Math.max(0, Math.min(count - 1, i));
      var s = slides[i];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
    }
    function update() {
      var center = track.scrollLeft + track.clientWidth / 2, best = 0, bestD = Infinity;
      slides.forEach(function (s, i) {
        var mid = s.offsetLeft + s.clientWidth / 2, d = Math.abs(mid - center);
        if (d < bestD) { bestD = d; best = i; }
        if (!reduceMotion && window.innerWidth <= 760) {
          var r = Math.min(1, d / s.clientWidth);
          s.style.setProperty("--s", (1 - r * 0.08).toFixed(3));
          s.style.setProperty("--o", (1 - r * 0.35).toFixed(3));
        } else { s.style.removeProperty("--s"); s.style.removeProperty("--o"); }
      });
      // at the right edge, the last slide is the current one
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) best = count - 1;
      current = best;
      dots.querySelectorAll("button").forEach(function (b, i) { b.classList.toggle("on", i === best); });
      counter.innerHTML = single ? "" : "<b>" + String(best + 1).padStart(2, "0") + "</b> / " + String(count).padStart(2, "0");
      if (navBtns.length) { navBtns[0].disabled = best === 0; navBtns[1].disabled = best === count - 1; }
    }
    var raf;
    track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    dots.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      goTo(Array.prototype.indexOf.call(dots.children, b));
    });
    navBtns.forEach(function (b) { b.onclick = function () { goTo(current + Number(b.getAttribute("data-dir"))); }; });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    });
    update();
  }

  // ---- render ----
  function render(c) {
    var p = c.profile || {};
    document.title = p.name ? p.name + (p.title ? " – " + String(p.title).replace(/[\s|]+$/, "") : "") : document.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && p.tagline) desc.setAttribute("content", p.tagline);

    document.querySelectorAll("[data-field]").forEach(function (el) {
      el.textContent = String(get(c, el.getAttribute("data-field")) || "").trim().replace(/\s*\|\s*$/, "");
    });

    var parts = String(p.name || "").trim().split(/\s+/);
    var last = parts.length > 1 ? parts.pop() : "";
    $("#heroName").innerHTML = esc(parts.join(" ")) + (last ? " <em>" + esc(last) + "</em>" : "");

    var avatar = $("#avatar");
    avatar.src = safeUrl(p.photo) || "assets/avatar.svg";
    avatar.alt = p.name || "";

    var av = $("#availability");
    av.hidden = !p.availability;
    av.lastElementChild.textContent = p.availability || "";
    $("#location").innerHTML = p.location ? ICONS.pin + esc(p.location) : "";

    var tel = String(p.phone || "").replace(/[^\d+]/g, "");
    var wa = String(p.whatsapp || "").replace(/\D/g, "");
    var actions = [];
    if (tel) actions.push('<a class="btn primary" href="tel:' + esc(tel) + '">' + ICONS.phone + "Sună-mă</a>");
    if (p.email) actions.push('<a class="btn" href="mailto:' + esc(p.email) + '">' + ICONS.mail + "Scrie-mi</a>");
    if (safeUrl(p.cvFile)) actions.push('<a class="btn dark" href="' + esc(safeUrl(p.cvFile)) + '" download>' + ICONS.download + "CV</a>");
    $("#actions").innerHTML = actions.join("");

    $("#social").innerHTML = list(c.social).filter(function (s) { return safeUrl(s.url); }).map(function (s) {
      return '<a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '" title="' + esc(s.label) + '">' + socialIcon(s.label, s.url) + "</a>";
    }).join("");

    // Stats
    var stats = list(c.stats).filter(function (s) { return s.value; });
    $("#stats").innerHTML = stats.map(function (s, i) {
      return '<div class="card stat reveal" style="--d:' + i + '"><strong data-value="' + esc(s.value) + '">' + esc(s.value) + "</strong><span>" + esc(s.label) + "</span></div>";
    }).join("");
    $("#stats").style.gridTemplateColumns = "repeat(" + Math.min(Math.max(stats.length, 1), 3) + ", 1fr)";
    $("#stats").classList.toggle("empty", !stats.length);

    // About
    $("#about").innerHTML = paragraphs(c.about);
    toggleSection("despre", !c.about);

    // Projects carousel
    var projects = list(c.projects).filter(function (pr) { return pr.title || pr.description; });
    var track = $("#projects");
    track.innerHTML = projects.map(function (pr, i) {
      var img = safeUrl(pr.image), link = safeUrl(pr.link);
      var preview = img
        ? '<div class="preview"><img src="' + esc(img) + '" alt="' + esc(pr.title) + '" loading="lazy"><span class="idx">' + String(i + 1).padStart(2, "0") + "</span></div>"
        : '<div class="preview fallback"><span class="letter">' + esc(String(pr.title || "?").trim().charAt(0).toUpperCase()) + '</span><span class="idx">' + String(i + 1).padStart(2, "0") + "</span></div>";
      var tags = list(pr.tags).filter(Boolean);
      return '<article class="card slide" aria-roledescription="slide" aria-label="' + (i + 1) + " din " + projects.length + '">' + preview +
        '<div class="body"><h3>' + esc(pr.title) + "</h3>" +
        (pr.description ? "<p>" + esc(pr.description) + "</p>" : "") +
        '<div class="foot"><div class="chips">' + tags.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>" +
        (link ? '<a class="go" href="' + esc(link) + '" target="_blank" rel="noopener">Vezi ' + ICONS.arrow + "</a>" : "") +
        "</div></div></article>";
    }).join("");
    toggleSection("proiecte", !projects.length);
    if (projects.length) setupCarousel(track, projects.length);

    // Skills: marquee + groups
    var skills = list(c.skills);
    var all = [];
    skills.forEach(function (g) { list(g.items).forEach(function (s) { if (s) all.push(s); }); });
    var run = all.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("");
    while (run && all.length && run.length < 600) run += run;
    $("#marquee").innerHTML = run + run;
    $("#skills").innerHTML = skills.map(function (g, i) {
      return '<div class="card reveal" style="--d:' + i + '"><h4>' + esc(g.group) + '</h4><div class="chips">' +
        list(g.items).filter(Boolean).map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + "</div></div>";
    }).join("");
    toggleSection("competente", !all.length);

    // Timeline
    function timeline(items, head, sub) {
      return items.map(function (it, i) {
        return '<li class="card reveal" style="--d:' + (i % 4) + '">' +
          (it.period ? '<span class="period">' + esc(it.period) + "</span>" : "") +
          "<h4>" + esc(String(it[head] || "").trim()) + "</h4>" +
          (it[sub] ? '<span class="org">' + esc(it[sub]) + "</span>" : "") +
          (it.description ? '<p class="desc">' + esc(it.description) + "</p>" : "") + "</li>";
      }).join("");
    }
    var exp = list(c.experience), edu = list(c.education);
    $("#experience").innerHTML = timeline(exp, "role", "company");
    $("#education").innerHTML = timeline(edu, "title", "institution");
    $("#experience").classList.toggle("empty", !exp.length);
    $("#education").classList.toggle("empty", !edu.length);
    toggleSection("experienta", !exp.length && !edu.length);

    // Contact
    var contacts = [];
    if (tel) contacts.push('<a href="tel:' + esc(tel) + '">' + ICONS.phone + esc(p.phone) + "</a>");
    if (p.email) contacts.push('<a href="mailto:' + esc(p.email) + '">' + ICONS.mail + esc(p.email) + "</a>");
    if (wa) contacts.push('<a href="https://wa.me/' + esc(wa) + '" target="_blank" rel="noopener">' + ICONS.whatsapp + "WhatsApp</a>");
    if (safeUrl(p.website)) contacts.push('<a href="' + esc(safeUrl(p.website)) + '">' + ICONS.globe + esc(String(p.website).replace(/^https?:\/\//, "").replace(/\/$/, "")) + "</a>");
    if (p.location) contacts.push("<a>" + ICONS.pin + esc(p.location) + "</a>");
    $("#contactList").innerHTML = contacts.join("");

    var qrEl = $("#qr");
    qrEl.innerHTML = "";
    if (window.QRCode) {
      new window.QRCode(qrEl, { text: safeUrl(p.website) || location.href.split("#")[0], width: 280, height: 280, colorDark: "#1f1611", colorLight: "#fbf4ea", correctLevel: window.QRCode.CorrectLevel.M });
    } else {
      qrEl.closest(".qr-wrap").classList.add("empty");
    }

    // Dock
    var dock = [];
    if (tel) dock.push('<a class="main" href="tel:' + esc(tel) + '">' + ICONS.phone + "Sună</a>");
    if (wa) dock.push('<a href="https://wa.me/' + esc(wa) + '" target="_blank" rel="noopener">' + ICONS.whatsapp + "WhatsApp</a>");
    if (p.email) dock.push('<a href="mailto:' + esc(p.email) + '">' + ICONS.mail + "Email</a>");
    dock.push('<button type="button" id="dockSave">' + ICONS.contact + "Salvează</button>");
    $("#dock").innerHTML = dock.join("");
    $("#dockSave").addEventListener("click", function () { saveContact(p); });

    observeReveals();
    observeCounters();
  }

  // ---- chrome: header + dock on scroll ----
  var topbar = $("#topbar"), dockEl = $("#dock");
  function onScroll() {
    var y = window.scrollY;
    topbar.classList.toggle("scrolled", y > 10);
    dockEl.classList.toggle("show", y > window.innerHeight * 0.35 || window.innerWidth <= 760);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  $("#year").textContent = new Date().getFullYear();

  fetch("content.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (c) { render(c); setTimeout(onScroll, 600); })
    .catch(function (err) {
      console.error("Nu s-a putut încărca content.json", err);
      document.querySelectorAll(".reveal").forEach(function (e) { e.classList.add("in"); });
      document.querySelector("main").insertAdjacentHTML("afterbegin",
        '<p class="card" style="padding:16px;margin-top:24px">Conținutul nu a putut fi încărcat.</p>');
    });
})();
