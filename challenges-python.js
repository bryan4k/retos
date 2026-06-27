const CHALLENGES_PYTHON = [
  {
    id: 'py-saludar',
    tech: 'python',
    level: 'principiante',
    title: 'Función saludar',
    scenario: null,
    description: `<p>Crea <code>saludar(nombre)</code> que devuelva <code>"Hola, {nombre}!"</code></p>`,
    learn: {
      concept: 'Las f-strings (f"...") interpolan variables dentro de strings de forma legible.',
      whenToUse: 'Mensajes dinámicos, logs, plantillas simples. Prefer f-strings sobre + o .format() en Python 3.6+.'
    },
    starterCode: `def saludar(nombre):\n    pass`,
    functionName: 'saludar',
    tests: [
      {
        args: ['Ana'], expected: 'Hola, Ana!', name: 'Saludo personalizado',
        feedback: { why: 'Falta return o formato incorrecto del string.', fix: 'return f"Hola, {nombre}!"', whenToUse: 'Cualquier string con variables embebidas.' }
      },
      { args: [''], expected: 'Hola, !', name: 'Nombre vacío' }
    ],
    hint: 'return f"Hola, {nombre}!"',
    feedback: {
      general: { why: 'Olvidar return hace que la función devuelva None.', fix: 'Toda función con resultado necesita return.', whenToUse: 'Python usa return explícito siempre.' }
    }
  },
  {
    id: 'py-suma-lista',
    tech: 'python',
    level: 'principiante',
    title: 'Suma de una lista',
    scenario: null,
    description: `<p><code>suma_lista(numeros)</code> devuelve la suma de todos los números. No uses <code>sum()</code> built-in.</p>`,
    learn: {
      concept: 'for item in lista itera elementos. Acumulador += es el patrón básico de agregación.',
      whenToUse: 'Totales, promedios, conteos. Primero domina el bucle manual, luego usa sum(), map(), reduce().'
    },
    starterCode: `def suma_lista(numeros):\n    pass`,
    functionName: 'suma_lista',
    tests: [
      { args: [[1, 2, 3, 4]], expected: 10, name: 'Lista positiva' },
      { args: [[]], expected: 0, name: 'Lista vacía' },
      { args: [[-1, 1]], expected: 0, name: 'Con negativos' }
    ],
    hint: 'total = 0\nfor n in numeros:\n    total += n\nreturn total',
    feedback: {
      general: { why: 'No inicializar total en 0 o iterar mal.', fix: 'Acumulador = 0 antes del bucle.', whenToUse: 'Bucles for con acumulador son base de procesamiento de datos.' }
    }
  },
  {
    id: 'py-descuento-factura',
    tech: 'python',
    level: 'intermedio',
    title: 'Descuento en factura',
    scenario: '🧾 Sistema de facturación: aplica 10% de descuento si el subtotal supera $1000.',
    description: `<p><code>calcular_total(subtotal)</code> devuelve subtotal con descuento del 10% si subtotal > 1000, sino subtotal sin cambio. Redondea a 2 decimales.</p>`,
    learn: {
      concept: 'Reglas de negocio se implementan con condicionales. round(x, 2) para moneda.',
      whenToUse: 'Facturación, promociones, pricing tiers. Siempre redondea montos monetarios.'
    },
    starterCode: `def calcular_total(subtotal):\n    pass`,
    functionName: 'calcular_total',
    tests: [
      {
        args: [1500], expected: 1350.0, name: 'Con descuento',
        feedback: { why: '1500 * 0.9 = 1350. Verifica condición > 1000 y el 10%.', fix: 'if subtotal > 1000: return round(subtotal * 0.9, 2)', whenToUse: 'Reglas de pricing en e-commerce y ERP.' }
      },
      { args: [500], expected: 500.0, name: 'Sin descuento' },
      { args: [1000], expected: 1000.0, name: 'Exactamente 1000' }
    ],
    hint: 'if subtotal > 1000: return round(subtotal * 0.9, 2)\nreturn round(subtotal, 2)',
    feedback: {
      general: { why: 'Usar >= en vez de > cambia el caso límite 1000.', fix: 'Lee bien si el descuento aplica en el límite exacto.', whenToUse: 'Siempre define casos borde en reglas de negocio.' }
    }
  },
  {
    id: 'py-contar-palabras',
    tech: 'python',
    level: 'intermedio',
    title: 'Analizar reseñas de producto',
    scenario: '⭐ Marketplace: cuenta cuántas palabras tiene cada reseña para detectar spam (reseñas de 1-2 palabras).',
    description: `<p><code>contar_palabras(texto)</code> devuelve el número de palabras. Separa por espacios; ignora espacios múltiples.</p>`,
    learn: {
      concept: 'split() divide strings. strip() quita espacios. Encadenar métodos procesa texto eficientemente.',
      whenToUse: 'NLP básico, validación de formularios, análisis de comentarios, logs.'
    },
    starterCode: `def contar_palabras(texto):\n    pass`,
    functionName: 'contar_palabras',
    tests: [
      {
        args: ['Excelente producto'], expected: 2, name: 'Dos palabras',
        feedback: { why: 'Cuentas caracteres en vez de palabras, o no manejas espacios extra.', fix: 'return len(texto.split())', whenToUse: 'Tokenización simple antes de análisis más complejo.' }
      },
      { args: [''], expected: 0, name: 'Vacío' },
      { args: ['  hola   mundo  '], expected: 2, name: 'Espacios extra' }
    ],
    hint: 'return len(texto.split())',
    feedback: {
      general: { why: 'split() sin args divide por cualquier whitespace y ignora vacíos.', fix: 'texto.split() ya maneja espacios múltiples.', whenToUse: 'Procesamiento de texto en pipelines de datos.' }
    }
  },
  {
    id: 'py-procesar-ventas',
    tech: 'python',
    level: 'avanzado',
    title: 'Procesar ventas del día',
    scenario: '📊 Dashboard de ventas: recibe lista de ventas y devuelve el total y la venta más alta.',
    description: `<p><code>resumen_ventas(ventas)</code> recibe <code>[{producto, monto}, ...]</code> y devuelve <code>{total, maxima}</code>. Lista vacía → <code>{total: 0, maxima: 0}</code>.</p>`,
    learn: {
      concept: 'Una pasada sobre los datos puede calcular múltiples métricas. Más eficiente que múltiples iteraciones.',
      whenToUse: 'Reportes, ETL, analytics. En datasets grandes, una sola iteración importa.'
    },
    starterCode: `def resumen_ventas(ventas):\n    pass`,
    functionName: 'resumen_ventas',
    tests: [
      {
        args: [[{'producto': 'A', 'monto': 100}, {'producto': 'B', 'monto': 250}]],
        expected: { total: 350, maxima: 250 }, name: 'Dos ventas',
        feedback: { why: 'Estructura del dict incorrecta o no iteras bien.', fix: 'total=0; maxima=0; for v in ventas: total+=v["monto"]; maxima=max(maxima, v["monto"])', whenToUse: 'Agregaciones en reportes diarios/semanales.' }
      },
      { args: [[]], expected: { total: 0, maxima: 0 }, name: 'Sin ventas' }
    ],
    hint: 'Itera una vez acumulando total y actualizando maxima con max()',
    feedback: {
      general: { why: 'Devolver lista en vez de dict, o keys incorrectas.', fix: 'return {"total": total, "maxima": maxima}', whenToUse: 'APIs que devuelven resúmenes estructurados.' }
    }
  },
  {
    id: 'py-validar-password',
    tech: 'python',
    level: 'experto',
    title: 'Validador de contraseña',
    scenario: '🔐 App bancaria: valida contraseñas antes de guardarlas — mínimo 8 chars, mayúscula, minúscula, dígito.',
    description: `<p><code>es_password_segura(password)</code> devuelve True si cumple todas las reglas.</p>`,
    learn: {
      concept: 'Validación compuesta: divide en checks independientes con all() o banderas.',
      whenToUse: 'Registro, cambio de contraseña. En producción usa bcrypt/argon2 para hashear, nunca guardes texto plano.'
    },
    starterCode: `def es_password_segura(password):\n    pass`,
    functionName: 'es_password_segura',
    tests: [
      {
        args: ['Abcdef1!'], expected: true, name: 'Contraseña válida',
        feedback: { why: 'Falta verificar alguna regla: longitud, mayúscula, minúscula o dígito.', fix: 'Usa any(c.isupper() for c in pw) y similares para cada regla', whenToUse: 'Todo sistema con autenticación propia.' }
      },
      { args: ['abc'], expected: false, name: 'Muy corta' },
      { args: ['abcdefgh'], expected: false, name: 'Sin mayúscula ni dígito' },
      { args: ['ABCDEFGH1'], expected: false, name: 'Sin minúscula' }
    ],
    hint: 'len>=8, any(isupper), any(islower), any(isdigit)',
    feedback: {
      general: { why: 'Validar solo longitud no basta para seguridad real.', fix: 'Checks separados + all([...]). En prod usa zxcvbn o similar.', whenToUse: 'Primera línea de defensa en registro; complementa con hash y 2FA.' }
    }
  }
];