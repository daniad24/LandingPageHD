(function () {
  "use strict";

  var DEFAULTS = { owner: "daniad24", repo: "LandingPageHD", branch: "main" };
  var CONTENT_PATH = "content.json";
  var UPLOAD_DIR = "assets/uploads";

  var LABELS = {
    profile: "Profil / carte de vizită", name: "Nume", title: "Titlu", tagline: "Descriere scurtă",
    location: "Locație", photo: "Poză profil", email: "Email", phone: "Telefon",
    whatsapp: "WhatsApp (doar cifre, cu prefix țară)", website: "Website", availability: "Disponibilitate (gol = ascuns)",
    cvFile: "CV (PDF)", social: "Rețele sociale", label: "Etichetă", url: "Link",
    about: "Despre mine", stats: "Cifre", value: "Valoare",
    experience: "Experiență", role: "Funcție", company: "Companie", period: "Perioadă", description: "Descriere",
    education: "Educație", institution: "Instituție",
    skills: "Competențe", group: "Categorie", items: "Elemente",
    projects: "Proiecte", tags: "Etichete", link: "Link", image: "Imagine",
    footer: "Text subsol"
  };
  var TEMPLATES = {
    social: { label: "", url: "" },
    stats: { value: "", label: "" },
    experience: { role: "", company: "", period: "", description: "" },
    education: { title: "", institution: "", period: "" },
    skills: { group: "", items: [] },
    projects: { title: "", description: "", tags: [], link: "", image: "" },
    items: "", tags: ""
  };
  var MULTILINE = { about: 1, description: 1, tagline: 1 };
  var FILE_FIELDS = { photo: "image/*", image: "image/*", cvFile: "application/pdf" };

  var cfg = {}, data = null, sha = null, dirty = false;

  function $(s) { return document.querySelector(s); }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function label(k) { return LABELS[k] || k; }
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function blank(v) {
    if (Array.isArray(v)) return [];
    if (v && typeof v === "object") {
      var o = {}; Object.keys(v).forEach(function (k) { o[k] = blank(v[k]); }); return o;
    }
    return typeof v === "string" ? "" : v;
  }

  // ---- storage ----
  function loadCfg() {
    try { cfg = JSON.parse(localStorage.getItem("admin-cfg") || "{}"); } catch (e) { cfg = {}; }
    ["owner", "repo", "branch"].forEach(function (k) { cfg[k] = cfg[k] || DEFAULTS[k]; });
  }
  function saveCfg() { try { localStorage.setItem("admin-cfg", JSON.stringify(cfg)); } catch (e) {} }

  // ---- GitHub API ----
  function api(path, opts) {
    opts = opts || {};
    return fetch("https://api.github.com/repos/" + cfg.owner + "/" + cfg.repo + "/contents/" + path +
      (opts.method ? "" : "?ref=" + encodeURIComponent(cfg.branch)), {
      method: opts.method || "GET",
      cache: "no-store",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + cfg.token,
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.message || ("HTTP " + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }
  function b64ToUtf8(b64) {
    var bin = atob(b64.replace(/\s/g, ""));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function bytesToB64(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function putFile(path, b64, message, prevSha) {
    var body = { message: message, content: b64, branch: cfg.branch };
    if (prevSha) body.sha = prevSha;
    return api(path, { method: "PUT", body: body });
  }

  // ---- user/password login: the token is stored AES-GCM encrypted in admin/auth.json ----
  var AUTH_PATH = "admin/auth.json";
  var KDF_ITER = 600000;
  function b64ToBytes(b64) { var s = atob(b64); var u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; }
  var NO_CRYPTO_MSG = "Login-ul cu parolă merge doar pe https://. Deschide pagina cu https:// sau intră cu tokenul.";
  function deriveKey(user, pass, salt, iter) {
    // crypto.subtle only exists on secure (https) pages.
    if (!window.crypto || !window.crypto.subtle) return Promise.reject(new Error(NO_CRYPTO_MSG));
    var enc = new TextEncoder();
    return crypto.subtle.importKey("raw", enc.encode(user.trim().toLowerCase() + "\n" + pass), "PBKDF2", false, ["deriveKey"])
      .then(function (base) {
        return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: iter, hash: "SHA-256" },
          base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
      });
  }
  function encryptAuth(user, pass, payload) {
    var salt = crypto.getRandomValues(new Uint8Array(16));
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return deriveKey(user, pass, salt, KDF_ITER).then(function (key) {
      return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, new TextEncoder().encode(JSON.stringify(payload)));
    }).then(function (ct) {
      return { v: 1, iter: KDF_ITER, salt: bytesToB64(salt), iv: bytesToB64(iv), data: bytesToB64(new Uint8Array(ct)) };
    });
  }
  function decryptAuth(auth, user, pass) {
    return deriveKey(user, pass, b64ToBytes(auth.salt), auth.iter).then(function (key) {
      return crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToBytes(auth.iv) }, key, b64ToBytes(auth.data));
    }).then(function (pt) { return JSON.parse(new TextDecoder().decode(pt)); });
  }
  function fetchAuth() {
    return fetch("auth.json", { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  // ---- UI state ----
  function setStatus(msg) { $("#status").textContent = msg; }
  function markDirty() { dirty = true; $("#save").disabled = false; setStatus("Modificări nesalvate"); }
  function show(view) {
    $("#loginView").hidden = view !== "login";
    $("#editorView").hidden = view !== "editor";
    $("#savebar").hidden = view !== "editor";
    $("#logout").hidden = view !== "editor";
  }
  function errMsg(e) {
    if (e.status === 401) return "Token invalid sau expirat.";
    if (e.status === 403 || e.status === 404) return "Tokenul nu are acces la " + cfg.owner + "/" + cfg.repo + " (verifică permisiunile Contents).";
    if (e.status === 409) return "Conținutul a fost modificat între timp. Apasă Reîncarcă.";
    return e.message;
  }

  function load() {
    setStatus("Se încarcă…");
    return api(CONTENT_PATH).then(function (j) {
      sha = j.sha;
      data = JSON.parse(b64ToUtf8(j.content));
      dirty = false;
      $("#save").disabled = true;
      $("#who").textContent = cfg.owner + "/" + cfg.repo + " · " + cfg.branch;
      buildForm();
      show("editor");
      setStatus("Nicio modificare");
    });
  }

  function save() {
    var btn = $("#save");
    btn.disabled = true;
    setStatus("Se salvează…");
    var text = JSON.stringify(data, null, 2) + "\n";
    return putFile(CONTENT_PATH, bytesToB64(new TextEncoder().encode(text)), "Actualizare conținut din pagina de editare", sha)
      .then(function (j) {
        sha = j.content.sha;
        dirty = false;
        setStatus("Salvat ✓ Site-ul se actualizează în ~1 minut.");
      })
      .catch(function (e) { btn.disabled = false; setStatus("Eroare: " + errMsg(e)); });
  }

  // ---- uploads ----
  function resizeImage(file) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var max = 1400, s = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error("Conversie eșuată")); }, "image/jpeg", 0.85);
      };
      img.onerror = function () { reject(new Error("Imagine invalidă")); };
      img.src = URL.createObjectURL(file);
    });
  }
  function upload(file) {
    var isImg = /^image\//.test(file.type) && file.type !== "image/svg+xml" && file.type !== "image/gif";
    var base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "fisier";
    var ext = isImg ? "jpg" : (file.name.split(".").pop() || "bin").toLowerCase();
    var path = UPLOAD_DIR + "/" + Date.now() + "-" + base + "." + ext;
    return (isImg ? resizeImage(file) : Promise.resolve(file))
      .then(function (blob) { return blob.arrayBuffer(); })
      .then(function (buf) { return putFile(path, bytesToB64(new Uint8Array(buf)), "Încărcare " + path); })
      .then(function () { return path; });
  }
  function previewSrc(p) { return /^(https?:)?\/\//.test(p) || p.charAt(0) === "/" ? p : "../" + p; }

  // ---- form builder ----
  function stringField(parent, key, wrap) {
    var val = parent[key] == null ? "" : String(parent[key]);
    var input;
    if (MULTILINE[key] || val.indexOf("\n") > -1) {
      input = el("textarea", { rows: key === "about" ? 7 : 3 });
    } else {
      input = el("input", { type: key === "email" ? "email" : key === "phone" ? "tel" : "text" });
    }
    input.value = val;
    input.addEventListener("input", function () { parent[key] = input.value; markDirty(); if (wrap) wrap(); });

    if (!FILE_FIELDS[key]) return el("label", { text: label(key) }, [input]);

    var thumb = FILE_FIELDS[key] === "image/*" ? el("img", { class: "thumb", alt: "" }) : null;
    function refreshThumb() { if (thumb) { thumb.src = input.value ? previewSrc(input.value) : ""; thumb.style.visibility = input.value ? "" : "hidden"; } }
    refreshThumb();
    input.addEventListener("input", refreshThumb);
    var picker = el("input", { type: "file", accept: FILE_FIELDS[key], hidden: "" });
    var btn = el("button", { type: "button", class: "btn", text: "Încarcă", onclick: function () { picker.click(); } });
    picker.addEventListener("change", function () {
      var f = picker.files[0]; if (!f) return;
      btn.disabled = true; btn.textContent = "Se încarcă…";
      upload(f).then(function (path) {
        input.value = path; parent[key] = path; refreshThumb(); markDirty();
        setStatus("Fișier încărcat. Apasă Salvează.");
      }).catch(function (e) { setStatus("Eroare la încărcare: " + errMsg(e)); })
        .then(function () { btn.disabled = false; btn.textContent = "Încarcă"; picker.value = ""; });
    });
    input.type = "text";
    return el("label", { text: label(key) }, [el("div", { class: "upload-row" }, [thumb, input, btn, picker])]);
  }

  function stringList(parent, key) {
    var box = el("div", { class: "str-list" });
    function draw() {
      box.innerHTML = "";
      parent[key].forEach(function (v, i) {
        var input = el("input", { type: "text" });
        input.value = v;
        input.addEventListener("input", function () { parent[key][i] = input.value; markDirty(); });
        box.appendChild(el("div", { class: "row" }, [input,
          el("button", { type: "button", class: "tool danger", title: "Șterge", text: "✕",
            onclick: function () { parent[key].splice(i, 1); markDirty(); draw(); } })]));
      });
      box.appendChild(el("button", { type: "button", class: "btn add", text: "+ Adaugă",
        onclick: function () { parent[key].push(""); markDirty(); draw(); box.querySelectorAll("input")[parent[key].length - 1].focus(); } }));
    }
    draw();
    return el("div", {}, [el("label", { text: label(key) }), box]);
  }

  function itemTitle(o, i) {
    var first = Object.keys(o).map(function (k) { return o[k]; }).filter(function (v) { return typeof v === "string" && v.trim(); })[0];
    return first || ("Element " + (i + 1));
  }

  function objectList(parent, key) {
    var box = el("div");
    var open = {};
    function draw() {
      box.innerHTML = "";
      var arr = parent[key];
      arr.forEach(function (item, i) {
        var titleSpan = el("span", { text: itemTitle(item, i) });
        function retitle() { titleSpan.textContent = itemTitle(item, i); }
        function tool(txt, title, fn, cls) {
          return el("button", { type: "button", class: "tool " + (cls || ""), title: title, text: txt,
            onclick: function (ev) { ev.preventDefault(); ev.stopPropagation(); fn(); markDirty(); draw(); } });
        }
        var tools = el("span", { class: "item-tools" }, [
          i > 0 ? tool("↑", "Mută sus", function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); }) : null,
          i < arr.length - 1 ? tool("↓", "Mută jos", function () { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); }) : null,
          tool("✕", "Șterge", function () { if (confirm("Ștergi „" + itemTitle(item, i) + "”?")) arr.splice(i, 1); }, "danger")
        ]);
        var det = el("details", { class: "item" }, [el("summary", {}, [titleSpan, tools])]);
        if (open[i]) det.open = true;
        det.addEventListener("toggle", function () { open[i] = det.open; });
        Object.keys(item).forEach(function (k) { det.appendChild(field(item, k, retitle)); });
        box.appendChild(det);
      });
      box.appendChild(el("button", { type: "button", class: "btn add", text: "+ Adaugă",
        onclick: function () {
          var tpl = TEMPLATES[key] !== undefined ? clone(TEMPLATES[key]) : blank(arr[0] || {});
          arr.push(tpl); open = {}; open[arr.length - 1] = true; markDirty(); draw();
        } }));
    }
    draw();
    return box;
  }

  function field(parent, key, onChange) {
    var v = parent[key];
    if (Array.isArray(v)) {
      var isStrings = v.length ? typeof v[0] === "string" : typeof TEMPLATES[key] === "string";
      return isStrings ? stringList(parent, key) : el("div", {}, [el("label", { text: label(key) }), objectList(parent, key)]);
    }
    if (v && typeof v === "object") {
      var box = el("div");
      Object.keys(v).forEach(function (k) { box.appendChild(field(v, k, onChange)); });
      return box;
    }
    return stringField(parent, key, onChange);
  }

  function buildForm() {
    var form = $("#form");
    form.innerHTML = "";
    Object.keys(data).forEach(function (key, idx) {
      var v = data[key];
      var isObjList = Array.isArray(v) && (v.length ? typeof v[0] !== "string" : typeof TEMPLATES[key] !== "string");
      var body = isObjList ? objectList(data, key) : field(data, key);
      var group = el("details", { class: "card group" }, [el("summary", { text: label(key) }), body]);
      if (idx === 0) group.open = true;
      form.appendChild(group);
    });
  }

  // ---- wiring ----
  loadCfg();
  $("#owner").value = cfg.owner; $("#repo").value = cfg.repo; $("#branch").value = cfg.branch;

  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    cfg.token = $("#token").value.trim();
    cfg.owner = $("#owner").value.trim() || DEFAULTS.owner;
    cfg.repo = $("#repo").value.trim() || DEFAULTS.repo;
    cfg.branch = $("#branch").value.trim() || DEFAULTS.branch;
    $("#loginError").textContent = "";
    load().then(saveCfg).catch(function (err) { $("#loginError").textContent = errMsg(err); });
  });
  $("#logout").addEventListener("click", function () {
    if (dirty && !confirm("Ai modificări nesalvate. Ieși oricum?")) return;
    delete cfg.token; saveCfg(); data = null; $("#token").value = ""; $("#who").textContent = ""; showLogin();
  });
  $("#save").addEventListener("click", save);
  $("#reload").addEventListener("click", function () {
    if (dirty && !confirm("Renunți la modificările nesalvate?")) return;
    load().catch(function (e) { setStatus("Eroare: " + errMsg(e)); });
  });
  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  var authBlob = null;
  function showLogin() {
    show("login");
    $("#passForm").hidden = !authBlob;
    $("#loginForm").hidden = !!authBlob;
  }
  $("#useToken").addEventListener("click", function (e) {
    e.preventDefault(); $("#passForm").hidden = true; $("#loginForm").hidden = false;
  });

  $("#passForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = e.target.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Se verifică…";
    $("#passError").textContent = "";
    decryptAuth(authBlob, $("#user").value, $("#pass").value)
      .then(function (p) {
        cfg.token = p.token; cfg.owner = p.owner || cfg.owner; cfg.repo = p.repo || cfg.repo; cfg.branch = p.branch || cfg.branch;
        return load().then(saveCfg).catch(function (err) { $("#passError").textContent = errMsg(err); });
      }, function (err) {
        $("#passError").textContent = err && err.message === NO_CRYPTO_MSG ? NO_CRYPTO_MSG : "Utilizator sau parolă greșite.";
      })
      .then(function () { btn.disabled = false; btn.textContent = "Intră"; $("#pass").value = ""; });
  });

  $("#credForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("#credMsg"), user = $("#newUser").value, pass = $("#newPass").value;
    if (pass !== $("#newPass2").value) { msg.textContent = "Parolele nu coincid."; return; }
    msg.textContent = "Se criptează și se salvează…";
    encryptAuth(user, pass, { token: cfg.token, owner: cfg.owner, repo: cfg.repo, branch: cfg.branch })
      .then(function (blob) {
        var text = JSON.stringify(blob, null, 2) + "\n";
        return api(AUTH_PATH).then(function (j) { return j.sha; }, function (err) { if (err.status === 404) return null; throw err; })
          .then(function (prev) { return putFile(AUTH_PATH, bytesToB64(new TextEncoder().encode(text)), "Actualizare date de login", prev); })
          .then(function () { authBlob = blob; });
      })
      .then(function () {
        msg.textContent = "Salvat ✓ De acum poți intra cu utilizator și parolă (activ în ~1 minut).";
        e.target.reset();
      })
      .catch(function (err) { msg.textContent = "Eroare: " + errMsg(err); });
  });

  fetchAuth().then(function (a) {
    authBlob = a && a.data ? a : null;
    if (cfg.token) {
      load().catch(function (err) { showLogin(); $(authBlob ? "#passError" : "#loginError").textContent = errMsg(err); });
    } else {
      showLogin();
    }
  });
})();
