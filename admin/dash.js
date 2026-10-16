/* Dashboard tab for the admin: shortcuts, your short links and visitor statistics (GoatCounter API).
   The GoatCounter API key lives only in this browser (localStorage), never in the repo. */
(function () {
  "use strict";
  var A = window.ADMIN, $ = function (s, r) { return (r || document).querySelector(s); };
  var SITE = "https://husanudaniel.ro";
  var LINKS = [
    { name: "Inel NFC", path: "/inel", hint: "programează-l pe inel" },
    { name: "Instagram", path: "/ig", hint: "în bio-ul de Instagram" },
    { name: "LinkedIn", path: "/in", hint: "în secțiunea de contact LinkedIn" },
    { name: "Cod QR", path: "/qr", hint: "pentru coduri QR / cărți de vizită tipărite" },
    { name: "Site", path: "/", hint: "linkul normal" }
  ];
  var SRC_NAMES = { inel: "Inel NFC", instagram: "Instagram", linkedin: "LinkedIn", qr: "Cod QR", cv: "CV (PDF)" };
  var ACT_NAMES = {
    "salveaza-contact": "Salvează contact", "whatsapp": "WhatsApp", "suna": "Sună", "email": "Email", "cv-pdf": "CV descărcat", "distribuie": "Distribuie",
    "instagram": "Instagram (deschis)", "linkedin": "LinkedIn (deschis)", "formular-trimis": "Mesaj trimis din formular"
  };
  var range = 30;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} return null; }
  function num(n) { return Number(n || 0).toLocaleString("ro-RO"); }

  /* ---------- tabs ---------- */
  function showTab(name) {
    document.querySelectorAll("#tabs button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === name); });
    document.querySelectorAll(".tabpanel").forEach(function (p) { p.hidden = p.id !== "tab-" + name; });
    store("admin-tab", name);
    window.scrollTo(0, 0);
  }
  $("#tabs").addEventListener("click", function (ev) { var b = ev.target.closest("[data-tab]"); if (b) showTab(b.getAttribute("data-tab")); });
  function edit(key) {
    showTab("content");
    var g = document.querySelector('#form [data-key="' + key + '"]');
    if (g) { g.open = true; g.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }

  /* ---------- dashboard ---------- */
  function code() { var d = A.data(); return String(((d && d.analytics) || {}).goatcounter || "").trim().toLowerCase(); }
  function count(d, k) { return Array.isArray(d && d[k]) ? d[k].length : 0; }

  function build() {
    var d = A.data(), root = $("#tab-dash");
    var tiles = [
      { k: "projects", n: count(d, "projects"), l: "proiecte" },
      { k: "testimonials", n: count(d, "testimonials"), l: "recomandări" },
      { k: "experience", n: count(d, "experience"), l: "experiențe" },
      { k: "skills", n: (d.skills || []).reduce(function (a, g) { return a + ((g.items || []).length); }, 0), l: "competențe" }
    ];
    root.innerHTML =
      '<div class="card dash-card" id="statsCard"><div class="dash-head"><h2>Statistici</h2><div class="dash-range" id="rangeSel">' +
        [7, 30, 90].map(function (n) { return '<button type="button" data-range="' + n + '" class="' + (n === range ? "on" : "") + '">' + n + ' zile</button>'; }).join("") +
      '</div></div><div id="statsBody"></div></div>' +

      '<div class="card dash-card"><h2>Linkurile tale</h2><p class="muted small">Fiecare link numără separat vizitele, ca să vezi de unde vin oamenii.</p><ul class="dash-links">' +
        LINKS.map(function (l) {
          return '<li><div><b>' + l.name + '</b><small>' + SITE.replace("https://", "") + l.path + ' · ' + l.hint + '</small></div>' +
            '<button type="button" class="btn small-btn" data-copy="' + SITE + l.path + '">Copiază</button></li>';
        }).join("") + '</ul></div>' +

      '<div class="card dash-card"><h2>Ce ai pe site</h2><div class="dash-tiles">' + tiles.map(function (t) {
        return '<button type="button" class="dash-tile" data-edit="' + t.k + '"><b>' + t.n + '</b><span>' + t.l + '</span><i>Editează ›</i></button>';
      }).join("") + '</div><div class="dash-row">' +
        '<button type="button" class="btn" data-edit="profile">Profil și contact</button>' +
        '<button type="button" class="btn" data-edit="about">Despre mine</button>' +
        '<a class="btn" href="' + SITE + '/" target="_blank" rel="noopener">Deschide site-ul ↗</a></div></div>' ;

    root.onclick = function (ev) {
      var e = ev.target.closest("[data-edit]"); if (e) return edit(e.getAttribute("data-edit"));
      var c = ev.target.closest("[data-copy]");
      if (c) {
        var text = c.getAttribute("data-copy");
        (navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(text) : Promise.reject()).catch(function () { window.prompt("Copiază linkul:", text); })
          .then(function () { c.textContent = "Copiat ✓"; setTimeout(function () { c.textContent = "Copiază"; }, 1600); });
        return;
      }
      var r = ev.target.closest("[data-range]");
      if (r) { range = +r.getAttribute("data-range"); build(); }
    };
    stats();
  }

  /* ---------- statistics ---------- */
  function setup(msg) {
    var c = code(), t = store("gc-token");
    $("#statsBody").innerHTML =
      (msg ? '<p class="dash-warn">' + msg + '</p>' : "") +
      '<ol class="dash-steps small"><li>Fă un cont gratuit pe <a href="https://www.goatcounter.com/signup" target="_blank" rel="noopener">goatcounter.com</a> și alege un cod (ex. <code>husanudaniel</code>).</li>' +
      '<li>În GoatCounter: <b>Settings → API</b> → creează o cheie cu permisiunea <b>„Read statistics”</b> și copiaz-o.</li>' +
      '<li>Pune mai jos codul și cheia. Cheia rămâne doar pe acest telefon/browser.</li></ol>' +
      '<label>Cod GoatCounter<input id="gcCode" value="' + esc(c) + '" placeholder="husanudaniel" autocapitalize="none" autocomplete="off"></label>' +
      '<label>Cheie API (doar pe acest dispozitiv)<input id="gcToken" type="password" value="' + esc(t || "") + '" autocomplete="off"></label>' +
      '<button type="button" class="btn primary wide" id="gcSave">Conectează statisticile</button>' +
      '<p class="muted small">Codul se salvează în site (apasă și <b>Salvează</b> jos), ca să înceapă numărătoarea pentru vizitatori.</p>';
    $("#gcSave").onclick = function () {
      var nc = $("#gcCode").value.trim().toLowerCase(), nt = $("#gcToken").value.trim();
      if (!/^[a-z0-9-]{2,50}$/.test(nc)) { $("#gcCode").focus(); return; }
      var d = A.data(); d.analytics = d.analytics || {};
      if (d.analytics.goatcounter !== nc) { d.analytics.goatcounter = nc; A.dirty(); }
      store("gc-token", nt || null);
      stats();
    };
  }

  function api(path, params) {
    var q = Object.keys(params || {}).map(function (k) { return k + "=" + encodeURIComponent(params[k]); }).join("&");
    return fetch("https://" + code() + ".goatcounter.com/api/v0/" + path + (q ? "?" + q : ""), {
      headers: { "Authorization": "Bearer " + store("gc-token"), "Accept": "application/json" }
    }).then(function (r) {
      if (!r.ok) { var e = new Error("HTTP " + r.status); e.status = r.status; throw e; }
      return r.json();
    });
  }

  function bars(rows, empty) {
    if (!rows.length) return '<p class="muted small">' + empty + '</p>';
    var max = Math.max.apply(null, rows.map(function (r) { return r.n; })) || 1;
    return '<ul class="dash-bars">' + rows.map(function (r) {
      return '<li><span class="b-name">' + esc(r.name) + '</span><span class="b-bar"><i style="width:' + Math.max(3, Math.round(100 * r.n / max)) + '%"></i></span><b>' + num(r.n) + '</b></li>';
    }).join("") + '</ul>';
  }
  function spark(days) {
    if (!days.length) return "";
    var max = Math.max.apply(null, days.map(function (d) { return d.n; })) || 1;
    return '<div class="dash-spark" aria-hidden="true">' + days.map(function (d) {
      return '<i title="' + esc(d.day) + ': ' + d.n + '" style="height:' + Math.max(3, Math.round(100 * d.n / max)) + '%"></i>';
    }).join("") + '</div>';
  }

  var seq = 0;
  function stats() {
    var body = $("#statsBody"); if (!body) return;
    if (!code() || !store("gc-token")) return setup();
    var my = ++seq, end = new Date(), start = new Date(end.getTime() - range * 864e5);
    start.setHours(0, 0, 0, 0);
    var p = { start: start.toISOString(), end: end.toISOString() };
    body.innerHTML = '<p class="muted">Se încarcă statisticile…</p>';
    Promise.all([api("stats/total", p), api("stats/hits", { start: p.start, end: p.end, limit: 100 })]).then(function (r) {
      if (my !== seq) return;
      var total = r[0] || {}, hits = (r[1] && r[1].hits) || [];
      var pages = hits.filter(function (h) { return !h.event; });
      var ev = hits.filter(function (h) { return h.event; });
      var views = total.total != null ? total.total : pages.reduce(function (a, h) { return a + (h.count || 0); }, 0);
      var src = ev.filter(function (h) { return /^src-/.test(h.path); }).map(function (h) { var k = h.path.slice(4); return { name: SRC_NAMES[k] || k, n: h.count || 0 }; })
        .sort(function (a, b) { return b.n - a.n; });
      var act = ev.filter(function (h) { return /^click-/.test(h.path); }).map(function (h) {
        var k = h.path.slice(6); return { name: ACT_NAMES[k] || (/^proiect-/.test(k) ? "Proiect: " + k.slice(8) : k), n: h.count || 0 };
      }).sort(function (a, b) { return b.n - a.n; });
      var saves = (act.filter(function (a) { return a.name === "Salvează contact"; })[0] || {}).n || 0;
      var daily = ((total.stats || []).map(function (d) { return { day: d.day, n: d.daily || (d.hourly || []).reduce(function (a, b) { return a + (b || 0); }, 0) }; }));
      body.innerHTML =
        '<div class="dash-kpis"><div><b>' + num(views) + '</b><span>vizite</span></div><div><b>' + num(saves) + '</b><span>contacte salvate</span></div>' +
        '<div><b>' + num(act.reduce(function (a, x) { return a + x.n; }, 0)) + '</b><span>apăsări în total</span></div></div>' + spark(daily) +
        '<h3>De unde vin</h3>' + bars(src, "Încă nu sunt vizite din <code>/inel</code>, <code>/ig</code> sau <code>/in</code>. Apar după ce folosești aceste linkuri.") +
        '<h3>Ce apasă oamenii</h3>' + bars(act, "Încă nicio apăsare înregistrată.") +
        '<div class="dash-row"><button type="button" class="btn small-btn" id="gcReload">Reîncarcă</button>' +
        '<a class="btn small-btn" target="_blank" rel="noopener" href="https://' + code() + '.goatcounter.com/">Deschide GoatCounter ↗</a>' +
        '<button type="button" class="btn small-btn" id="gcChange">Schimbă cheia</button></div>';
      $("#gcReload").onclick = stats; $("#gcChange").onclick = function () { setup(); };
    }).catch(function (err) {
      if (my !== seq) return;
      var msg = err && (err.status === 401 || err.status === 403) ? "Cheia API nu e bună sau nu are permisiunea „Read statistics”."
        : err && err.status === 404 ? "Nu găsesc contul <b>" + esc(code()) + "</b> pe GoatCounter. Verifică codul."
        : "Nu am putut citi statisticile din browser (rețea sau GoatCounter refuză cererea). Poți vedea aceleași cifre direct în GoatCounter.";
      setup(msg);
      $("#statsBody").insertAdjacentHTML("beforeend", '<p><a class="btn small-btn" target="_blank" rel="noopener" href="https://' + esc(code()) + '.goatcounter.com/">Deschide GoatCounter ↗</a></p>');
    });
  }

  var first = true;
  A.onLoad = function () {
    build();
    if (first) { first = false; var t = store("admin-tab"); showTab(t === "content" || t === "account" ? t : "dash"); }
  };
})();
