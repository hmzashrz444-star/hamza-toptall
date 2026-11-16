import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const core = [
  'index.html',
  'src/styles/presentation.css',
  'src/scripts/presentation.js',
  'src/scripts/slide-route.js',
  'src/scripts/preview-slide.js',
  'docs/NEXT.md'
];

const localReferences = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
  .map((match) => match[1].split('?')[0])
  .filter((path) => path && !path.startsWith('http') && !path.startsWith('#'));

await Promise.all([...new Set([...core, ...localReferences])].map((path) => access(resolve(root, path))));

const [styleFiles, scriptFiles] = await Promise.all([
  readdir(resolve(root, 'src/styles/slides')),
  readdir(resolve(root, 'src/scripts/slides'))
]);

for (const file of styleFiles.filter((name) => name.endsWith('.css'))) {
  if (!html.includes(`src/styles/slides/${file}`)) throw new Error(`Slide stylesheet is not linked: ${file}`);
}
for (const file of scriptFiles.filter((name) => name.endsWith('.js'))) {
  if (!html.includes(`src/scripts/slides/${file}`)) throw new Error(`Slide script is not linked: ${file}`);
}

const slideNumbers = [...html.matchAll(/id="slide-(\d+)"/g)].map((match) => Number(match[1]));
const highestSlide = Math.max(...slideNumbers);
for (let number = 1; number <= highestSlide; number += 1) {
  if (!slideNumbers.includes(number)) throw new Error(`Missing slide ${number}`);
}

for (const marker of ['SLIDE 01 - LOCKED', 'SLIDE 04 - LOCKED', 'https://www.luckybackyards.com/', 'https://www.copperfield.com/']) {
  if (!html.includes(marker)) throw new Error(`Missing project marker: ${marker}`);
}
if (html.includes(String.fromCodePoint(0x2014))) throw new Error('Visible presentation copy must not use an em dash.');

console.log(`Validated ${highestSlide} slides and all linked project files.`);
