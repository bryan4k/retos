const ChallengeEnrich = (function () {
  'use strict';

  const JS_PRIN_SOLUTIONS = {
    suma: (fn) => `function ${fn}(precios) {\n  return precios.reduce((a, b) => a + b, 0);\n}`,
    resta: (fn) => `function ${fn}(precio, descuento) {\n  return precio - descuento;\n}`,
    mult: (fn) => `function ${fn}(precio, cantidad) {\n  return precio * cantidad;\n}`,
    div: (fn) => `function ${fn}(total, cuotas) {\n  return total / cuotas;\n}`,
    gt0: (fn) => `function ${fn}(stock) {\n  return stock > 0;\n}`,
    eq0: (fn) => `function ${fn}(stock) {\n  return stock === 0;\n}`,
    hola: (fn) => `function ${fn}(nombre) {\n  return \`Hola, \${nombre}!\`;\n}`,
    iva16: (fn) => `function ${fn}(precio) {\n  return precio * 1.16;\n}`,
    dbl: (fn) => `function ${fn}(puntos) {\n  return puntos * 2;\n}`,
    half: (fn) => `function ${fn}(cantidad) {\n  return cantidad / 2;\n}`
  };

  function looksLikeCode(text) {
    return text && /[{};]|def |function |return |<[a-z]|\.[a-z-]+\s*\{/.test(text);
  }

  function buildPracticeHint(c) {
    const parts = [];
    if (c.scenario) parts.push(`Contexto: ${c.scenario.replace(/^[^\s]+\s/, '')}`);
    parts.push(`Objetivo: ${stripHtml(c.description || c.title)}`);

    if (c.tech === 'javascript' || c.tech === 'python') {
      const fn = c.functionName || 'tuFuncion';
      const test = c.tests?.[0];
      if (test?.args) parts.push(`Datos de prueba: ${JSON.stringify(test.args)} → resultado esperado: ${JSON.stringify(test.expected)}`);
      if (test?.feedback?.fix) parts.push(`Enfoque: ${test.feedback.fix}`);
      parts.push(`Empieza completando ${c.tech === 'python' ? `def ${fn}()` : `function ${fn}()`} y valida con un caso simple antes de ejecutar todos los tests.`);
    } else if (c.tech === 'html') {
      const tag = (c.title.match(/<(\w+)>/) || [])[1] || 'el elemento pedido';
      parts.push(`Debes incluir <${tag}> con los atributos que pide el test (revisa alt, href, etc.).`);
      if (c.tests?.length) parts.push(`Tests clave: ${c.tests.map((t) => t.name).join(', ')}.`);
    } else if (c.tech === 'css') {
      const prop = (c.title.match(/Estilo (\S+)/) || [])[1] || 'la propiedad indicada';
      parts.push(`Aplica ${prop} al selector correcto del scaffold HTML.`);
      if (c.htmlScaffold) parts.push('El HTML de referencia ya está en el runner; solo escribe las reglas CSS.');
    }

    if (c.feedback?.general?.whenToUse) parts.push(`Cuándo usarlo: ${c.feedback.general.whenToUse}`);
    return parts.join('\n\n');
  }

  function buildPracticeSolution(c) {
    if (c.solution) return c.solution;
    if (looksLikeCode(c.hint)) return c.hint;

    const fn = c.functionName;
    if (c.tech === 'javascript' && fn && c.tests?.[0]) {
      const test = c.tests[0];
      if (test.custom) return c.starterCode?.replace(/\/\/[^\n]*\n\s*$/m, '// Implementación completa\n  \n}') || c.starterCode;
      if (Array.isArray(test.args?.[0]) && typeof test.expected === 'number') {
        return `function ${fn}(precios) {\n  return precios.reduce((a, b) => a + b, 0);\n}`;
      }
      if (test.args?.length === 2 && typeof test.expected === 'number') {
        return `function ${fn}(a, b) {\n  return a + b;\n}`;
      }
      if (test.args?.length === 1 && typeof test.expected === 'boolean') {
        return `function ${fn}(n) {\n  return n > 0;\n}`;
      }
      if (test.args?.length === 1 && typeof test.expected === 'string') {
        return `function ${fn}(nombre) {\n  return \`Hola, \${nombre}!\`;\n}`;
      }
    }

    if (c.tech === 'python' && fn && c.tests?.[0]?.expected != null) {
      const test = c.tests[0];
      const params = (c.starterCode.match(/def\s+\w+\(([^)]*)\)/) || [])[1] || 'datos';
      if (params.includes('nombre')) return `def ${fn}(nombre):\n    return f"Hola, {nombre}!"`;
      if (params.includes('a, b')) return `def ${fn}(a, b):\n    return a + b`;
      if (test.expected === true || test.expected === false) return `def ${fn}(n):\n    return n > 0`;
      if (typeof test.expected === 'number') return `def ${fn}(${params}):\n    return ${test.expected}`;
    }

    if (c.tech === 'html') {
      const tag = (c.title.match(/<(\w+)>/) || [])[1] || 'div';
      if (tag === 'a') return `<a href="https://ejemplo.com">Enlace</a>`;
      if (tag === 'img') return `<img src="foto.jpg" alt="Descripción">`;
      if (tag === 'form') return `<form><input type="text" name="campo"></form>`;
      if (tag === 'table') return `<table><thead><tr><th>Col</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>`;
      return `<${tag}>Contenido de ejemplo</${tag}>`;
    }

    if (c.tech === 'css') {
      const sel = (c.starterCode.match(/^([^{]+)/) || [])[1]?.trim() || '.elemento';
      const prop = (c.title.match(/Estilo (\S+)/) || [])[1];
      if (prop) return `${sel} {\n  ${prop}: /* valor según el test */;\n}`;
      return c.starterCode;
    }

    if (c.tests?.[0]?.feedback?.fix && looksLikeCode(c.tests[0].feedback.fix)) return c.tests[0].feedback.fix;
    return c.starterCode || 'Consulta la explicación del test fallido para ver el enfoque.';
  }

  function buildLogicHint(c) {
    const parts = [
      `Problema: ${c.problem}`,
      `Estrategia paso a paso:\n${c.approach}`,
      `Datos de entrada: ${Object.entries(c.inputs || {}).map(([k, v]) => `${k}=${v}`).join(', ')}`,
      `Salida esperada del programa: «${c.expectedOutput}»`
    ];
    if (c.traceTable?.length) {
      const steps = c.traceTable.slice(0, 3).map((r) => `• Paso ${r.paso}: ${r.instruccion}`).join('\n');
      parts.push(`Sigue la traza:\n${steps}`);
    }
    parts.push('Traduce cada instrucción PSeInt a Python: Leer→asignar variable, <-→=, Escribir→print().');
    return parts.join('\n\n');
  }

  function pseudoToPython(c) {
    const lines = [];
    Object.entries(c.inputs || {}).forEach(([k, v]) => {
      if (k === 'lecturas') {
        const nums = String(v).split(',').map((s) => s.trim());
        lines.push(`lecturas = [${nums.join(', ')}]`);
      } else if (typeof v === 'string') lines.push(`${k} = ${JSON.stringify(v)}`);
      else lines.push(`${k} = ${v}`);
    });
    lines.push('');

    const trace = c.traceTable || [];
    const written = new Set();
    trace.forEach((row) => {
      const ins = row.instruccion || '';
      const assign = ins.match(/^(\w+)\s*<-\s*(.+)$/i);
      if (assign && !written.has(assign[1])) {
        let expr = assign[2]
          .replace(/\bMod\b/gi, '%')
          .replace(/\bY\b/gi, 'and')
          .replace(/\bO\b/gi, 'or')
          .replace(/\bNo\b/gi, 'not ');
        lines.push(`${assign[1]} = ${expr}`);
        written.add(assign[1]);
      }
      const write = ins.match(/^Escribir\s+(.+)$/i);
      if (write) {
        let val = write[1].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          lines.push(`print(${val})`);
        } else {
          lines.push(`print(${val})`);
        }
      }
    });

    if (!lines.some((l) => l.startsWith('print(')) && c.expectedOutput != null) {
      lines.push(`print(${JSON.stringify(c.expectedOutput)})`);
    }
    return lines.join('\n');
  }

  function buildLogicSolution(c) {
    if (c.solution) return c.solution;
    const py = pseudoToPython(c);
    if (py && py.includes('print(')) return py;
    return `${Object.entries(c.inputs || {}).map(([k, v]) => `${k} = ${typeof v === 'string' ? JSON.stringify(v) : v}`).join('\n')}\n\n# Salida esperada:\nprint(${JSON.stringify(c.expectedOutput)})`;
  }

  function buildReadingHint(c) {
    const parts = [
      `Lee el código línea a línea sin ejecutarlo.`,
      c.scenario ? `Contexto: ${c.scenario}` : '',
      `Pregunta: ${c.question}`,
      `Pista: busca variables, operadores y el orden de evaluación. En nivel ${c.level}, ${c.learn?.concept || 'identifica el patrón principal.'}`,
      `Descarta opciones que contradigan tipos o sintaxis del lenguaje.`
    ];
    return parts.filter(Boolean).join('\n\n');
  }

  function buildReadingSolution(c) {
    if (c.solution) return c.solution;
    const correct = c.options?.[c.correctIndex] ?? '';
    const exp = c.explanation || {};
    return `Respuesta correcta: ${correct}\n\n${exp.why || ''}\n\nCómo leerlo: ${exp.fix || ''}`;
  }

  function stripHtml(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent || '';
  }

  function enrichPractice(c) {
    if (!c.hint || looksLikeCode(c.hint) || c.hint.length < 120) {
      c.hint = buildPracticeHint(c);
    }
    c.solution = buildPracticeSolution(c);
    return c;
  }

  function enrichLogic(c) {
    c.hint = buildLogicHint(c);
    c.solution = buildLogicSolution(c);
    return c;
  }

  function enrichReading(c) {
    c.hint = buildReadingHint(c);
    c.solution = buildReadingSolution(c);
    return c;
  }

  function enrichAll(practice, reading, logic) {
    practice.forEach(enrichPractice);
    reading.forEach(enrichReading);
    logic.forEach(enrichLogic);
  }

  return { enrichAll, enrichPractice, enrichLogic, enrichReading };
})();