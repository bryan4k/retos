const CHALLENGES_HTML = [
  {
    id: 'html-estructura-basica',
    tech: 'html',
    level: 'principiante',
    title: 'Estructura básica de página',
    scenario: null,
    description: `
      <div class="exercise-brief">
        <p class="brief-problem"><strong>Problema:</strong> Abres un archivo en el navegador y solo ves texto suelto o una página en blanco porque falta la estructura mínima que todo documento HTML debe tener.</p>
        <p class="brief-objective"><strong>Objetivo:</strong> Crear el esqueleto válido con <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code> (con <code>&lt;title&gt;</code>) y <code>&lt;body&gt;</code> con un párrafo de bienvenida.</p>
        <p class="brief-req-title"><strong>Requisitos concretos:</strong></p>
        <ol class="brief-steps">
          <li>DOCTYPE y etiqueta html con lang.</li>
          <li>title dentro de head (no en body).</li>
          <li>Al menos un <code>&lt;p&gt;</code> con texto en body.</li>
        </ol>
        <p class="brief-success"><strong>Criterio de éxito:</strong> Los tests detectan html, title en head y párrafo con contenido.</p>
      </div>
    `,
    learn: {
      concept: 'Todo documento HTML necesita una estructura jerárquica para que el navegador lo interprete correctamente.',
      whenToUse: 'Siempre que crees una página web. El DOCTYPE le dice al navegador qué versión de HTML usar; head contiene metadatos; body el contenido visible.'
    },
    starterCode: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi primera página</title>
</head>
<body>
  <!-- Escribe un párrafo de bienvenida aquí -->
  
</body>
</html>`,
    tests: [
      { type: 'exists', selector: 'html', name: 'Elemento html presente' },
      { type: 'exists', selector: 'head title', name: 'Título en head' },
      { type: 'exists', selector: 'body p', name: 'Párrafo en body' },
      { type: 'text', selector: 'body p', contains: true, name: 'Párrafo con contenido' }
    ],
    hint: 'Dentro de <body> agrega <p>Bienvenido a mi sitio</p> o texto similar.',
    feedback: {
      general: {
        why: 'HTML es un árbol de etiquetas anidadas. Si falta una etiqueta o está mal cerrada, el navegador no puede renderizar bien la página.',
        fix: 'Verifica que cada etiqueta de apertura tenga su cierre y que title esté dentro de head, no de body.',
        whenToUse: 'Usa esta estructura como plantilla base en todos tus proyectos web.'
      }
    }
  },
  {
    id: 'html-nav-lista',
    tech: 'html',
    level: 'principiante',
    title: 'Menú de navegación',
    scenario: null,
    description: `
      <div class="exercise-brief">
        <p class="brief-problem"><strong>Problema:</strong> El sitio tiene enlaces sueltos sin estructura; es difícil de estilar, poco accesible y los lectores de pantalla no reconocen la zona como navegación.</p>
        <p class="brief-objective"><strong>Objetivo:</strong> Armar un menú con <code>&lt;nav&gt;</code> que contenga <code>&lt;ul&gt;</code> y al menos 3 <code>&lt;a&gt;</code> (pueden usar <code>href="#"</code>).</p>
        <p class="brief-req-title"><strong>Requisitos concretos:</strong></p>
        <ol class="brief-steps">
          <li>nav como contenedor semántico.</li>
          <li>ul con li por cada enlace.</li>
          <li>Mínimo 3 enlaces con texto visible.</li>
        </ol>
        <p class="brief-success"><strong>Criterio de éxito:</strong> Tests verifican nav, ul, li y al menos 3 enlaces dentro.</p>
      </div>
    `,
    learn: {
      concept: 'Las listas no ordenadas agrupan elementos relacionados; nav indica semánticamente una zona de navegación.',
      whenToUse: 'En headers de sitios web, dashboards y apps con múltiples secciones. Mejora accesibilidad y SEO.'
    },
    starterCode: `<nav>
  <!-- Crea una lista con al menos 3 enlaces -->
  
</nav>`,
    tests: [
      { type: 'exists', selector: 'nav', name: 'Elemento nav' },
      { type: 'exists', selector: 'nav ul', name: 'Lista dentro de nav' },
      { type: 'count', selector: 'nav a', min: 3, name: 'Al menos 3 enlaces' },
      { type: 'exists', selector: 'nav li', name: 'Items de lista' }
    ],
    hint: 'Estructura: <nav><ul><li><a href="#">Inicio</a></li>...</ul></nav>',
    feedback: {
      general: {
        why: 'Los enlaces sueltos sin lista son más difíciles de estilar y menos semánticos para lectores de pantalla.',
        fix: 'Envuelve cada enlace en <li> dentro de un <ul> dentro de <nav>.',
        whenToUse: 'Usa nav + ul para menús horizontales o verticales en cualquier sitio multipágina.'
      }
    }
  },
  {
    id: 'html-formulario-contacto',
    tech: 'html',
    level: 'intermedio',
    title: 'Formulario de contacto',
    scenario: '🏢 Una empresa necesita captar leads en su landing page. Debes crear el formulario que enviará nombre, email y mensaje al CRM.',
    description: `
      <div class="exercise-brief">
        <p class="brief-problem"><strong>Problema:</strong> La landing captura leads pero el formulario no tiene labels, validación de email ni botón de envío; falla en móvil y accesibilidad.</p>
        <p class="brief-objective"><strong>Objetivo:</strong> Construir <code>&lt;form id="contacto"&gt;</code> con nombre (label+input), email obligatorio, textarea de mensaje y botón enviar.</p>
        <p class="brief-req-title"><strong>Requisitos concretos:</strong></p>
        <ol class="brief-steps">
          <li>Label con <code>for</code> asociado al id del input.</li>
          <li>Email con <code>type="email"</code> y <code>required</code>.</li>
          <li>textarea para el mensaje.</li>
          <li>button o input <code>type="submit"</code>.</li>
        </ol>
        <p class="brief-success"><strong>Criterio de éxito:</strong> Tests validan form#contacto, label[for], email required, textarea y submit.</p>
      </div>
    `,
    learn: {
      concept: 'Los formularios conectan al usuario con el backend. Labels asociados mejoran accesibilidad; types correctos activan validación nativa.',
      whenToUse: 'Registro, login, contacto, checkout, encuestas. Siempre asocia label con input via for/id.'
    },
    starterCode: `<form id="contacto">
  <!-- Nombre, email, mensaje y botón enviar -->
  
</form>`,
    tests: [
      { type: 'exists', selector: 'form#contacto', name: 'Formulario con id contacto' },
      { type: 'exists', selector: 'label[for]', name: 'Label con atributo for' },
      { type: 'exists', selector: 'input[type="email"][required]', name: 'Email requerido' },
      { type: 'exists', selector: 'textarea', name: 'Área de mensaje' },
      { type: 'exists', selector: 'button[type="submit"], input[type="submit"]', name: 'Botón enviar' }
    ],
    hint: 'Usa <label for="email">Email</label> y <input id="email" type="email" required>',
    feedback: {
      general: {
        why: 'Sin labels ni types, el formulario falla en móvil, accesibilidad y validación automática del navegador.',
        fix: 'Cada input necesita id único y su label con for igual. Email debe ser type="email" con required.',
        whenToUse: 'Todo formulario público debe tener labels, types semánticos y validación HTML5 antes de enviar al servidor.'
      }
    }
  },
  {
    id: 'html-tarjeta-producto',
    tech: 'html',
    level: 'intermedio',
    title: 'Tarjeta de producto e-commerce',
    scenario: '🛒 Tu tienda online muestra productos en grid. Cada tarjeta debe tener imagen, nombre, precio y botón de compra accesible.',
    description: `
      <div class="exercise-brief">
        <p class="brief-problem"><strong>Problema:</strong> El catálogo muestra productos sin estructura semántica ni imagen accesible; Google y lectores de pantalla no entienden cada ítem.</p>
        <p class="brief-objective"><strong>Objetivo:</strong> Crear una tarjeta en <code>&lt;article class="producto"&gt;</code> con imagen (alt), título h2, precio y botón de compra.</p>
        <p class="brief-req-title"><strong>Requisitos concretos:</strong></p>
        <ol class="brief-steps">
          <li>img con alt descriptivo (no solo "imagen").</li>
          <li>h2 con nombre del producto.</li>
          <li>p con clase <code>precio</code>.</li>
          <li>button con texto exacto "Agregar al carrito".</li>
        </ol>
        <p class="brief-success"><strong>Criterio de éxito:</strong> Tests comprueban article.producto, alt, h2, .precio y texto del botón.</p>
      </div>
    `,
    learn: {
      concept: 'article representa contenido independiente y reutilizable. alt en imágenes es obligatorio para accesibilidad.',
      whenToUse: 'Cards de blog, productos, noticias, testimonios. article ayuda a SEO y lectores de pantalla a delimitar bloques.'
    },
    starterCode: `<article class="producto">
  <!-- Imagen, título, precio y botón -->
  
</article>`,
    tests: [
      { type: 'exists', selector: 'article.producto', name: 'Article con clase producto' },
      { type: 'attribute', selector: 'article img', attr: 'alt', notEmpty: true, name: 'Imagen con alt' },
      { type: 'exists', selector: 'article h2', name: 'Título del producto' },
      { type: 'exists', selector: 'article .precio', name: 'Precio con clase' },
      { type: 'text', selector: 'article button', expected: 'Agregar al carrito', name: 'Botón de compra' }
    ],
    hint: 'alt debe describir el producto, ej: alt="Zapatillas deportivas rojas"',
    feedback: {
      general: {
        why: 'Las tiendas sin alt ni estructura semántica pierden ventas de usuarios con lector de pantalla y ranking en Google.',
        fix: 'Usa article > img(alt) + h2 + p.precio + button. El alt describe la imagen, no diga solo "imagen".',
        whenToUse: 'Patrón estándar en Amazon, Mercado Libre y cualquier catálogo de productos.'
      }
    }
  },
  {
    id: 'html-landing-semantica',
    tech: 'html',
    level: 'avanzado',
    title: 'Landing page semántica',
    scenario: '🚀 Startup lanza producto. Necesitas una landing con header, sección hero, características y footer — todo semántico para SEO.',
    description: `
      <div class="exercise-brief">
        <p class="brief-problem"><strong>Problema:</strong> La landing es solo divs genéricos; buscadores y tecnologías asistivas no distinguen cabecera, contenido principal ni pie.</p>
        <p class="brief-objective"><strong>Objetivo:</strong> Maquetar la landing con landmarks HTML5: header+nav, main con secciones hero y features, y footer.</p>
        <p class="brief-req-title"><strong>Requisitos concretos:</strong></p>
        <ol class="brief-steps">
          <li>header con nav (logo o texto de marca).</li>
          <li>main &gt; section#hero con un solo h1 y párrafo.</li>
          <li>section#features con al menos 2 article.</li>
          <li>footer con copyright o texto legal.</li>
        </ol>
        <p class="brief-success"><strong>Criterio de éxito:</strong> Tests validan header nav, main, hero h1, 2+ articles en features y footer.</p>
      </div>
    `,
    learn: {
      concept: 'HTML5 semántico comunica la estructura lógica de la página a buscadores y tecnologías asistivas.',
      whenToUse: 'Landings, blogs, documentación. Evita div-soup; usa header, main, section, article, footer.'
    },
    starterCode: `<!-- Estructura semántica completa de landing -->

`,
    tests: [
      { type: 'exists', selector: 'header nav', name: 'Header con navegación' },
      { type: 'exists', selector: 'main', name: 'Contenido principal' },
      { type: 'exists', selector: 'section#hero h1', name: 'Hero con h1' },
      { type: 'count', selector: 'section#features article', min: 2, name: 'Al menos 2 features' },
      { type: 'exists', selector: 'footer', name: 'Footer presente' }
    ],
    hint: 'Solo una h1 por página, dentro de #hero. Features van en articles separados.',
    feedback: {
      general: {
        why: 'Una página de solo divs funciona visualmente pero Google y screen readers no entienden la jerarquía.',
        fix: 'Organiza: header > nav, main > section#hero + section#features > articles, footer.',
        whenToUse: 'Toda página pública que quieras posicionar en buscadores debe usar landmarks semánticos.'
      }
    }
  },
  {
    id: 'html-dashboard-accesible',
    tech: 'html',
    level: 'experto',
    title: 'Dashboard accesible',
    scenario: '🏥 Un hospital usa un dashboard interno. Debe ser usable con teclado y lectores de pantalla (WCAG).',
    description: `
      <div class="exercise-brief">
        <p class="brief-problem"><strong>Problema:</strong> El dashboard interno no cumple WCAG: la tabla no tiene caption ni encabezados de columna y no hay forma de saltar al contenido con teclado.</p>
        <p class="brief-objective"><strong>Objetivo:</strong> Crear un dashboard accesible con skip link, tabla estructurada y botón con aria-label descriptivo.</p>
        <p class="brief-req-title"><strong>Requisitos concretos:</strong></p>
        <ol class="brief-steps">
          <li>Enlace <code>&lt;a href="#main"&gt;</code> al inicio (saltar al contenido).</li>
          <li>main con id="main".</li>
          <li>table con caption, thead y tbody; th scope="col".</li>
          <li>button con aria-label no vacío.</li>
        </ol>
        <p class="brief-success"><strong>Criterio de éxito:</strong> Tests verifican skip link, caption, th[scope], main#main y aria-label en botón.</p>
      </div>
    `,
    learn: {
      concept: 'WCAG exige que la información no dependa solo del color y que todo sea navegable por teclado.',
      whenToUse: 'Apps gubernamentales, salud, banca y cualquier producto con usuarios diversos. Accesibilidad es requisito legal en muchos países.'
    },
    starterCode: `<!-- Dashboard accesible con tabla de pacientes -->

`,
    tests: [
      { type: 'exists', selector: 'a[href="#main"]', name: 'Skip link' },
      { type: 'exists', selector: 'table caption', name: 'Caption en tabla' },
      { type: 'exists', selector: 'th[scope="col"]', name: 'Headers de columna' },
      { type: 'exists', selector: 'main#main', name: 'Main con id' },
      { type: 'attribute', selector: 'button[aria-label]', attr: 'aria-label', notEmpty: true, name: 'Botón con aria-label' }
    ],
    hint: 'Skip link: <a href="#main">Saltar al contenido</a> y <main id="main">',
    feedback: {
      general: {
        why: 'Tablas sin th/caption son ilegibles para screen readers; botones sin aria-label son anunciados solo como "botón".',
        fix: 'Agrega caption que describa la tabla, th en cada columna, aria-label en acciones icon-only.',
        whenToUse: 'Tablas de datos, dashboards admin, backoffice. Siempre prueba con Tab + lector de pantalla.'
      }
    }
  }
];