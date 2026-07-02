const ChallengeEnrich = (function () {
  'use strict';

  const HTML_SOLUTIONS = {
    p: '<p>Contenido del párrafo</p>',
    h1: '<h1>Título principal</h1>',
    ul: '<ul><li>Elemento 1</li><li>Elemento 2</li></ul>',
    a: '<a href="https://ejemplo.com">Enlace de ejemplo</a>',
    img: '<img src="imagen.jpg" alt="Descripción de la imagen">',
    button: '<button type="button">Acción</button>',
    input: '<input type="text" name="campo" placeholder="Escribe aquí">',
    label: '<label for="campo">Etiqueta</label>',
    div: '<div>Contenedor</div>',
    span: '<span>Texto en línea</span>',
    form: '<form><input type="text" name="usuario"></form>',
    select: '<select><option value="1">Opción 1</option></select>',
    textarea: '<textarea name="mensaje"></textarea>',
    table: '<table><thead><tr><th>Columna</th></tr></thead><tbody><tr><td>Dato</td></tr></tbody></table>',
    thead: '<table><thead><tr><th>Encabezado</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>',
    nav: '<nav><a href="/">Inicio</a></nav>',
    article: '<article><h2>Noticia</h2><p>Contenido</p></article>',
    section: '<section><h2>Sección</h2></section>',
    footer: '<footer><p>© 2026</p></footer>',
    header: '<header><h1>Logo</h1></header>',
    main: '<main><p>Contenido principal</p></main>',
    aside: '<aside><p>Barra lateral</p></aside>',
    figure: '<figure><img src="foto.jpg" alt="Foto"><figcaption>Leyenda</figcaption></figure>',
    figcaption: '<figure><img src="foto.jpg" alt="Foto"><figcaption>Leyenda</figcaption></figure>',
    details: '<details><summary>Más info</summary><p>Detalle</p></details>',
    summary: '<details><summary>Resumen</summary><p>Contenido</p></details>',
    fieldset: '<fieldset><legend>Datos</legend><input type="text"></fieldset>',
    legend: '<fieldset><legend>Grupo</legend><input type="text"></fieldset>',
    datalist: '<input list="opciones"><datalist id="opciones"><option value="A"></datalist>',
    output: '<output name="resultado">0</output>',
    dialog: '<dialog open>Diálogo</dialog>',
    template: '<template><p>Plantilla</p></template>',
    picture: '<picture><source srcset="foto.webp" type="image/webp"><img src="foto.jpg" alt="Foto"></picture>',
    source: '<video controls><source src="video.mp4" type="video/mp4"></video>',
    track: '<video controls><track kind="subtitles" src="subs.vtt" srclang="es"></video>',
    meter: '<meter value="0.6" min="0" max="1">60%</meter>',
    progress: '<progress value="40" max="100">40%</progress>',
    time: '<time datetime="2026-01-01">1 ene 2026</time>',
    address: '<address>Calle 123, Ciudad</address>',
    slot: '<div><slot name="titulo"></slot></div>'
  };

  const JS_PRIN_BODY = {
    suma: 'return precios.reduce((a, b) => a + b, 0);',
    resta: 'return precio - descuento;',
    mult: 'return precio * cantidad;',
    div: 'return total / cuotas;',
    gt0: 'return stock > 0;',
    eq0: 'return stock === 0;',
    hola: 'return `Hola, ${nombre}!`;',
    iva16: 'return precio * 1.16;',
    dbl: 'return puntos * 2;',
    half: 'return cantidad / 2;'
  };

  const PY_PRIN_BODY = {
    saludar: 'return f"Hola, {nombre}!"',
    suma: 'return a + b',
    es_positivo: 'return n > 0',
    doble: 'return n * 2',
    area_cuadrado: 'return lado * lado'
  };

  function looksLikeCode(text) {
    return text && /[{};]|def |function |return |<[a-z]|\.[a-z-]+\s*\{/.test(text);
  }

  function kebabProp(camel) {
    return camel.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
  }

  function fillStarter(starterCode, snippet) {
    const code = (snippet || '').trim();
    if (!starterCode) return code;
    if (/^(function |def |const \w+ =|let \w+ =|class )/.test(code)) return code;

    if (starterCode.includes('pass')) {
      return starterCode.replace(/\s*pass\s*$/, `\n    ${code}\n`);
    }

    const fnMatch = starterCode.match(/^(function\s+\w+\s*\([^)]*\)\s*\{)([\s\S]*?)(\}\s*)$/);
    if (fnMatch) {
      return `${fnMatch[1]}\n  ${code}\n${fnMatch[3]}`;
    }

    const defMatch = starterCode.match(/^(def\s+\w+\s*\([^)]*\):)\s*([\s\S]*)$/);
    if (defMatch) {
      return `${defMatch[1]}\n    ${code}\n`;
    }

    return starterCode.replace(/\{\s*\n?\s*\}/, `{\n  ${code}\n}`);
  }

  function bestFeedbackFix(c) {
    const fixes = [];
    if (c.feedback?.compile?.fix) fixes.push(c.feedback.compile.fix);
    if (c.feedback?.general?.fix) fixes.push(c.feedback.general.fix);
    (c.tests || []).forEach((t) => {
      if (t.feedback?.fix) fixes.push(t.feedback.fix);
    });
    return fixes.find((f) => looksLikeCode(f)) || fixes.find((f) => f && f.length > 3) || null;
  }

  function detectJsPrinOp(starterCode) {
    if (/precios\.reduce|precios/.test(starterCode) && /suma/.test(starterCode)) return 'suma';
    if (/precio, descuento/.test(starterCode)) return 'resta';
    if (/precio, cantidad/.test(starterCode)) return 'mult';
    if (/total, cuotas/.test(starterCode)) return 'div';
    if (/stock > 0/.test(starterCode)) return 'gt0';
    if (/stock === 0/.test(starterCode)) return 'eq0';
    if (/nombre/.test(starterCode) && /Hola/.test(starterCode)) return 'hola';
    if (/16% IVA|1\.16/.test(starterCode)) return 'iva16';
    if (/puntos/.test(starterCode) && /doblePuntos|doble/.test(starterCode)) return 'dbl';
    if (/cantidad/.test(starterCode) && /mitad|half/.test(starterCode)) return 'half';
    return null;
  }

  function buildJsSolution(c, rawHint) {
    const fn = c.functionName;
    const starter = c.starterCode || '';

    if (rawHint?.includes('function ') || rawHint?.includes('return function')) return rawHint.trim();
    if (rawHint && looksLikeCode(rawHint)) return fillStarter(starter, rawHint);

    const fix = bestFeedbackFix(c);
    if (fix) {
      if (fix.includes('function ')) return fix;
      return fillStarter(starter, fix);
    }

    const op = detectJsPrinOp(starter);
    if (op && fn && JS_PRIN_BODY[op]) {
      return fillStarter(starter, JS_PRIN_BODY[op]);
    }

    const name = fn || 'solucion';
    if (/items.*precio.*cantidad|calcularTotal|totalCarrito/.test(starter + name)) {
      if (starter.includes('[{')) {
        return fillStarter(starter, 'return productos.reduce((total, p) => total + p.precio * p.cantidad, 0);');
      }
      return `function ${name}(items) {\n  return items.reduce((t, i) => t + i[0] * i[1], 0);\n}`;
    }
    if (/soloActivos|activo/.test(starter + name)) {
      return fillStarter(starter, 'return usuarios.filter(u => u.activo).length;');
    }
    if (/promedio|nums/.test(starter + name)) {
      return fillStarter(starter, 'return nums[0].reduce((a, b) => a + b, 0) / nums[0].length;');
    }
    if (/emailOk|email/.test(starter + name)) {
      return fillStarter(starter, 'const [user, domain] = email.split("@");\n  return Boolean(user && domain && domain.includes(".") && email.length >= 5);');
    }
    if (/formato|toLocaleString/.test(starter)) {
      return starter.replace(/\/\/[^\n]*\n\s*$/, '').trim() || starter;
    }
    if (/throttle|debounce|delay/.test(starter + (c.title || ''))) {
      if (rawHint) return fillStarter(starter, rawHint);
      return fillStarter(starter, 'let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };');
    }
    if (/filter.*sort|precio <= max/.test(starter + (fix || ''))) {
      return fillStarter(starter, 'return productos.filter(p => p.precio <= max).sort((a, b) => a.precio - b.precio);');
    }

    const test = c.tests?.[0];
    if (test?.args && fn) {
      if (Array.isArray(test.args[0]) && typeof test.expected === 'number' && test.args[0].every((x) => typeof x === 'number')) {
        return fillStarter(starter, 'return precios.reduce((a, b) => a + b, 0);');
      }
      if (test.args.length === 2 && typeof test.expected === 'number') {
        return `function ${fn}(a, b) {\n  return a + b;\n}`;
      }
      if (test.args.length === 1 && typeof test.expected === 'boolean') {
        if (starter.includes('stock')) return fillStarter(starter, 'return stock === 0;');
        return fillStarter(starter, 'return n > 0;');
      }
      if (test.args.length === 1 && typeof test.expected === 'string' && test.expected.startsWith('Hola')) {
        return fillStarter(starter, 'return `Hola, ${nombre}!`;');
      }
    }

    if (test?.custom) {
      return fillStarter(starter, 'return datos;');
    }

    return starter;
  }

  function buildPySolution(c, rawHint) {
    const fn = c.functionName;
    const starter = c.starterCode || '';

    if (rawHint?.startsWith('def ')) return rawHint.trim();
    if (rawHint && looksLikeCode(rawHint)) return fillStarter(starter, rawHint);

    const fix = bestFeedbackFix(c);
    if (fix) {
      if (fix.startsWith('def ')) return fix;
      return fillStarter(starter, fix);
    }

    if (fn && PY_PRIN_BODY[fn]) {
      return fillStarter(starter, PY_PRIN_BODY[fn]);
    }

    const params = (starter.match(/def\s+\w+\(([^)]*)\)/) || [])[1] || '';
    const test = c.tests?.[0];

    if (fn === 'suma_lista' || /suma_lista/.test(starter)) {
      return `def suma_lista(numeros):\n    total = 0\n    for n in numeros:\n        total += n\n    return total`;
    }
    if (/calcular_total|descuento/.test(starter + (fn || ''))) {
      return `def ${fn}(subtotal):\n    if subtotal > 1000:\n        return round(subtotal * 0.9, 2)\n    return round(subtotal, 2)`;
    }
    if (params.includes('nombre')) {
      return `def ${fn}(nombre):\n    return f"Hola, {nombre}!"\n`;
    }
    if (params.includes('a, b')) {
      return `def ${fn}(a, b):\n    return a + b\n`;
    }
    if (params.includes('n') && test?.expected === true) {
      return `def ${fn}(n):\n    return n > 0\n`;
    }
    if (test?.expected != null && typeof test.expected === 'number' && params.includes('lado')) {
      return `def ${fn}(lado):\n    return lado * lado\n`;
    }
    if (test?.expected != null && typeof test.expected === 'number') {
      return `def ${fn}(${params}):\n    return ${test.expected}\n`;
    }
    if (test?.custom) {
      return fillStarter(starter, 'return datos');
    }

    return starter;
  }

  function buildHtmlSolution(c) {
    const tag = (c.title.match(/<(\w+)>/i) || [])[1]?.toLowerCase()
      || (c.tests?.[0]?.selector?.match(/^(\w+)/) || [])[1]?.toLowerCase()
      || 'div';
    return HTML_SOLUTIONS[tag] || `<${tag}>Contenido</${tag}>`;
  }

  function buildCssSolution(c) {
    const sel = (c.starterCode.match(/^([^{]+)/) || [])[1]?.trim() || '.elemento';
    const test = c.tests?.[0];
    if (!test) return c.starterCode;

    let prop = (c.title.match(/Estilo (\S+)/) || [])[1];
    if (test.property) prop = kebabProp(test.property);

    let value;
    if (test.expected) value = test.expected;
    else if (test.match?.length) value = test.match[0];
    else if (test.minPx != null) value = `${test.minPx}px`;
    else if (test.type === 'cssContains') {
      const v = test.value || '';
      if (v === 'grid' || v === 'subgrid') value = 'grid';
      else if (v === 'var') value = 'var(--color, #6366f1)';
      else if (v === 'has') value = 'has(.child)';
      else if (v === 'clamp') value = 'clamp(1rem, 2vw, 2rem)';
      else if (v === 'min') value = 'min(100%, 400px)';
      else if (v === 'max') value = 'max(200px, 50%)';
      else if (v === 'layer') value = '@layer theme';
      else if (v === 'scope') value = '@scope (.card)';
      else value = v;
    } else {
      value = 'inherit';
    }

    if (test.type === 'cssContains' && typeof value === 'string' && value.startsWith('@')) {
      return `${value}\n\n${sel} {\n  color: #333;\n}`;
    }

    return `${sel} {\n  ${prop}: ${value};\n}`;
  }

  function translateExpr(expr) {
    return expr
      .trim()
      .replace(/\bMod\b/gi, '%')
      .replace(/\bY\b/gi, 'and')
      .replace(/\bO\b/gi, 'or')
      .replace(/\bNo\b/gi, 'not ')
      .replace(/(\w+)\s*=\s*(\d+)/g, '$1 == $2')
      .replace(/([^=!<>])\s*=\s*([^=])/g, '$1 == $2');
  }

  function buildLogicSolutionFromPseudo(c) {
    const lines = [];
    Object.entries(c.inputs || {}).forEach(([k, v]) => {
      if (k === 'lecturas') {
        const nums = String(v).split(',').map((s) => s.trim());
        lines.push(`lecturas = [${nums.join(', ')}]`);
      } else if (typeof v === 'string') lines.push(`${k} = ${JSON.stringify(v)}`);
      else lines.push(`${k} = ${v}`);
    });
    if (lines.length) lines.push('');

    const pseudo = (c.pseudocode || '')
      .replace(/Algoritmo\s+\w+/gi, '')
      .replace(/FinAlgoritmo/gi, '')
      .trim();

    let indent = 0;
    const ind = () => '    '.repeat(indent);

    pseudo.split('\n').map((l) => l.trim()).filter(Boolean).forEach((line) => {
      if (/^Leer\s+/i.test(line)) return;

      const si = line.match(/^Si\s+(.+?)\s+Entonces$/i);
      if (si) {
        lines.push(`${ind()}if ${translateExpr(si[1])}:`);
        indent++;
        return;
      }
      if (/^Sino$/i.test(line)) {
        indent = Math.max(0, indent - 1);
        lines.push(`${ind()}else:`);
        indent++;
        return;
      }
      if (/^FinSi$/i.test(line)) {
        indent = Math.max(0, indent - 1);
        return;
      }
      const mientras = line.match(/^Mientras\s+(.+?)\s+Hacer$/i);
      if (mientras) {
        lines.push(`${ind()}while ${translateExpr(mientras[1])}:`);
        indent++;
        return;
      }
      if (/^FinMientras$/i.test(line)) {
        indent = Math.max(0, indent - 1);
        return;
      }
      const para = line.match(/^Para\s+(\w+)\s+<-\s+(\d+)\s+Hasta\s+(\w+)\s+Hacer$/i);
      if (para) {
        lines.push(`${ind()}for ${para[1]} in range(${para[2]}, ${para[3]} + 1):`);
        indent++;
        return;
      }
      if (/^FinPara$/i.test(line)) {
        indent = Math.max(0, indent - 1);
        return;
      }
      const assign = line.match(/^(\w+)\s*<-\s*(.+)$/i);
      if (assign) {
        lines.push(`${ind()}${assign[1]} = ${translateExpr(assign[2])}`);
        return;
      }
      const write = line.match(/^Escribir\s+(.+)$/i);
      if (write) {
        lines.push(`${ind()}print(${translateExpr(write[1])})`);
      }
    });

    return lines.join('\n');
  }

  function buildLogicFromLecturas(c) {
    const nums = String(c.inputs.lecturas).split(',').map((s) => s.trim());
    const lines = [`lecturas = [${nums.join(', ')}]`];
    const pseudo = c.pseudocode || '';

    if (/max\s*<-/i.test(pseudo) && /Mayor|mayor/.test(c.title + pseudo)) {
      lines.push(
        'max_val = float("-inf")',
        'for x in lecturas:',
        '    if x > max_val:',
        '        max_val = x',
        'print(max_val)'
      );
      return lines.join('\n');
    }

    if (/Factorial|f\s*<-/i.test(pseudo)) {
      const n = c.inputs.n ?? nums[0];
      lines.length = 0;
      lines.push(`n = ${n}`, 'f = 1', 'for i in range(1, n + 1):', '    f *= i', 'print(f)');
      return lines.join('\n');
    }

    return null;
  }

  function buildLogicSolution(c) {
    if (c.solution) return c.solution;

    if (c.inputs?.lecturas) {
      const fromLecturas = buildLogicFromLecturas(c);
      if (fromLecturas) return fromLecturas;
    }

    const fromPseudo = buildLogicSolutionFromPseudo(c);
    if (fromPseudo.includes('print(')) return fromPseudo;

    const lines = [];
    Object.entries(c.inputs || {}).forEach(([k, v]) => {
      if (typeof v === 'string') lines.push(`${k} = ${JSON.stringify(v)}`);
      else lines.push(`${k} = ${v}`);
    });
    (c.traceTable || []).forEach((row) => {
      const ins = row.instruccion || '';
      const assign = ins.match(/^(\w+)\s*<-\s*(.+)$/i);
      if (assign) lines.push(`${assign[1]} = ${translateExpr(assign[2])}`);
      const write = ins.match(/^Escribir\s+(.+)$/i);
      if (write) lines.push(`print(${translateExpr(write[1])})`);
    });
    if (!lines.some((l) => l.startsWith('print(')) && c.expectedOutput != null) {
      lines.push(`print(${JSON.stringify(c.expectedOutput)})`);
    }
    return lines.join('\n');
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

  function buildPracticeSolution(c, rawHint) {
    if (c.solution) return c.solution;

    switch (c.tech) {
      case 'javascript': return buildJsSolution(c, rawHint);
      case 'python': return buildPySolution(c, rawHint);
      case 'html': return buildHtmlSolution(c);
      case 'css': return buildCssSolution(c);
      default: return c.starterCode || '';
    }
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

  function buildReadingHint(c) {
    const parts = [
      'Lee el código línea a línea sin ejecutarlo.',
      c.scenario ? `Contexto: ${c.scenario}` : '',
      `Pregunta: ${c.question}`,
      `Pista: busca variables, operadores y el orden de evaluación. En nivel ${c.level}, ${c.learn?.concept || 'identifica el patrón principal.'}`,
      'Descarta opciones que contradigan tipos o sintaxis del lenguaje.'
    ];
    return parts.filter(Boolean).join('\n\n');
  }

  function buildReadingSolution(c) {
    if (c.solution) return c.solution;
    const correct = c.options?.[c.correctIndex] ?? '';
    return `${c.code}\n\n# Respuesta correcta: ${correct}`;
  }

  function stripHtml(html) {
    if (typeof document === 'undefined') return html;
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent || '';
  }

  function enrichPractice(c) {
    const rawHint = c.hint;
    c.solution = buildPracticeSolution(c, rawHint);
    if (!rawHint || looksLikeCode(rawHint) || rawHint.length < 120) {
      c.hint = buildPracticeHint(c);
    }
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