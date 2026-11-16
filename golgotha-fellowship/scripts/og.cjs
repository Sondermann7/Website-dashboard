/** Renders public/og-default.png (1200x630 social preview) from type only - no photo, no logo redraw. */
const { chromium } = require('playwright');
const path = require('node:path');
const font = (p) => 'file://' + path.resolve(__dirname, '../node_modules', p);
const html = `<style>
@font-face{font-family:D;src:url(${font('@fontsource/dm-serif-display/files/dm-serif-display-latin-400-normal.woff2')})}
@font-face{font-family:I;src:url(${font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')});font-weight:100 900}
body{margin:0;width:1200px;height:630px;background:#182A2B;color:#FAF8F3;font-family:I;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box}
.e{color:#DCAB90;letter-spacing:.2em;font-weight:600;font-size:22px;text-transform:uppercase}
h1{font:400 104px/1.02 D;margin:26px 0 30px}
p{font-size:30px;color:#C8D3CE;margin:0;border-left:4px solid #A96F51;padding-left:24px}
</style><div class="e">Nampa, Idaho</div><h1>Golgotha Fellowship</h1><p>Bible teaching, line by line · Sundays 8:30 &amp; 10:30 AM</p>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(html); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.resolve(__dirname, '../public/og-default.png') });
  await b.close();
})();
