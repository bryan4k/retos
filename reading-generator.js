const ReadingGenerator = (function () {
  'use strict';

  const PER_GROUP = 50;
  const LEVELS_LIST = ['principiante', 'intermedio', 'avanzado', 'experto'];
  const TECHS_LIST = ['html', 'css', 'javascript', 'python'];

  const CONTEXTS = [
    'un checkout de e-commerce', 'un panel de administración', 'una API de pagos', 'un sistema de logs',
    'un componente de login', 'un servicio de notificaciones', 'un módulo de reportes', 'un job de cron',
    'un middleware de auth', 'un parser de CSV', 'un webhook handler', 'un cache layer',
    'un formulario multi-step', 'una cola de mensajes', 'un rate limiter', 'un test suite'
  ];

  const learnRead = {
    principiante: 'Leer código empieza por identificar variables, tipos y flujo línea a línea.',
    intermedio: 'Busca patrones: condicionales, bucles, transformaciones de datos y efectos secundarios.',
    avanzado: 'Analiza closures, async, herencia, especificidad CSS o scope antes de predecir el resultado.',
    experto: 'Evalúa arquitectura, edge cases, race conditions y trade-offs como en code review real.'
  };

  function q(id, tech, level, title, scenario, code, question, options, correct, explanation, wrong) {
    const item = {
      id, tech, level, type: 'reading', title, scenario, code, question, options,
      correctIndex: correct,
      learn: { concept: learnRead[level], whenToUse: 'En code reviews, debugging, onboarding y mantenimiento de legacy.' },
      explanation: {
        why: explanation.why,
        fix: explanation.fix || explanation.answer,
        whenToUse: explanation.when || 'Al leer PRs o depurar bugs en producción.'
      },
      wrongExplanations: wrong || {}
    };
    if (typeof ExerciseBriefs !== 'undefined') {
      item.description = ExerciseBriefs.reading(item);
    }
    return item;
  }

  function jsReading(level, i) {
    const ctx = CONTEXTS[i % CONTEXTS.length];
    const n = i + 1;
    const v = n * 3;
    const id = `read-js-${level.slice(0, 3)}-${String(n).padStart(2, '0')}`;

    const bank = {
      principiante: [
        () => q(id, 'javascript', level, `¿Qué imprime? #${n}`, `Snippet de ${ctx}`,
          `let precio = ${v + 100};\nlet desc = ${n + 10};\nconsole.log(precio - desc);`,
          '¿Cuál es la salida?', [`${v + 100 - (n + 10)}`, '115', '10015', 'undefined'], 0,
          { why: `Resta aritmética con valores del caso #${n}.`, answer: 'Operadores matemáticos se evalúan izquierda a derecha.', when: 'Cálculos de descuentos en carritos.' },
          { 1: 'Sumaste en vez de restar.', 2: 'Concatenaste strings si fueran strings.', 3: 'console.log siempre imprime algo.' }),
        () => q(id, 'javascript', level, `Tipo de dato #${n}`, `Variable en ${ctx}`,
          `const activo = true;\nconst stock = 0;\nconsole.log(typeof activo, typeof stock);`,
          '¿Qué imprime?', ['boolean number', 'true number', 'boolean undefined', 'bool int'], 0,
          { why: 'typeof true es "boolean", typeof 0 es "number".', when: 'Validar tipos antes de operar.' }),
        () => q(id, 'javascript', level, `Loop básico #${n}`, `Contador en ${ctx}`,
          `let s = 0;\nconst lim = ${n % 5 + 3};\nfor (let i = 1; i <= lim; i++) s += i;\nconsole.log(s);`,
          '¿Resultado?', [String((() => { let s=0,l=n%5+3; for(let i=1;i<=l;i++)s+=i; return s; })()), '3', '10', '0'], 0,
          { why: 'Suma acumulada del 1 al límite del bucle.', when: 'Acumuladores en bucles.' }),
        () => q(id, 'javascript', level, `Array length #${n}`, `Lista en ${ctx}`,
          `const items = ['a', 'b', 'c'];\nconsole.log(items.length);`,
          '¿Salida?', ['3', '2', 'c', 'undefined'], 0,
          { why: 'length devuelve cantidad de elementos.', when: 'Validar si hay datos antes de renderizar.' }),
        () => q(id, 'javascript', level, `Template string #${n}`, `Mensaje en ${ctx}`,
          `const user = 'Luis';\nconsole.log(\`Bienvenido \${user}\`);`,
          '¿Salida?', ['Bienvenido Luis', 'Bienvenido ${user}', 'Bienvenido user', 'Error'], 0,
          { why: 'Backticks interpolan variables.', when: 'Mensajes dinámicos al usuario.' })
      ],
      intermedio: [
        () => q(id, 'javascript', level, `map transform #${n}`, `Precios en ${ctx}`,
          `const p = [10, 20];\nconst r = p.map(x => x * 2);\nconsole.log(r);`,
          '¿r es?', ['[20, 40]', '[10, 20]', '60', '[10, 20, 10, 20]'], 0,
          { why: 'map aplica función a cada elemento sin mutar original.', when: 'Transformar listas para UI.' }),
        () => q(id, 'javascript', level, `filter lógica #${n}`, `Usuarios en ${ctx}`,
          `const u = [{a:1},{a:0},{a:3}];\nconsole.log(u.filter(x => x.a).length);`,
          '¿Cuántos pasan?', ['2', '3', '1', '0'], 0,
          { why: '0 es falsy, 1 y 3 truthy.', when: 'Filtrar registros activos.' }),
        () => q(id, 'javascript', level, `Destructuring #${n}`, `Pedido en ${ctx}`,
          `const o = { id: 1, total: 99 };\nconst { total } = o;\nconsole.log(total);`,
          '¿Salida?', ['99', '1', 'undefined', '{ total: 99 }'], 0,
          { why: 'Destructuring extrae propiedades.', when: 'Props de objetos API.' }),
        () => q(id, 'javascript', level, `Spread array #${n}`, `Merge en ${ctx}`,
          `console.log([...[1,2], 3]);`,
          '¿Resultado?', ['[1, 2, 3]', '[1, 2, [3]]', '[3, 1, 2]', 'Error'], 0,
          { why: 'Spread expande elementos.', when: 'Combinar arrays inmutables.' }),
        () => q(id, 'javascript', level, `Truthy check #${n}`, `Validación en ${ctx}`,
          `console.log(Boolean('0'), Boolean(0));`,
          '¿Salida?', ['true false', 'false false', 'true true', 'false true'], 0,
          { why: 'String "0" es truthy, número 0 es falsy.', when: 'Validar inputs de formularios.' })
      ],
      avanzado: [
        () => q(id, 'javascript', level, `Closure #${n}`, `Contador en ${ctx}`,
          `function mk() {\n  let c = 0;\n  return () => ++c;\n}\nconst f = mk();\nconsole.log(f(), f());`,
          '¿Salida?', ['1 2', '0 1', '1 1', '2 2'], 0,
          { why: 'Closure mantiene c entre llamadas.', when: 'Factories, privacidad de estado.' }),
        () => q(id, 'javascript', level, `Promise #${n}`, `Async en ${ctx}`,
          `Promise.resolve(5).then(x => x * 2).then(console.log);`,
          '¿Se imprime?', ['10', '5', 'Promise', 'undefined'], 0,
          { why: 'then encadena transformación async.', when: 'Cadenas de fetch.' }),
        () => q(id, 'javascript', level, `Hoisting var #${n}`, `Legacy en ${ctx}`,
          `console.log(x);\nvar x = 5;`,
          '¿Qué pasa?', ['undefined', '5', 'ReferenceError', 'null'], 0,
          { why: 'var se hoistea declarada sin valor.', when: 'Entender bugs en código antiguo.' }),
        () => q(id, 'javascript', level, `this arrow #${n}`, `Handler en ${ctx}`,
          `const obj = { n: 1, f: () => this.n };\nconsole.log(obj.f());`,
          '¿Salida?', ['undefined', '1', '0', 'Error'], 0,
          { why: 'Arrow no tiene this propio.', when: 'Elegir arrow vs function en callbacks.' }),
        () => q(id, 'javascript', level, `Short-circuit #${n}`, `Default en ${ctx}`,
          `const name = '' || 'Invitado';\nconsole.log(name);`,
          '¿Salida?', ['Invitado', '', 'undefined', 'false'], 0,
          { why: '|| retorna primer truthy o último.', when: 'Valores por defecto.' })
      ],
      experto: [
        () => q(id, 'javascript', level, `Event loop #${n}`, `Orden en ${ctx}`,
          `console.log(1);\nsetTimeout(() => console.log(2), 0);\nconsole.log(3);`,
          '¿Orden?', ['1 3 2', '1 2 3', '2 1 3', '3 2 1'], 0,
          { why: 'Sync primero, macrotasks después.', when: 'Debug de timing.' }),
        () => q(id, 'javascript', level, `Microtask #${n}`, `Promises en ${ctx}`,
          `console.log('a');\nPromise.resolve().then(() => console.log('b'));\nconsole.log('c');`,
          '¿Orden?', ['a c b', 'a b c', 'b a c', 'c b a'], 0,
          { why: 'Microtasks antes del siguiente macrotask.', when: 'Prioridad de Promises.' }),
        () => q(id, 'javascript', level, `Mutación sort #${n}`, `Bug en ${ctx}`,
          `const a = [3,1,2];\nconst b = a.sort();\nconsole.log(a === b);`,
          '¿Salida?', ['true', 'false', 'undefined', '[3,1,2]'], 0,
          { why: 'sort muta y retorna misma referencia.', when: 'Copiar antes de ordenar.' }),
        () => q(id, 'javascript', level, `== vs === #${n}`, `Comparación en ${ctx}`,
          `console.log(0 == false, 0 === false);`,
          '¿Salida?', ['true false', 'false true', 'true true', 'false false'], 0,
          { why: '== coerciona tipos, === no.', when: 'Siempre preferir ===.' }),
        () => q(id, 'javascript', level, `Prototype #${n}`, `Herencia en ${ctx}`,
          `function A() {}\nA.prototype.x = 1;\nconst a = new A();\nconsole.log(a.x);`,
          '¿Salida?', ['1', 'undefined', 'Error', 'null'], 0,
          { why: 'Instancia delega al prototype.', when: 'Entender clases ES6.' })
      ]
    };

    return bank[level][i % bank[level].length]();
  }

  function pyReading(level, i) {
    const ctx = CONTEXTS[i % CONTEXTS.length];
    const n = i + 1;
    const id = `read-py-${level.slice(0, 3)}-${String(n).padStart(2, '0')}`;
    const snippets = [
      [`x = [1, 2, 3]\nprint(len(x))`, '3', ['3', '2', '6', 'Error'], 0],
      [`print(10 // 3)`, '3', ['3', '3.33', '1', '0'], 0],
      [`d = {'a': 1}\nprint(d.get('b', 0))`, '0', ['0', 'None', '1', 'KeyError'], 0],
      [`print(list(range(2)))`, '[0, 1]', ['[0, 1]', '[1, 2]', '[2]', '[0,1]'], 0],
      [`print('ab' * 2)`, 'abab', ['abab', 'ab2', 'aab b', 'Error'], 0]
    ];
    const s = snippets[i % snippets.length];
    return q(id, 'python', level, `Lee Python #${n}`, `Script de ${ctx}`, s[0],
      '¿Cuál es la salida correcta?', s[2], s[3],
      { why: `La salida es ${s[1]}.`, when: 'Scripts de datos y automatización.' });
  }

  function htmlReading(level, i) {
    const n = i + 1;
    const id = `read-html-${level.slice(0, 3)}-${String(n).padStart(2, '0')}`;
    const ctx = CONTEXTS[i % CONTEXTS.length];
    const items = [
      [`<button disabled>Enviar</button>`, 'El botón no es clickeable', ['No clickeable', 'Se envía el form', 'Estilo gris solo', 'Error HTML'], 0],
      [`<input type="email" required>`, 'Validación nativa de email', ['Valida email', 'Solo estilo', 'Envía siempre', 'Requiere JS'], 0],
      [`<a href="#sec">Ir</a>`, 'Enlace interno a ancla', ['Ancla misma página', 'Nueva pestaña', 'Descarga archivo', 'POST request'], 0],
      [`<img src="x.jpg" alt="Logo">`, 'Lectores de pantalla leen alt', ['Accesible con alt', 'Decorativa solo', 'Bloquea SEO', 'Requiere title'], 0],
      [`<nav><ul><li><a href="/">Home</a></li></ul></nav>`, 'Estructura semántica de menú', ['Nav semántico correcto', 'Debe ser solo divs', 'ul no permitido', 'li solo en ol'], 0]
    ];
    const item = items[i % items.length];
    return q(id, 'html', level, `Interpreta HTML #${n}`, `Markup de ${ctx}`, item[0],
      `¿Qué significa o qué efecto tiene?`, item[2], item[3],
      { why: item[1], when: 'Code review de plantillas y emails HTML.' });
  }

  function cssReading(level, i) {
    const n = i + 1;
    const id = `read-css-${level.slice(0, 3)}-${String(n).padStart(2, '0')}`;
    const ctx = CONTEXTS[i % CONTEXTS.length];
    const items = [
      [`.box { display: flex; justify-content: center; }`, 'Centra hijos horizontalmente en flex', ['Centra horizontal', 'Centra vertical', 'Oculta overflow', 'Grid implícito'], 0],
      [`.a { margin: 10px 20px; }`, '10 arriba/abajo, 20 izq/der', ['10 vertical 20 horizontal', '10 todos lados', '20 vertical', 'Solo izquierda'], 0],
      [`.x { position: fixed; }`, 'Se fija al viewport', ['Fijo al viewport', 'Relativo al padre', 'Flujo normal', 'Solo en print'], 0],
      [`.g { display: grid; gap: 1rem; }`, 'Espacio entre celdas grid', ['Gap entre celdas', 'Padding interno', 'Margin externo', 'Border spacing'], 0],
      [`@media (max-width: 768px) { .nav { flex-direction: column; } }`, 'Aplica en pantallas <=768px', ['Móvil/tablet estrecho', 'Solo desktop', 'Solo print', 'Nunca aplica'], 0]
    ];
    const item = items[i % items.length];
    return q(id, 'css', level, `Interpreta CSS #${n}`, `Estilos de ${ctx}`, item[0],
      '¿Qué hace esta regla?', item[2], item[3],
      { why: item[1], when: 'Revisar PRs de UI y debug en DevTools.' });
  }

  function generateAll() {
    const all = [];
    TECHS_LIST.forEach((tech) => {
      LEVELS_LIST.forEach((level) => {
        for (let i = 0; i < PER_GROUP; i++) {
          if (tech === 'javascript') all.push(jsReading(level, i));
          else if (tech === 'python') all.push(pyReading(level, i));
          else if (tech === 'html') all.push(htmlReading(level, i));
          else if (tech === 'css') all.push(cssReading(level, i));
        }
      });
    });
    return all;
  }

  return { generateAll, PER_GROUP };
})();