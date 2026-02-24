// ============================================================
// helpers.js — Utilidades de testing
// ============================================================

import { CONFIG, STATE } from './config.js';

const VERBOSE = process.env.VERBOSE === 'true';

// ─── Colores para consola ─────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

// ─── HTTP Client con timeout ──────────────────────────────────
export async function request(method, path, { body, token, headers: extraHeaders, timeout } = {}) {
  const url = path.startsWith('http') ? path : `${CONFIG.BASE_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout || CONFIG.REQUEST_TIMEOUT_MS);

  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  if (token) {
    headers['Cookie'] = token;
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      redirect: 'manual',
    });

    clearTimeout(timeoutId);

    let data = null;
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      try {
        data = await res.text();
      } catch {
        data = null;
      }
    }

    return {
      status: res.status,
      headers: res.headers,
      data,
      ok: res.ok,
      redirected: res.status >= 300 && res.status < 400,
      location: res.headers.get('location'),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`TIMEOUT: ${method} ${path} excedió ${CONFIG.REQUEST_TIMEOUT_MS}ms`);
    }
    throw err;
  }
}

// ─── Login y obtener cookie de sesión ─────────────────────────
export async function login(email, password) {
  // Primero obtener el CSRF token y sus cookies
  const csrfRes = await fetch(`${CONFIG.BASE_URL}/api/auth/csrf`, {
    redirect: 'manual',
  });
  const csrfData = await csrfRes.json().catch(() => ({}));
  const csrfToken = csrfData.csrfToken || '';

  // Recoger cookies del CSRF request
  const csrfCookies = csrfRes.headers.getSetCookie?.() || [];
  const csrfCookieStr = csrfCookies.map(c => c.split(';')[0]).join('; ');

  // Hacer login via NextAuth credentials (form-urlencoded, como lo hace el browser)
  const loginRes = await fetch(`${CONFIG.BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': csrfCookieStr,
    },
    body: new URLSearchParams({
      email,
      password,
      csrfToken,
      json: 'true',
    }),
    redirect: 'manual',
  });

  // Recoger cookies de la respuesta del callback (incluye callback-url, csrf-token)
  const allCookies = new Map();
  for (const c of csrfCookies) {
    const [nameVal] = c.split(';');
    const [name] = nameVal.split('=');
    allCookies.set(name.trim(), nameVal.trim());
  }
  const callbackCookies = loginRes.headers.getSetCookie?.() || [];
  for (const c of callbackCookies) {
    const [nameVal] = c.split(';');
    const [name] = nameVal.split('=');
    allCookies.set(name.trim(), nameVal.trim());
  }

  // Seguir la cadena de redirects para obtener el session-token
  let location = loginRes.headers.get('location');
  let cookieHeader = [...allCookies.values()].join('; ');

  const MAX_REDIRECTS = 5;
  for (let i = 0; i < MAX_REDIRECTS && location; i++) {
    // Resolver URL relativa
    const redirectUrl = location.startsWith('http')
      ? location
      : new URL(location, CONFIG.BASE_URL).toString();

    const redirectRes = await fetch(redirectUrl, {
      method: 'GET',
      headers: { 'Cookie': cookieHeader },
      redirect: 'manual',
    });

    // Recoger nuevas cookies (aquí viene el session-token)
    const newCookies = redirectRes.headers.getSetCookie?.() || [];
    for (const c of newCookies) {
      const [nameVal] = c.split(';');
      const [name] = nameVal.split('=');
      allCookies.set(name.trim(), nameVal.trim());
    }

    cookieHeader = [...allCookies.values()].join('; ');
    location = redirectRes.headers.get('location');
  }

  // Filtrar solo cookies de next-auth relevantes
  const finalCookies = [...allCookies.values()]
    .filter(c => c.includes('next-auth'))
    .join('; ');

  if (finalCookies && finalCookies.includes('session-token')) {
    return finalCookies;
  }

  // Fallback: retornar todas las cookies recolectadas
  return cookieHeader || null;
}

// ─── Assertion helpers ────────────────────────────────────────
export class AssertionError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'AssertionError';
    this.details = details;
  }
}

