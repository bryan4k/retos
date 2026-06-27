import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = 'http://localhost:5500';
const OUT = __dirname;
const VIEWPORT = { width: 1440, height: 900 };

async function shot(page, name) {
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  console.log('Saved', path);
}

async function goHome(page) {
  await page.evaluate(() => {
    document.querySelector('#practice-back')?.click();
    document.querySelector('#reading-back')?.click();
    document.querySelector('#logic-back')?.click();
  });
  await page.waitForTimeout(400);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: VIEWPORT });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await shot(page, 'inicio');

await page.click('#enter-practice');
await page.waitForTimeout(1200);
await shot(page, 'escribir-codigo');

await goHome(page);
await page.click('#enter-reading');
await page.waitForTimeout(1200);
await shot(page, 'leer-codigo');

await goHome(page);
await page.click('#enter-logic');
await page.waitForTimeout(1500);
await shot(page, 'logica');

await browser.close();
console.log('Done');