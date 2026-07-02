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

  function problemLine(text) {
    return text ? `<p class="brief-problem"><strong>Problema:</strong> ${text}</p>` : '';
  }

  function objectiveLine(text) {
    return text ? `<p class="brief-objective"><strong>Objetivo:</strong> ${text}</p>` : '';
  }

  function htmlDescription(b) {
    return wrap([
      problemLine(b.problem),
      objectiveLine(b.objective),
      b.requirements?.length ? `<p class="brief-req-title"><strong>Requisitos concretos:</strong></p>${steps(b.requirements)}` : '',
      exampleLine(b.example),
      successLine(b.deliverable)
    ]);
  }

  function parseHtmlIndex(id) {
    const m = (id || '').match(/(\d+)$/);
    return m ? parseInt(m[1], 10) - 1 : 0;
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

  const HTML_BRIEFS = {
    p: (ctx) => ({
      title: 'Descripción visible del servicio',
      scenario: `📄 ${ctx}: la ficha no explica el servicio al usuario.`,
      problem: `En ${ctx}, los usuarios abren la página y no encuentran una descripción clara del servicio; solo hay contenedores vacíos.`,
      objective: `Escribir un párrafo ${fmt('<p>')} con texto real que explique una ventaja o característica del servicio.`,
      requirements: [
        `Incluir al menos un ${fmt('<p>')} en el HTML.`,
        'El párrafo debe tener texto visible (no vacío).',
        'Usa una oración completa, por ejemplo sobre envío, precio o disponibilidad.'
      ],
      example: `${fmt('<p>Entrega en 30 minutos en tu zona.</p>')}`,
      deliverable: 'El test confirma que existe un elemento p en el documento.'
    }),
    h1: (ctx) => ({
      title: 'Título principal de la pantalla',
      scenario: `📄 ${ctx}: falta el encabezado principal.`,
      problem: `La pantalla de ${ctx} se renderiza sin título principal; el usuario no sabe en qué sección está.`,
      objective: `Agregar un único ${fmt('<h1>')} que nombre la página o el producto destacado.`,
      requirements: [
        `Incluir ${fmt('<h1>')} con texto descriptivo.`,
        'Debe ser el título más importante de la vista (no uses h1 dentro de un card pequeño).',
        'Una sola palabra o frase corta es válida.'
      ],
      example: `${fmt('<h1>Menú del día</h1>')}`,
      deliverable: 'El test detecta el elemento h1 en tu markup.'
    }),
    ul: (ctx) => ({
      title: 'Lista de características o pasos',
      scenario: `📄 ${ctx}: hay que mostrar varios ítems en lista.`,
      problem: `El equipo de ${ctx} necesita mostrar 3 beneficios o pasos, pero hoy están en texto suelto sin estructura.`,
      objective: `Crear una lista no ordenada ${fmt('<ul>')} con al menos dos ${fmt('<li>')} con contenido.`,
      requirements: [
        `Usar ${fmt('<ul>')} como contenedor.`,
        `Cada ítem va dentro de ${fmt('<li>')}.`,
        'Mínimo dos elementos de lista con texto.'
      ],
      example: `${fmt('<ul><li>Envío gratis</li><li>Pago seguro</li></ul>')}`,
      deliverable: 'El test verifica que existe ul en el HTML.'
    }),
    a: (ctx) => ({
      title: 'Enlace de llamada a la acción',
      scenario: `📄 ${ctx}: el botón de acción no navega a ningún lado.`,
      problem: `En ${ctx} hay texto que parece enlace pero no es clicable porque falta un ${fmt('<a href="...">')} válido.`,
      objective: `Crear un enlace ${fmt('<a>')} con atributo ${fmt('href')} no vacío que lleve a una URL o ancla.`,
      requirements: [
        `Incluir ${fmt('<a href="...">')} con texto visible.`,
        `${fmt('href')} debe tener valor (URL, #seccion o /ruta).`,
        'No uses div con onclick; usa enlace real.'
      ],
      example: `${fmt('<a href="https://ejemplo.com/pedir">Hacer pedido</a>')}`,
      deliverable: 'Los tests exigen a con href definido.'
    }),
    img: (ctx) => ({
      title: 'Imagen accesible del producto',
      scenario: `📄 ${ctx}: la imagen no carga contexto para lectores de pantalla.`,
      problem: `En ${ctx} se muestra una foto sin ${fmt('alt')}; usuarios con lector de pantalla no saben qué representa.`,
      objective: `Insertar ${fmt('<img>')} con ${fmt('src')} y ${fmt('alt')} descriptivo del contenido visual.`,
      requirements: [
        `Etiqueta ${fmt('<img src="..." alt="...">')}.`,
        `${fmt('alt')} describe la imagen, no digas solo "imagen".`,
        `${fmt('src')} apunta a una ruta o URL (puede ser de ejemplo).`
      ],
      example: `${fmt('<img src="plato.jpg" alt="Ensalada César con pollo">')}`,
      deliverable: 'El test busca img[alt] presente en el DOM.'
    }),
    button: (ctx) => ({
      title: 'Botón de acción visible',
      scenario: `📄 ${ctx}: falta un control para confirmar la acción.`,
      problem: `El flujo de ${ctx} necesita un botón para confirmar (pedir, guardar, continuar) pero no existe en el HTML.`,
      objective: `Agregar ${fmt('<button>')} con ${fmt('type')} y texto que indique la acción.`,
      requirements: [
        `Usar ${fmt('<button type="button">')} o ${fmt('type="submit"')} si va en formulario.`,
        'Texto visible dentro del botón.',
        'No uses div estilizado como botón.'
      ],
      example: `${fmt('<button type="button">Confirmar pedido</button>')}`,
      deliverable: 'El test confirma que hay un button en el documento.'
    }),
    input: (ctx) => ({
      title: 'Campo de captura de datos',
      scenario: `📄 ${ctx}: no se puede ingresar información del usuario.`,
      problem: `En ${ctx} el usuario debe escribir un dato (nombre, cantidad, búsqueda) pero no hay campo de entrada.`,
      objective: `Añadir ${fmt('<input>')} con ${fmt('type')} y ${fmt('name')} para capturar un dato.`,
      requirements: [
        `Incluir ${fmt('<input type="text" name="...">')} o type adecuado (email, number).`,
        'Define name para que el dato sea identificable.',
        'Puede ir solo o dentro de un form.'
      ],
      example: `${fmt('<input type="text" name="busqueda" placeholder="Buscar producto">')}`,
      deliverable: 'El test verifica presencia de input.'
    }),
    label: (ctx) => ({
      title: 'Etiqueta accesible para un campo',
      scenario: `📄 ${ctx}: los campos no tienen rótulo.`,
      problem: `En ${ctx} hay inputs sin etiqueta; al tocar el texto el campo no se enfoca y lectores de pantalla no anuncian el propósito.`,
      objective: `Crear ${fmt('<label>')} asociado a un campo con ${fmt('for')} igual al ${fmt('id')} del input.`,
      requirements: [
        `Incluir ${fmt('<label for="id-del-campo">')} con texto claro.`,
        'El input relacionado debe existir con el mismo id.',
        'El label describe qué debe escribir el usuario.'
      ],
      example: `${fmt('<label for="email">Correo</label><input id="email" type="email">')}`,
      deliverable: 'El test confirma que existe label en el HTML.'
    }),
    div: (ctx) => ({
      title: 'Contenedor de bloque de contenido',
      scenario: `📄 ${ctx}: el contenido no está agrupado.`,
      problem: `Varios textos y controles de ${ctx} quedan sueltos sin un contenedor que los agrupe para maquetación y estilos.`,
      objective: `Usar ${fmt('<div>')} como contenedor que envuelva el bloque de contenido de esta vista.`,
      requirements: [
        `Incluir al menos un ${fmt('<div>')} en el markup.`,
        'Puede tener clase para estilos (ej. class="card").',
        'Coloca dentro el contenido de la sección.'
      ],
      example: `${fmt('<div class="resumen"><p>Total: $120</p></div>')}`,
      deliverable: 'El test detecta el elemento div.'
    }),
    span: (ctx) => ({
      title: 'Texto destacado en línea',
      scenario: `📄 ${ctx}: hay que resaltar un dato dentro de una frase.`,
      problem: `En ${ctx} un precio o etiqueta debe destacarse dentro de un párrafo sin romper el flujo del texto.`,
      objective: `Usar ${fmt('<span>')} dentro de un párrafo para envolver la parte que quieres resaltar.`,
      requirements: [
        `Incluir ${fmt('<span>')} con texto (precio, badge, estado).`,
        'Normalmente va dentro de un p u otro elemento de texto.',
        'Puede llevar class para estilo (ej. class="precio").'
      ],
      example: `${fmt('<p>Precio: <span class="precio">$49</span></p>')}`,
      deliverable: 'El test verifica que span está presente.'
    }),
    form: (ctx) => ({
      title: 'Formulario de envío de datos',
      scenario: `📄 ${ctx}: los datos del usuario no se pueden enviar.`,
      problem: `En ${ctx} el usuario completa datos pero no hay ${fmt('<form>')} que agrupe campos para enviarlos al servidor.`,
      objective: `Construir un ${fmt('<form>')} que incluya al menos un ${fmt('<input>')} para capturar información.`,
      requirements: [
        `Etiqueta ${fmt('<form>')} envolviendo los campos.`,
        'Al menos un input dentro del form.',
        'Opcional: action y method; para el test basta la estructura.'
      ],
      example: `${fmt('<form><input type="text" name="usuario"></form>')}`,
      deliverable: 'Tests: form presente e input dentro del form.'
    }),
    select: (ctx) => ({
      title: 'Selector de opciones',
      scenario: `📄 ${ctx}: el usuario no puede elegir entre alternativas.`,
      problem: `En ${ctx} hay que elegir una opción (talla, ciudad, categoría) pero solo hay texto estático.`,
      objective: `Implementar ${fmt('<select>')} con al menos una ${fmt('<option>')} seleccionable.`,
      requirements: [
        `Incluir ${fmt('<select name="...">')}.`,
        'Al menos una option con value o texto.',
        'name ayuda a identificar el campo al enviar.'
      ],
      example: `${fmt('<select name="talla"><option value="m">Mediana</option></select>')}`,
      deliverable: 'El test confirma select en el documento.'
    }),
    textarea: (ctx) => ({
      title: 'Área de comentarios o mensaje largo',
      scenario: `📄 ${ctx}: no hay espacio para mensajes largos.`,
      problem: `En ${ctx} el usuario necesita escribir un comentario, dirección o nota de varias líneas y un input de una línea no alcanza.`,
      objective: `Agregar ${fmt('<textarea>')} con ${fmt('name')} para texto multilínea.`,
      requirements: [
        `Usar ${fmt('<textarea name="...">')}.`,
        'Puede tener placeholder o texto inicial.',
        'Cierra correctamente la etiqueta textarea.'
      ],
      example: `${fmt('<textarea name="mensaje" placeholder="Escribe tu comentario"></textarea>')}`,
      deliverable: 'El test verifica textarea presente.'
    }),
    table: (ctx) => ({
      title: 'Tabla de datos con encabezados',
      scenario: `📄 ${ctx}: los datos tabulares no tienen estructura.`,
      problem: `En ${ctx} hay que listar filas de datos (pedidos, inventario, usuarios) pero se muestran sin tabla accesible.`,
      objective: `Crear ${fmt('<table>')} con ${fmt('<thead>')}, ${fmt('<th>')} y al menos una fila en ${fmt('<tbody>')}.`,
      requirements: [
        `Estructura: ${fmt('table > thead > tr > th')}.`,
        `Incluir ${fmt('tbody')} con al menos un ${fmt('tr')}.`,
        'Los th describen las columnas.'
      ],
      example: `${fmt('<table><thead><tr><th>Producto</th></tr></thead><tbody><tr><td>Leche</td></tr></tbody></table>')}`,
      deliverable: 'Tests: table, th y estructura válida.'
    }),
    thead: (ctx) => ({
      title: 'Encabezado de tabla de reportes',
      scenario: `📄 ${ctx}: la tabla no identifica las columnas.`,
      problem: `El reporte de ${ctx} muestra celdas sin fila de encabezado; no se entiende qué significa cada columna.`,
      objective: `Armar una tabla que use ${fmt('<thead>')} con ${fmt('<th>')} para titular cada columna.`,
      requirements: [
        'Tabla completa con thead y th.',
        'Al menos una columna nombrada en th.',
        'Datos de ejemplo en tbody.'
      ],
      example: `${fmt('<table><thead><tr><th>Fecha</th><th>Total</th></tr></thead><tbody><tr><td>Hoy</td><td>100</td></tr></tbody></table>')}`,
      deliverable: 'El test busca th dentro de la tabla.'
    }),
    nav: (ctx) => ({
      title: 'Menú de navegación del sitio',
      scenario: `📄 ${ctx}: no hay forma de moverse entre secciones.`,
      problem: `Los usuarios de ${ctx} no encuentran enlaces a Inicio, Catálogo o Contacto; la navegación no está marcada semánticamente.`,
      objective: `Crear ${fmt('<nav>')} con enlaces ${fmt('<a>')} a las secciones principales (pueden ser ${fmt('href="#"')}).`,
      requirements: [
        `Contenedor ${fmt('<nav>')}.`,
        'Al menos un enlace a dentro.',
        'Recomendado: ul > li > a para menús.'
      ],
      example: `${fmt('<nav><a href="#">Inicio</a><a href="#catalogo">Catálogo</a></nav>')}`,
      deliverable: 'El test confirma nav presente.'
    }),
    article: (ctx) => ({
      title: 'Bloque de contenido independiente',
      scenario: `📄 ${ctx}: una noticia o producto sin estructura semántica.`,
      problem: `Cada ítem de contenido en ${ctx} (noticia, producto, post) debe ser un bloque autónomo para SEO y accesibilidad.`,
      objective: `Envolver el contenido en ${fmt('<article>')} con título ${fmt('<h2>')} o ${fmt('<h3>')} y un párrafo.`,
      requirements: [
        `Usar ${fmt('<article>')} como contenedor.`,
        'Incluir encabezado y párrafo de contenido.',
        'Un article por ítem (producto, entrada de blog).'
      ],
      example: `${fmt('<article><h2>Promo verano</h2><p>20% en bebidas</p></article>')}`,
      deliverable: 'El test detecta article en el HTML.'
    }),
    section: (ctx) => ({
      title: 'Sección temática de la página',
      scenario: `📄 ${ctx}: el contenido no está dividido por temas.`,
      problem: `La página de ${ctx} mezcla hero, catálogo y testimonios sin delimitar secciones; cuesta maquetar y posicionar en buscadores.`,
      objective: `Definir una ${fmt('<section>')} con título y contenido que agrupe un tema (ej. "Ofertas", "Testimonios").`,
      requirements: [
        `Incluir ${fmt('<section>')} con h2 o h3 de título.`,
        'Contenido relacionado dentro de la misma section.',
        'Puede tener id para anclas (id="ofertas").'
      ],
      example: `${fmt('<section id="ofertas"><h2>Ofertas</h2><p>Hasta 50% hoy</p></section>')}`,
      deliverable: 'El test verifica section presente.'
    }),
    footer: (ctx) => ({
      title: 'Pie de página con información legal',
      scenario: `📄 ${ctx}: falta información al final de la página.`,
      problem: `Al terminar de leer ${ctx} el usuario no encuentra copyright, enlaces legales ni contacto; el sitio parece incompleto.`,
      objective: `Añadir ${fmt('<footer>')} con texto de copyright o enlaces secundarios.`,
      requirements: [
        `Etiqueta ${fmt('<footer>')} al cierre del contenido.`,
        'Texto visible (© año, nombre empresa, enlace).',
        'No confundir con footer de un card; es el pie de la página.'
      ],
      example: `${fmt('<footer><p>© 2026 Mi Tienda · <a href="#">Privacidad</a></p></footer>')}`,
      deliverable: 'El test confirma footer en el documento.'
    }),
    header: (ctx) => ({
      title: 'Cabecera con marca y navegación',
      scenario: `📄 ${ctx}: la parte superior no identifica el sitio.`,
      problem: `La zona superior de ${ctx} no tiene cabecera semántica; logo y menú quedan en divs genéricos.`,
      objective: `Crear ${fmt('<header>')} con el nombre del sitio o logo (texto) y espacio para navegación.`,
      requirements: [
        `Usar ${fmt('<header>')} una vez en la parte superior.`,
        'Incluir título o texto de marca.',
        'Puede contener nav con enlaces.'
      ],
      example: `${fmt('<header><h1>FreshFood</h1><nav><a href="#">Menú</a></nav></header>')}`,
      deliverable: 'El test detecta header.'
    }),
    main: (ctx) => ({
      title: 'Contenido principal único',
      scenario: `📄 ${ctx}: el contenido central no está marcado.`,
      problem: `Lectores de pantalla y buscadores no distinguen el contenido principal de ${ctx} respecto a header y footer.`,
      objective: `Envolver el contenido central en ${fmt('<main>')} (solo uno por página).`,
      requirements: [
        `Un único ${fmt('<main>')} con el contenido relevante.`,
        'No pongas navegación ni footer dentro de main.',
        'Incluye al menos un encabezado o párrafo dentro.'
      ],
      example: `${fmt('<main><h1>Panel</h1><p>Resumen del día</p></main>')}`,
      deliverable: 'El test verifica main presente.'
    }),
    aside: (ctx) => ({
      title: 'Barra lateral complementaria',
      scenario: `📄 ${ctx}: información relacionada sin apartado lateral.`,
      problem: `En ${ctx} hay tips, filtros o enlaces relacionados que compiten visualmente con el contenido principal.`,
      objective: `Usar ${fmt('<aside>')} para contenido complementario (filtros, banners, enlaces relacionados).`,
      requirements: [
        `Incluir ${fmt('<aside>')} con contenido secundario.`,
        'Título opcional con h2/h3.',
        'No repitas todo el contenido principal aquí.'
      ],
      example: `${fmt('<aside><h3>Filtros</h3><ul><li>Ofertas</li></ul></aside>')}`,
      deliverable: 'El test confirma aside.'
    }),
    figure: (ctx) => ({
      title: 'Figura con imagen y leyenda',
      scenario: `📄 ${ctx}: imagen sin contexto editorial.`,
      problem: `Una imagen en ${ctx} necesita leyenda explicativa pero está suelta sin estructura.`,
      objective: `Agrupar imagen y leyenda en ${fmt('<figure>')} con ${fmt('<figcaption>')}.`,
      requirements: [
        `${fmt('figure')} contiene img y figcaption.`,
        'figcaption describe la imagen.',
        'img con alt descriptivo.'
      ],
      example: `${fmt('<figure><img src="graf.jpg" alt="Ventas marzo"><figcaption>Picos los viernes</figcaption></figure>')}`,
      deliverable: 'El test verifica figure.'
    }),
    figcaption: (ctx) => ({
      title: 'Leyenda bajo una ilustración',
      scenario: `📄 ${ctx}: la gráfica no tiene pie de foto.`,
      problem: `La ilustración en ${ctx} se entiende mal sin texto debajo que explique qué muestra.`,
      objective: `Incluir ${fmt('<figcaption>')} dentro de un ${fmt('<figure>')} junto a una imagen.`,
      requirements: ['Estructura figure > img + figcaption.', 'Texto en figcaption no vacío.'],
      example: `${fmt('<figure><img src="x.png" alt="Mapa"><figcaption>Distribución por zona</figcaption></figure>')}`,
      deliverable: 'El test detecta figcaption dentro del patrón figure.'
    }),
    details: (ctx) => ({
      title: 'Contenido expandible (acordeón nativo)',
      scenario: `📄 ${ctx}: hay demasiada información visible de golpe.`,
      problem: `En ${ctx} las preguntas frecuentes ocupan mucho espacio; el usuario necesita expandir solo lo que le interesa.`,
      objective: `Usar ${fmt('<details>')} con ${fmt('<summary>')} como título clicable y contenido oculto hasta expandir.`,
      requirements: [
        `${fmt('<details>')} con ${fmt('<summary>')} visible.`,
        'Contenido adicional dentro de details (p, ul).',
        'summary resume la sección.'
      ],
      example: `${fmt('<details><summary>¿Horario?</summary><p>Lun–Vie 9–18h</p></details>')}`,
      deliverable: 'El test verifica details.'
    }),
    summary: (ctx) => ({
      title: 'Título de panel desplegable',
      scenario: `📄 ${ctx}: falta etiqueta en el acordeón.`,
      problem: `El panel colapsable de ${ctx} no tiene texto en el encabezado clicable.`,
      objective: `Dentro de ${fmt('<details>')}, escribir ${fmt('<summary>')} con la pregunta o título del bloque.`,
      requirements: ['details > summary con texto.', 'Contenido expandible debajo.'],
      example: `${fmt('<details><summary>Ver política de devoluciones</summary><p>30 días</p></details>')}`,
      deliverable: 'El test confirma summary presente.'
    }),
    fieldset: (ctx) => ({
      title: 'Grupo de campos relacionados',
      scenario: `📄 ${ctx}: campos de formulario sin agrupar.`,
      problem: `En ${ctx} varios radios o checkboxes de una misma pregunta no están agrupados; falla accesibilidad y validación.`,
      objective: `Agrupar campos relacionados en ${fmt('<fieldset>')} con ${fmt('<legend>')} que nombre el grupo.`,
      requirements: [
        `${fmt('fieldset')} envuelve inputs relacionados.`,
        `${fmt('legend')} describe el grupo al inicio.`,
        'Al menos un input dentro.'
      ],
      example: `${fmt('<fieldset><legend>Método de pago</legend><input type="radio" name="pago"> Tarjeta</fieldset>')}`,
      deliverable: 'El test verifica fieldset.'
    }),
    legend: (ctx) => ({
      title: 'Título de grupo de formulario',
      scenario: `📄 ${ctx}: el grupo de opciones no tiene nombre.`,
      problem: `Los usuarios no saben qué pregunta responden los radios de ${ctx} porque falta leyenda del grupo.`,
      objective: `Colocar ${fmt('<legend>')} como primer hijo de ${fmt('<fieldset>')} nombrando el grupo.`,
      requirements: ['fieldset con legend al inicio.', 'Inputs del mismo grupo dentro.'],
      example: `${fmt('<fieldset><legend>Talla</legend><input name="talla" type="radio"> S</fieldset>')}`,
      deliverable: 'El test detecta legend.'
    }),
    datalist: (ctx) => ({
      title: 'Sugerencias al escribir en un campo',
      scenario: `📄 ${ctx}: el usuario no ve opciones al buscar.`,
      problem: `En ${ctx} el campo de búsqueda no sugiere ciudades o productos frecuentes mientras se escribe.`,
      objective: `Combinar ${fmt('<input list="...">')} con ${fmt('<datalist id="...">')} y opciones.`,
      requirements: [
        'input con atributo list igual al id del datalist.',
        'datalist con al menos una option.',
        'ids deben coincidir.'
      ],
      example: `${fmt('<input list="ciudades"><datalist id="ciudades"><option value="Lima"></datalist>')}`,
      deliverable: 'El test verifica datalist.'
    }),
    output: (ctx) => ({
      title: 'Resultado calculado en formulario',
      scenario: `📄 ${ctx}: el total no se muestra al usuario.`,
      problem: `En ${ctx} un cálculo (subtotal, IVA) debería mostrarse en pantalla junto al formulario pero no hay elemento de salida.`,
      objective: `Usar ${fmt('<output>')} para mostrar un valor resultante vinculado al form.`,
      requirements: [
        `${fmt('<output name="...">')} con valor o texto inicial.`,
        'Puede ir dentro de form.',
        'name permite asociarlo a scripts después.'
      ],
      example: `${fmt('<form oninput="o.value = 100"><output name="total">100</output></form>')}`,
      deliverable: 'El test confirma output.'
    }),
    dialog: (ctx) => ({
      title: 'Ventana modal de confirmación',
      scenario: `📄 ${ctx}: acciones críticas sin confirmación.`,
      problem: `En ${ctx} al eliminar o confirmar un pago debería aparecer un diálogo modal nativo pero no está en el markup.`,
      objective: `Implementar ${fmt('<dialog>')} con mensaje y botón de cierre o confirmación.`,
      requirements: [
        `${fmt('<dialog>')} con contenido visible o atributo open.',
        'Texto que explique la acción.',
        'Botón para cerrar o confirmar.'
      ],
      example: `${fmt('<dialog open><p>¿Eliminar pedido?</p><button>Cancelar</button></dialog>')}`,
      deliverable: 'El test verifica dialog.'
    }),
    template: (ctx) => ({
      title: 'Plantilla HTML reutilizable',
      scenario: `📄 ${ctx}: se repite el mismo bloque en JS.`,
      problem: `En ${ctx} JavaScript clona tarjetas de producto; el HTML patrón debe vivir en ${fmt('<template>')} sin renderizarse hasta activarse.`,
      objective: `Definir ${fmt('<template>')} con el markup de un ítem que se copiará dinámicamente.`,
      requirements: [
        `${fmt('<template>')} con HTML válido dentro.`,
        'Contenido no visible hasta que JS lo use.',
        'Ejemplo: card de producto o fila de tabla.'
      ],
      example: `${fmt('<template id="card"><article><h2></h2></article></template>')}`,
      deliverable: 'El test detecta template.'
    }),
    slot: (ctx) => ({
      title: 'Hueco en componente web',
      scenario: `📄 ${ctx}: componente sin zona de contenido proyectado.`,
      problem: `El web component de ${ctx} no permite insertar contenido externo en un punto definido del layout.`,
      objective: `Incluir ${fmt('<slot>')} (o slot con name) donde debe ir el contenido proyectado.`,
      requirements: [
        `${fmt('<slot>')} dentro de un contenedor.',
        'Opcional: slot name="footer" para zonas nombradas.',
        'Puede ir en template de componente.'
      ],
      example: `${fmt('<div class="card"><slot name="titulo"></slot><slot></slot></div>')}`,
      deliverable: 'El test verifica slot.'
    }),
    picture: (ctx) => ({
      title: 'Imagen responsive con formatos',
      scenario: `📄 ${ctx}: la imagen pesa mucho en móvil.`,
      problem: `En ${ctx} se sirve la misma imagen grande a todos los dispositivos; hace falta picture con fuentes alternativas.`,
      objective: `Usar ${fmt('<picture>')} con ${fmt('<source>')} y ${fmt('<img>')} fallback.`,
      requirements: [
        'picture contiene source y img.',
        'img con alt obligatorio.',
        'source con srcset o type (webp).'
      ],
      example: `${fmt('<picture><source srcset="f.webp" type="image/webp"><img src="f.jpg" alt="Banner"></picture>')}`,
      deliverable: 'El test verifica picture.'
    }),
    source: (ctx) => ({
      title: 'Fuente alternativa de media',
      scenario: `📄 ${ctx}: video o imagen sin formato alternativo.`,
      problem: `El reproductor de ${ctx} no ofrece formato alternativo al navegador para optimizar carga.`,
      objective: `Añadir ${fmt('<source>')} dentro de ${fmt('<video>')} o ${fmt('<picture>')} con src y type.`,
      requirements: [
        'source con src apuntando a archivo.',
        'Elemento padre video o picture.',
        'type MIME opcional (video/mp4).'
      ],
      example: `${fmt('<video controls><source src="clip.mp4" type="video/mp4"></video>')}`,
      deliverable: 'El test detecta source.'
    }),
    track: (ctx) => ({
      title: 'Subtítulos para video',
      scenario: `📄 ${ctx}: video sin accesibilidad auditiva.`,
      problem: `El video de ${ctx} no tiene pista de subtítulos; usuarios sordos o en silencio no entienden el audio.`,
      objective: `Incluir ${fmt('<track kind="subtitles" src="...">')} dentro del ${fmt('<video>')}.`,
      requirements: [
        'video con track hijo.',
        'kind="subtitles" o "captions".',
        'src apunta a archivo .vtt (puede ser ejemplo).'
      ],
      example: `${fmt('<video><track kind="subtitles" src="subs.vtt" srclang="es"></video>')}`,
      deliverable: 'El test verifica track.'
    }),
    meter: (ctx) => ({
      title: 'Indicador de nivel o progreso parcial',
      scenario: `📄 ${ctx}: uso de disco sin indicador visual.`,
      problem: `En ${ctx} el panel admin debe mostrar que el almacenamiento va al 60% pero solo hay texto.`,
      objective: `Mostrar el nivel con ${fmt('<meter value="..." min="0" max="1">')} y texto alternativo.`,
      requirements: [
        'meter con value, min y max.',
        'Texto entre etiquetas como fallback.',
        'value dentro del rango min–max.'
      ],
      example: `${fmt('<meter value="0.6" min="0" max="1">60% usado</meter>')}`,
      deliverable: 'El test confirma meter.'
    }),
    progress: (ctx) => ({
      title: 'Barra de progreso de una tarea',
      scenario: `📄 ${ctx}: subida de archivo sin feedback.`,
      problem: `Al subir un archivo en ${ctx} el usuario no ve cuánto ha avanzado la operación.`,
      objective: `Usar ${fmt('<progress value="..." max="100">')} para mostrar avance numérico.`,
      requirements: [
        'progress con value y max.',
        'value ≤ max.',
        'Texto fallback opcional entre etiquetas.'
      ],
      example: `${fmt('<progress value="40" max="100">40%</progress>')}`,
      deliverable: 'El test verifica progress.'
    }),
    time: (ctx) => ({
      title: 'Fecha u hora legible por máquina',
      scenario: `📄 ${ctx}: la fecha no es interpretable por buscadores.`,
      problem: `En ${ctx} se muestra "15 de marzo" sin marca semántica; eventos y SEO necesitan datetime ISO.`,
      objective: `Marcar la fecha con ${fmt('<time datetime="YYYY-MM-DD">')} y texto humano dentro.`,
      requirements: [
        'time con atributo datetime en formato ISO.',
        'Texto visible amigable para humanos.',
        'Una fecha o hora concreta.'
      ],
      example: `${fmt('<time datetime="2026-03-15">15 de marzo de 2026</time>')}`,
      deliverable: 'El test detecta time.'
    }),
    address: (ctx) => ({
      title: 'Datos de contacto estructurados',
      scenario: `📄 ${ctx}: contacto solo en texto plano.`,
      problem: `La dirección y email de ${ctx} están en un párrafo genérico; lectores y buscadores no los identifican como contacto.`,
      objective: `Envolver dirección, teléfono o email en ${fmt('<address>')} en el footer o página de contacto.`,
      requirements: [
        `${fmt('<address>')} con contenido de contacto.`,
        'Puede incluir enlace mailto: o tel:.',
        'No uses address para direcciones postales en mera mención literaria.'
      ],
      example: `${fmt('<address>Av. Principal 123<br><a href="mailto:info@tienda.com">info@tienda.com</a></address>')}`,
      deliverable: 'El test confirma address.'
    })
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

  function getHtmlBrief(tag, ctx) {
    const factory = HTML_BRIEFS[tag];
    if (factory) return factory(ctx);
    return {
      title: `Marcar contenido con ${fmt(`<${tag}>`)}`,
      scenario: `📄 ${ctx}: falta el elemento ${fmt(`<${tag}>`)}.`,
      problem: `La pantalla de ${ctx} no incluye ${fmt(`<${tag}>`)}; el layout o los tests automáticos fallan por markup incompleto.`,
      objective: `Agregar ${fmt(`<${tag}>`)} con la estructura y atributos que exigen los tests del reto.`,
      requirements: [
        `Incluir al menos un ${fmt(`<${tag}>`)} válido en el HTML.`,
        'Revisa si el test pide atributos como href, alt, name o type.'
      ],
      example: null,
      deliverable: `Los tests confirman que ${fmt(`<${tag}>`)} está presente en el documento.`
    };
  }

  function practiceHtml(meta) {
    const { ctx, tag } = meta;
    const b = getHtmlBrief(tag, ctx);
    return {
      scenario: b.scenario,
      title: b.title,
      description: htmlDescription(b)
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

  return { practice, logic, reading, wrap, getHtmlBrief };
})();