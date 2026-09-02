/**
 * Writes a minimal one-page placeholder at public/resume.pdf so the hero link
 * is never a 404 during development.
 *
 * Replace public/resume.pdf with your real resume before deploying. Do not run
 * this script again afterwards — it will overwrite it.
 *
 *   node scripts/make-placeholder-resume.mjs
 */
import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, '..', 'public', 'resume.pdf');

if (existsSync(target) && !process.argv.includes('--force')) {
  console.log('public/resume.pdf already exists — leaving it alone.');
  console.log('Pass --force to overwrite with the placeholder.');
  process.exit(0);
}

const lines = [
  ['R V Chandan', 24, 700],
  ['Placeholder resume', 14, 668],
  ['Replace public/resume.pdf with the real PDF before deploying.', 11, 640],
  ['chandanrv97@gmail.com', 11, 620],
];

const content =
  'BT\n' +
  lines
    .map(
      ([text, size, y]) =>
        `/F1 ${size} Tf 1 0 0 1 72 ${y} Tm (${String(text).replace(
          /([()\\])/g,
          '\\$1',
        )}) Tj`,
    )
    .join('\n') +
  '\nET\n';

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
  `<< /Length ${content.length} >>\nstream\n${content}endstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
];

let pdf = '%PDF-1.4\n';
const offsets = [];

objects.forEach((body, i) => {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefStart = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets) {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

writeFileSync(target, pdf, 'latin1');
console.log(`Wrote placeholder → ${target}`);
