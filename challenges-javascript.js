const CHALLENGES_JAVASCRIPT = [
  {
    id: 'js-suma-dos-numeros',
    tech: 'javascript',
    level: 'principiante',
    title: 'Suma dos números',
    scenario: null,
    description: `<p>Crea <code>suma(a, b)</code> que devuelva la suma de dos números.</p>`,
    learn: {
      concept: 'Las funciones encapsulan lógica reutilizable con parámetros de entrada y return de salida.',
      whenToUse: 'Cálculos, transformaciones, validaciones. Toda lógica que repitas más de una vez debe ser función.'
    },
    starterCode: `function suma(a, b) {\n  \n}`,
    functionName: 'suma',
    tests: [
      {
        args: [2, 3], expected: 5, name: 'Positivos',
        feedback: { why: 'La función no devuelve la suma correcta.', fix: 'return a + b;', whenToUse: 'Operaciones aritméticas básicas en calculadoras y totales.' }
      },
      { args: [-1, 1], expected: 0, name: 'Opuestos' },
      { args: [0, 0], expected: 0, name: 'Ceros' }
    ],
    hint: 'return a + b;',
    feedback: {
      compile: { why: 'Syntax error o falta la función.', fix: 'Define function suma(a, b) { return a + b; }', whenToUse: 'Siempre nombra funciones en camelCase en JS.' },
      general: { why: 'Sin return la función devuelve undefined.', fix: 'Agrega return antes del resultado.', whenToUse: 'Toda función que produce valor necesita return explícito (salvo arrow implícitas).' }
    }
  },
  {
    id: 'js-es-par',
    tech: 'javascript',
    level: 'principiante',
    title: '¿Es par?',
    scenario: null,
    description: `<p><code>esPar(numero)</code> devuelve true si el número es par.</p>`,
    learn: {
      concept: 'El operador módulo (%) devuelve el resto de una división.',
      whenToUse: 'Validar pares/impares, alternar estilos en listas, paginación, hash buckets.'
    },
    starterCode: `function esPar(numero) {\n  \n}`,
    functionName: 'esPar',
    tests: [
      { args: [4], expected: true, name: 'Cuatro es par', feedback: { why: '4 % 2 === 0, debería ser true.', fix: 'return numero % 2 === 0;', whenToUse: 'Alternar colores: items.filter((_, i) => i % 2 === 0)' } },
      { args: [7], expected: false, name: 'Siete es impar' },
      { args: [0], expected: true, name: 'Cero es par' }
    ],
    hint: 'return numero % 2 === 0;',
    feedback: {
      general: { why: 'Confundir = con === o olvidar que 0 es par.', fix: 'Usa === para comparar booleanos.', whenToUse: 'Condicionales que dependen de divisibilidad.' }
    }
  },
  {
    id: 'js-carrito-total',
    tech: 'javascript',
    level: 'intermedio',
    title: 'Total del carrito',
    scenario: '🛒 E-commerce: calcula el total del carrito aplicando cantidad × precio de cada producto.',
    description: `<p>Implementa <code>calcularTotal(productos)</code> donde cada producto es <code>{ nombre, precio, cantidad }</code>.</p>`,
    learn: {
      concept: 'reduce() acumula un valor iterando un array. Es el patrón estándar para sumar/agregar.',
      whenToUse: 'Totales de carrito, facturas, estadísticas, agrupaciones. Alternativa: for...of con acumulador.'
    },
    starterCode: `function calcularTotal(productos) {\n  // productos: [{ nombre, precio, cantidad }, ...]\n  \n}`,
    functionName: 'calcularTotal',
    tests: [
      {
        args: [[{ nombre: 'Camisa', precio: 25, cantidad: 2 }, { nombre: 'Pantalón', precio: 40, cantidad: 1 }]],
        expected: 90, name: 'Carrito con 2 productos',
        feedback: { why: 'No multiplicaste precio × cantidad o no sumaste todo.', fix: 'productos.reduce((t, p) => t + p.precio * p.cantidad, 0)', whenToUse: 'Checkout, dashboards de ventas, reportes.' }
      },
      { args: [[]], expected: 0, name: 'Carrito vacío' },
      { args: [[{ nombre: 'Gorra', precio: 15, cantidad: 3 }]], expected: 45, name: 'Un producto' }
    ],
    hint: 'Usa reduce: productos.reduce((total, p) => total + p.precio * p.cantidad, 0)',
    feedback: {
      general: { why: 'Olvidar cantidad o empezar reduce sin valor inicial 0.', fix: 'Siempre pasa 0 como segundo argumento de reduce para sumas.', whenToUse: 'Toda agregación numérica sobre arrays.' }
    }
  },
  {
    id: 'js-validar-email',
    tech: 'javascript',
    level: 'intermedio',
    title: 'Validar email de registro',
    scenario: '📧 Formulario de registro: rechaza emails inválidos antes de llamar al servidor.',
    description: `<p><code>esEmailValido(email)</code> devuelve true si contiene @, un punto después del @, y al menos 5 caracteres.</p>`,
    learn: {
      concept: 'Validación en cliente mejora UX al dar feedback instantáneo, pero siempre revalida en servidor.',
      whenToUse: 'Registro, newsletter, checkout. Combina validación simple en JS con regex o API en backend.'
    },
    starterCode: `function esEmailValido(email) {\n  \n}`,
    functionName: 'esEmailValido',
    tests: [
      {
        args: ['user@mail.com'], expected: true, name: 'Email válido',
        feedback: { why: 'El email cumple las reglas pero tu función devuelve false.', fix: 'Verifica includes("@"), indexOf(".") > indexOf("@"), length >= 5', whenToUse: 'Antes de fetch() en formularios de registro.' }
      },
      { args: ['invalido'], expected: false, name: 'Sin @' },
      { args: ['a@b'], expected: false, name: 'Muy corto' },
      { args: ['user@.com'], expected: false, name: 'Punto mal ubicado' }
    ],
    hint: 'const [user, domain] = email.split("@"); return domain && domain.includes(".") && email.length >= 5;',
    feedback: {
      general: { why: 'Validar solo @ no basta; "a@b" pasaría sin más reglas.', fix: 'Verifica estructura mínima: usuario@dominio.ext', whenToUse: 'Validación rápida en cliente; usa librerías o backend para producción.' }
    }
  },
  {
    id: 'js-filtrar-productos',
    tech: 'javascript',
    level: 'avanzado',
    title: 'Filtrar productos por precio',
    scenario: '🔍 Tienda online: el usuario mueve un slider de precio máximo y la lista se actualiza en tiempo real.',
    description: `<p><code>filtrarPorPrecio(productos, maxPrecio)</code> devuelve productos con precio &lt;= maxPrecio, ordenados de menor a mayor.</p>`,
    learn: {
      concept: 'filter() selecciona elementos; sort() ordena. Encadenar ambos es un patrón funcional muy común.',
      whenToUse: 'Búsquedas, filtros de e-commerce, tablas admin, dashboards con criterios múltiples.'
    },
    starterCode: `function filtrarPorPrecio(productos, maxPrecio) {\n  // productos: [{ nombre, precio }]\n  \n}`,
    functionName: 'filtrarPorPrecio',
    tests: [
      {
        args: [[{ nombre: 'A', precio: 100 }, { nombre: 'B', precio: 50 }, { nombre: 'C', precio: 200 }], 150],
        expected: [{ nombre: 'B', precio: 50 }, { nombre: 'A', precio: 100 }],
        name: 'Filtra y ordena',
        feedback: { why: 'Falta filtrar, ordenar, o modificaste el array original.', fix: 'return productos.filter(p => p.precio <= max).sort((a,b) => a.precio - b.precio)', whenToUse: 'Filtros de catálogo con múltiples criterios encadenados.' }
      },
      { args: [[{ nombre: 'X', precio: 300 }], 100], expected: [], name: 'Ninguno cumple' }
    ],
    hint: 'Encadena .filter() y .sort((a,b) => a.precio - b.precio)',
    feedback: {
      general: { why: 'sort() muta el array original — copia antes si es inmutable.', fix: '[...productos].filter(...).sort(...)', whenToUse: 'Siempre que muestres listas filtrables al usuario.' }
    }
  },
  {
    id: 'js-debounce-busqueda',
    tech: 'javascript',
    level: 'experto',
    title: 'Debounce para búsqueda',
    scenario: '🔎 Barra de búsqueda en Netflix/Amazon: no consulta la API en cada tecla, espera a que el usuario deje de escribir.',
    description: `<p>Implementa <code>debounce(fn, delay)</code> que retrase la ejecución hasta que pasen <code>delay</code> ms sin nuevas llamadas.</p>`,
    learn: {
      concept: 'Debounce agrupa múltiples eventos rápidos en una sola ejecución. Throttle limita la frecuencia.',
      whenToUse: 'Búsqueda en vivo, resize, scroll, autoguardado. Esencial para performance en inputs y eventos de alta frecuencia.'
    },
    starterCode: `function debounce(fn, delay) {\n  \n}`,
    functionName: 'debounce',
    tests: [
      {
        name: 'Ejecuta una vez tras ráfaga',
        custom: true,
        run: (debounce, assert) => new Promise((resolve) => {
          let count = 0;
          const d = debounce(() => count++, 50);
          d(); d(); d();
          setTimeout(() => { assert(count === 1, `Esperado 1, obtuvo ${count}`); resolve(); }, 100);
        }),
        feedback: { why: 'Sin clearTimeout cada llamada programa un nuevo timeout y fn se ejecuta múltiples veces.', fix: 'let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };', whenToUse: 'input search, window resize handlers.' }
      },
      {
        name: 'Pasa argumentos',
        custom: true,
        run: (debounce, assert) => new Promise((resolve) => {
          let r = null;
          const d = debounce((a, b) => { r = a + b; }, 30);
          d(2, 3);
          setTimeout(() => { assert(r === 5, `Esperado 5, obtuvo ${r}`); resolve(); }, 60);
        }),
        feedback: { why: 'Los args no se reenvían a fn dentro del setTimeout.', fix: 'setTimeout(() => fn(...args), delay)', whenToUse: 'Cuando la función debounced necesita los parámetros del evento.' }
      }
    ],
    hint: 'let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };',
    feedback: {
      general: { why: 'Confundir debounce con throttle. Debounce espera pausa; throttle ejecuta cada X ms.', fix: 'Debounce = clearTimeout + setTimeout. Throttle = flag o timestamp.', whenToUse: 'Debounce en búsqueda; throttle en scroll infinito.' }
    }
  }
];