export function assert(condition, message, details = null) {
  if (!condition) {
    throw new AssertionError(message, details);
  }
}

export function assertEqual(actual, expected, label = '') {
  if (actual !== expected) {
    throw new AssertionError(
      `${label}: esperado ${JSON.stringify(expected)}, recibido ${JSON.stringify(actual)}`,
      { actual, expected }
    );
  }
}

export function assertIncludes(arr, value, label = '') {
  if (!Array.isArray(arr) || !arr.includes(value)) {
    throw new AssertionError(
      `${label}: ${JSON.stringify(value)} no encontrado en array`,
      { array: arr, value }
    );
  }
}

export function assertStatus(res, expectedStatus, label = '') {
  if (res.status !== expectedStatus) {
    throw new AssertionError(
      `${label}: Status esperado ${expectedStatus}, recibido ${res.status}`,
      { status: res.status, body: typeof res.data === 'object' ? JSON.stringify(res.data).slice(0, 300) : String(res.data).slice(0, 300) }
    );
  }
}

export function assertOk(res, label = '') {
  if (!res.ok) {
    throw new AssertionError(
      `${label}: Request falló con status ${res.status}`,
      { status: res.status, body: typeof res.data === 'object' ? JSON.stringify(res.data).slice(0, 500) : String(res.data).slice(0, 500) }
    );
  }
}

export function assertHasProperty(obj, prop, label = '') {
  if (obj === null || obj === undefined || !(prop in obj)) {
    throw new AssertionError(
      `${label}: propiedad "${prop}" no encontrada en objeto`,
      { keys: obj ? Object.keys(obj) : 'null/undefined' }
    );
  }
}

export function assertType(value, type, label = '') {
  if (typeof value !== type) {
    throw new AssertionError(
      `${label}: tipo esperado "${type}", recibido "${typeof value}"`,
      { value }
    );
  }
}

export function assertArrayNotEmpty(arr, label = '') {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new AssertionError(
      `${label}: array vacío o no es array`,
      { value: arr }
    );
  }
}

export function assertGreaterThan(actual, expected, label = '') {
  if (actual <= expected) {
    throw new AssertionError(
      `${label}: esperado > ${expected}, recibido ${actual}`,
      { actual, expected }
    );
  }
}

// ─── Test Runner ──────────────────────────────────────────────
let _totalPassed = 0;
let _totalFailed = 0;
let _totalSkipped = 0;
let _failures = [];

export function getResults() {
  return {
    passed: _totalPassed,
    failed: _totalFailed,
    skipped: _totalSkipped,
    failures: _failures,
  };
}

export function resetResults() {
  _totalPassed = 0;
  _totalFailed = 0;
  _totalSkipped = 0;
  _failures = [];
}

export async function runTestModule(moduleName, testFn) {
  console.log(`\n${C.bold}${C.cyan}${'═'.repeat(70)}${C.reset}`);
  console.log(`${C.bold}${C.cyan}  📋 ${moduleName}${C.reset}`);
  console.log(`${C.cyan}${'═'.repeat(70)}${C.reset}\n`);

  try {
    await testFn();
  } catch (err) {
    console.log(`\n  ${C.red}💥 ERROR FATAL en módulo: ${err.message}${C.reset}`);
    if (VERBOSE) console.log(`  ${C.gray}${err.stack}${C.reset}`);
    _totalFailed++;
    _failures.push({ module: moduleName, test: 'MODULE_CRASH', error: err.message });
  }
}

export async function test(name, fn) {
  const start = Date.now();
  try {
    await fn();
    const elapsed = Date.now() - start;
    const slow = elapsed > CONFIG.SLOW_TEST_THRESHOLD_MS;
    const timeStr = slow ? `${C.yellow}${elapsed}ms ⚠️ LENTO${C.reset}` : `${C.gray}${elapsed}ms${C.reset}`;
    console.log(`  ${C.green}✅ PASS${C.reset} ${name} ${C.dim}(${timeStr})${C.reset}`);
    _totalPassed++;
  } catch (err) {
    const elapsed = Date.now() - start;
    console.log(`  ${C.red}❌ FAIL${C.reset} ${name} ${C.dim}(${elapsed}ms)${C.reset}`);
    console.log(`     ${C.red}→ ${err.message}${C.reset}`);
    if (err.details && VERBOSE) {
      console.log(`     ${C.gray}Detalles: ${JSON.stringify(err.details).slice(0, 400)}${C.reset}`);
    }
    _totalFailed++;
    _failures.push({ test: name, error: err.message, details: err.details });
  }
}

