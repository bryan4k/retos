import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5500';
const USER = `test_${Date.now().toString(36)}`;
const PASS = 'test1234';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });

    // Sin sesión: tarjetas bloqueadas
    const practiceDisabled = await page.locator('#enter-practice').isDisabled();
    if (!practiceDisabled) throw new Error('enter-practice debería estar deshabilitado sin sesión');

    // Crear cuenta
    await page.fill('#auth-username', USER);
    await page.fill('#auth-password', PASS);
    await page.click('#auth-register');
    await page.waitForTimeout(800);

    const errorVisible = await page.locator('#auth-error').isVisible();
    if (errorVisible) {
      const err = await page.locator('#auth-error').textContent();
      throw new Error(`Registro falló: ${err}`);
    }

    const barVisible = await page.locator('#auth-user-bar').isVisible();
    if (!barVisible) throw new Error('Barra de sesión no visible tras registro');

    const displayName = await page.locator('#auth-username-display').textContent();
    if (displayName !== USER) throw new Error(`Usuario mostrado incorrecto: ${displayName}`);

    // Con sesión: tarjetas habilitadas
    const practiceEnabled = await page.locator('#enter-practice').isEnabled();
    if (!practiceEnabled) throw new Error('enter-practice debería estar habilitado con sesión');

    await page.click('#enter-practice');
    await page.waitForSelector('#app-practice:not([hidden])', { timeout: 5000 });

    // Cerrar sesión desde la app
    await page.click('#practice-session .session-logout');
    await page.waitForTimeout(500);
    const homeVisible = await page.locator('#screen-home').isVisible();
    if (!homeVisible) throw new Error('Debería volver al inicio tras logout');

    const lockedAgain = await page.locator('#enter-practice').isDisabled();
    if (!lockedAgain) throw new Error('Tarjetas deberían bloquearse tras logout');

    // Login con la misma cuenta
    await page.fill('#auth-username', USER);
    await page.fill('#auth-password', PASS);
    await page.click('#auth-login');
    await page.waitForTimeout(800);

    const loginErr = await page.locator('#auth-error').isVisible();
    if (loginErr) {
      const err = await page.locator('#auth-error').textContent();
      throw new Error(`Login falló: ${err}`);
    }

    await page.click('#enter-logic');
    await page.waitForSelector('#app-logic:not([hidden])', { timeout: 5000 });

    console.log('OK: auth register, login, gate y logout funcionan');
    console.log(`Usuario de prueba: ${USER}`);
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(1);
});