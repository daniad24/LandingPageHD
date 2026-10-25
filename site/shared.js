/* Shared helpers for the site (and the CV template). Reads the live content.json. */
(function () {
  "use strict";
  var I = {
    phone: '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.4 11.4 0 0 1-4.4-3.9c-.3-.5-1.1-1.5-1.1-2.8s.7-2 1-2.3a1 1 0 0 1 .7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6a8 8 0 0 0 1.5 1.8 7.3 7.3 0 0 0 2.1 1.3c.3.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.2 1.2z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z"/></svg>',
    contact: '<svg viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/></svg>',
    globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.3 18.3V10H5.7v8.3zM7 8.9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11.3 9.4v-4.6c0-2.4-1.3-3.5-3-3.5a2.6 2.6 0 0 0-2.4 1.3V10h-2.5v8.3h2.5v-4.4c0-1.1.2-2.2 1.6-2.2s1.4 1.3 1.4 2.3v4.3z"/></svg>'
  };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function list(v) { return Array.isArray(v) ? v : []; }
  function safeUrl(u) { u = String(u || "").trim(); return /^(javascript|data|vbscript):/i.test(u.replace(/\s/g, "")) ? "" : u; }
  // content.json paths are relative to the site root, which is the folder above /site/ (works from any page depth)
  var BASE = new URL("../", (document.currentScript && document.currentScript.src) || location.href).href;
  function asset(u) { u = safeUrl(u); return !u || /^(https?:)?\/\//i.test(u) || u.charAt(0) === "/" ? u : BASE + u; }
  function paragraphs(t) {
    return String(t || "").split(/\n\s*\n/).filter(Boolean).map(function (p) { return "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>"; }).join("");
  }
  function lines(t) {
    return String(t || "").split(/\n+/).map(function (l) { return l.replace(/^[\s•\-–]+/, "").trim(); }).filter(Boolean);
  }
  function favicon(domain) {
    domain = String(domain || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    return domain ? "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(domain) + "&sz=128" : "";
  }
  function logo(it) { return asset(it.logo) || favicon(it.domain); }
  function shot(link) { return /^https?:\/\//i.test(link || "") ? "https://s0.wp.com/mshots/v1/" + encodeURIComponent(link) + "?w=1200&h=900" : ""; }
  function cover(pr) { return asset(pr.image) || shot(pr.link); }
  function initials(n) {
    return String(n || "?").split(/[\s–-]+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }
  function tel(p) { return String(p.phone || "").replace(/[^\d+]/g, ""); }
  function wa(p) { return String(p.whatsapp || "").replace(/\D/g, ""); }
  function socialIcon(s) {
    var l = (s.label + " " + s.url).toLowerCase();
    return l.indexOf("instagram") > -1 ? I.instagram : l.indexOf("linkedin") > -1 ? I.linkedin : I.globe;
  }
  function vcard(p) {
    var parts = String(p.name || "").trim().split(/\s+/), last = parts.length > 1 ? parts.pop() : "";
    var v = ["BEGIN:VCARD", "VERSION:3.0", "N:" + last + ";" + parts.join(" ") + ";;;", "FN:" + (p.name || "")];
    if (p.title) v.push("TITLE:" + p.title);
    if (p.phone) v.push("TEL;TYPE=CELL:" + p.phone);
    if (p.email) v.push("EMAIL;TYPE=INTERNET:" + p.email);
    if (p.website) v.push("URL:" + p.website);
    v.push("END:VCARD");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([v.join("\r\n")], { type: "text/vcard;charset=utf-8" }));
    a.download = (p.name || "contact").replace(/\s+/g, "_") + ".vcf";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function share(p) {
    var url = "https://husanudaniel.ro/";
    if (navigator.share) { navigator.share({ title: p.name, text: [p.name, p.title].filter(Boolean).join(" – "), url: url }).catch(function () {}); return; }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(function () { toast(window.GLASS ? window.GLASS.L("copied") : "Link copiat ✓"); });
    else window.prompt("Copiază linkul:", url);
  }
  var t;
  function toast(msg) {
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 2000);
  }
  function reveal(root) {
    var els = (root || document).querySelectorAll("[data-reveal]:not(.in)");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (e) { e.classList.add("in"); }); return;
    }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    els.forEach(function (e, i) { e.style.setProperty("--i", i % 6); io.observe(e); });
  }
  function load() {
    return fetch(BASE + "content.json", { cache: "no-store" }).then(function (r) { return r.json(); });
  }
  // English overrides (content.en.json): objects are merged, arrays of objects merged by index, the rest replaced
  function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }
  function merge(base, over) {
    var out = JSON.parse(JSON.stringify(base || {}));
    Object.keys(over || {}).forEach(function (k) {
      var b = out[k], o = over[k];
      if (Array.isArray(o) && Array.isArray(b) && o.every(isObj)) out[k] = b.map(function (x, i) { return isObj(x) && o[i] ? Object.assign({}, x, o[i]) : x; });
      else if (isObj(o) && isObj(b)) out[k] = Object.assign({}, b, o);
      else out[k] = o;
    });
    return out;
  }
  function loadBoth() {
    var en = fetch(BASE + "content.en.json", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; });
    return Promise.all([load(), en]);
  }
  // entries marked "hidden": true in the admin stay saved but are not shown anywhere
  function visible(c) {
    var out = Object.assign({}, c);
    ["projects", "testimonials", "experience", "education"].forEach(function (k) {
      if (Array.isArray(c[k])) out[k] = c[k].filter(function (x) { return !(x && x.hidden === true); });
    });
    return out;
  }
  window.CV = { I: I, esc: esc, list: list, safeUrl: safeUrl, asset: asset, paragraphs: paragraphs, lines: lines,
    logo: logo, cover: cover, shot: shot, initials: initials, tel: tel, wa: wa, socialIcon: socialIcon,
    vcard: vcard, share: share, toast: toast, reveal: reveal, load: load, base: BASE, merge: merge, loadBoth: loadBoth, visible: visible };
})();
