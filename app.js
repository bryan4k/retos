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
  const LIST_LIMIT = 40;

  let editor = null;
  let logicEditor = null;
  let activeApp = null;

  const progress = loadJSON(PROGRESS_KEY, {});
  const readingProgress = loadJSON(READING_PROGRESS_KEY, {});
  const logicProgress = loadJSON(LOGIC_PROGRESS_KEY, {});
  const savedCode = loadJSON(CODE_KEY, {});
  const savedLogicCode = loadJSON(LOGIC_CODE_KEY, {});
  const practiceLevels = loadLevelsPlan(LEVELS_PLAN_KEY);
  const readingLevels = loadLevelsPlan(READING_LEVELS_PLAN_KEY);
  const logicLevels = loadLevelsPlan(LOGIC_LEVELS_PLAN_KEY);

  const practice = { current: null, level: 'all', tech: 'all', search: '', levelsPlan: practiceLevels };
  const reading = { current: null, selected: null, level: 'all', tech: 'all', search: '', levelsPlan: readingLevels };
  const logic = { current: null, level: 'all', tech: 'logica', search: '', levelsPlan: logicLevels };

  const $ = (sel) => document.querySelector(sel);

  function loadJSON(key, fb) {
    try { return JSON.parse(localStorage.getItem(key)) || fb; } catch { return fb; }
  }

  function defaultLevelsPlan() {
    return { principiante: true, intermedio: true, avanzado: true, experto: true };
  }

  function loadLevelsPlan(key) {
    const stored = loadJSON(key, null);
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

  function saveLevelsPlan(app) {
    const key = app === 'practice' ? LEVELS_PLAN_KEY
      : app === 'logic' ? LOGIC_LEVELS_PLAN_KEY : READING_LEVELS_PLAN_KEY;
    localStorage.setItem(key, JSON.stringify(getAppState(app).levelsPlan));
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
      const first = getPlanPool(CHALLENGES, practice.levelsPlan).find((c) => !progress[c.id]);
      if (first) selectPractice(first.id);
    }
    refreshEditor();
  }

  function enterReading() {
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
    const pool = getPlanPool(READING_CHALLENGES, reading.levelsPlan);
    const pick = pool.find((c) => !readingProgress[c.id]) || pool[0];
    if (pick) selectReading(pick.id);
  }

  function enterLogic() {
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
    const pool = getPlanPool(LOGIC_CHALLENGES, logic.levelsPlan);
    const pick = pool.find((c) => !logicProgress[c.id]) || pool[0];
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
        localStorage.setItem(CODE_KEY, JSON.stringify(savedCode));
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
        localStorage.setItem(LOGIC_CODE_KEY, JSON.stringify(savedLogicCode));
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
        const first = getPlanPool(pool, state.levelsPlan).find((c) => !prog[c.id]);
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

    const techEntries = app === 'logic'
      ? [['logica', TECHNOLOGIES.logica]]
      : Object.entries(TECHNOLOGIES).filter(([, t]) => !t.deskTest);

    const grouped = techEntries.map(([techId, tech]) => {
      const levels = Object.entries(LEVELS).sort((a, b) => a[1].order - b[1].order)
        .filter(([levelId]) => state.levelsPlan[levelId] !== false)
        .map(([levelId, level]) => {
          const items = visible.filter((c) => c.tech === techId && c.level === levelId);
          return items.length ? { levelId, level, items } : null;
        }).filter(Boolean);
      return levels.length ? { techId, tech, levels } : null;
    }).filter(Boolean);

    const currentId = state.current?.id;
    $(listId).innerHTML = grouped.map((g) => `
      <div class="tech-group"><div class="tech-group-title">${g.tech.icon} ${g.tech.label}</div>
      ${g.levels.map((lg) => {
        const shown = lg.items.slice(0, LIST_LIMIT);
        const more = lg.items.length - shown.length;
        return `<div class="level-group">
          <div class="level-group-title"><span class="level-dot" style="background:${lg.level.color}"></span>
            ${lg.level.label} <span class="count-badge">${lg.items.length}</span></div>
          ${shown.map((c) => renderRow(c, prog, currentId)).join('')}
          ${more > 0 ? `<p class="more-hint">+${more} más — usa búsqueda</p>` : ''}
        </div>`;
      }).join('')}</div>`).join('');

    $(listId).querySelectorAll('.challenge-item').forEach((btn) => {
      btn.onclick = () => {
        if (app === 'practice') selectPractice(btn.dataset.id);
        else if (app === 'logic') selectLogic(btn.dataset.id);
        else selectReading(btn.dataset.id);
      };
    });
  }

  function renderRow(c, prog, currentId) {
    const done = prog[c.id];
    const active = currentId === c.id;
    return `<div class="challenge-row${active ? ' active' : ''}${done ? ' completed' : ''}">
      <button class="challenge-item full-width" data-id="${c.id}">
        <span class="challenge-status">${done ? '✓' : '○'}</span>
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
        localStorage.setItem(LOGIC_PROGRESS_KEY, JSON.stringify(logicProgress));
        updateLogicStats();
        renderLogicList();
        showToast('¡Ejercicio completado! 🎉', 'success');
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
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        updatePracticeStats(); renderPracticeList();
        showToast('¡Reto completado! 🎉', 'success');
      }
    } catch (err) {
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
      localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(readingProgress));
      updateReadingStats(); renderReadingList();
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

    $('#practice-search').addEventListener('input', (e) => { practice.search = e.target.value; renderPracticeList(); });
    $('#reading-search').addEventListener('input', (e) => { reading.search = e.target.value; renderReadingList(); });
    $('#logic-search').addEventListener('input', (e) => { logic.search = e.target.value; renderLogicList(); });

    $('#practice-btn-run').addEventListener('click', runPracticeTests);
    $('#practice-btn-reset').addEventListener('click', () => {
      if (practice.current?.starterCode && confirm('¿Reiniciar?')) {
        editor.setValue(practice.current.starterCode);
        savedCode[practice.current.id] = practice.current.starterCode;
        localStorage.setItem(CODE_KEY, JSON.stringify(savedCode));
        updatePracticePreview();
      }
    });
    $('#practice-btn-hint').addEventListener('click', () => {
      if (practice.current?.hint) {
        $('#hint-content').innerHTML = `<p>${escapeHtml(practice.current.hint)}</p>`;
        Glossary.applyTo($('#hint-content'));
        $('#hint-modal').hidden = false;
      }
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
      localStorage.setItem(LOGIC_CODE_KEY, JSON.stringify(savedLogicCode));
      selectLogic(logic.current.id);
    });
    $('#logic-btn-hint').addEventListener('click', () => {
      if (logic.current?.hint) {
        $('#hint-content').innerHTML = `<p>${escapeHtml(logic.current.hint)}</p>`;
        Glossary.applyTo($('#hint-content'));
        $('#hint-modal').hidden = false;
      }
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
    $('#reading-btn-guide').addEventListener('click', () => {
      Glossary.applyTo($('#read-guide-modal .modal-body'));
      $('#read-guide-modal').hidden = false;
    });

    document.querySelectorAll('.menu-toggle').forEach((btn) => {
      btn.addEventListener('click', () => $(`#${btn.dataset.sidebar}`)?.classList.add('open'));
    });
    document.querySelectorAll('.sidebar-close').forEach((btn) => {
      btn.addEventListener('click', () => closeSidebar(btn.dataset.sidebar));
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
    initEditor();
    initLogicEditor();
    renderFilters('practice', practice, CHALLENGES);
    renderFilters('reading', reading, READING_CHALLENGES);
    updateHomeStats();
    bindEvents();
    goHome();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();