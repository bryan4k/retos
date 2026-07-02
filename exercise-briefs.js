const ExerciseBriefs = (function () {
  'use strict';

  function wrap(parts) {
    return `<div class="exercise-brief">${parts.filter(Boolean).join('')}</div>`;
  }

  function ctxLine(text) {
    return text ? `<p class="brief-context"><strong>Contexto:</strong> ${text}</p>` : '';
  }

  function taskLine(text) {
    return `<p class="brief-task"><strong>Qué debes hacer:</strong> ${text}</p>`;
  }

  function steps(items) {
    if (!items?.length) return '';
    return `<ol class="brief-steps">${items.map((s) => `<li>${s}</li>`).join('')}</ol>`;
  }

  function exampleLine(text) {
    return text ? `<p class="brief-example"><strong>Ejemplo:</strong> ${text}</p>` : '';
  }

  function successLine(text) {
    return `<p class="brief-success"><strong>Criterio de éxito:</strong> ${text}</p>`;
  }

  function fmt(v) {
    return `<code>${String(v).replace(/</g, '&lt;')}</code>`;
  }

  function testSummary(tests) {
    if (!tests?.length) return 'Los tests automáticos validan tu solución.';
    return tests.map((t) => {
      if (t.args && t.expected !== undefined) {
        return `con entrada ${fmt(JSON.stringify(t.args))} debe devolver ${fmt(JSON.stringify(t.expected))}`;
      }
      if (t.type === 'stdout' && t.expected) return `la salida del programa debe ser ${fmt(t.expected)}`;
      if (t.name) return `pasa el test «${t.name}»`;
      return null;
    }).filter(Boolean).join('; ');
  }

  const JS_OPS = {
    suma: (fn, test, exp, ctx) => ({
      scenario: `🛒 En ${ctx}, el checkout debe sumar los precios de los productos del pedido.`,
      task: `Completa ${fmt(`${fn}(precios)`)} para que devuelva la suma total del array.`,
      steps: [
        `Recibes un array de números con los precios de cada ítem.`,
        `Suma todos los valores y devuelve el resultado con ${fmt('return')}.`,
        `No modifiques el array original.`
      ],
      example: `${fmt(`${fn}(${JSON.stringify(test[0])})`)} → ${fmt(exp)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    resta: (fn, test, exp, ctx) => ({
      scenario: `🏷️ En ${ctx}, se aplica un descuento fijo al precio de un producto.`,
      task: `Implementa ${fmt(`${fn}(precio, descuento)`)} restando el descuento al precio.`,
      steps: ['Resta el segundo parámetro al primero.', `Devuelve el precio final con ${fmt('return')}.`],
      example: `${fmt(`${fn}(${test[0]}, ${test[1]})`)} → ${fmt(exp)}`,
      success: `El test verifica que ${fmt(`${fn}(100, 15)`)} devuelva ${fmt(85)}.`
    }),
    mult: (fn, test, exp, ctx) => ({
      scenario: `📦 En ${ctx}, cada línea del pedido tiene precio unitario y cantidad.`,
      task: `Crea ${fmt(`${fn}(precio, cantidad)`)} que calcule el subtotal de una línea.`,
      steps: ['Multiplica precio por cantidad.', 'Retorna el número resultante.'],
      example: `${fmt(`${fn}(${test[0]}, ${test[1]})`)} → ${fmt(exp)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    div: (fn, test, exp, ctx) => ({
      scenario: `💳 En ${ctx}, un pago se divide en cuotas iguales.`,
      task: `Implementa ${fmt(`${fn}(total, cuotas)`)} para obtener el monto de cada cuota.`,
      steps: ['Divide el total entre el número de cuotas.', 'Devuelve el valor (puede ser decimal).'],
      example: `${fmt(`${fn}(${test[0]}, ${test[1]})`)} → ${fmt(exp)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    gt0: (fn, test, exp, ctx) => ({
      scenario: `📊 En ${ctx}, el almacén necesita saber si un producto tiene unidades disponibles.`,
      task: `Escribe ${fmt(`${fn}(stock)`)} que devuelva ${fmt('true')} si hay stock y ${fmt('false')} si no.`,
      steps: [`Compara si ${fmt('stock > 0')}.`, 'Retorna un booleano, no un número.'],
      example: `${fmt(`${fn}(5)`)} → ${fmt(true)}; ${fmt(`${fn}(0)`)} → ${fmt(false)}`,
      success: `Debe devolver ${fmt(true)} cuando stock es positivo.`
    }),
    eq0: (fn, test, exp, ctx) => ({
      scenario: `🚫 En ${ctx}, hay que detectar productos agotados.`,
      task: `Implementa ${fmt(`${fn}(stock)`)} que devuelva ${fmt('true')} solo cuando el stock sea exactamente 0.`,
      steps: [`Usa comparación estricta ${fmt('stock === 0')}.`, 'Retorna booleano.'],
      example: `${fmt(`${fn}(0)`)} → ${fmt(true)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    hola: (fn, test, exp, ctx) => ({
      scenario: `👋 En ${ctx}, el sistema personaliza el mensaje de bienvenida.`,
      task: `Completa ${fmt(`${fn}(nombre)`)} para saludar al usuario por su nombre.`,
      steps: [`Devuelve el string ${fmt('"Hola, {nombre}!"')} usando template literals o concatenación.`, 'Respeta mayúsculas y la coma del formato.'],
      example: `${fmt(`${fn}("Ana")`)} → ${fmt(exp)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    iva16: (fn, test, exp, ctx) => ({
      scenario: `🧾 En ${ctx}, los precios mostrados al cliente incluyen 16% de IVA.`,
      task: `Implementa ${fmt(`${fn}(precio)`)} que devuelva el precio con impuesto incluido.`,
      steps: ['Multiplica el precio por 1.16 (o suma el 16%).', 'Retorna el número final.'],
      example: `${fmt(`${fn}(100)`)} → ${fmt(116)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    dbl: (fn, test, exp, ctx) => ({
      scenario: `⭐ En ${ctx}, una promoción duplica los puntos de fidelidad del cliente.`,
      task: `Crea ${fmt(`${fn}(puntos)`)} que devuelva el doble de los puntos recibidos.`,
      steps: ['Multiplica puntos por 2.', 'Retorna el resultado.'],
      example: `${fmt(`${fn}(50)`)} → ${fmt(100)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    half: (fn, test, exp, ctx) => ({
      scenario: `📐 En ${ctx}, una oferta 2×1 entrega la mitad de unidades pedidas.`,
      task: `Implementa ${fmt(`${fn}(cantidad)`)} que devuelva la mitad de la cantidad.`,
      steps: ['Divide cantidad entre 2.', 'Retorna el número (puede ser decimal).'],
      example: `${fmt(`${fn}(10)`)} → ${fmt(5)}`,
      success: testSummary([{ args: test, expected: exp }])
    })
  };

  const PY_FNS = {
    saludar: (fn, test, exp, ctx) => ({
      scenario: `👋 API de ${ctx}: el endpoint de bienvenida devuelve un saludo personalizado.`,
      task: `Completa ${fmt(`def ${fn}(nombre):`)} para retornar ${fmt('"Hola, {nombre}!"')}.`,
      steps: ['Usa f-string o concatenación.', 'Incluye return con el formato exacto.'],
      example: `${fmt(`${fn}("Pedro")`)} → ${fmt(exp)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    suma: (fn, test, exp, ctx) => ({
      scenario: `🧮 Microservicio de ${ctx}: suma dos valores de un cálculo.`,
      task: `Implementa ${fmt(`${fn}(a, b)`)} que retorne la suma de ambos enteros.`,
      steps: ['Suma a + b.', 'Devuelve el resultado con return.'],
      example: `${fmt(`${fn}(3, 7)`)} → ${fmt(10)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    es_positivo: (fn, test, exp, ctx) => ({
      scenario: `✅ Validación en ${ctx}: filtra valores numéricos válidos.`,
      task: `Escribe ${fmt(`${fn}(n)`)} que retorne ${fmt('True')} si n es mayor que 0.`,
      steps: ['Compara n > 0.', 'Retorna booleano Python (True/False).'],
      example: `${fmt(`${fn}(5)`)} → ${fmt(true)}`,
      success: 'Debe retornar True para números positivos.'
    }),
    doble: (fn, test, exp, ctx) => ({
      scenario: `📈 Reporte de ${ctx}: duplica una métrica para comparar periodos.`,
      task: `Completa ${fmt(`${fn}(n)`)} retornando el doble de n.`,
      steps: ['Multiplica n * 2.', 'Usa return.'],
      example: `${fmt(`${fn}(8)`)} → ${fmt(16)}`,
      success: testSummary([{ args: test, expected: exp }])
    }),
    area_cuadrado: (fn, test, exp, ctx) => ({
      scenario: `📐 Módulo de ${ctx}: calcula área de parcelas cuadradas.`,
      task: `Implementa ${fmt(`${fn}(lado)`)} que retorne lado × lado.`,
      steps: ['Eleva al cuadrado o multiplica lado * lado.', 'Retorna un número.'],
      example: `${fmt(`${fn}(5)`)} → ${fmt(25)}`,
      success: testSummary([{ args: test, expected: exp }])
    })
  };

  const HTML_USE = {
    p: 'un párrafo con texto descriptivo del producto o servicio',
    h1: 'el título principal visible de la página o sección',
    ul: 'una lista con al menos dos elementos de menú, características o pasos',
    a: 'un enlace clicable con atributo href hacia una URL válida',
    img: 'una imagen con src y texto alternativo alt descriptivo',
    button: 'un botón con type="button" o "submit" y texto visible',
    input: 'un campo de formulario con type y name definidos',
    label: 'una etiqueta asociada a un campo (usa for si hay id)',
    div: 'un contenedor que agrupa bloques de contenido',
    span: 'texto en línea dentro de un párrafo o etiqueta',
    form: 'un formulario que incluya al menos un input',
    select: 'un desplegable con option dentro',
    textarea: 'un área de texto multilínea con name',
    table: 'una tabla con thead, th y al menos una fila en tbody',
    nav: 'navegación con enlaces dentro (ul/li o links directos)',
    article: 'un artículo con encabezado y párrafo de contenido',
    section: 'una sección temática con título h2 o h3',
    footer: 'pie de página con información de copyright o enlaces',
    header: 'cabecera con logo o título del sitio'
  };

  function practiceJs(meta) {
    const { ctx, functionName: fn, tests, level, title, op, items, filter, avg, email, fmt: isFmt } = meta;
    const test = tests?.[0];

    if (level === 'principiante' && op && JS_OPS[op]) {
      const b = JS_OPS[op](fn, test?.args || meta.sampleTest, test?.expected ?? meta.sampleExp, ctx);
      return { scenario: b.scenario, description: wrap([ctxLine(b.scenario), taskLine(b.task), steps(b.steps), exampleLine(b.example), successLine(b.success)]) };
    }

    if (items) {
      return {
        scenario: `🛒 Carrito de ${ctx}: calcula el total de la compra.`,
        description: wrap([
          ctxLine(`Cada ítem del carrito es un par [precio, cantidad]. El total es la suma de precio × cantidad de cada línea.`),
          taskLine(`Implementa ${fmt(`${fn}(items)`)} donde items es un array de pares numéricos.`),
          steps([
            'Recorre cada par [precio, cantidad].',
            'Multiplica y acumula en un total.',
            `Devuelve el número final (ej. [[10,2],[5,4]] → ${fmt(40)}).`
          ]),
          successLine(testSummary(tests))
        ])
      };
    }
    if (filter) {
      return {
        scenario: `👥 ${ctx}: cuenta usuarios con cuenta activa.`,
        description: wrap([
          taskLine(`Implementa ${fmt(`${fn}(usuarios)`)} que retorne cuántos usuarios tienen ${fmt('activo: true')}.`),
          steps(['Filtra el array por la propiedad activo.', 'Devuelve la cantidad (.length), no el array.']),
          successLine('El test espera 1 usuario activo en el ejemplo del enunciado.')
        ])
      };
    }
    if (avg) {
      return {
        scenario: `⭐ ${ctx}: promedio de calificaciones de un producto.`,
        description: wrap([
          taskLine(`Crea ${fmt(`${fn}(nums)`)} que reciba un array de números anidado y devuelva el promedio.`),
          steps(['Extrae/suma los valores.', 'Divide entre la cantidad de elementos.', 'Retorna un número (puede ser decimal).']),
          exampleLine(`${fmt(`${fn}([[4,5,3]])`)} → ${fmt(4)}`),
          successLine(testSummary(tests))
        ])
      };
    }
    if (email) {
      return {
        scenario: `📧 ${ctx}: validación básica de correo en registro.`,
        description: wrap([
          taskLine(`Implementa ${fmt(`${fn}(email)`)} que retorne ${fmt('true')} si el email parece válido.`),
          steps([
            'Debe contener @ con texto antes y después.',
            'Debe tener un punto en la parte del dominio.',
            `Rechaza strings como ${fmt('"bad"')}.`
          ]),
          successLine('Pasan emails válidos y fallan strings sin formato correcto.')
        ])
      };
    }
    if (isFmt) {
      return {
        scenario: `💰 ${ctx}: formateo de montos para la interfaz.`,
        description: wrap([
          taskLine(`Completa ${fmt(`${fn}(monto)`)} para mostrar moneda en formato USD con dos decimales.`),
          exampleLine(`${fmt(`${fn}(1500)`)} → ${fmt('$1,500.00')}`),
          successLine(testSummary(tests))
        ])
      };
    }

    if (level === 'avanzado') {
      return {
        scenario: `🏢 ${ctx}: módulo de datos — ${title}.`,
        description: wrap([
          taskLine(`Define la función ${fmt(`${fn}(datos)`)} con la lógica que pide el título del reto.`),
          steps([
            'Lee el nombre del ejercicio: indica la operación (agrupar, buscar, ordenar, paginar, comisión).',
            'Recibe el parámetro datos y procesa según el caso de negocio.',
            'Retorna el resultado en el tipo adecuado (array, objeto o número).'
          ]),
          successLine('La función debe existir y ser invocable; los tests validan la estructura base.')
        ])
      };
    }

    if (level === 'experto') {
      return {
        scenario: `⚙️ ${ctx}: patrón de diseño — ${title}.`,
        description: wrap([
          taskLine(`Implementa el patrón indicado en ${fmt(`${fn}(...)`)} (throttle, memoize, pipe, retry o deep equal).`),
          steps([
            'Revisa el comentario del starterCode sobre el patrón esperado.',
            'La función debe aceptar los parámetros típicos del patrón (fn, delay, args, etc.).',
            'Devuelve una nueva función o resultado según el patrón.'
          ]),
          successLine('El test verifica que la función esté definida correctamente.')
        ])
      };
    }

    return {
      scenario: `💼 Caso en ${ctx}.`,
      description: wrap([taskLine(`Implementa ${fmt(`${fn}()`)} según el título «${title}».`), successLine(testSummary(tests))])
    };
  }

  function practicePy(meta) {
    const { ctx, functionName: fn, tests, level, title, desc, code, fnKey } = meta;
    const test = tests?.[0];
    const key = fnKey || fn;

    if (level === 'principiante' && PY_FNS[key]) {
      const b = PY_FNS[key](fn, test?.args, test?.expected, ctx);
      return { scenario: b.scenario, description: wrap([ctxLine(b.scenario), taskLine(b.task), steps(b.steps), exampleLine(b.example), successLine(b.success)]) };
    }

    if (level !== 'principiante') {
      const hints = {
        descuento: 'Si el monto supera 500, aplica 10% de descuento; si no, devuelve el monto igual.',
        contar_palabras: 'Recibe un string, separa por espacios y cuenta cuántas palabras tiene.',
        promedio_lista: 'Suma todos los números de la lista y divide entre len(lista).',
        filtrar_pares: 'Devuelve solo los números pares usando comprensión de listas o filtro.',
        formatear_nombre: 'Convierte un nombre "juan perez" a formato título "Juan Perez".',
        resumen_ventas: 'Recibe ventas y devuelve un dict con total y venta máxima.',
        agrupar_por: 'Agrupa registros por una clave usando defaultdict o dict.',
        validar_rango: 'Comprueba que un valor esté entre mínimo y máximo inclusive.',
        parsear_fecha: 'Convierte string de fecha a objeto datetime con strptime.',
        top_n: 'Ordena una lista y devuelve los primeros n elementos.',
        es_password_segura: 'Valida longitud, mayúsculas, números y caracteres especiales.',
        cache_decorator: 'Crea un decorador que memorice resultados de la función.',
        flatten: 'Aplana una lista anidada recursivamente.',
        merge_dicts: 'Combina varios diccionarios en uno solo.',
        rate_limiter: 'Implementa una clase que limite llamadas por ventana de tiempo.'
      };
      const hint = hints[key] || desc || title;
      return {
        scenario: `🐍 Backend de ${ctx}.`,
        description: wrap([
          ctxLine(`El equipo de ${ctx} necesita automatizar: ${title.replace(/_/g, ' ')}.`),
          taskLine(`Implementa ${fmt(`def ${fn}(datos):`)} con la lógica descrita.`),
          steps([hint, 'Usa indentación de 4 espacios.', 'Retorna el valor que pide el caso de uso.']),
          successLine('La función debe estar definida y ser invocable.')
        ])
      };
    }

    return { scenario: null, description: wrap([taskLine(`Implementa ${fmt(`${fn}(${code})`)} en ${ctx}.`)]) };
  }

  function practiceHtml(meta) {
    const { ctx, tag, tests, level } = meta;
    const use = HTML_USE[tag] || `markup semántico con &lt;${tag}&gt;`;
    const reqs = [];
    tests?.forEach((t) => {
      if (t.type === 'exists') reqs.push(`Incluir elemento ${fmt(t.selector)} en el HTML.`);
      if (t.type === 'attribute') reqs.push(`El ${fmt(t.selector)} debe tener ${fmt(t.attr)} con valor no vacío.`);
    });

    return {
      scenario: level === 'principiante' ? `📄 Maquetación básica para ${ctx}.` : `📄 Pantalla de ${ctx}.`,
      description: wrap([
        ctxLine(`Estás maquetando una vista de ${ctx}. El diseño requiere ${use}.`),
        taskLine(`Escribe HTML en el editor usando la etiqueta ${fmt(`<${tag}>`)} de forma correcta.`),
        steps(reqs.length ? reqs : [`Crea al menos un ${fmt(`<${tag}>`)} válido.`, 'Usa atributos obligatorios según buenas prácticas.']),
        successLine(`Los tests verifican presencia de ${fmt(`<${tag}>`)}${tag === 'a' ? ' con href' : ''}${tag === 'img' ? ' con alt' : ''}.`)
      ])
    };
  }

  function practiceCss(meta) {
    const { ctx, sel, prop, tests, level } = meta;
    const test = tests?.[0];
    let target = '';
    if (test?.expected) target = `${prop}: ${test.expected}`;
    else if (test?.match) target = `${prop} con valor ${test.match.join(' o ')}`;
    else if (test?.minPx) target = `${prop} de al menos ${test.minPx}px`;
    else if (test?.type === 'cssContains') target = `incluir la regla o propiedad «${test.value}»`;

    return {
      scenario: `🎨 UI de ${ctx}: el diseñador definió estilos para el componente.`,
      description: wrap([
        ctxLine(`El HTML de referencia ya tiene un elemento ${fmt(sel)}. Solo debes escribir CSS.`),
        taskLine(`Aplica ${fmt(prop)} al selector ${fmt(sel)} para cumplir el diseño.`),
        steps([
          `Escribe la regla en el selector correcto: ${fmt(sel)}.`,
          `El valor debe lograr: ${target}.`,
          'No modifiques el HTML; solo el panel de estilos.'
        ]),
        successLine(`El test comprueba el estilo computado de ${fmt(sel)}.`)
      ])
    };
  }

  function practice(meta) {
    switch (meta.tech) {
      case 'javascript': return practiceJs(meta);
      case 'python': return practicePy(meta);
      case 'html': return practiceHtml(meta);
      case 'css': return practiceCss(meta);
      default: return { scenario: null, description: '' };
    }
  }

  function logic(ch) {
    const inputs = Object.entries(ch.inputs || {}).map(([k, v]) => `${k} = ${v}`).join(', ');
    const steps = [
      'Lee el pseudocódigo PSeInt del panel izquierdo.',
      `Usa los datos de entrada ya definidos: ${inputs || 'ver editor'}.`,
      'Traduce cada instrucción a Python (asignaciones, condiciones, bucles).',
      `Al final tu programa debe imprimir exactamente: ${fmt(ch.expectedOutput)}.`,
      'Pulsa «Ejecutar tests» para validar la salida.'
    ];

    return {
      scenario: ch.scenario,
      problem: ch.problem,
      description: wrap([
        ctxLine(ch.scenario?.replace(/^[^\s]+\s/, '') || 'Ejercicio de lógica de programación.'),
        taskLine(ch.problem),
        steps,
        exampleLine(`Con las entradas dadas, la salida esperada en consola es ${fmt(ch.expectedOutput)}.`),
        successLine(`El test compara tu ${fmt('print()')} con la salida ${fmt(ch.expectedOutput)}.`)
      ])
    };
  }

  function reading(item) {
    const techLabel = { javascript: 'JavaScript', python: 'Python', html: 'HTML', css: 'CSS' }[item.tech] || item.tech;
    return wrap([
      ctxLine(item.scenario || `Fragmento de ${techLabel} en un proyecto real.`),
      taskLine(`Lee el código de la derecha <strong>sin ejecutarlo</strong> y responde la pregunta.`),
      steps([
        'Identifica variables, funciones y estructuras línea a línea.',
        'Simula mentalmente cada operación o regla CSS/HTML.',
        `Pregunta: ${item.question}`,
        'Selecciona la opción que coincide con tu predicción y pulsa «Verificar respuesta».'
      ]),
      successLine('La explicación aparecerá tras verificar, indicando por qué la opción correcta es la adecuada.')
    ]);
  }

  return { practice, logic, reading, wrap };
})();