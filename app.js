(function () {
  'use strict';

  const PROGRESS_KEY = 'coderetos-progress';
  const READING_PROGRESS_KEY = 'coderetos-reading-progress';
  const LOGIC_PROGRESS_KEY = 'coderetos-logic-progress';
  const CODE_KEY = 'coderetos-code';
  const LOGIC_CODE_KEY = 'coderetos-logic-code';
  const LEVELS_PLAN_KEY = 'coderetos-levels-plan';
  const READING_LEVELS_PLAN_KEY = 'coderetos-reading-levels-plan';
  const LOGIC_LEVELS_PLAN_KEY = 'coderetos-logic-levels-plan';
  const SIDEBAR_STATE_KEY = 'coderetos-sidebar-state';
  const HIDE_COMPLETED_KEY = 'coderetos-hide-completed';
  const ATTEMPTS_KEY = 'coderetos-attempts';
  const LIST_LIMIT = 40;

  let editor = null;
  let logicEditor = null;
  let activeApp = null;

  let progress = {};
  let readingProgress = {};
  let logicProgress = {};
  let savedCode = {};
  let savedLogicCode = {};
  let attempts = {};
  let practiceLevels = defaultLevelsPlan();
  let readingLevels = defaultLevelsPlan();
  let logicLevels = defaultLevelsPlan();
  const sidebarCollapsed = { 'practice-sidebar': false, 'reading-sidebar': false, 'logic-sidebar': false };

  const practice = { current: null, level: 'all', tech: 'all', search: '', levelsPlan: practiceLevels, hideCompleted: true };
  const reading = { current: null, selected: null, level: 'all', tech: 'all', search: '', levelsPlan: readingLevels, hideCompleted: true };
  const logic = { current: null, level: 'all', tech: 'logica', search: '', levelsPlan: logicLevels, hideCompleted: true };

  const $ = (sel) => document.querySelector(sel);

  function loadJSON(key, fb) {
    try { return JSON.parse(localStorage.getItem(key)) || fb; } catch { return fb; }
  }

  function sk(key) {
    return Auth.userKey(key);
  }

  function persistJSON(key, data) {
    localStorage.setItem(sk(key), JSON.stringify(data));
  }

  function reloadUserData() {
    progress = loadJSON(sk(PROGRESS_KEY), {});
    readingProgress = loadJSON(sk(READING_PROGRESS_KEY), {});
    logicProgress = loadJSON(sk(LOGIC_PROGRESS_KEY), {});
    savedCode = loadJSON(sk(CODE_KEY), {});
    savedLogicCode = loadJSON(sk(LOGIC_CODE_KEY), {});
    attempts = loadJSON(sk(ATTEMPTS_KEY), {});
    practiceLevels = loadLevelsPlan(LEVELS_PLAN_KEY);
    readingLevels = loadLevelsPlan(READING_LEVELS_PLAN_KEY);
    logicLevels = loadLevelsPlan(LOGIC_LEVELS_PLAN_KEY);
    practice.levelsPlan = practiceLevels;
    reading.levelsPlan = readingLevels;
    logic.levelsPlan = logicLevels;
    const hideDone = loadHideCompleted();
    practice.hideCompleted = hideDone;
    reading.hideCompleted = hideDone;
    logic.hideCompleted = hideDone;
    loadSidebarState();
    updateHideCompletedToggles();
    updateAuthUI();
    updateHomeStats();
    if (activeApp === 'practice') { renderPracticeList(); updatePracticeStats(); }
    else if (activeApp === 'reading') { renderReadingList(); updateReadingStats(); }
    else if (activeApp === 'logic') { renderLogicList(); updateLogicStats(); }
  }

  function defaultLevelsPlan() {
    return { principiante: true, intermedio: true, avanzado: true, experto: true };
  }

  function loadLevelsPlan(key) {
    const stored = loadJSON(sk(key), null);
    if (stored && typeof stored === 'object') return { ...defaultLevelsPlan(), ...stored };
    return defaultLevelsPlan();
  }

  function getAppState(app) {
    if (app === 'practice') return practice;
    if (app === 'logic') return logic;
    return reading;
  }

  function getAppPool(app) {
    if (app === 'practice') return CHALLENGES;
    if (app === 'logic') return LOGIC_CHALLENGES;
    return READING_CHALLENGES;
  }

  function refreshAppLists(app) {
    if (app === 'practice') { renderPracticeList(); updatePracticeStats(); }
    else if (app === 'logic') { renderLogicList(); updateLogicStats(); }
    else { renderReadingList(); updateReadingStats(); }
  }

  function loadHideCompleted() {
    const v = localStorage.getItem(sk(HIDE_COMPLETED_KEY));
    if (v === null) return true;
    return v !== 'false';
  }

  function saveHideCompleted(value) {
    localStorage.setItem(sk(HIDE_COMPLETED_KEY), value ? 'true' : 'false');
  }

  function isHidingCompleted(state) {
    return state.hideCompleted !== false;
  }

  function shouldShowInList(c, prog, currentId, state) {
    if (!isHidingCompleted(state)) return true;
    return !prog[c.id] || c.id === currentId;
  }

  function updateHideCompletedToggles() {
    ['practice', 'reading', 'logic'].forEach((app) => {
      const btn = $(`#${app}-toggle-completed`);
      const state = getAppState(app);
      if (!btn) return;
      const hiding = isHidingCompleted(state);
      btn.classList.toggle('active', hiding);
      btn.textContent = hiding ? 'Ocultar completados' : 'Mostrar completados';
    });
  }

  function toggleHideCompleted(app) {
    const state = getAppState(app);
    state.hideCompleted = !isHidingCompleted(state);
    practice.hideCompleted = state.hideCompleted;
    reading.hideCompleted = state.hideCompleted;
    logic.hideCompleted = state.hideCompleted;
    saveHideCompleted(state.hideCompleted);
    updateHideCompletedToggles();
    refreshAppLists(app);
  }

  function advanceToNextChallenge(app) {
    const state = getAppState(app);
    if (!isHidingCompleted(state)) return;
    const pool = getAppPool(app);
    const prog = app === 'practice' ? progress : app === 'logic' ? logicProgress : readingProgress;
    const next = UnlockManager.firstUnlocked(app, pool, state.levelsPlan, prog);
    if (!next) return;
    if (app === 'practice') selectPractice(next.id);
    else if (app === 'logic') selectLogic(next.id);
    else selectReading(next.id);
  }

  function saveLevelsPlan(app) {
    const key = app === 'practice' ? LEVELS_PLAN_KEY
      : app === 'logic' ? LOGIC_LEVELS_PLAN_KEY : READING_LEVELS_PLAN_KEY;
    persistJSON(key, getAppState(app).levelsPlan);
  }

  function recordAttempt(id) {
    attempts[id] = (attempts[id] || 0) + 1;
    persistJSON(ATTEMPTS_KEY, attempts);
  }

  function showHintModal(text) {
    if (!text) return;
    $('#hint-content').textContent = text;
    Glossary.applyTo($('#hint-content'));
    $('#hint-modal').hidden = false;
  }

  function showSolutionModal(solution, tech) {
    if (!solution) return;
    if (!confirm('¿Ver la solución completa? Intenta primero con la pista si aún no lo has hecho.')) return;
    const isCode = /[{};<>]|def |function |return /.test(solution);
    $('#solution-content').innerHTML = isCode
      ? `<pre class="solution-code"><code>${escapeHtml(solution)}</code></pre>`
      : `<div class="hint-body">${escapeHtml(solution)}</div>`;
    Glossary.applyTo($('#solution-content'));
    $('#solution-modal').hidden = false;
  }

  function loadSidebarState() {
    const stored = loadJSON(sk(SIDEBAR_STATE_KEY), {});
    Object.keys(sidebarCollapsed).forEach((id) => {
      sidebarCollapsed[id] = !!stored[id];
      applySidebarCollapse(id, sidebarCollapsed[id]);
    });
  }

  function saveSidebarState() {
    persistJSON(SIDEBAR_STATE_KEY, { ...sidebarCollapsed });
  }

  function applySidebarCollapse(id, collapsed) {
    const el = $(`#${id}`);
    if (!el) return;
    el.classList.toggle('collapsed', collapsed);
    const btn = el.querySelector('.sidebar-collapse');
    if (btn) btn.textContent = collapsed ? '▶' : '◀';
    const layout = el.closest('.layout');
    if (layout) layout.classList.toggle('sidebar-is-collapsed', collapsed);
  }

  function toggleSidebarCollapse(id) {
    sidebarCollapsed[id] = !sidebarCollapsed[id];
    applySidebarCollapse(id, sidebarCollapsed[id]);
    saveSidebarState();
    refreshEditor();
    refreshLogicEditor();
  }

  function requireAuth() {
    if (Auth.isLoggedIn()) return true;
    showToast('Debes iniciar sesión o crear una cuenta para acceder a los retos', 'info');
    $('#auth-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    $('#auth-username')?.focus();
    return false;
  }

  function updateAuthUI() {
    const logged = Auth.isLoggedIn();
    const bar = $('#auth-user-bar');
    const form = $('#auth-form');
    if (!bar || !form) return;
    if (logged) {
      bar.hidden = false;
      form.hidden = true;
      $('#auth-username-display').textContent = Auth.getUsername();
      $('#auth-avatar').textContent = Auth.getUsername().charAt(0).toUpperCase();
    } else {
      bar.hidden = true;
      form.hidden = false;
    }

    document.querySelector('.home-cards')?.classList.toggle('home-cards-locked', !logged);
    ['enter-practice', 'enter-reading', 'enter-logic'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) btn.disabled = !logged;
    });

    ['practice', 'reading', 'logic'].forEach((app) => {
      const el = $(`#${app}-session`);
      const userEl = $(`#${app}-session-user`);
      if (!el || !userEl) return;
      if (logged) {
        el.hidden = false;
        userEl.textContent = Auth.getUsername();
      } else {
        el.hidden = true;
      }
    });
  }

  function handleLogout() {
    Auth.logout();
    reloadUserData();
    goHome();
    showToast('Sesión cerrada', 'info');
  }

  async function handleAuthSubmit(e) {
    e.preventDefault();
    const username = $('#auth-username').value;
    const password = $('#auth-password').value;
    const errEl = $('#auth-error');
    const result = await Auth.login(username, password);
    if (!result.ok) {
      errEl.textContent = result.error;
      errEl.hidden = false;
      return;
    }
    errEl.hidden = true;
    reloadUserData();
    showToast(`Bienvenido, ${result.username}`, 'success');
  }

  async function handleAuthRegister() {
    const username = $('#auth-username').value;
    const password = $('#auth-password').value;
    const errEl = $('#auth-error');
    const result = await Auth.register(username, password);
    if (!result.ok) {
      errEl.textContent = result.error;
      errEl.hidden = false;
      return;
    }
    errEl.hidden = true;
    reloadUserData();
    showToast(`Cuenta creada. ¡Hola, ${result.username}!`, 'success');
  }

  function isInPlan(c, levelsPlan) {
    return levelsPlan[c.level] !== false;
  }

  function getPlanPool(pool, levelsPlan) {
    return pool.filter((c) => isInPlan(c, levelsPlan));
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function formatInputs(inputs) {
    if (!inputs) return '';
    return Object.entries(inputs)
      .map(([k, v]) => `<span class="input-pair"><strong>${escapeHtml(k)}</strong> = ${escapeHtml(String(v))}</span>`)
      .join('');
  }

  function renderTraceTable(trace) {
    if (!trace?.length) return '';
    const varKeys = new Set();
    trace.forEach((row) => {
      if (row.vars) Object.keys(row.vars).forEach((k) => varKeys.add(k));
    });
    const cols = [...varKeys];
    const head = ['Paso', 'Instrucción', ...cols, 'Salida'];
    const body = trace.map((row) => {
      const cells = [
        row.paso,
        row.instruccion,
        ...cols.map((k) => row.vars?.[k] ?? '—'),
        row.salida ?? '—'
      ];
      return `<tr>${cells.map((c) => `<td>${escapeHtml(String(c))}</td>`).join('')}</tr>`;
    }).join('');
    return `<div class="trace-table-wrap"><table class="trace-table"><thead><tr>${head.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function matchesSearch(c, q) {
    if (!q) return true;
    const t = q.toLowerCase();
    return c.title.toLowerCase().includes(t) || c.id.toLowerCase().includes(t) ||
      (c.scenario && c.scenario.toLowerCase().includes(t));
  }

  function showToast(msg, type = 'info') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    $('#toast-container').appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }

  function goHome() {
    activeApp = null;
    $('#screen-home').hidden = false;
    $('#app-practice').hidden = true;
    $('#app-reading').hidden = true;
    $('#app-logic').hidden = true;
    document.body.classList.remove('in-practice', 'in-reading', 'in-logic');
  }

  function enterPractice() {
    if (!requireAuth()) return;
    activeApp = 'practice';
    $('#screen-home').hidden = true;
    $('#app-practice').hidden = false;
    $('#app-reading').hidden = true;
    $('#app-logic').hidden = true;
    document.body.classList.add('in-practice');
    document.body.classList.remove('in-reading', 'in-logic');
    renderLevelPlan('practice');
    renderPracticeList();
    updatePracticeStats();
    if (!practice.current) {
      const first = UnlockManager.firstUnlocked('practice', CHALLENGES, practice.levelsPlan, progress);
      if (first) selectPractice(first.id);
    }
    refreshEditor();
  }

  function enterReading() {
    if (!requireAuth()) return;
    activeApp = 'reading';
    $('#screen-home').hidden = true;
    $('#app-practice').hidden = true;
    $('#app-reading').hidden = false;
    $('#app-logic').hidden = true;
    document.body.classList.add('in-reading');
    document.body.classList.remove('in-practice', 'in-logic');
    reading.tech = 'all';
    reading.current = null;
    reading.selected = null;
    renderLevelPlan('reading');
    renderFilters('reading', reading, READING_CHALLENGES);
    renderReadingList();
    updateReadingStats();
    const pick = UnlockManager.firstUnlocked('reading', READING_CHALLENGES, reading.levelsPlan, readingProgress);
    if (pick) selectReading(pick.id);
  }

  function enterLogic() {
    if (!requireAuth()) return;
    activeApp = 'logic';
    $('#screen-home').hidden = true;
    $('#app-practice').hidden = true;
    $('#app-reading').hidden = true;
    $('#app-logic').hidden = false;
    document.body.classList.add('in-logic');
    document.body.classList.remove('in-practice', 'in-reading');
    logic.current = null;
    renderLevelPlan('logic');
    renderLogicFilters();
    renderLogicList();
    updateLogicStats();
    Runners.loadPyodide().catch(() => {});
    const pick = UnlockManager.firstUnlocked('logic', LOGIC_CHALLENGES, logic.levelsPlan, logicProgress);
    if (pick) selectLogic(pick.id);
    refreshLogicEditor();
  }

  function refreshEditor() {
    if (!editor) return;
    requestAnimationFrame(() => {
      editor.refresh();
    });
  }

  function initEditor() {
    editor = CodeMirror.fromTextArea($('#code-editor'), {
      mode: 'javascript', theme: 'dracula', lineNumbers: true, tabSize: 2,
      lineWrapping: true, autofocus: true, indentWithTabs: false
    });
    EditorHints.bindEditor(editor, {
      'Ctrl-Enter': runPracticeTests,
      'Cmd-Enter': runPracticeTests
    });
    editor.on('change', () => {
      if (practice.current) {
        savedCode[practice.current.id] = editor.getValue();
        persistJSON(CODE_KEY, savedCode);
        if (Runners.needsPreview(practice.current.tech)) updatePracticePreview();
      }
    });
  }

  function refreshLogicEditor() {
    if (!logicEditor) return;
    requestAnimationFrame(() => logicEditor.refresh());
  }

  function initLogicEditor() {
    logicEditor = CodeMirror.fromTextArea($('#logic-editor'), {
      mode: 'python', theme: 'dracula', lineNumbers: true, tabSize: 4,
      lineWrapping: true, indentWithTabs: false
    });
    EditorHints.bindEditor(logicEditor, {
      'Ctrl-Enter': runLogicTests,
      'Cmd-Enter': runLogicTests
    });
    logicEditor.on('change', () => {
      if (logic.current) {
        savedLogicCode[logic.current.id] = logicEditor.getValue();
        persistJSON(LOGIC_CODE_KEY, savedLogicCode);
      }
    });
  }

  function renderLevelPlan(app) {
    const state = getAppState(app);
    const el = $(`#${app}-level-plan`);
    const levels = Object.entries(LEVELS).sort((a, b) => a[1].order - b[1].order);

    el.innerHTML = levels.map(([id, lvl]) => {
      const on = state.levelsPlan[id] !== false;
      return `<button type="button" class="level-plan-chip${on ? ' active' : ''}" data-level="${id}" data-app="${app}"
        style="--level-color:${lvl.color}">
        <span class="level-dot" style="background:${lvl.color}"></span>${lvl.label}</button>`;
    }).join('');

    el.onclick = (e) => {
      const btn = e.target.closest('[data-level]');
      if (!btn || btn.dataset.app !== app) return;
      const levelId = btn.dataset.level;
      const activeCount = Object.values(state.levelsPlan).filter(Boolean).length;

      if (state.levelsPlan[levelId] !== false && activeCount <= 1) {
        showToast('Debes tener al menos un nivel activo', 'info');
        return;
      }

      state.levelsPlan[levelId] = !state.levelsPlan[levelId];
      saveLevelsPlan(app);
      renderLevelPlan(app);
      updatePlanSummary(app);
      refreshAppLists(app);

      const cur = getAppState(app).current;
      if (cur && !isInPlan(cur, state.levelsPlan)) {
        const pool = getAppPool(app);
        const prog = app === 'practice' ? progress : app === 'logic' ? logicProgress : readingProgress;
        const first = UnlockManager.firstUnlocked(app, pool, state.levelsPlan, prog);
        getAppState(app).current = null;
        if (first) {
          if (app === 'practice') selectPractice(first.id);
          else if (app === 'logic') selectLogic(first.id);
          else selectReading(first.id);
        }
      }
    };

    updatePlanSummary(app);
  }

  function updatePlanSummary(app) {
    const state = getAppState(app);
    const pool = getAppPool(app);
    const active = Object.entries(LEVELS).filter(([id]) => state.levelsPlan[id] !== false);
    const inPlan = getPlanPool(pool, state.levelsPlan);
    const label = app === 'logic' ? 'ejercicios' : 'retos';
    $(`#${app}-plan-summary`).textContent =
      `${active.length} nivel${active.length !== 1 ? 'es' : ''} · ${inPlan.length} ${label} en tu plan`;
  }

  function renderLogicFilters() {
    const levelEl = $('#logic-level-filters');
    const levelChips = [{ id: 'all', label: 'Todos' },
      ...Object.entries(LEVELS).sort((a, b) => a[1].order - b[1].order)
        .filter(([id]) => logic.levelsPlan[id] !== false)
        .map(([id, l]) => ({ id, label: l.label }))];
    levelEl.innerHTML = levelChips.map((c) => `
      <button class="filter-chip${logic.level === c.id ? ' active' : ''}" data-level="${c.id}">${c.label}</button>`).join('');
    levelEl.onclick = (e) => {
      const b = e.target.closest('[data-level]');
      if (!b) return;
      logic.level = b.dataset.level;
      renderLogicFilters();
      renderLogicList();
    };
  }

  function renderFilters(app, state, pool) {
    const prefix = app;
    const techEl = $(`#${prefix}-tech-filters`);
    const levelEl = $(`#${prefix}-level-filters`);

    const techChips = [{ id: 'all', label: 'Todas', icon: '🧩' },
      ...Object.entries(TECHNOLOGIES).filter(([, t]) => !t.deskTest).map(([id, t]) => ({ id, label: t.label, icon: t.icon }))];
    techEl.innerHTML = techChips.map((c) => `
      <button class="filter-chip tech-chip${state.tech === c.id ? ' active' : ''}" data-tech="${c.id}"
        style="${c.id !== 'all' ? `--chip-color:${TECHNOLOGIES[c.id]?.color}` : ''}">${c.icon} ${c.label}</button>`).join('');
    techEl.onclick = (e) => {
      const b = e.target.closest('[data-tech]');
      if (!b) return;
      state.tech = b.dataset.tech;
      renderFilters(app, state, pool);
      refreshAppLists(app);
    };

    const levelChips = [{ id: 'all', label: 'Todos' },
      ...Object.entries(LEVELS).sort((a, b) => a[1].order - b[1].order)
        .filter(([id]) => state.levelsPlan[id] !== false)
        .map(([id, l]) => ({ id, label: l.label }))];
    levelEl.innerHTML = levelChips.map((c) => `
      <button class="filter-chip${state.level === c.id ? ' active' : ''}" data-level="${c.id}">${c.label}</button>`).join('');
    levelEl.onclick = (e) => {
      const b = e.target.closest('[data-level]');
      if (!b) return;
      state.level = b.dataset.level;
      renderFilters(app, state, pool);
      refreshAppLists(app);
    };
  }

  function getVisible(pool, state) {
    return pool.filter((c) => {
      if (!isInPlan(c, state.levelsPlan)) return false;
      if (state.level !== 'all' && c.level !== state.level) return false;
      if (state.tech !== 'all' && c.tech !== state.tech) return false;
      if (!matchesSearch(c, state.search)) return false;
      return true;
    });
  }

  function renderList(app, pool, prog, state, listId) {
    const visible = getVisible(pool, state);
    const currentId = state.current?.id;
    const listItems = visible.filter((c) => shouldShowInList(c, prog, currentId, state));

    if (!visible.length) {
      $(listId).innerHTML = `<div class="empty-sidebar">Sin retos. <button class="btn-link" data-reset="${app}">Activar más niveles</button></div>`;
      $(`[data-reset="${app}"]`)?.addEventListener('click', () => {
        Object.keys(state.levelsPlan).forEach((k) => { state.levelsPlan[k] = true; });
        saveLevelsPlan(app);
        renderLevelPlan(app);
        renderFilters(app, state, pool);
        refreshAppLists(app);
      });
      return;
    }

    if (!listItems.length) {
      const doneCount = visible.filter((c) => prog[c.id]).length;
      const label = app === 'logic' ? 'ejercicios' : 'retos';
      $(listId).innerHTML = `<div class="empty-sidebar empty-sidebar-done">
        <span class="empty-sidebar-icon">🎉</span>
        <p>¡Completaste ${doneCount} ${label} en esta vista!</p>
        <button type="button" class="btn-link" data-show-completed="${app}">Ver completados</button>
      </div>`;
      $(`[data-show-completed="${app}"]`)?.addEventListener('click', () => toggleHideCompleted(app));
      return;
    }

    const techEntries = app === 'logic'
      ? [['logica', TECHNOLOGIES.logica]]
      : Object.entries(TECHNOLOGIES).filter(([, t]) => !t.deskTest);

    const grouped = techEntries.map(([techId, tech]) => {
      const levels = Object.entries(LEVELS).sort((a, b) => a[1].order - b[1].order)
        .filter(([levelId]) => state.levelsPlan[levelId] !== false)
        .map(([levelId, level]) => {
          const items = listItems.filter((c) => c.tech === techId && c.level === levelId);
          return items.length ? { levelId, level, items } : null;
        }).filter(Boolean);
      return levels.length ? { techId, tech, levels } : null;
    }).filter(Boolean);

    if (!grouped.length) {
      $(listId).innerHTML = `<div class="empty-sidebar empty-sidebar-done">
        <span class="empty-sidebar-icon">🎉</span>
        <p>¡Todo completado en los filtros actuales!</p>
        <button type="button" class="btn-link" data-show-completed="${app}">Ver completados</button>
      </div>`;
      $(`[data-show-completed="${app}"]`)?.addEventListener('click', () => toggleHideCompleted(app));
      return;
    }

    $(listId).innerHTML = grouped.map((g) => `
      <div class="tech-group"><div class="tech-group-title">${g.tech.icon} ${g.tech.label}</div>
      ${g.levels.map((lg) => {
        const shown = lg.items.slice(0, LIST_LIMIT);
        const more = lg.items.length - shown.length;
        const doneInGroup = lg.items.filter((c) => prog[c.id]).length;
        return `<div class="level-group">
          <div class="level-group-title"><span class="level-dot" style="background:${lg.level.color}"></span>
            ${lg.level.label} <span class="count-badge">${lg.items.length}</span>
            <span class="group-progress">${doneInGroup}/${lg.items.length}</span></div>
          ${shown.map((c) => renderRow(c, prog, currentId, app)).join('')}
          ${more > 0 ? `<p class="more-hint">+${more} más — usa búsqueda</p>` : ''}
        </div>`;
      }).join('')}</div>`).join('');

    $(listId).querySelectorAll('.challenge-item:not([disabled])').forEach((btn) => {
      btn.onclick = () => {
        if (app === 'practice') selectPractice(btn.dataset.id);
        else if (app === 'logic') selectLogic(btn.dataset.id);
        else selectReading(btn.dataset.id);
      };
    });
  }

  function renderRow(c, prog, currentId, app) {
    const done = prog[c.id];
    const active = currentId === c.id;
    const unlocked = UnlockManager.isUnlocked(app, c, prog);
    const locked = !unlocked;
    const lockTitle = locked ? escapeHtml(UnlockManager.nextLockedReason(app, c, prog) || '') : '';
    return `<div class="challenge-row${active ? ' active' : ''}${done ? ' completed' : ''}${locked ? ' locked' : ''}">
      <button class="challenge-item full-width" data-id="${c.id}" ${locked ? 'disabled title="' + lockTitle + '"' : ''}>
        <span class="challenge-status${locked ? ' locked-icon' : ''}">${done ? '✓' : locked ? '🔒' : '○'}</span>
        <span class="challenge-name">${escapeHtml(c.title)}</span>
      </button></div>`;
  }

  function renderPracticeList() {
    renderList('practice', CHALLENGES, progress, practice, '#practice-challenge-list');
    updatePlanSummary('practice');
  }

  function renderReadingList() {
    renderList('reading', READING_CHALLENGES, readingProgress, reading, '#reading-challenge-list');
    updatePlanSummary('reading');
  }

  function renderLogicList() {
    renderList('logic', LOGIC_CHALLENGES, logicProgress, logic, '#logic-challenge-list');
    updatePlanSummary('logic');
  }

  function selectLogic(id) {
    const c = LOGIC_CHALLENGES.find((x) => x.id === id);
    if (!c || !isInPlan(c, logic.levelsPlan)) return;
    if (!UnlockManager.isUnlocked('logic', c, logicProgress)) {
      showToast(UnlockManager.nextLockedReason('logic', c, logicProgress) || 'Completa el ejercicio anterior.', 'info');
      return;
    }
    logic.current = c;

    $('#logic-level-badge').textContent = LEVELS[c.level].label;
    $('#logic-level-badge').className = `level-badge ${c.level}`;
    $('#logic-title').textContent = c.title;

    const scenario = c.scenario ? `<div class="scenario-banner">${escapeHtml(c.scenario)}</div>` : '';
    const learn = c.learn ? `<div class="learn-block learn-block-full">${LearnContent.renderHtml(c.learn)}</div>` : '';
    const problem = `<div class="problem-block"><h4>📋 Problema</h4><p>${escapeHtml(c.problem)}</p></div>`;
    const approach = `<div class="approach-block"><h4>🧭 Cómo resolverlo</h4><p>${escapeHtml(c.approach)}</p></div>`;
    const pseudo = `<div class="pseint-block"><h4>📜 Algoritmo PSeInt</h4>
      <div class="pseint-inputs"><span class="pseint-inputs-label">Datos de entrada:</span>${formatInputs(c.inputs)}</div>
      <pre class="pseint-code"><code>${escapeHtml(c.pseudocode)}</code></pre></div>`;
    $('#logic-description').innerHTML = `<div class="description-content">${scenario}${problem}${approach}${pseudo}${learn}
      <p class="read-tip">💡 Traduce el pseudocódigo a Python en el editor. Haz una prueba de escritorio en papel si quieres, luego <strong>ejecuta los tests</strong>.</p></div>`;
    Glossary.applyTo($('#logic-description'));

    logicEditor.setValue(savedLogicCode[c.id] || c.starterCode);
    logicEditor.clearHistory();

    $('#logic-btn-run').disabled = false;
    $('#logic-btn-reset').disabled = false;
    $('#logic-btn-hint').disabled = !c.hint;
    $('#logic-btn-solution').disabled = !c.solution;
    $('#logic-btn-learn').disabled = !c.learn;
    $('#logic-results').innerHTML = '<div class="empty-state small"><p>Escribe tu solución y ejecuta los tests.</p></div>';
    $('#logic-results-summary').textContent = '';

    renderLogicList();
    closeSidebar('logic-sidebar');
    refreshLogicEditor();
  }

  async function runLogicTests() {
    const c = logic.current;
    if (!c) return;
    const btn = $('#logic-btn-run');
    btn.disabled = true;
    btn.textContent = 'Ejecutando...';

    try {
      const result = await LogicRunner.runCodeTest(c, logicEditor.getValue());
      const results = [result];
      const ok = result.pass;

      $('#logic-results-summary').textContent = ok ? '1/1' : '0/1';
      $('#logic-results-summary').className = `results-summary ${ok ? 'pass' : 'fail'}`;

      const banner = ok
        ? '<div class="success-banner"><span class="emoji">🎉</span><div><h4>¡Completado!</h4><p>Tu programa produce la salida correcta.</p></div></div>'
        : '';

      $('#logic-results').innerHTML = banner + `<div class="test-results">${results.map((r) => `
        <div class="test-item ${r.pass ? 'pass' : 'fail'}"><span class="test-icon">${r.pass ? '✓' : '✗'}</span>
        <div class="test-details"><div class="test-name">${escapeHtml(r.name)}</div>
        ${r.expected != null ? `<div class="test-io">Esperado: <span class="expected">${escapeHtml(r.expected)}</span>${!r.pass && r.actual ? `<br>Obtuviste: <span class="got">${escapeHtml(r.actual)}</span>` : ''}</div>` : ''}
        ${r.error ? `<div class="test-error">${escapeHtml(r.error)}</div>` : ''}
        ${!r.pass ? renderFeedbackCard(r.feedback || c.feedback?.general) : ''}</div></div>`).join('')}</div>`;

      if (!ok && c.traceTable?.length) {
        $('#logic-results').innerHTML += `<div class="trace-section trace-section-answer"><h4>📊 Prueba de escritorio de referencia</h4><p class="trace-hint">Si te trabaste, revisa paso a paso cómo debería ejecutarse el algoritmo:</p>${renderTraceTable(c.traceTable)}</div>`;
      }

      Glossary.applyTo($('#logic-results'));

      if (ok) {
        logicProgress[c.id] = true;
        persistJSON(LOGIC_PROGRESS_KEY, logicProgress);
        updateLogicStats();
        renderLogicList();
        showToast('¡Ejercicio completado! 🎉', 'success');
        advanceToNextChallenge('logic');
      } else {
        recordAttempt(c.id);
      }
    } catch (err) {
      $('#logic-results-summary').textContent = 'Error';
      $('#logic-results-summary').className = 'results-summary fail';
      $('#logic-results').innerHTML = `<div class="test-item fail"><span class="test-icon">✗</span><div class="test-details">
        <div class="test-name">Error de ejecución</div><div class="test-error">${escapeHtml(err.message)}</div>
        ${renderFeedbackCard(err.compileFeedback || c.feedback?.code)}</div></div>`;
      Glossary.applyTo($('#logic-results'));
    }

    btn.disabled = false;
    btn.textContent = 'Ejecutar tests';
  }

  function updateLogicStats() {
    const inPlan = getPlanPool(LOGIC_CHALLENGES, logic.levelsPlan);
    const done = inPlan.filter((c) => logicProgress[c.id]).length;
    const pct = inPlan.length ? Math.round((done / inPlan.length) * 100) : 0;
    $('#logic-completed').textContent = done;
    $('#logic-total').textContent = inPlan.length;
    $('#logic-percent').textContent = `${pct}%`;
    $('#logic-ring').setAttribute('stroke-dasharray', `${pct}, 100`);
    updateHomeStats();
  }

  function selectPractice(id) {
    const c = CHALLENGES.find((x) => x.id === id);
    if (!c || !isInPlan(c, practice.levelsPlan)) return;
    if (!UnlockManager.isUnlocked('practice', c, progress)) {
      showToast(UnlockManager.nextLockedReason('practice', c, progress) || 'Completa el reto anterior.', 'info');
      return;
    }
    practice.current = c;

    $('#practice-tech-badge').textContent = TECHNOLOGIES[c.tech].label;
    $('#practice-tech-badge').className = `tech-badge ${c.tech}`;
    $('#practice-level-badge').textContent = LEVELS[c.level].label;
    $('#practice-level-badge').className = `level-badge ${c.level}`;
    $('#practice-title').textContent = c.title;

    const scenario = c.scenario ? `<div class="scenario-banner">${escapeHtml(c.scenario)}</div>` : '';
    const learn = c.learn ? `<div class="learn-block learn-block-full">${LearnContent.renderHtml(c.learn)}</div>` : '';
    $('#practice-description').innerHTML = `<div class="description-content">${scenario}${c.description}${learn}</div>`;
    Glossary.applyTo($('#practice-description'));

    editor.setOption('mode', TECHNOLOGIES[c.tech]?.editorMode || 'javascript');
    $('#practice-editor-lang').textContent = TECHNOLOGIES[c.tech]?.label;
    editor.setValue(savedCode[c.id] || c.starterCode);
    editor.clearHistory();

    const showPrev = Runners.needsPreview(c.tech);
    $('#practice-preview').hidden = !showPrev;
    $('#app-practice .panels').classList.toggle('has-preview', showPrev);
    if (showPrev) updatePracticePreview();

    $('#practice-btn-run').disabled = false;
    $('#practice-btn-reset').disabled = false;
    $('#practice-btn-hint').disabled = !c.hint;
    $('#practice-btn-solution').disabled = !c.solution;
    $('#practice-btn-learn').disabled = !c.learn;
    $('#practice-results').innerHTML = `<div class="empty-state small"><p>Ejecuta los tests.</p></div>`;
    $('#practice-results-summary').textContent = '';

    renderPracticeList();
    closeSidebar('practice-sidebar');
    refreshEditor();
    if (c.tech === 'python') Runners.loadPyodide().catch(() => {});
  }

  function updatePracticePreview() {
    if (practice.current && Runners.needsPreview(practice.current.tech))
      Runners.renderPreview(practice.current, editor.getValue(), $('#practice-preview-content'));
  }

  function renderFeedbackCard(fb) {
    if (!fb) return '';
    return `<div class="feedback-card">
      <div class="feedback-row"><span class="feedback-label">❓ Por qué falló</span><p>${escapeHtml(fb.why)}</p></div>
      <div class="feedback-row"><span class="feedback-label">🔧 Cómo corregirlo</span><p>${escapeHtml(fb.fix)}</p></div>
      ${fb.whenToUse ? `<div class="feedback-row"><span class="feedback-label">💡 Cuándo usarlo</span><p>${escapeHtml(fb.whenToUse)}</p></div>` : ''}</div>`;
  }

  async function runPracticeTests() {
    const c = practice.current;
    if (!c) return;
    const btn = $('#practice-btn-run');
    btn.disabled = true; btn.textContent = 'Ejecutando...';
    try {
      const results = await Runners.run(c, editor.getValue());
      const passed = results.filter((r) => r.pass).length;
      const ok = passed === results.length;
      $('#practice-results-summary').textContent = `${passed}/${results.length}`;
      $('#practice-results-summary').className = `results-summary ${ok ? 'pass' : 'fail'}`;
      const banner = ok ? `<div class="success-banner"><span class="emoji">🎉</span><div><h4>¡Completado!</h4></div></div>` : '';
      $('#practice-results').innerHTML = banner + `<div class="test-results">${results.map((r) => `
        <div class="test-item ${r.pass ? 'pass' : 'fail'}"><span class="test-icon">${r.pass ? '✓' : '✗'}</span>
        <div class="test-details"><div class="test-name">${escapeHtml(r.name)}</div>
        ${r.input ? `<div class="test-io">Esperado: <span class="expected">${escapeHtml(r.expected)}</span>${!r.pass ? `<br>Obtuviste: <span class="got">${escapeHtml(r.actual)}</span>` : ''}</div>` : ''}
        ${r.error ? `<div class="test-error">${escapeHtml(r.error)}</div>` : ''}${!r.pass ? renderFeedbackCard(r.feedback) : ''}</div></div>`).join('')}</div>`;
      Glossary.applyTo($('#practice-results'));
      if (ok) {
        progress[c.id] = true;
        persistJSON(PROGRESS_KEY, progress);
        updatePracticeStats(); renderPracticeList();
        showToast('¡Reto completado! 🎉', 'success');
        advanceToNextChallenge('practice');
      } else {
        recordAttempt(c.id);
      }
    } catch (err) {
      recordAttempt(c.id);
      $('#practice-results-summary').textContent = 'Error';
      $('#practice-results-summary').className = 'results-summary fail';
      const fb = err.compileFeedback || c.feedback?.general;
      $('#practice-results').innerHTML = `<div class="test-item fail"><span class="test-icon">✗</span><div class="test-details">
        <div class="test-name">Error</div><div class="test-error">${escapeHtml(err.message)}</div>${renderFeedbackCard(fb)}</div></div>`;
      Glossary.applyTo($('#practice-results'));
    }
    btn.disabled = false; btn.textContent = 'Ejecutar tests';
  }

  function updatePracticeStats() {
    const inPlan = getPlanPool(CHALLENGES, practice.levelsPlan);
    const done = inPlan.filter((c) => progress[c.id]).length;
    const pct = inPlan.length ? Math.round((done / inPlan.length) * 100) : 0;
    $('#practice-completed').textContent = done;
    $('#practice-total').textContent = inPlan.length;
    $('#practice-percent').textContent = `${pct}%`;
    $('#practice-ring').setAttribute('stroke-dasharray', `${pct}, 100`);
    updateHomeStats();
  }

  function selectReading(id) {
    const item = READING_CHALLENGES.find((x) => x.id === id);
    if (!item || !isInPlan(item, reading.levelsPlan)) return;
    if (!UnlockManager.isUnlocked('reading', item, readingProgress)) {
      showToast(UnlockManager.nextLockedReason('reading', item, readingProgress) || 'Completa el ejercicio anterior.', 'info');
      return;
    }
    reading.current = item;
    reading.selected = null;

    $('#reading-tech-badge').textContent = TECHNOLOGIES[item.tech].label;
    $('#reading-tech-badge').className = `tech-badge ${item.tech}`;
    $('#reading-level-badge').textContent = LEVELS[item.level].label;
    $('#reading-level-badge').className = `level-badge ${item.level}`;
    $('#reading-title').textContent = item.title;
    $('#reading-code-lang').textContent = TECHNOLOGIES[item.tech].label;

    const scenario = item.scenario ? `<div class="scenario-banner">${escapeHtml(item.scenario)}</div>` : '';
    const learn = item.learn ? `<div class="learn-block learn-block-full">${LearnContent.renderHtml(item.learn)}</div>` : '';
    $('#reading-context').innerHTML = `<div class="description-content">${scenario}${learn}
      <p class="read-tip">💡 <strong>No ejecutes el código.</strong> Léelo y predice el resultado.</p></div>`;
    Glossary.applyTo($('#reading-context'));

    $('#reading-code-title').textContent = 'Código a analizar';
    $('#reading-code').className = `code-read-block lang-${item.tech}`;
    $('#reading-code').innerHTML = `<code>${escapeHtml(item.code)}</code>`;
    $('#reading-question').textContent = item.question;
    $('#reading-options').innerHTML = item.options.map((opt, i) => `
      <button class="quiz-option" data-index="${i}">${escapeHtml(opt)}</button>`).join('');
    $('#reading-options').querySelectorAll('.quiz-option').forEach((btn) => {
      btn.onclick = () => {
        reading.selected = parseInt(btn.dataset.index, 10);
        $('#reading-options').querySelectorAll('.quiz-option').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
      };
    });

    $('#reading-btn-check').disabled = false;
    $('#reading-btn-hint').disabled = !item.hint;
    $('#reading-btn-solution').disabled = !item.solution;
    $('#reading-explanation').innerHTML = `<div class="empty-state small"><p>Selecciona y verifica.</p></div>`;
    $('#reading-result-summary').textContent = '';
    renderReadingList();
    closeSidebar('reading-sidebar');
  }

  function checkReadingAnswer() {
    const item = reading.current;
    if (!item || reading.selected === null) { showToast('Selecciona una opción', 'info'); return; }
    const correct = reading.selected === item.correctIndex;
    if (correct) {
      readingProgress[item.id] = true;
      persistJSON(READING_PROGRESS_KEY, readingProgress);
      updateReadingStats(); renderReadingList();
      advanceToNextChallenge('reading');
    } else {
      recordAttempt(item.id);
    }

    $('#reading-result-summary').textContent = correct ? '✓ Correcto' : '✗ Incorrecto';
    $('#reading-result-summary').className = `results-summary ${correct ? 'pass' : 'fail'}`;

    const exp = item.explanation;
    let html = correct
      ? `<div class="success-banner"><span class="emoji">🎯</span><div><h4>¡Bien leído!</h4><p>${escapeHtml(exp.why)}</p></div></div>`
      : `<div class="test-item fail"><div class="test-details"><div class="test-name">Correcta: ${escapeHtml(item.options[item.correctIndex])}</div></div></div>`;
    html += `<div class="feedback-card">
      <div class="feedback-row"><span class="feedback-label">❓ Por qué</span><p>${escapeHtml(exp.why)}</p></div>
      <div class="feedback-row"><span class="feedback-label">🔧 Cómo leerlo mejor</span><p>${escapeHtml(exp.fix)}</p></div>
      <div class="feedback-row"><span class="feedback-label">💡 Cuándo aplica</span><p>${escapeHtml(exp.whenToUse)}</p></div></div>`;
    if (!correct && item.wrongExplanations?.[reading.selected])
      html += `<div class="feedback-card wrong-card"><span class="feedback-label">Tu error</span><p>${escapeHtml(item.wrongExplanations[reading.selected])}</p></div>`;

    $('#reading-options').querySelectorAll('.quiz-option').forEach((btn, i) => {
      btn.classList.toggle('correct', i === item.correctIndex);
      btn.classList.toggle('wrong', i === reading.selected && !correct);
      btn.disabled = true;
    });
    $('#reading-explanation').innerHTML = html;
    Glossary.applyTo($('#reading-explanation'));
    if (correct) showToast('¡Correcto!', 'success');
  }

  function updateReadingStats() {
    const inPlan = getPlanPool(READING_CHALLENGES, reading.levelsPlan);
    const done = inPlan.filter((c) => readingProgress[c.id]).length;
    const pct = inPlan.length ? Math.round((done / inPlan.length) * 100) : 0;
    $('#reading-completed').textContent = done;
    $('#reading-total').textContent = inPlan.length;
    $('#reading-percent').textContent = `${pct}%`;
    $('#reading-ring').setAttribute('stroke-dasharray', `${pct}, 100`);
    updateHomeStats();
  }

  function updateHomeStats() {
    const pDone = Object.keys(progress).filter((k) => progress[k]).length;
    const rDone = Object.keys(readingProgress).filter((k) => readingProgress[k]).length;
    const lDone = Object.keys(logicProgress).filter((k) => logicProgress[k]).length;
    $('#home-stats').textContent =
      `${CHALLENGE_STATS.practice} retos · ${CHALLENGE_STATS.reading} lecturas · ${CHALLENGE_STATS.logic} lógica · ${pDone + rDone + lDone} completados`;
  }

  function closeSidebar(id) { $(`#${id}`)?.classList.remove('open'); }

  function bindEvents() {
    $('#enter-practice').addEventListener('click', enterPractice);
    $('#enter-reading').addEventListener('click', enterReading);
    $('#enter-logic').addEventListener('click', enterLogic);
    $('#practice-back').addEventListener('click', goHome);
    $('#reading-back').addEventListener('click', goHome);
    $('#logic-back').addEventListener('click', goHome);

    $('#practice-toggle-completed')?.addEventListener('click', () => toggleHideCompleted('practice'));
    $('#reading-toggle-completed')?.addEventListener('click', () => toggleHideCompleted('reading'));
    $('#logic-toggle-completed')?.addEventListener('click', () => toggleHideCompleted('logic'));

    $('#practice-search').addEventListener('input', (e) => { practice.search = e.target.value; renderPracticeList(); });
    $('#reading-search').addEventListener('input', (e) => { reading.search = e.target.value; renderReadingList(); });
    $('#logic-search').addEventListener('input', (e) => { logic.search = e.target.value; renderLogicList(); });

    $('#practice-btn-run').addEventListener('click', runPracticeTests);
    $('#practice-btn-reset').addEventListener('click', () => {
      if (practice.current?.starterCode && confirm('¿Reiniciar?')) {
        editor.setValue(practice.current.starterCode);
        savedCode[practice.current.id] = practice.current.starterCode;
        persistJSON(CODE_KEY, savedCode);
        updatePracticePreview();
      }
    });
    $('#practice-btn-hint').addEventListener('click', () => {
      if (practice.current?.hint) showHintModal(practice.current.hint);
    });
    $('#practice-btn-solution').addEventListener('click', () => {
      if (practice.current?.solution) showSolutionModal(practice.current.solution, practice.current.tech);
    });
    $('#practice-btn-learn').addEventListener('click', () => {
      const l = practice.current?.learn;
      if (l) {
        $('#learn-content').innerHTML = `<div class="learn-modal-body">${LearnContent.renderHtml(l)}</div>`;
        Glossary.applyTo($('#learn-content'));
        $('#learn-modal').hidden = false;
      }
    });

    $('#logic-btn-run').addEventListener('click', runLogicTests);
    $('#logic-btn-reset').addEventListener('click', () => {
      if (!logic.current?.starterCode || !confirm('¿Reiniciar código?')) return;
      delete savedLogicCode[logic.current.id];
      persistJSON(LOGIC_CODE_KEY, savedLogicCode);
      selectLogic(logic.current.id);
    });
    $('#logic-btn-hint').addEventListener('click', () => {
      if (logic.current?.hint) showHintModal(logic.current.hint);
    });
    $('#logic-btn-solution').addEventListener('click', () => {
      if (logic.current?.solution) showSolutionModal(logic.current.solution, 'python');
    });
    $('#logic-btn-learn').addEventListener('click', () => {
      const l = logic.current?.learn;
      if (l) {
        $('#learn-content').innerHTML = `<div class="learn-modal-body">${LearnContent.renderHtml(l)}</div>`;
        Glossary.applyTo($('#learn-content'));
        $('#learn-modal').hidden = false;
      }
    });

    $('#reading-btn-check').addEventListener('click', checkReadingAnswer);
    $('#reading-btn-hint').addEventListener('click', () => {
      if (reading.current?.hint) showHintModal(reading.current.hint);
    });
    $('#reading-btn-solution').addEventListener('click', () => {
      if (reading.current?.solution) showSolutionModal(reading.current.solution, reading.current.tech);
    });
    $('#reading-btn-guide').addEventListener('click', () => {
      Glossary.applyTo($('#read-guide-modal .modal-body'));
      $('#read-guide-modal').hidden = false;
    });

    document.querySelectorAll('.menu-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.sidebar;
        const el = $(`#${id}`);
        if (el?.classList.contains('collapsed')) toggleSidebarCollapse(id);
        else el?.classList.add('open');
      });
    });
    document.querySelectorAll('.sidebar-collapse').forEach((btn) => {
      btn.addEventListener('click', () => toggleSidebarCollapse(btn.dataset.sidebar));
    });
    document.querySelectorAll('.sidebar-expand').forEach((btn) => {
      btn.addEventListener('click', () => toggleSidebarCollapse(btn.dataset.sidebar));
    });
    document.querySelectorAll('.sidebar-close').forEach((btn) => {
      btn.addEventListener('click', () => closeSidebar(btn.dataset.sidebar));
    });

    $('#auth-form')?.addEventListener('submit', handleAuthSubmit);
    $('#auth-register')?.addEventListener('click', handleAuthRegister);
    $('#auth-logout')?.addEventListener('click', handleLogout);
    document.querySelectorAll('.session-logout').forEach((btn) => {
      btn.addEventListener('click', handleLogout);
    });
    Auth.onAuthChange(() => {
      updateAuthUI();
      if (!Auth.isLoggedIn() && activeApp) goHome();
    });
    document.querySelectorAll('[data-close]').forEach((b) => {
      b.addEventListener('click', () => { $(`#${b.dataset.close}`).hidden = true; });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') document.querySelectorAll('.modal-overlay:not([hidden])').forEach((m) => m.hidden = true);
    });
    window.addEventListener('resize', () => { refreshEditor(); refreshLogicEditor(); });
  }

  function init() {
    Auth.restoreSession();
    reloadUserData();
    initEditor();
    initLogicEditor();
    renderFilters('practice', practice, CHALLENGES);
    renderFilters('reading', reading, READING_CHALLENGES);
    bindEvents();
    goHome();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();