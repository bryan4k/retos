const ChallengeGenerator = (function () {
  'use strict';

  const PER_GROUP = 50;
  const LEVELS_LIST = ['principiante', 'intermedio', 'avanzado', 'experto'];
  const TECHS_LIST = ['html', 'css', 'javascript', 'python'];

  const CONTEXTS = [
    'una app de delivery', 'un e-commerce de ropa', 'un dashboard de ventas', 'una plataforma educativa',
    'un sistema de reservas hoteleras', 'una app bancaria', 'un CRM de clientes', 'un portal de empleo',
    'una red social', 'un sistema de inventario', 'una app de fitness', 'un marketplace de comida',
    'un sistema de tickets de soporte', 'una plataforma de streaming', 'un admin de clínica médica',
    'una app inmobiliaria', 'un sistema de facturación', 'una tienda de electrónica', 'un blog de noticias',
    'una app de transporte', 'un sistema de nómina', 'una plataforma de cursos', 'un comparador de precios',
    'una app de tareas', 'un sistema de puntos de fidelidad'
  ];

  function makeLearn(tech, level, title, scenario, ctx) {
    return LearnContent.build({ tech, level, title, context: ctx, scenario });
  }

  function fb(why, fix, when) {
    return { why, fix, whenToUse: when };
  }

  // ─── JAVASCRIPT ───
  function jsChallenges(level, startIdx) {
    const list = [];
    const ops = {
      principiante: [
        { t: 'Calcular total de pedido', fn: 'totalPedido', code: 'precios', test: [[10, 20, 5]], exp: 35, op: 'suma' },
        { t: 'Aplicar descuento fijo', fn: 'conDescuento', code: 'precio, desc', test: [[100, 15]], exp: 85, op: 'resta' },
        { t: 'Calcular subtotal', fn: 'subtotal', code: 'precio, cant', test: [[25, 4]], exp: 100, op: 'mult' },
        { t: 'Dividir en cuotas', fn: 'cuota', code: 'total, n', test: [[1200, 3]], exp: 400, op: 'div' },
        { t: '¿Hay stock?', fn: 'hayStock', code: 'stock', test: [[5]], exp: true, op: 'gt0' },
        { t: '¿Está agotado?', fn: 'agotado', code: 'stock', test: [[0]], exp: true, op: 'eq0' },
        { t: 'Saludar cliente', fn: 'saludar', code: 'nombre', test: [['Ana']], exp: 'Hola, Ana!', op: 'hola' },
        { t: 'Precio con IVA', fn: 'conIva', code: 'precio', test: [[100]], exp: 116, op: 'iva16' },
        { t: 'Doble puntos', fn: 'doblePuntos', code: 'pts', test: [[50]], exp: 100, op: 'dbl' },
        { t: 'Mitad de cantidad', fn: 'mitad', code: 'n', test: [[10]], exp: 5, op: 'half' }
      ],
      intermedio: [
        { t: 'Total del carrito', fn: 'totalCarrito', items: true, test: [[[25, 2], [10, 3]]], exp: 80 },
        { t: 'Filtrar activos', fn: 'soloActivos', filter: true, test: [[[{ a: 1, ok: true }, { a: 2, ok: false }]]], exp: 1 },
        { t: 'Promedio de ratings', fn: 'promedio', avg: true, test: [[[4, 5, 3]]], exp: 4 },
        { t: 'Email válido básico', fn: 'emailOk', email: true, test: [['a@b.com']], exp: true },
        { t: 'Formatear moneda', fn: 'formato', fmt: true, test: [[1500]], exp: '$1,500.00' }
      ],
      avanzado: [
        { t: 'Agrupar por categoría', fn: 'agrupar', group: true },
        { t: 'Buscar producto', fn: 'buscar', search: true },
        { t: 'Ordenar por fecha', fn: 'ordenar', sort: true },
        { t: 'Paginar resultados', fn: 'paginar', page: true },
        { t: 'Calcular comisión', fn: 'comision', comm: true }
      ],
      experto: [
        { t: 'Throttle eventos', fn: 'throttle', pattern: 'throttle' },
        { t: 'Memoizar cálculo', fn: 'memoize', pattern: 'memo' },
        { t: 'Pipe de funciones', fn: 'pipe', pattern: 'pipe' },
        { t: 'Retry con backoff', fn: 'retry', pattern: 'retry' },
        { t: 'Deep equal', fn: 'deepEqual', pattern: 'deep' }
      ]
    };

    const base = ops[level] || ops.principiante;
    for (let i = 0; i < PER_GROUP; i++) {
      const ctx = CONTEXTS[i % CONTEXTS.length];
      const b = base[i % base.length];
      const id = `js-${level.slice(0, 3)}-${String(i + 1).padStart(2, '0')}`;
      const scenario = level === 'principiante' ? null : `${['🏢', '🛒', '📊', '🔧', '💼'][i % 5]} Caso real en ${ctx}.`;

      let starterCode, tests, functionName = b.fn + (i > 9 ? i : '');

      if (level === 'principiante') {
        functionName = b.fn;
        const sc = {
          suma: `function ${functionName}(precios) {\n  // Suma todos los precios\n  \n}`,
          resta: `function ${functionName}(precio, descuento) {\n  \n}`,
          mult: `function ${functionName}(precio, cantidad) {\n  \n}`,
          div: `function ${functionName}(total, cuotas) {\n  \n}`,
          gt0: `function ${functionName}(stock) {\n  // true si stock > 0\n  \n}`,
          eq0: `function ${functionName}(stock) {\n  // true si stock === 0\n  \n}`,
          hola: `function ${functionName}(nombre) {\n  \n}`,
          iva16: `function ${functionName}(precio) {\n  // Aplica 16% IVA\n  \n}`,
          dbl: `function ${functionName}(puntos) {\n  \n}`,
          half: `function ${functionName}(cantidad) {\n  \n}`
        };
        starterCode = sc[b.op] || sc.suma;
        const answers = {
          suma: (args) => args[0].reduce((a, b) => a + b, 0),
          resta: (args) => args[0] - args[1],
          mult: (args) => args[0] * args[1],
          div: (args) => args[0] / args[1],
          gt0: (args) => args[0] > 0,
          eq0: (args) => args[0] === 0,
          hola: (args) => `Hola, ${args[0]}!`,
          iva16: (args) => args[0] * 1.16,
          dbl: (args) => args[0] * 2,
          half: (args) => args[0] / 2
        };
        const exp = answers[b.op](b.test);
        tests = [{ args: b.test, expected: exp, name: 'Caso principal', feedback: fb('Revisa la operación y el return.', 'Verifica tipos y return explícito.', 'Operaciones básicas en lógica de negocio.') }];
      } else if (level === 'intermedio') {
        functionName = b.fn;
        if (b.items) {
          starterCode = `function ${functionName}(items) {\n  // items: [{precio, cantidad}]\n  \n}`;
          tests = [{ args: [[[10, 2], [5, 4]]], expected: 40, name: 'Carrito', feedback: fb('Multiplica precio*cantidad y suma.', 'items.reduce((t,i)=>t+i[0]*i[1],0) adaptado a objetos.', 'Checkout e-commerce.') }];
        } else if (b.filter) {
          starterCode = `function ${functionName}(usuarios) {\n  // Filtra activos\n  \n}`;
          tests = [{ args: [[{ n: 'A', activo: true }, { n: 'B', activo: false }]], expected: 1, name: 'Filtrar', custom: true, run: (fn, a) => a(fn([{ n: 'A', activo: true }, { n: 'B', activo: false }]).length === 1, 'Filtra activos') }];
        } else if (b.avg) {
          starterCode = `function ${functionName}(nums) {\n  \n}`;
          tests = [{ args: [[[4, 5, 3]]], expected: 4, name: 'Promedio' }];
        } else if (b.email) {
          starterCode = `function ${functionName}(email) {\n  \n}`;
          tests = [{ args: [['user@mail.com']], expected: true, name: 'Email ok' }, { args: [['bad']], expected: false, name: 'Email mal' }];
        } else {
          starterCode = `function ${functionName}(monto) {\n  return '$' + monto.toLocaleString('en-US') + '.00';\n}`;
          tests = [{ args: [[1500]], expected: '$1,500.00', name: 'Formato' }];
        }
      } else if (level === 'avanzado') {
        functionName = b.fn;
        starterCode = `function ${functionName}(datos) {\n  // Implementa para ${ctx}\n  \n}`;
        tests = [{ name: 'Estructura válida', custom: true, run: (fn, a) => a(typeof fn === 'function', 'Define la función') }];
      } else {
        functionName = b.fn;
        starterCode = `function ${functionName}(/* params */) {\n  // Patrón: ${b.pattern}\n  \n}`;
        tests = [{ name: 'Función definida', custom: true, run: (fn, a) => a(typeof fn === 'function', 'Implementa el patrón') }];
      }

      const brief = ExerciseBriefs.practice({
        tech: 'javascript', level, ctx, functionName, tests, title: b.t,
        op: b.op, items: b.items, filter: b.filter, avg: b.avg, email: b.email, fmt: b.fmt,
        sampleTest: b.test, sampleExp: level === 'principiante' ? tests[0]?.expected : undefined
      });

      list.push({
        id, tech: 'javascript', level, title: `${b.t} #${i + 1}`,
        scenario: brief.scenario || scenario,
        description: brief.description,
        learn: makeLearn('javascript', level, `${b.t} #${i + 1}`, brief.scenario || scenario, ctx),
        starterCode, functionName, tests,
        hint: 'Lee el escenario y piensa en el caso de negocio antes de codear.',
        feedback: { general: fb('El resultado no coincide.', 'Depura con console.log paso a paso.', 'Revisa la lógica paso a paso antes de optimizar.') }
      });
    }
    return list;
  }

  // ─── PYTHON ───
  function pyChallenges(level) {
    const list = [];
    const templates = {
      principiante: [
        { fn: 'saludar', code: 'nombre', test: [['Pedro']], exp: 'Hola, Pedro!' },
        { fn: 'suma', code: 'a, b', test: [[3, 7]], exp: 10 },
        { fn: 'es_positivo', code: 'n', test: [[5]], exp: true },
        { fn: 'doble', code: 'n', test: [[8]], exp: 16 },
        { fn: 'area_cuadrado', code: 'lado', test: [[5]], exp: 25 }
      ],
      intermedio: [
        { fn: 'descuento', desc: '10% si > 500' },
        { fn: 'contar_palabras', desc: 'split y len' },
        { fn: 'promedio_lista', desc: 'sum/len' },
        { fn: 'filtrar_pares', desc: 'list comprehension' },
        { fn: 'formatear_nombre', desc: 'title case' }
      ],
      avanzado: [
        { fn: 'resumen_ventas', desc: 'dict con total y max' },
        { fn: 'agrupar_por', desc: 'defaultdict' },
        { fn: 'validar_rango', desc: 'min max' },
        { fn: 'parsear_fecha', desc: 'strptime' },
        { fn: 'top_n', desc: 'sorted slice' }
      ],
      experto: [
        { fn: 'es_password_segura', desc: 'validación compuesta' },
        { fn: 'cache_decorator', desc: 'decorador simple' },
        { fn: 'flatten', desc: 'recursión' },
        { fn: 'merge_dicts', desc: 'combina dicts' },
        { fn: 'rate_limiter', desc: 'clase simple' }
      ]
    };

    const base = templates[level];
    for (let i = 0; i < PER_GROUP; i++) {
      const ctx = CONTEXTS[i % CONTEXTS.length];
      const b = base[i % base.length];
      const id = `py-${level.slice(0, 3)}-${String(i + 1).padStart(2, '0')}`;
      const scenario = level === 'principiante' ? null : `🐍 Backend de ${ctx}: automatiza este proceso.`;

      let starterCode, tests, functionName = b.fn;
      if (level === 'principiante') {
        starterCode = `def ${functionName}(${b.code}):\n    pass`;
        if (b.fn === 'saludar') tests = [{ args: b.test, expected: b.exp, name: 'Saludo' }];
        else if (b.fn === 'suma') tests = [{ args: b.test, expected: b.exp, name: 'Suma' }];
        else if (b.fn === 'es_positivo') tests = [{ args: b.test, expected: true, name: 'Positivo' }];
        else if (b.fn === 'doble') tests = [{ args: b.test, expected: b.exp, name: 'Doble' }];
        else tests = [{ args: b.test, expected: b.exp, name: 'Área' }];
      } else {
        starterCode = `def ${functionName}(datos):\n    """${b.desc} - ${ctx}"""\n    pass`;
        tests = [{ args: [[1, 2, 3]], expected: null, name: 'Implementación', custom: true, run: () => {} }];
        tests = [{ name: 'Función definida', custom: true, run: (fn, a) => a(callable(fn), 'Define la función') }];
      }

      const brief = ExerciseBriefs.practice({
        tech: 'python', level, ctx, functionName, tests, title: b.fn,
        desc: b.desc, code: b.code, fnKey: b.fn
      });

      list.push({
        id, tech: 'python', level, title: `${b.fn.replace(/_/g, ' ')} #${i + 1}`,
        scenario: brief.scenario || scenario,
        description: brief.description,
        learn: makeLearn('python', level, `${b.fn.replace(/_/g, ' ')} #${i + 1}`, brief.scenario || scenario, ctx),
        starterCode, functionName, tests,
        hint: 'Python usa indentación de 4 espacios. No olvides return.',
        feedback: { general: fb('Error de lógica o sintaxis.', 'Revisa indentación y tipos.', 'Valida tipos y casos borde.') }
      });
    }
    return list;
  }

  // ─── HTML ───
  function htmlChallenges(level) {
    const list = [];
    const tags = {
      principiante: ['p', 'h1', 'ul', 'a', 'img', 'button', 'input', 'label', 'div', 'span'],
      intermedio: ['form', 'select', 'textarea', 'table', 'thead', 'nav', 'article', 'section', 'footer', 'header'],
      avanzado: ['main', 'aside', 'figure', 'figcaption', 'details', 'summary', 'fieldset', 'legend', 'datalist', 'output'],
      experto: ['dialog', 'template', 'slot', 'picture', 'source', 'track', 'meter', 'progress', 'time', 'address']
    };
    const base = tags[level];

    for (let i = 0; i < PER_GROUP; i++) {
      const ctx = CONTEXTS[i % CONTEXTS.length];
      const tag = base[i % base.length];
      const id = `html-${level.slice(0, 3)}-${String(i + 1).padStart(2, '0')}`;
      const scenario = level === 'principiante' ? null : `📄 Maquetación para ${ctx}.`;

      const tests = [
        { type: 'exists', selector: tag, name: `Elemento <${tag}>` },
        { type: 'exists', selector: tag === 'img' ? 'img[alt]' : tag, name: tag === 'img' ? 'Alt en imagen' : 'Presente' }
      ];
      if (tag === 'a') tests.push({ type: 'attribute', selector: 'a', attr: 'href', notEmpty: true, name: 'Enlace con href' });
      if (tag === 'form') tests.push({ type: 'exists', selector: 'input', name: 'Input en form' });
      if (tag === 'table') tests.push({ type: 'exists', selector: 'th', name: 'Headers tabla' });

      const brief = ExerciseBriefs.practice({ tech: 'html', level, ctx, tag, tests });

      list.push({
        id, tech: 'html', level,
        title: `Usar <${tag}> en ${ctx.split(' ').slice(-2).join(' ')} #${i + 1}`,
        scenario: brief.scenario || scenario,
        description: brief.description,
        learn: makeLearn('html', level, `Usar <${tag}> #${i + 1}`, brief.scenario || scenario, ctx),
        starterCode: `<!-- Maqueta para ${ctx} usando <${tag}>\n\n-->`,
        tests,
        hint: `Investiga cuándo usar <${tag}> y sus atributos obligatorios.`,
        feedback: { general: fb(`Falta <${tag}> o atributos requeridos.`, 'Consulta MDN para este elemento.', 'Markup semántico en producción.') }
      });
    }
    return list;
  }

  // ─── CSS ───
  function cssChallenges(level) {
    const list = [];
    const props = {
      principiante: [
        { p: 'color', sel: '.texto', val: 'color' },
        { p: 'font-size', sel: '.titulo', min: 20 },
        { p: 'margin', sel: '.box', val: 'margin' },
        { p: 'padding', sel: '.card', val: 'padding' },
        { p: 'border-radius', sel: '.btn', min: 4 },
        { p: 'background-color', sel: '.hero', val: 'background' },
        { p: 'text-align', sel: '.center', match: ['center'] },
        { p: 'font-weight', sel: '.bold', match: ['700', 'bold'] },
        { p: 'width', sel: '.full', val: 'width' },
        { p: 'height', sel: '.banner', val: 'height' }
      ],
      intermedio: [
        { p: 'display', sel: '.flex', expected: 'flex' },
        { p: 'grid-template-columns', sel: '.grid', css: 'grid' },
        { p: 'gap', sel: '.grid', min: 8 },
        { p: 'justify-content', sel: '.nav', match: ['space-between', 'center'] },
        { p: 'align-items', sel: '.row', match: ['center'] },
        { p: 'flex-direction', sel: '.stack', match: ['column'] },
        { p: 'position', sel: '.sticky', match: ['sticky', 'fixed'] },
        { p: 'z-index', sel: '.modal', min: 1 },
        { p: 'overflow', sel: '.scroll', match: ['auto', 'scroll', 'hidden'] },
        { p: 'box-shadow', sel: '.elevated', val: 'box-shadow' }
      ],
      avanzado: [
        { p: 'transition', sel: '.hover', val: 'transition' },
        { p: 'transform', sel: '.scale', val: 'transform' },
        { p: 'animation', sel: '.pulse', val: 'animation' },
        { p: 'clip-path', sel: '.shape', val: 'clip-path' },
        { p: 'filter', sel: '.blur', val: 'filter' },
        { p: 'grid-area', sel: '.item', val: 'grid-area' },
        { p: 'minmax', css: true },
        { p: 'aspect-ratio', sel: '.video', val: 'aspect-ratio' },
        { p: 'object-fit', sel: 'img', match: ['cover', 'contain'] },
        { p: 'backdrop-filter', sel: '.glass', val: 'backdrop-filter' }
      ],
      experto: [
        { p: '--custom-prop', css: 'var' },
        { p: 'container-type', sel: '.container', val: 'container' },
        { p: 'has()', css: 'has' },
        { p: 'subgrid', css: 'subgrid' },
        { p: 'clamp()', css: 'clamp' },
        { p: 'min()', css: 'min' },
        { p: 'max()', css: 'max' },
        { p: 'layer', css: 'layer' },
        { p: 'scope', css: 'scope' },
        { p: 'scroll-snap', sel: '.carousel', val: 'scroll-snap' }
      ]
    };

    const base = props[level];
    for (let i = 0; i < PER_GROUP; i++) {
      const ctx = CONTEXTS[i % CONTEXTS.length];
      const b = base[i % base.length];
      const id = `css-${level.slice(0, 3)}-${String(i + 1).padStart(2, '0')}`;
      const sel = b.sel || '.elemento';
      const scenario = `🎨 UI de ${ctx}: estiliza según requisitos del diseño.`;

      const scaffold = `<div class="app"><div class="${sel.replace('.', '')}">Contenido ${i + 1}</div></div>`;
      let tests = [];

      if (b.expected) tests = [{ type: 'style', selector: sel, property: b.p.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), expected: b.expected, name: b.p }];
      else if (b.match) tests = [{ type: 'style', selector: sel, property: b.p.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), match: b.match, name: b.p }];
      else if (b.min) tests = [{ type: 'style', selector: sel, property: b.p.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), minPx: b.min, name: b.p }];
      else if (b.css) tests = [{ type: 'cssContains', value: b.p || b.css, name: 'Regla CSS' }];
      else tests = [{ type: 'cssContains', value: b.p, name: b.p }];

      const brief = ExerciseBriefs.practice({ tech: 'css', level, ctx, sel, prop: b.p, tests });

      list.push({
        id, tech: 'css', level,
        title: `Estilo ${b.p} para ${ctx.split(' ').pop()} #${i + 1}`,
        scenario: brief.scenario || scenario,
        description: brief.description,
        learn: makeLearn('css', level, `Estilo ${b.p} #${i + 1}`, brief.scenario || scenario, ctx),
        htmlScaffold: scaffold,
        starterCode: `${sel} {\n  /* Aplica ${b.p} */\n  \n}`,
        tests,
        hint: `Busca en MDN: CSS ${b.p}`,
        feedback: { general: fb(`La propiedad ${b.p} no está bien aplicada.`, 'Inspecciona en DevTools el selector correcto.', 'Estilos en componentes de UI real.') }
      });
    }
    return list;
  }

  function generateAll() {
    const all = [];
    const handcraftedIds = new Set(
      [...(typeof CHALLENGES_HTML !== 'undefined' ? CHALLENGES_HTML : []),
       ...(typeof CHALLENGES_CSS !== 'undefined' ? CHALLENGES_CSS : []),
       ...(typeof CHALLENGES_JAVASCRIPT !== 'undefined' ? CHALLENGES_JAVASCRIPT : []),
       ...(typeof CHALLENGES_PYTHON !== 'undefined' ? CHALLENGES_PYTHON : [])].map((c) => c.id)
    );

    TECHS_LIST.forEach((tech) => {
      LEVELS_LIST.forEach((level) => {
        let generated = [];
        if (tech === 'javascript') generated = jsChallenges(level);
        else if (tech === 'python') generated = pyChallenges(level);
        else if (tech === 'html') generated = htmlChallenges(level);
        else if (tech === 'css') generated = cssChallenges(level);

        const handcrafted = {
          html: typeof CHALLENGES_HTML !== 'undefined' ? CHALLENGES_HTML.filter((c) => c.level === level) : [],
          css: typeof CHALLENGES_CSS !== 'undefined' ? CHALLENGES_CSS.filter((c) => c.level === level) : [],
          javascript: typeof CHALLENGES_JAVASCRIPT !== 'undefined' ? CHALLENGES_JAVASCRIPT.filter((c) => c.level === level) : [],
          python: typeof CHALLENGES_PYTHON !== 'undefined' ? CHALLENGES_PYTHON.filter((c) => c.level === level) : []
        }[tech];

        const handCount = handcrafted.length;
        const toAdd = Math.max(0, PER_GROUP - handCount);
        const filtered = generated.filter((g) => !handcraftedIds.has(g.id)).slice(0, toAdd);
        all.push(...handcrafted, ...filtered);
      });
    });

    return all;
  }

  return { generateAll, PER_GROUP };
})();