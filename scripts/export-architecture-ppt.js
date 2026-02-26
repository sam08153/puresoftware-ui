// Generates a PowerPoint deck from architecture-slides.md
// Usage: node scripts/export-architecture-ppt.js
(async function () {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const PptxGenJS = (await import('pptxgenjs')).default;

  const projectRoot = path.resolve(__dirname, '..', '..');
  const mdPath = path.join(projectRoot, 'architecture-slides.md');
  const outPath = path.join(projectRoot, 'architecture-slides.pptx');

  const md = fs.readFileSync(mdPath, 'utf8');
  const lines = md.split(/\r?\n/);

  const slides = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) slides.push(current);
      const raw = line.replace(/^##\s+/, '').trim();
      const title = raw.includes('–') ? raw.split('–').slice(1).join('–').trim() : raw;
      current = { title, bullets: [] };
    } else if (line.startsWith('- ')) {
      if (current) current.bullets.push(line.slice(2).trim());
    } else if (line.startsWith('  - ')) {
      if (current) current.bullets.push(line.slice(4).trim());
    }
  }
  if (current) slides.push(current);

  const pptx = new PptxGenJS();

  slides.forEach((s) => {
    const slide = pptx.addSlide();
    slide.addText(s.title, { x: 0.5, y: 0.5, fontSize: 28, bold: true });
    const text = s.bullets.map((b) => ({ text: b, options: { bullet: true, fontSize: 18 } }));
    if (text.length) {
      slide.addText(text, { x: 0.5, y: 1.2, w: 9, h: 5.5, fontSize: 18, lineSpacingMultiple: 1.1 });
    }
  });

  await pptx.writeFile({ fileName: outPath });
  console.log('Wrote:', outPath);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
