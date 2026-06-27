const LogicRunner = (function () {
  'use strict';

  function normalizeValue(val) {
    if (val == null) return null;
    const s = String(val).trim();
    if (!s || s === '—' || s === '-' || s === '–') return null;
    if (/^(v|verdadero|true|si|sí)$/i.test(s)) return 'v';
    if (/^(f|falso|false|no)$/i.test(s)) return 'f';
    const n = Number(s);
    if (!Number.isNaN(n) && s !== '') return n;
    return s.toLowerCase();
  }

  function valuesMatch(expected, actual) {
    const e = normalizeValue(expected);
    const a = normalizeValue(actual);
    if (e === null) return true;
    if (a === null) return false;
    if (e === a) return true;
    return String(e) === String(a);
  }

  async function runPythonStdout(code) {
    const py = await Runners.loadPyodide();
    py.runPython(`
import sys
from io import StringIO
_logic_capture = StringIO()
_logic_stdout = sys.stdout
sys.stdout = _logic_capture
`);
    try {
      py.runPython(code);
    } catch (err) {
      py.runPython('sys.stdout = _logic_stdout');
      const fb = {
        why: err.message || 'Error al ejecutar Python.',
        fix: 'Revisa indentación, dos puntos en if/for y que uses print() para la salida.',
        whenToUse: 'Python debe reflejar el mismo flujo que tu pseudocódigo.'
      };
      throw Object.assign(new Error(err.message), { compileFeedback: fb });
    }
    const output = py.runPython('_logic_capture.getvalue()');
    py.runPython('sys.stdout = _logic_stdout');
    return String(output ?? '').trim();
  }

  async function runCodeTest(challenge, code) {
    const test = challenge.tests?.[0];
    const expected = test?.expected ?? challenge.expectedOutput ?? '';
    try {
      const actual = await runPythonStdout(code);
      const pass = valuesMatch(expected, actual);
      return {
        name: test?.name || 'Salida del programa',
        pass,
        expected: String(expected),
        actual: actual || '(sin salida)',
        kind: 'code',
        feedback: pass ? null : (challenge.feedback?.code || challenge.feedback?.general)
      };
    } catch (err) {
      return {
        name: 'Ejecución Python',
        pass: false,
        error: err.message,
        kind: 'code',
        feedback: err.compileFeedback || challenge.feedback?.code
      };
    }
  }

  return { runCodeTest, normalizeValue, valuesMatch };
})();