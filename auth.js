const Auth = (function () {
  'use strict';

  const USERS_KEY = 'coderetos-users';
  const SESSION_KEY = 'coderetos-session';
  const SALT_LEN = 16;
  const ITERATIONS = 120000;

  const DATA_KEYS = [
    'coderetos-progress',
    'coderetos-reading-progress',
    'coderetos-logic-progress',
    'coderetos-code',
    'coderetos-logic-code',
    'coderetos-levels-plan',
    'coderetos-reading-levels-plan',
    'coderetos-logic-levels-plan',
    'coderetos-sidebar-state',
    'coderetos-attempts'
  ];

  let currentUser = null;
  const listeners = new Set();

  function emit() {
    listeners.forEach((fn) => fn(currentUser));
  }

  function onAuthChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function isLoggedIn() {
    return !!currentUser;
  }

  function getUsername() {
    return currentUser;
  }

  function userKey(base) {
    return currentUser ? `${base}::${currentUser}` : base;
  }

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function toBase64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }

  function fromBase64(str) {
    return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  }

  async function hashPassword(password, saltB64) {
    const enc = new TextEncoder();
    const salt = saltB64 ? fromBase64(saltB64) : crypto.getRandomValues(new Uint8Array(SALT_LEN));
    const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
      key,
      256
    );
    return { hash: toBase64(bits), salt: toBase64(salt) };
  }

  function validateUsername(username) {
    const u = (username || '').trim().toLowerCase();
    if (u.length < 3 || u.length > 24) return { ok: false, error: 'El usuario debe tener entre 3 y 24 caracteres.' };
    if (!/^[a-z0-9_]+$/.test(u)) return { ok: false, error: 'Solo letras minúsculas, números y guión bajo.' };
    return { ok: true, username: u };
  }

  function validatePassword(password) {
    if (!password || password.length < 4) return { ok: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
    return { ok: true };
  }

  function migrateGuestToUser(username) {
    DATA_KEYS.forEach((base) => {
      const guestRaw = localStorage.getItem(base);
      const userKeyName = `${base}::${username}`;
      if (guestRaw && !localStorage.getItem(userKeyName)) {
        localStorage.setItem(userKeyName, guestRaw);
      }
    });
  }

  async function register(username, password) {
    const vu = validateUsername(username);
    if (!vu.ok) return vu;
    const vp = validatePassword(password);
    if (!vp.ok) return vp;

    const users = loadUsers();
    if (users[vu.username]) return { ok: false, error: 'Ese usuario ya existe.' };

    const { hash, salt } = await hashPassword(password);
    users[vu.username] = { hash, salt, createdAt: Date.now() };
    saveUsers(users);
    migrateGuestToUser(vu.username);
    return login(vu.username, password);
  }

  async function login(username, password) {
    const vu = validateUsername(username);
    if (!vu.ok) return vu;
    const vp = validatePassword(password);
    if (!vp.ok) return vp;

    const users = loadUsers();
    const user = users[vu.username];
    if (!user) return { ok: false, error: 'Usuario o contraseña incorrectos.' };

    const { hash } = await hashPassword(password, user.salt);
    if (hash !== user.hash) return { ok: false, error: 'Usuario o contraseña incorrectos.' };

    currentUser = vu.username;
    localStorage.setItem(SESSION_KEY, currentUser);
    emit();
    return { ok: true, username: currentUser };
  }

  function logout() {
    currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    emit();
  }

  function restoreSession() {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    const users = loadUsers();
    if (!users[saved]) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    currentUser = saved;
    emit();
    return currentUser;
  }

  function listUsernames() {
    return Object.keys(loadUsers()).sort();
  }

  return {
    register,
    login,
    logout,
    restoreSession,
    isLoggedIn,
    getUsername,
    userKey,
    onAuthChange,
    listUsernames,
    validateUsername,
    validatePassword
  };
})();