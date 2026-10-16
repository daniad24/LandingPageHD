/* Visitor-facing extras: NFC business-card mode, recommendations, contact form and privacy-friendly stats (GoatCounter).
   Needs shared.js (CV) and glass.js (GLASS). */
(function () {
  "use strict";
  var C = window.CV, G = window.GLASS, I = C.I, e = C.esc, L = function (k) { return G.L(k); };

  /* ---------- where the visitor came from: ?ref=inel | linkedin | instagram | qr ---------- */
  var SOURCES = { inel: "Inel NFC", nfc: "Inel NFC", linkedin: "LinkedIn", li: "LinkedIn", instagram: "Instagram", ig: "Instagram", qr: "Cod QR", cv: "CV (PDF)" };
  var params = new URLSearchParams(location.search);
  var ref = (params.get("ref") || params.get("utm_source") || "").toLowerCase();
  var source = SOURCES[ref] || (ref ? ref : "");
  var cardMode = params.has("card") || ref === "inel" || ref === "nfc";
  // keep the address bar clean (the language choice is the only parameter worth keeping)
  if (ref || params.has("card")) {
    var keep = params.get("lang");
    history.replaceState(history.state, "", location.pathname + (keep ? "?lang=" + keep : "") + location.hash);
  }

  /* ---------- stats ---------- */
  var gcQueue = [], gcReady = false;
  function skip() { try { return localStorage.getItem("skipgc") === "t"; } catch (err) { return false; } }
  function stats(code) {
    code = String(code || "").trim().toLowerCase();
    if (!/^[a-z0-9-]{2,50}$/.test(code) || skip() || /^(localhost|127\.)/.test(location.hostname)) return;
    window.goatcounter = { no_onload: true, allow_local: false };
    var s = document.createElement("script");
    s.async = true; s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + code + ".goatcounter.com/count");
    s.onload = function () {
      gcReady = true;
      window.goatcounter.count({ path: location.pathname, referrer: source || document.referrer, title: document.title });
      gcQueue.forEach(track); gcQueue = [];
    };
    document.head.appendChild(s);
  }
  function track(name) {
    if (!gcReady) { if (gcQueue.length < 20) gcQueue.push(name); return; }
    try { window.goatcounter.count({ path: "click-" + name, title: name, event: true }); } catch (err) {}
  }
  // what visitors tap: save contact, WhatsApp, call, email, CV, projects
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a, [data-act]");
    if (!a) return;
    var act = a.getAttribute("data-act"), h = a.getAttribute("href") || "";
    if (act === "vcf") track("salveaza-contact");
    else if (act === "share") track("distribuie");
    else if (/^tel:/.test(h)) track("suna");
    else if (/^mailto:/.test(h)) track("email");
    else if (/wa\.me/.test(h)) track("whatsapp");
    else if (/\.pdf$/i.test(h)) track("cv-pdf");
    else if (/instagram\.com/.test(h)) track("instagram");
    else if (/linkedin\.com/.test(h)) track("linkedin");
    else if (/^https?:/.test(h) && a.closest(".xv")) track("proiect-" + h.replace(/^https?:\/\//, "").replace(/\/.*$/, ""));
  }, true);

  /* ---------- 1. Business-card mode (the NFC ring opens /inel) ---------- */
  function card(c) {
    var p = c.profile || {}, tel = C.tel(p), wa = C.wa(p);
    var socials = C.list(c.social).map(function (s) {
      return '<a class="cm-soc" href="' + e(C.safeUrl(s.url)) + '" target="_blank" rel="noopener" aria-label="' + e(s.label) + '">' + C.socialIcon(s) + "</a>";
    }).join("");
    var el = document.createElement("div");
    el.className = "cm"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", p.name || "");
    el.innerHTML = '<div class="cm-card glass">' +
      '<p class="cm-hi">' + L("cardHi") + "</p>" +
      '<div class="cm-photo"><img src="' + e(C.asset(p.photo)) + '" alt=""></div>' +
      "<h2>" + e(p.name) + "</h2><p class=\"cm-role\">" + e(p.title) + "</p>" +
      '<button class="btn accent cm-save" data-act="vcf">' + I.contact + L("cardSave") + "</button>" +
      '<div class="cm-grid">' +
        (wa ? '<a class="btn" href="https://wa.me/' + e(wa) + '" target="_blank" rel="noopener">' + I.whatsapp + "WhatsApp</a>" : "") +
        (tel ? '<a class="btn" href="tel:' + e(tel) + '">' + I.phone + L("call") + "</a>" : "") +
        (p.email ? '<a class="btn" href="mailto:' + e(p.email) + '">' + I.mail + "Email</a>" : "") +
        '<button class="btn" data-act="share">' + I.share + L("share") + "</button>" +
      "</div>" +
      (socials ? '<div class="cm-socs">' + socials + "</div>" : "") +
      '<button class="cm-more" type="button">' + L("cardMore") + ' <span aria-hidden="true">↓</span></button>' +
      "</div>";
    document.body.appendChild(el);
    document.documentElement.classList.add("cm-on");
    requestAnimationFrame(function () { el.classList.add("in"); });
    el.addEventListener("click", function (ev) {
      var a = ev.target.closest("[data-act]");
      if (a) {
        var act = a.getAttribute("data-act"), prof = (G.current && G.current().profile) || p;
        if (act === "vcf") { C.vcard(prof); C.toast(L("saved")); if (G.onSave) G.onSave(a); }
        else if (act === "share") C.share(prof);
        return;
      }
      if (ev.target.closest(".cm-more")) close();
    });
    function close() {
      el.classList.remove("in"); el.classList.add("out");
      document.documentElement.classList.remove("cm-on");
      setTimeout(function () { el.remove(); }, 600);
    }
    return { close: close };
  }

  /* ---------- 5. Recommendations ---------- */
  function quotes(c) {
    var qs = C.list(c.testimonials).filter(function (q) { return q && q.quote; });
    if (!qs.length) return "";
    return '<section class="glass t quotes" id="recomandari" data-in><p class="label"><b></b>' + L("quotes") + '</p><div class="q-track">' +
      qs.map(function (q) {
        var who = [q.role, q.company].filter(Boolean).join(" · ");
        return '<figure class="q"><blockquote>' + e(q.quote) + '</blockquote><figcaption><span class="q-av">' +
          (q.photo ? '<img src="' + e(C.asset(q.photo)) + '" alt="">' : e(C.initials(q.name))) + "</span><span><b>" + e(q.name) + "</b>" +
          (who ? "<small>" + e(who) + "</small>" : "") + "</span></figcaption></figure>";
      }).join("") + "</div></section>";
  }

  /* ---------- 8. Contact form (FormSubmit: delivers to the profile e-mail, no server needed) ---------- */
  function form() {
    return '<form class="cform" novalidate><p class="cf-title">' + L("formTitle") + "</p>" +
      '<input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<label><span>' + L("fName") + '</span><input name="name" required maxlength="80" autocomplete="name"></label>' +
      '<label><span>' + L("fEmail") + '</span><input name="email" type="email" required maxlength="120" autocomplete="email"></label>' +
      '<label class="wide"><span>' + L("fMsg") + '</span><textarea name="message" required maxlength="3000" rows="4"></textarea></label>' +
      '<button class="btn accent" type="submit">' + I.mail + L("fSend") + '</button><p class="cf-note" role="status" aria-live="polite"></p></form>';
  }
  function wireForm(root, c) {
    var f = root.querySelector(".cform"); if (!f) return;
    var p = c.profile || {}, note = f.querySelector(".cf-note"), btn = f.querySelector("button");
    function v(n) { return f.elements.namedItem(n).value.trim(); }
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (v("_honey")) return; // a bot filled the hidden field
      var bad = [].filter.call(f.querySelectorAll("[required]"), function (x) { return !x.value.trim() || (x.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.value.trim())); });
      f.querySelectorAll(".bad").forEach(function (x) { x.classList.remove("bad"); });
      if (bad.length) { bad.forEach(function (x) { x.closest("label").classList.add("bad"); }); bad[0].focus(); return; }
      var to = String(p.formEmail || p.email || "").trim();
      if (!to) { note.textContent = L("fErr"); return; }
      btn.disabled = true; btn.lastChild.textContent = L("fSending"); note.textContent = "";
      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(to), {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: v("name"), email: v("email"), message: v("message"),
          _subject: "Mesaj nou de pe husanudaniel.ro – " + v("name"), _replyto: v("email"), _template: "table", _captcha: "false" })
      }).then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) === "false") throw new Error(j.message || "fail"); }); })
        .then(function () {
          f.reset(); note.textContent = L("fOk"); f.classList.add("sent"); track("formular-trimis");
          if (window.WOW) window.WOW.confetti(btn);
        })
        .catch(function () { note.innerHTML = e(L("fErr")) + (p.email ? ' <a href="mailto:' + e(p.email) + '">' + e(p.email) + "</a>" : ""); })
        .then(function () { btn.disabled = false; btn.lastChild.textContent = L("fSend"); });
    });
  }

  window.MORE = { cardMode: cardMode, source: source, card: card, quotes: quotes, form: form, wireForm: wireForm, stats: stats, track: track };
})();
