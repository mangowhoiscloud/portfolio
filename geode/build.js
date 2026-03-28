const pptxgen = require('/opt/homebrew/lib/node_modules/pptxgenjs');
const html2pptx = require('/Users/mango/.claude/skills/pptx/scripts/html2pptx');
const path = require('path');
const fs = require('fs');

async function build() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'mangowhoiscloud';
  pptx.title = 'GEODE v0.30 — Autonomous Execution Harness';

  const slidesDir = path.join(__dirname, 'slides');
  const tmpDir = path.join(__dirname, 'slides', 'tmp');
  fs.mkdirSync(tmpDir, { recursive: true });

  const slideFiles = fs.readdirSync(slidesDir)
    .filter(f => f.endsWith('.html') && f.startsWith('s'))
    .sort();

  console.log(`Building ${slideFiles.length} slides...`);

  for (const file of slideFiles) {
    const htmlPath = path.join(slidesDir, file);
    console.log(`  ${file}`);
    try {
      await html2pptx(htmlPath, pptx, { tmpDir });
    } catch (e) {
      console.error(`  ERROR in ${file}: ${e.message}`);
    }
  }

  const outFile = path.join(__dirname, 'GEODE-Portfolio-v030.pptx');
  await pptx.writeFile({ fileName: outFile });
  console.log(`\nSaved: ${outFile}`);
}

build().catch(e => { console.error(e); process.exit(1); });
