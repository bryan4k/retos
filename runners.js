const Runners = (function () {
  'use strict';

  let pyodide = null;
  let pyodideLoading = null;

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return a === b;
    if (typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) {
      return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every((k) => deepEqual(a[k], b[k]));
  }

  function formatValue(val) {
    if (typeof val === 'string') return `"${val}"`;
    return JSON.stringify(val);
  }

  function getFeedback(test, challenge, passed) {
    if (passed) return null;
    const fb = test.feedback || challenge.feedback?.general || {};
    return {
      why: fb.why || 'El resultado no coincide con lo esperado.',
      fix: fb.fix || 'Revisa tu lógica paso a paso con los ejemplos.',
      whenToUse: fb.whenToUse || challenge.learn?.whenToUse || ''
    };
  }

  function buildIframeDoc(challenge, userCode) {
    const scaffold = challenge.htmlScaffold || '';
    if (challenge.tech === 'css') {
      return `<!DOCTYPE html><html><head><style>${userCode}</style></head><body>${scaffold}</body></html>`;
    }
    if (challenge.tech === 'html') {
      const hasDoctype = /<!DOCTYPE/i.test(userCode);
      return hasDoctype ? userCode : `<!DOCTYPE html><html><body>${userCode}</body></html>`;
    }
    return userCode;
  }

  function createTestDocument(challenge, userCode) {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:-9999px;width:800px;height:600px;visibility:hidden';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(buildIframeDoc(challenge, userCode));
    doc.close();
    return { doc, iframe };
  }

  function parseStyleValue(val) {
    if (!val) return val;
    return val.replace(/\s+/g, '');
  }

  function styleMatches(actual, expected, match) {
    const norm = parseStyleValue(actual);
    if (expected) return norm === parseStyleValue(expected);
    if (match) return match.some((m) => norm === parseStyleValue(m) || actual === m);
    return false;
  }

  async function runDomTest(doc, test) {
    const el = doc.querySelector(test.selector);
    if (!el && test.type !== 'count') {
      return { pass: false, error: `No se encontró: ${test.selector}` };
    }

    switch (test.type) {
      case 'exists':
        return { pass: !!el };
      case 'count': {
        const nodes = doc.querySelectorAll(test.selector);
        const count = nodes.length;
        const pass = test.min ? count >= test.min : count === test.expected;
        return { pass, actual: count, expected: test.min || test.expected };
      }
      case 'text': {
        const text = (el.textContent || '').trim();
        if (test.expected) return { pass: text === test.expected, actual: text, expected: test.expected };
        return { pass: text.length > 0, actual: text };
      }
      case 'attribute': {
        const val = el.getAttribute(test.attr);
        if (test.notEmpty) return { pass: !!val && val.trim().length > 0, actual: val };
        return { pass: val === test.expected, actual: val, expected: test.expected };
      }
      default:
        return { pass: false, error: 'Test desconocido' };
    }
  }

  async function runStyleTest(doc, test, userCode) {
    const el = doc.querySelector(test.selector);
    if (!el) return { pass: false, error: `Selector no encontrado: ${test.selector}` };

    const win = el.ownerDocument.defaultView;
    const computed = win.getComputedStyle(el);
    const prop = test.property;
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const actual = computed[camel] || computed.getPropertyValue(prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`));

    if (test.notTransparent) {
      return { pass: actual && actual !== 'rgba(0, 0, 0, 0)' && actual !== 'transparent', actual };
    }
    if (test.minPx) {
      const num = parseFloat(actual);
      return { pass: num >= test.minPx, actual, expected: `>= ${test.minPx}px` };
    }
    if (test.minNum) {
      const num = parseFloat(actual);
      return { pass: num >= test.minNum, actual, expected: `>= ${test.minNum}` };
    }
    if (test.expected || test.match) {
      const pass = styleMatches(actual, test.expected, test.match);
      return { pass, actual, expected: test.expected || test.match?.join(' | ') };
    }
    return { pass: false, error: 'Config de estilo incompleta' };
  }

  async function runHtmlCssTests(challenge, userCode) {
    const { doc, iframe } = createTestDocument(challenge, userCode);
    const results = [];

    try {
      for (const test of challenge.tests) {
        let outcome;
        if (test.type === 'style') {
          outcome = await runStyleTest(doc, test, userCode);
        } else if (test.type === 'mediaRule' || test.type === 'cssContains') {
          const code = userCode.toLowerCase();
          if (test.type === 'mediaRule') {
            outcome = { pass: code.includes(test.contains.toLowerCase()), actual: 'CSS analizado' };
          } else {
            outcome = { pass: code.includes(test.value.toLowerCase()), actual: 'CSS analizado' };
          }
        } else {
          outcome = await runDomTest(doc, test);
        }

        results.push({
          name: test.name,
          pass: outcome.pass,
          actual: outcome.actual !== undefined ? formatValue(outcome.actual) : undefined,
          expected: outcome.expected !== undefined ? formatValue(outcome.expected) : undefined,
          error: outcome.error,
          feedback: getFeedback(test, challenge, outcome.pass)
        });
      }
    } finally {
      iframe.remove();
    }

    return results;
  }

  function compileJS(code, functionName) {
    const wrapped = `${code}\nif (typeof ${functionName} !== 'function') throw new Error('Debes definir la función ${functionName}');\nreturn ${functionName};`;
    return new Function(wrapped)();
  }

  async function runJSTests(challenge, code) {
    let fn;
    try {
      fn = compileJS(code, challenge.functionName);
    } catch (err) {
      const fb = challenge.feedback?.compile || challenge.feedback?.general || {};
      throw Object.assign(err, {
        compileFeedback: {
          why: fb.why || err.message,
          fix: fb.fix || 'Revisa la sintaxis de tu código.',
          whenToUse: fb.whenToUse || challenge.learn?.whenToUse || ''
        }
      });
    }

    const results = [];
    for (const test of challenge.tests) {
      try {
        if (test.custom && test.run) {
          let testPassed = true;
          let errorMsg = '';
          const assert = (cond, msg) => {
            if (!cond) { testPassed = false; errorMsg = msg; throw new Error(msg); }
          };
          try { await test.run(fn, assert); } catch (e) { if (!errorMsg) errorMsg = e.message; }
          results.push({
            name: test.name,
            pass: testPassed,
            error: testPassed ? null : errorMsg,
            feedback: getFeedback(test, challenge, testPassed)
          });
        } else {
          let result = fn(...test.args);
          if (result instanceof Promise) result = await result;
          const pass = deepEqual(result, test.expected);
          results.push({
            name: test.name,
            pass,
            input: formatValue(test.args),
            expected: formatValue(test.expected),
            actual: formatValue(result),
            feedback: getFeedback(test, challenge, pass)
          });
        }
      } catch (err) {
        results.push({
          name: test.name,
          pass: false,
          error: err.message,
          feedback: getFeedback(test, challenge, false)
        });
      }
    }
    return results;
  }

  async function loadPyodide() {
    if (pyodide) return pyodide;
    if (pyodideLoading) return pyodideLoading;
    pyodideLoading = (async () => {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          s.onload = resolve;
          s.onerror = () => reject(new Error('No se pudo cargar Pyodide'));
          document.head.appendChild(s);
        });
      }
      pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
      });
      return pyodide;
    })();
    return pyodideLoading;
  }

  async function runPythonTests(challenge, code) {
    const py = await loadPyodide();
    try {
      py.runPython(code);
    } catch (err) {
      const fb = challenge.feedback?.general || {};
      throw Object.assign(new Error(err.message), {
        compileFeedback: {
          why: fb.why || 'Error de sintaxis o indentación en Python.',
          fix: fb.fix || 'Python usa indentación (4 espacios). Verifica : al final de def/if.',
          whenToUse: fb.whenToUse || 'Siempre mantén indentación consistente en Python.'
        }
      });
    }

    const fn = py.globals.get(challenge.functionName);
    if (!fn) {
      throw Object.assign(new Error(`Debes definir la función ${challenge.functionName}`), {
        compileFeedback: {
          why: 'La función no existe en el entorno Python.',
          fix: `def ${challenge.functionName}(...):`,
          whenToUse: challenge.learn?.whenToUse || ''
        }
      });
    }

    const results = [];
    for (const test of challenge.tests) {
      try {
        const pyArgs = test.args.map((a) => py.toPy(a));
        let result = fn(...pyArgs);
        if (result && typeof result.then === 'function') result = await result;
        const jsResult = result?.toJs?.({ dict_converter: Object.fromEntries, create_proxies: false }) ?? result;
        const pass = deepEqual(jsResult, test.expected);
        results.push({
          name: test.name,
          pass,
          input: formatValue(test.args),
          expected: formatValue(test.expected),
          actual: formatValue(jsResult),
          feedback: getFeedback(test, challenge, pass)
        });
      } catch (err) {
        results.push({
          name: test.name,
          pass: false,
          error: err.message,
          feedback: getFeedback(test, challenge, false)
        });
      }
    }
    return results;
  }

  async function run(challenge, code) {
    switch (challenge.tech) {
      case 'html':
      case 'css':
        return runHtmlCssTests(challenge, code);
      case 'javascript':
        return runJSTests(challenge, code);
      case 'python':
        return runPythonTests(challenge, code);
      default:
        throw new Error('Tecnología no soportada');
    }
  }

  function needsPreview(tech) {
    return tech === 'html' || tech === 'css';
  }

  function renderPreview(challenge, code, container) {
    container.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.className = 'preview-frame';
    iframe.setAttribute('sandbox', 'allow-same-origin');
    container.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(buildIframeDoc(challenge, code));
    doc.close();
  }

  return { run, needsPreview, renderPreview, loadPyodide };
})();