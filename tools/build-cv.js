// Regenerates assets/cv/Daniel-Husanu-CV-RO.pdf and -EN.pdf from designs/cv/ (which reads content.json + content.en.json).
// Usage: from the repo root, start a static server (python3 -m http.server 8765), then: node tools/build-cv.js
// Needs Playwright (npm i -D playwright, or a global install).
const path = require('path');
const { chromium } = require('playwright');

async function build({ base = 'http://localhost:8765', setup, executablePath } = {}) {
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const ctx = await browser.newContext();
  if (setup) await setup(ctx);
  const page = await ctx.newPage();
  for (const lang of ['ro', 'en']) {
    await page.goto(`${base}/designs/cv/?lang=${lang}`);
    await page.waitForFunction(() => window.cvReady === true, null, { timeout: 20000 });
    const out = path.join(__dirname, '..', 'assets', 'cv', `Daniel-Husanu-CV-${lang.toUpperCase()}.pdf`);
    await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log('wrote', path.relative(process.cwd(), out));
  }
  await browser.close();
}

if (require.main === module) build({ base: process.argv[2] }).catch(e => { console.error(e); process.exit(1); });
module.exports = build;
