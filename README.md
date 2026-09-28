# LandingPageHD
Landing Page pentru HusanuDaniel.ro – carte de vizită, CV și proiecte.

## Structură
- `index.html`, `styles.css`, `app.js` – site-ul (static, fără build).
- `content.json` – **tot conținutul** (profil, experiență, competențe, proiecte…).
- `admin/` – pagină de editare optimizată pentru telefon.
- `assets/` – imagini; fișierele încărcate din admin ajung în `assets/uploads/`.

## Publicare (GitHub Pages)
1. Repo → **Settings → Pages** → *Deploy from a branch* → `main` / `(root)`.
2. Pentru domeniu propriu: introdu `husanudaniel.ro` la *Custom domain* și adaugă la registrar
   înregistrările DNS indicate de GitHub (A către IP-urile GitHub Pages sau CNAME către `daniad24.github.io`).

## Editare de pe telefon
1. Creează un token: GitHub → Settings → Developer settings → **Fine-grained tokens** →
   *Only select repositories* = acest repo, *Permissions → Contents* = **Read and write**.
2. Deschide `https://husanudaniel.ro/admin/` (nu e legat de nicăieri de pe site, îl deschizi direct), lipește tokenul.
3. Modifică, apasă **Salvează**. Se face un commit în `content.json`, iar site-ul se actualizează în ~1 minut.

### Login cu utilizator și parolă (opțional)
După ce ai intrat o dată cu tokenul, deschide secțiunea **Utilizator și parolă** din admin și setează-le.
Tokenul se salvează **criptat** (AES-GCM, cheie derivată din user + parolă cu PBKDF2) în `admin/auth.json`.
De acum intri doar cu user și parolă. Fișierul e public, deci folosește o parolă lungă și unică.
Dacă uiți parola: intră cu tokenul („Intră cu token GitHub”) și setează alta.

Tokenul rămâne doar în browserul dispozitivului tău. Nu-l partaja. Dacă pierzi telefonul, revocă-l din GitHub.
Branch-ul editat implicit este `main` (se poate schimba la „Setări avansate”).

## Rulare locală
```sh
python3 -m http.server 8000
# http://localhost:8000
```
