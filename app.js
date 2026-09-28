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
  function socialIcon(label) {
    var l = String(label).toLowerCase();
    if (l.indexOf("linkedin") > -1) return ICONS.linkedin;
    if (l.indexOf("github") > -1) return ICONS.github;
    return ICONS.globe;
  }
  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).filter(Boolean)
      .map(function (p) { return "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>"; }).join("");
  }
  function hide(el, isEmpty) {
    var section = el.closest(".section");
    (isEmpty ? el.classList.add : el.classList.remove).call(el.classList, "empty");
    if (section && section.id !== "experienta") section.classList.toggle("empty", isEmpty);
  }

  function vcard(p) {
    var parts = String(p.name || "").trim().split(/\s+/);
    var last = parts.length > 1 ? parts.pop() : "";
    var lines = [
      "BEGIN:VCARD", "VERSION:3.0",
      "N:" + last + ";" + parts.join(" ") + ";;;",
      "FN:" + (p.name || "")
    ];
    if (p.title) lines.push("TITLE:" + p.title);
    if (p.phone) lines.push("TEL;TYPE=CELL:" + p.phone);
    if (p.email) lines.push("EMAIL;TYPE=INTERNET:" + p.email);
    if (p.website) lines.push("URL:" + p.website);
    if (p.location) lines.push("ADR;TYPE=WORK:;;;" + p.location + ";;;");
    lines.push("END:VCARD");
    return lines.join("\r\n");
  }

  function render(c) {
    var p = c.profile || {};
    document.title = p.name ? p.name + (p.title ? " – " + p.title : "") : document.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && p.tagline) desc.setAttribute("content", p.tagline);

    document.querySelectorAll("[data-field]").forEach(function (el) {
      el.textContent = get(c, el.getAttribute("data-field")) || "";
    });

    var avatar = $("#avatar");
    avatar.src = safeUrl(p.photo) || "assets/avatar.svg";
    avatar.alt = p.name || "";

    var av = $("#availability");
    av.hidden = !p.availability;
    av.lastElementChild.textContent = p.availability || "";

    $("#location").innerHTML = p.location ? ICONS.pin + esc(p.location) : "";

    // Business card actions
    var actions = [];
    var tel = String(p.phone || "").replace(/[^\d+]/g, "");
    if (tel) actions.push('<a class="btn primary" href="tel:' + esc(tel) + '">' + ICONS.phone + "Sună</a>");
    if (p.email) actions.push('<a class="btn" href="mailto:' + esc(p.email) + '">' + ICONS.mail + "Email</a>");
    if (p.whatsapp) actions.push('<a class="btn" href="https://wa.me/' + esc(String(p.whatsapp).replace(/\D/g, "")) + '" target="_blank" rel="noopener">' + ICONS.whatsapp + "WhatsApp</a>");
    actions.push('<button class="btn" id="saveContact">' + ICONS.contact + "Salvează contact</button>");
    if (safeUrl(p.cvFile)) actions.push('<a class="btn" href="' + esc(safeUrl(p.cvFile)) + '" download>' + ICONS.download + "CV (PDF)</a>");
    $("#actions").innerHTML = actions.join("");
    $("#saveContact").addEventListener("click", function () {
      var blob = new Blob([vcard(p)], { type: "text/vcard;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = (p.name || "contact").replace(/\s+/g, "_") + ".vcf";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    });

    $("#social").innerHTML = list(c.social).filter(function (s) { return safeUrl(s.url); }).map(function (s) {
      return '<a href="' + esc(safeUrl(s.url)) + '" target="_blank" rel="noopener">' + socialIcon(s.label) + esc(s.label) + "</a>";
    }).join("");

    var stats = list(c.stats).filter(function (s) { return s.value; });
    $("#stats").innerHTML = stats.map(function (s) {
      return '<div class="card stat"><strong>' + esc(s.value) + "</strong><span>" + esc(s.label) + "</span></div>";
    }).join("");

    $("#about").innerHTML = paragraphs(c.about);
    hide($("#about"), !c.about);

    function timeline(items, head, sub) {
      return items.map(function (it) {
        var meta = [it[sub], it.period].filter(Boolean).map(esc).join(" · ");
        return '<li class="card"><h4>' + esc(it[head]) + "</h4>" +
          (meta ? '<p class="meta">' + meta + "</p>" : "") +
          (it.description ? '<p class="desc">' + esc(it.description) + "</p>" : "") + "</li>";
      }).join("");
    }
    $("#experience").innerHTML = timeline(list(c.experience), "role", "company");
    $("#education").innerHTML = timeline(list(c.education), "title", "institution");
    $("#experience").classList.toggle("empty", !list(c.experience).length);
    var noEdu = !list(c.education).length;
    $("#education").classList.toggle("empty", noEdu);
    $(".subhead").classList.toggle("empty", noEdu);
    $("#experienta").classList.toggle("empty", !list(c.experience).length && noEdu);

    var skills = list(c.skills);
    $("#skills").innerHTML = skills.map(function (g) {
      return '<div class="card"><h4>' + esc(g.group) + '</h4><div class="chips">' +
        list(g.items).filter(Boolean).map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") +
        "</div></div>";
    }).join("");
    hide($("#skills"), !skills.length);

    var projects = list(c.projects);
    $("#projects").innerHTML = projects.map(function (pr) {
      var img = safeUrl(pr.image), link = safeUrl(pr.link);
      return '<article class="card project">' +
        (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : "") +
        '<div class="body"><h4>' + esc(pr.title) + "</h4>" +
        (pr.description ? "<p>" + esc(pr.description) + "</p>" : "") +
        (link ? '<a class="more" href="' + esc(link) + '" target="_blank" rel="noopener">Vezi proiectul ' + ICONS.arrow + "</a>" : "") +
        '<div class="chips">' + list(pr.tags).filter(Boolean).map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>" +
        "</div></article>";
    }).join("");
    hide($("#projects"), !projects.length);

    var contacts = [];
    if (tel) contacts.push('<a href="tel:' + esc(tel) + '">' + ICONS.phone + esc(p.phone) + "</a>");
    if (p.email) contacts.push('<a href="mailto:' + esc(p.email) + '">' + ICONS.mail + esc(p.email) + "</a>");
    if (safeUrl(p.website)) contacts.push('<a href="' + esc(safeUrl(p.website)) + '">' + ICONS.globe + esc(String(p.website).replace(/^https?:\/\//, "")) + "</a>");
    if (p.location) contacts.push("<a>" + ICONS.pin + esc(p.location) + "</a>");
    $("#contactList").innerHTML = contacts.join("");

    var qrTarget = safeUrl(p.website) || location.href.split("#")[0];
    var qrEl = $("#qr");
    qrEl.innerHTML = "";
    if (window.QRCode) {
      new window.QRCode(qrEl, { text: qrTarget, width: 280, height: 280, correctLevel: window.QRCode.CorrectLevel.M });
    } else {
      qrEl.closest(".qr-wrap").classList.add("empty");
    }
  }

  // Theme toggle
  var root = document.documentElement;
  try { var saved = localStorage.getItem("theme"); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
  $("#themeToggle").addEventListener("click", function () {
    var dark = root.getAttribute("data-theme")
      ? root.getAttribute("data-theme") === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  $("#year").textContent = new Date().getFullYear();

  fetch("content.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function (err) {
      console.error("Nu s-a putut încărca content.json", err);
      document.querySelector("main").insertAdjacentHTML("afterbegin",
        '<p class="card" style="padding:16px;margin-top:24px">Conținutul nu a putut fi încărcat.</p>');
    });
})();