export async function testSkip(name, reason = '') {
  console.log(`  ${C.yellow}⏭️  SKIP${C.reset} ${name}${reason ? ` ${C.dim}(${reason})${C.reset}` : ''}`);
  _totalSkipped++;
}

// ─── Cleanup helper ───────────────────────────────────────────
export async function cleanup() {
  console.log(`\n${C.magenta}🧹 Limpiando datos de prueba...${C.reset}`);

  const token = STATE.ownerToken;
  if (!token) {
    console.log(`  ${C.yellow}⚠️ No hay token de owner, no se puede limpiar${C.reset}`);
    return;
  }

  // Eliminar scores primero (dependencias)
  for (const id of STATE.cleanupIds.scores) {
    try {
      await request('DELETE', `/api/scores/${id}`, { token });
    } catch { /* ignore */ }
  }

  // Eliminar atletas (cascada elimina scores restantes)
  for (const id of STATE.cleanupIds.athletes) {
    try {
      await request('DELETE', `/api/athletes/${id}`, { token });
    } catch { /* ignore */ }
  }

  // Eliminar WODs
  for (const id of STATE.cleanupIds.wods) {
    try {
      await request('DELETE', `/api/wods/${id}`, { token });
    } catch { /* ignore */ }
  }

  // Eliminar admin users
  for (const id of STATE.cleanupIds.adminUsers) {
    try {
      await request('DELETE', `/api/admin/users/${id}`, { token });
    } catch { /* ignore */ }
  }

  console.log(`  ${C.green}✅ Limpieza completada${C.reset}`);
}

// ─── Report final ─────────────────────────────────────────────
export function printReport() {
  const { passed, failed, skipped, failures } = getResults();
  const total = passed + failed + skipped;

  console.log(`\n${C.bold}${'═'.repeat(70)}${C.reset}`);
  console.log(`${C.bold}  📊 REPORTE FINAL DE PRUEBAS${C.reset}`);
  console.log(`${'═'.repeat(70)}`);
  console.log(`  Total:    ${total}`);
  console.log(`  ${C.green}Pasadas:  ${passed}${C.reset}`);
  console.log(`  ${C.red}Fallidas: ${failed}${C.reset}`);
  console.log(`  ${C.yellow}Omitidas: ${skipped}${C.reset}`);
  console.log(`  Tasa:     ${total > 0 ? ((passed / (total - skipped)) * 100).toFixed(1) : 0}%`);

  if (failures.length > 0) {
    console.log(`\n${C.bold}${C.red}  ❌ PRUEBAS FALLIDAS:${C.reset}`);
    console.log(`${'─'.repeat(70)}`);
    failures.forEach((f, i) => {
      console.log(`  ${i + 1}. ${C.red}${f.test}${C.reset}`);
      console.log(`     ${C.gray}→ ${f.error}${C.reset}`);
      if (f.details) {
        console.log(`     ${C.gray}  ${JSON.stringify(f.details).slice(0, 300)}${C.reset}`);
      }
    });
  }

  console.log(`\n${'═'.repeat(70)}`);

  if (failed === 0) {
    console.log(`\n  ${C.green}${C.bold}🎉 ¡TODAS LAS PRUEBAS PASARON! La aplicación está lista.${C.reset}\n`);
  } else {
    console.log(`\n  ${C.red}${C.bold}⚠️  HAY ${failed} PRUEBA(S) FALLIDA(S). Se requieren correcciones.${C.reset}\n`);
  }

  return failed;
}

// ─── Utilidad: esperar ────────────────────────────────────────
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
