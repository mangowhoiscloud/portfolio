const pptxgen = require('/opt/homebrew/lib/node_modules/pptxgenjs');
const html2pptx = require('/Users/mango/.claude/skills/pptx/scripts/html2pptx');
const path = require('path');
const fs = require('fs');

const target = process.argv[2];
if (!target) {
  console.error('Usage: node build-single.js <slide-file>');
  console.error('  e.g. node build-single.js s13-subagent.html');
  process.exit(1);
}

async function build() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  const slidesDir = path.join(__dirname, 'slides');
  const tmpDir = path.join(slidesDir, 'tmp');
  fs.mkdirSync(tmpDir, { recursive: true });

  const htmlPath = path.join(slidesDir, target);
  if (!fs.existsSync(htmlPath)) {
    console.error(`File not found: ${htmlPath}`);
    process.exit(1);
  }

  console.log(`Building single slide: ${target}`);
  await html2pptx(htmlPath, pptx, { tmpDir });

  const outName = target.replace('.html', '.pptx');
  const outFile = path.join(__dirname, outName);
  await pptx.writeFile({ fileName: outFile });
  console.log(`Saved: ${outFile}`);
}

build().catch(e => { console.error(e); process.exit(1); });
