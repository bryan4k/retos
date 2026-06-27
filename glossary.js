const Glossary = (function () {
  'use strict';

  const TERMS = {
    'arrow function': 'Función definida con =>. Hereda this del contexto padre, ideal para callbacks cortos.',
    'async': 'Código asíncrono que puede usar await. No bloquea el hilo principal mientras espera operaciones.',
    'await': 'Pausa una función async hasta que una Promise se resuelva. Solo funciona dentro de async.',
    'api': 'Interfaz de Programación de Aplicaciones. Contrato para que sistemas se comuniquen (REST, GraphQL, etc.).',
    'aria': 'Atributos de Accesibilidad Web. Complementan HTML cuando la semántica nativa no basta (aria-label, role).',
    'alt': 'Texto alternativo en imágenes. Obligatorio para accesibilidad y SEO; describe la imagen para lectores de pantalla.',
    'anidamiento': 'Colocar elementos dentro de otros. En HTML, CSS y JSON la estructura anidada define jerarquía.',
    'acumulador': 'Variable que va guardando un resultado parcial en un bucle o reduce (ej: suma total).',
    'booleano': 'Tipo con solo dos valores: true o false. Base de condicionales y validaciones.',

    'callback': 'Función pasada como argumento para ejecutarse después (ej: al terminar un fetch).',
    'closure': 'Función que recuerda variables de su scope exterior aunque ya haya terminado la función padre.',
    'currying': 'Transformar f(a,b,c) en f(a)(b)(c). Útil para funciones reutilizables con parámetros parciales.',
    'debounce': 'Retrasa ejecución hasta que paren las llamadas rápidas. Ideal para búsqueda en vivo.',
    'decorador': 'En Python, función que envuelve otra para añadir comportamiento (@decorator).',
    'destructuring': 'Extraer valores de objetos/arrays en variables: const {a} = obj; const [x] = arr.',
    'dom': 'Document Object Model. Representación en árbol del HTML que el navegador manipula con JS.',
    'edge case': 'Caso límite o inusual (array vacío, 0, null) que suele romper código no probado.',

    'f-string': 'En Python, string con f"...{variable}..." para interpolar valores legiblemente.',
    'flexbox': 'Modelo CSS de layout en una dimensión. Alinea y distribuye hijos con display: flex.',
    'grid': 'Modelo CSS de layout en dos dimensiones. Filas y columnas con display: grid.',
    'hoisting': 'Comportamiento JS donde var y function se “elevan”: declaradas antes de ejecutar la línea.',
    'iframe': 'Marco HTML que embebe otra página. Útil para previews y widgets aislados.',
    'inmutabilidad': 'No modificar datos originales; crear copias nuevas. Evita bugs en estado compartido.',
    'iterable': 'Objeto recorrible con bucle (array, string, generadores en Python/JS).',
    'landmark': 'Regiones semánticas HTML: header, main, nav, footer. Ayudan a navegación y SEO.',
    'list comprehension': 'Sintaxis Python compacta: [x*2 for x in nums]. Crea listas en una línea.',
    'map': 'Método que transforma cada elemento de un array devolviendo uno nuevo del mismo tamaño.',
    'filter': 'Método que devuelve elementos que cumplen una condición, sin mutar el original.',
    'reduce': 'Método que acumula un array en un solo valor (suma, objeto, etc.).',
    'memoize': 'Cachear resultados de función según argumentos para no recalcular.',
    'middleware': 'Capa intermedia que procesa peticiones antes del handler final (auth, logs).',
    'media query': 'Regla CSS @media que aplica estilos según tamaño de pantalla u otras condiciones.',
    'nullable': 'Valor que puede ser null/None además de su tipo normal. Requiere validación explícita.',
    'palíndromo': 'Texto que se lee igual al derecho y al revés.',
    'prototype': 'Objeto del que heredan propiedades las instancias en JavaScript.',
    'promise': 'Objeto que representa un valor futuro (éxito o error). Base de async/await.',
    'pyodide': 'Python ejecutándose en el navegador vía WebAssembly. Permite correr Python sin servidor.',
    'recursión': 'Función que se llama a sí misma. Necesita caso base para no iterar infinitamente.',
    'regex': 'Expresión regular. Patrón para validar o buscar texto (emails, formatos).',
    'refactor': 'Reestructurar código sin cambiar comportamiento externo. Mejora legibilidad o performance.',
    'responsive': 'Diseño que se adapta a móvil, tablet y desktop sin romper la experiencia.',
    'sandbox': 'Entorno aislado donde el código tiene permisos limitados (iframes, workers).',
    'scope': 'Ámbito donde una variable es visible. let/const tienen block scope; var function scope.',
    'selector': 'En CSS, patrón que apunta a elementos (.clase, #id). En JS, querySelector los usa.',
    'semántico': 'Uso de etiquetas HTML según su significado real (nav, article, main), no solo por cómo se ven. Mejora accesibilidad, SEO y mantenimiento.',
    'semántica': 'Disciplina de elegir la etiqueta correcta según el tipo de contenido. Ej: button para acciones, no div con onclick. Google y lectores de pantalla entienden mejor tu página.',
    'semantica': 'Disciplina de elegir la etiqueta correcta según el tipo de contenido. Ej: button para acciones, no div con onclick. Google y lectores de pantalla entienden mejor tu página.',
    'html': 'HyperText Markup Language. Lenguaje de marcado que estructura el contenido web: títulos, párrafos, enlaces, formularios e imágenes. Es la capa base de toda página; CSS la estiliza y JS la hace interactiva.',
    'css': 'Cascading Style Sheets. Hoja de estilos que controla colores, tipografías, espaciado, layout y animaciones. Separa presentación del contenido HTML para diseños consistentes y responsive.',
    'javascript': 'Lenguaje de programación del navegador y Node.js. Añade interactividad: eventos, validaciones, peticiones a APIs, manipulación del DOM y lógica de aplicaciones web completas.',
    'js': 'Abreviatura de JavaScript. Mismo lenguaje; se usa en archivos .js, frameworks (React, Vue) y en consola del navegador para depurar.',
    'python': 'Lenguaje legible y versátil para backend (Django, FastAPI), scripts, ciencia de datos y automatización. Usa indentación en lugar de llaves.',
    'seo': 'Search Engine Optimization. Prácticas para que tu sitio sea encontrado y bien posicionado en Google: HTML semántico, títulos claros, meta description, velocidad, enlaces y contenido útil.',
    'serp': 'Search Engine Results Page. La página de resultados de Google. Tu title y meta description aparecen ahí y deciden si el usuario hace clic.',
    'crawler': 'Robot de buscadores (Googlebot) que recorre enlaces e indexa páginas. HTML roto o sin enlaces internos dificulta que te encuentren.',
    'indexación': 'Proceso en que un buscador guarda tu página en su índice. Sin indexación, tu sitio no aparece en búsquedas aunque esté publicado.',
    'meta description': 'Resumen en HTML (<meta name="description">) que suele mostrarse bajo el título en Google. Debe describir la página en ~150 caracteres.',
    'server-side': 'Ejecución en el servidor antes de enviar la respuesta al navegador. Genera HTML dinámico (PHP, Laravel, Django, Node). Ideal para SEO y datos privados.',
    'client-side': 'Ejecución en el navegador del usuario (JavaScript, CSS). La lógica corre en el dispositivo del cliente; puede no verse en el HTML inicial (CSR).',
    'blade': 'Motor de plantillas de Laravel (PHP). Mezcla HTML con directivas @if, @foreach y {{ $variable }} en el servidor antes de responder al cliente.',
    'ejs': 'Embedded JavaScript. Plantillas que insertan datos en HTML con <% %> y <%= %>. Popular en Express.js para renderizar páginas en el servidor.',
    'pug': 'Lenguaje de plantillas indentado que compila a HTML. Menos verboso que HTML puro; usado en Node.js (antes Jade).',
    'handlebars': 'Motor de plantillas Mustache para JS. Sintaxis {{variable}} y {{#each}} para generar HTML desde datos en frontend o SSR.',
    'twig': 'Motor de plantillas de Symfony/PHP. Similar a Blade: herencia de layouts, filtros y sintaxis {{ }} en el servidor.',
    'mustache': 'Sintaxis minimalista de plantillas sin lógica compleja ({{name}}). Base de Handlebars y otros motores.',
    'template engine': 'Sistema que combina una plantilla HTML con datos para producir HTML final. Blade, EJS y Twig evitan repetir cabeceras y menús en cada página.',
    'motor de plantillas': 'Herramienta server-side que genera HTML dinámico a partir de datos y archivos .blade, .ejs, etc.',
    'php': 'Lenguaje server-side muy usado en web. WordPress y Laravel corren en PHP; el servidor interpreta el archivo y devuelve HTML al navegador.',
    'laravel': 'Framework PHP moderno con Blade, Eloquent ORM, rutas y migraciones. Estándar para APIs y sitios con backend robusto.',
    'django': 'Framework Python “batteries included”: ORM, admin, auth y plantillas. Muy usado en backends, CMS internos y APIs.',
    'express': 'Framework minimalista de Node.js para APIs y sitios. A menudo combina con EJS o sirve JSON a un frontend SPA.',
    'react': 'Librería JS de Facebook para UI por componentes y estado. Virtual DOM; suele usar CSR o SSR con Next.js.',
    'vue': 'Framework progresivo JS: fácil de integrar en HTML existente. Componentes .vue con template, script y style.',
    'angular': 'Framework completo de Google con TypeScript, inyección de dependencias y herramientas CLI para apps enterprise.',
    'next.js': 'Framework React con SSR, SSG y rutas por archivo. Mejora SEO y performance frente a SPA pura.',
    'nuxt': 'Framework Vue equivalente a Next: renderizado en servidor, rutas automáticas y optimización SEO.',
    'node': 'Node.js. Permite ejecutar JavaScript fuera del navegador (servidor, scripts). Ecosistema npm enorme.',
    'npm': 'Gestor de paquetes de Node. Instala librerías (react, express) con npm install; package.json declara dependencias.',
    'vite': 'Herramienta de build ultrarrápida para proyectos modernos. Dev server instantáneo y empaquetado con Rollup.',
    'webpack': 'Empaquetador que une módulos JS, CSS e imágenes en bundles para producción. Muy configurable.',
    'sass': 'Preprocesador CSS con variables, anidamiento y mixins. Compila a CSS estándar (.scss → .css).',
    'less': 'Preprocesador CSS similar a Sass. Variables y funciones; usado en Bootstrap antiguo.',
    'postcss': 'Herramienta que transforma CSS con plugins (autoprefixer, tailwind). Se ejecuta en el build, no en el navegador.',
    'tailwind': 'Framework CSS utility-first: clases como flex, pt-4, text-center. Rápido para prototipos si conoces las utilidades.',
    'bootstrap': 'Framework CSS/JS con grid, componentes (navbar, modal) y diseño responsive predefinido.',
    'markup': 'Lenguaje de marcado como HTML: etiquetas que describen estructura, no lógica ejecutable.',
    'stylesheet': 'Archivo CSS o conjunto de reglas que definen la apariencia visual de elementos HTML.',
    'doctype': 'Declaración <!DOCTYPE html> que indica al navegador el modo estándar. Sin ella, el rendering puede ser impredecible.',
    'meta': 'Etiquetas en <head> con metadatos: charset, viewport, description, Open Graph. No se ven pero afectan SEO y comportamiento.',
    'head': 'Sección HTML con metadatos, title, links a CSS y scripts. No es contenido visible directamente.',
    'body': 'Sección HTML con todo lo que el usuario ve e interactúa: texto, imágenes, formularios.',
    'accesibilidad': 'Diseño usable por personas con discapacidad visual, motora o cognitiva. Incluye contraste, teclado, alt y ARIA.',
    'a11y': 'Abreviatura de accessibility (11 letras entre a y y). Sinónimo de accesibilidad web.',
    'cms': 'Content Management System. WordPress, Drupal: permiten editar contenido sin tocar código en cada publicación.',
    'wordpress': 'CMS más usado del mundo. Temas (HTML/CSS) y plugins (PHP) extienden blogs y tiendas.',
    'http': 'Protocolo de transferencia web. GET pide recursos; POST envía datos. Base de toda comunicación browser-servidor.',
    'https': 'HTTP con cifrado TLS. Obligatorio para formularios, pagos y confianza del usuario (candado en el navegador).',
    'ssl': 'Certificado que cifra la conexión (evolucionó a TLS). Sin HTTPS los datos viajan en texto plano.',
    'dns': 'Sistema que traduce dominios (google.com) a IPs. Sin DNS correcto tu sitio no resuelve aunque el servidor funcione.',
    'endpoint': 'URL concreta de una API que realiza una acción: GET /api/users, POST /api/login.',
    'crud': 'Create, Read, Update, Delete. Operaciones básicas sobre datos en cualquier app (formularios, tablas admin).',
    'backend': 'Capa servidor: lógica, base de datos, auth, APIs. PHP, Python, Node suelen vivir aquí.',
    'frontend': 'Capa cliente: HTML, CSS, JS que el usuario ve. React/Vue son frontend; también “maquetación pura”.',
    'fullstack': 'Desarrollo que cubre frontend y backend. Un fullstack puede crear la UI y la API que la alimenta.',
    'mobile-first': 'Diseñar primero para móvil y ampliar con media queries min-width. Mejor UX en pantallas pequeñas.',
    'validación': 'Comprobar que datos cumplen reglas antes de procesarlos. HTML5 (required, type=email) + JS o servidor.',
    'formulario': 'Conjunto de inputs para capturar datos del usuario. Debe tener labels, types correctos y validación.',
    'atributo': 'Par en etiqueta HTML: href en <a>, src en <img>, class, id, alt. Modifican comportamiento o estilo.',
    'etiqueta': 'Elemento HTML: <p>, <div>, <button>. Apertura, contenido y cierre (o self-closing como <img>).',
    'navegador': 'Chrome, Firefox, Safari. Interpreta HTML/CSS/JS. Cada uno puede renderizar ligeramente distinto.',
    'devtools': 'Herramientas de desarrollo del navegador (F12): inspeccionar DOM, CSS, consola, red y performance.',
    'consola': 'Panel en DevTools donde console.log muestra valores y aparecen errores de JavaScript en tiempo real.',
    'breakpoint': 'En CSS: ancho de pantalla donde cambia el layout responsive (@media). En debugging: línea donde el código se pausa para inspeccionar variables.',
    'variable css': 'Custom property --nombre en CSS. Permite temas y valores reutilizables: color: var(--primary).',
    'especificidad': 'Sistema que decide qué regla CSS gana cuando varias aplican al mismo elemento: inline (1000) > #id (100) > .clase (10) > etiqueta (1). La cascada y el orden también influyen.',
    'cascada': 'Orden en que CSS aplica reglas: origen, especificidad y orden de declaración. La “C” de CSS.',
    'heredado': 'Propiedades CSS que los hijos reciben del padre (color, font-family). No todas se heredan (margin, border).',
    'box model': 'Modelo de caja: content + padding + border + margin. Entenderlo es clave para espaciado y layout.',
    'padding': 'Espacio interior entre contenido y borde del elemento. No colapsa con elementos vecinos.',
    'margin': 'Espacio exterior alrededor del elemento. Separa bloques; puede colapsar verticalmente entre hermanos.',
    'border': 'Línea alrededor del padding. Define tamaño visual y puede redondearse con border-radius.',
    'z-index': 'Orden de apilamiento en el eje Z. Solo tiene efecto con position distinto de static.',
    'position': 'CSS static, relative, absolute, fixed, sticky. Controla cómo se posiciona respecto al flujo o viewport.',
    'overflow': 'Qué pasa si el contenido desborda: hidden, scroll, auto. Crítico en modales y tablas.',
    'transition': 'Animación suave entre dos estados CSS al cambiar propiedades (hover, clases).',
    'animation': 'Secuencia de keyframes CSS repetible, independiente de interacción del usuario.',
    'keyframes': 'Pasos de una animación CSS (@keyframes nombre { 0% {} 100% {} }).',
    'pseudo-clase': 'Selector CSS como :hover, :focus, :nth-child. Aplica estilos en estados sin clase extra en HTML.',
    'pseudo-elemento': '::before y ::after crean contenido decorativo en CSS sin añadir nodos al HTML.',
    'combinador': 'En CSS: espacio (descendiente), > (hijo directo), + (hermano adyacente). Define relaciones entre selectores.',
    'reset': 'Hoja CSS que anula estilos por defecto del navegador para partir de base consistente entre browsers.',
    'normalize': 'Similar a reset pero preserva utilidades del user-agent (mejor legibilidad por defecto).',
    'open graph': 'Meta tags og:title, og:image para previews al compartir en redes sociales y WhatsApp.',
    'canonical': 'Link rel=canonical indica a Google la URL principal cuando hay contenido duplicado.',
    'sitemap': 'Archivo XML que lista URLs del sitio para ayudar a buscadores a descubrir páginas.',
    'robots.txt': 'Indica a crawlers qué rutas pueden rastrear. No bloquea indexación por sí solo del todo.',
    'latencia': 'Tiempo entre pedir un recurso y recibirlo. Afecta UX y ranking SEO (Core Web Vitals).',
    'core web vitals': 'Métricas de Google: LCP (carga), INP (interactividad), CLS (estabilidad visual). Afectan SEO.',
    'lcp': 'Largest Contentful Paint. Tiempo hasta que el elemento principal visible termina de cargar.',
    'cls': 'Cumulative Layout Shift. Cuánto “salta” el layout mientras carga; mal CLS frustra al usuario.',
    'minificación': 'Quitar espacios y comentarios de CSS/JS en producción para archivos más pequeños y rápidos.',
    'bundling': 'Unir muchos archivos JS/CSS en uno o pocos bundles para menos peticiones HTTP.',
    'transpilación': 'Convertir código de un lenguaje/sintaxis a otro (TypeScript→JS, Sass→CSS, JSX→JS).',
    'jsx': 'Sintaxis en React que mezcla HTML-like dentro de JavaScript. Compila a React.createElement.',
    'virtual dom': 'Representación en memoria del DOM que React compara para actualizar solo lo que cambió.',
    'hook': 'Funciones React (useState, useEffect) que añaden estado y efectos a componentes funcionales.',
    'props': 'Propiedades que un componente padre pasa al hijo en React/Vue. Entrada de datos, no mutables en hijo.',
    'estado local': 'Datos que vive dentro de un componente y al cambiar provoca re-render (useState en React).',
    'routing': 'Sistema de rutas que muestra distintas vistas según la URL (/home, /producto/5).',
    'spa routing': 'En SPAs, el servidor siempre devuelve index.html y JS cambia la vista según la ruta (history API).',
    'history api': 'pushState/replaceState en JS para cambiar URL sin recargar la página completa.',
    'fetch': 'API moderna de JS para peticiones HTTP. Devuelve Promises; reemplaza XMLHttpRequest en la mayoría de casos.',
    'xhr': 'XMLHttpRequest. API clásica para AJAX antes de fetch; aún presente en código legacy.',
    'ajax': 'Asynchronous JavaScript and XML. Actualizar parte de la página sin recarga completa.',
    'multipart': 'Tipo de formulario para subir archivos (enctype multipart/form-data).',
    'enctype': 'Atributo del form: application/x-www-form-urlencoded (default) o multipart para archivos.',
    'csrf token': 'Token anti-falsificación en formularios para que el servidor verifique que la petición es legítima.',
    'sanitización': 'Limpiar entrada del usuario para evitar XSS o inyección antes de guardar o mostrar datos.',
    'escape': 'Convertir caracteres especiales (<, >, &) a entidades HTML para mostrar texto sin ejecutar código.',
    'entidad html': 'Código como &amp; o &lt; para representar caracteres reservados en HTML.',
    'utf-8': 'Codificación de caracteres estándar web. Soporta acentos y emojis; declárala en meta charset.',
    'mime type': 'Tipo de archivo que el servidor declara (text/html, application/json). El navegador actúa según él.',
    'status code': 'Código HTTP: 200 OK, 301 redirect, 404 no encontrado, 500 error servidor.',
    'redirect': 'Respuesta 301/302 que envía al usuario a otra URL. Importante al cambiar slugs sin perder SEO.',
    'slug': 'Parte legible de la URL: /blog/como-aprender-css. Debe ser descriptiva y estable.',
    'query string': 'Parámetros tras ? en URL: ?page=2&sort=price. Útil para filtros y paginación.',
    'path param': 'Segmento de ruta variable: /users/:id en APIs REST.',

    'migración': 'Archivo versionado que cambia el esquema de la base de datos (añadir columna, tabla) de forma controlada.',
    'seed': 'Datos iniciales insertados en BD para desarrollo o demos (usuarios de prueba, catálogo).',
    'env': 'Variables de entorno (.env): claves API, URLs de BD. No se suben a git; cada entorno tiene las suyas.',
    'git': 'Control de versiones distribuido. Commits, branches y merge para colaborar sin pisar código ajeno.',
    'commit': 'Snapshot guardado del proyecto en git con mensaje descriptivo del cambio.',
    'branch': 'Línea de desarrollo paralela en git (feature/login) que luego se fusiona a main.',
    'pull request': 'Solicitud de revisión para fusionar una branch. Ahí se lee código ajeno y se comenta.',
    'code review': 'Revisión de código por pares antes de merge. Detecta bugs, mejora diseño y comparte conocimiento.',
    'legacy': 'Código antiguo aún en producción. Difícil de cambiar pero crítico; leerlo bien es habilidad senior.',
    'deprecado': 'API o patrón desaconsejado que aún funciona pero será eliminado. Migrar antes de que rompa.',
    'polyfill': 'Script que añade funcionalidad moderna a navegadores viejos (Promise, fetch).',
    'shim': 'Código que adapta una interfaz para que funcione donde no existe nativamente.',

    'hot reload': 'Recargar módulos en desarrollo sin perder estado de la app (Vite, Webpack HMR).',
    'ssg': 'Static Site Generation. HTML pregenerado en build (blog, docs). Máxima velocidad y SEO.',
    'isr': 'Incremental Static Regeneration en Next.js: páginas estáticas que se regeneran en background.',
    'edge': 'Ejecutar código cerca del usuario (CDN edge functions) para menor latencia global.',

    'spread': 'Operador ... que expande arrays/objetos: [...arr], {...obj}.',
    'throttle': 'Limita ejecución a una vez cada X ms. Útil en scroll o resize.',
    'truthy': 'Valor que JavaScript trata como true en condicionales (ej: "0" es truthy, 0 es falsy).',
    'falsy': 'Valores tratados como false: 0, "", null, undefined, NaN, false.',
    'viewport': 'Área visible del navegador. Meta viewport controla escala en móvil.',
    'wcag': 'Pautas de Accesibilidad para el Contenido Web. Estándar internacional a11y.',
    'webhook': 'URL que recibe notificaciones HTTP automáticas cuando ocurre un evento en otro sistema.',
    'token': 'Pieza de dato que representa identidad, sesión o valor en APIs y autenticación.',
    'payload': 'Cuerpo de datos enviado en una petición o mensaje (JSON en POST, por ejemplo).',
    'schema': 'Estructura formal de datos: campos, tipos y reglas de validación.',
    'etl': 'Extract, Transform, Load. Pipeline que extrae datos, los transforma y carga en destino.',
    'cron': 'Tarea programada que se ejecuta a intervalos fijos en el servidor.',
    'hash': 'Resultado irreversible de una función criptográfica. Usado para contraseñas, no para guardar texto plano.',
    'graphql': 'Lenguaje de consulta de APIs. El cliente pide exactamente los campos que necesita.',
    'rest': 'Estilo de API basado en HTTP, URLs y verbos (GET, POST). El más extendido en la web.',
    'json': 'Formato de intercambio de datos ligero basado en texto. Estándar en APIs web.',
    'typescript': 'Superset de JavaScript con tipos estáticos. Se compila a JS.',
    'componente': 'Pieza reutilizable de UI o lógica encapsulada (botón, card, función módulo).',
    'estado': 'Datos que cambian en el tiempo y afectan qué muestra la app (carrito, usuario logueado).',
    'renderizar': 'Generar la representación visual o DOM a partir de datos o plantillas.',
    'compilación': 'Traducir código fuente a otro formato antes de ejecutar (TypeScript, Sass).',
    'runtime': 'Momento en que el código se ejecuta, no cuando se escribe o compila.',
    'bundle': 'Archivo empaquetado con múltiples módulos JS para el navegador.',
    'depurar': 'Encontrar y corregir errores (debug). Con breakpoints, logs o lectura de código.',
    'snippet': 'Fragmento pequeño de código reutilizable o de ejemplo.',
    'pipeline': 'Secuencia automatizada de pasos de procesamiento (datos, CI/CD, builds).',
    'query': 'Consulta para obtener datos: SQL, GraphQL o parámetros de búsqueda en URL.',
    'mutation': 'Operación que modifica datos (crear, actualizar, borrar), en GraphQL o estado.',
    'herencia': 'Mecanismo donde una clase u objeto recibe propiedades de otro: extends en JS, class Hijo(Padre) en Python, o prototype chain.',
    'polimorfismo': 'Mismo interfaz, distintas implementaciones. Ej: distintos métodos .render().',
    'encapsulación': 'Ocultar detalles internos y exponer solo una API pública al resto del sistema.',
    'singleton': 'Patrón con una sola instancia global (conexión DB, config).',
    'factory': 'Función/clase que crea objetos sin especificar la clase exacta.',
    'observer': 'Patrón donde objetos se suscriben a cambios de otro (event listeners).',
    'iterador': 'Objeto con método next() que devuelve valores uno a uno.',
    'generador': 'Función que puede pausarse y reanudarse (function* en JS, yield en Python).',
    'lambda': 'Función anónima pequeña. En Python: lambda x: x*2.',
    'módulo': 'Archivo o unidad de código con exports/imports. Organiza proyectos grandes.',
    'import': 'Traer código de otro módulo o librería al archivo actual.',
    'export': 'Exponer funciones/variables para que otros módulos las usen.',
    'lint': 'Análisis estático que detecta errores de estilo o bugs antes de ejecutar.',
    'semver': 'Versionado semántico MAJOR.MINOR.PATCH para paquetes y APIs.',
    'cdn': 'Content Delivery Network: red de servidores que cachea assets estáticos (imágenes, CSS, JS) cerca del usuario. Reduce latencia y descarga la carga del servidor de origen.',
    'cors': 'Política del navegador que controla si un sitio puede pedir recursos de otro dominio.',
    'cookie': 'Pequeño dato que el navegador guarda y envía al servidor (sesiones, preferencias).',
    'localstorage': 'Almacenamiento persistente en el navegador del usuario (clave-valor).',
    'session': 'Periodo de interacción de un usuario autenticado o una pestaña activa.',
    'oauth': 'Protocolo de autorización para login con Google/GitHub sin compartir contraseña.',
    'jwt': 'JSON Web Token. Credencial firmada para autenticación stateless en APIs.',
    'orm': 'Object-Relational Mapping. Traduce tablas SQL a objetos en código (User.find, save). Django ORM, Eloquent (Laravel) y Prisma son ejemplos habituales.',
    'sql': 'Lenguaje para consultar bases de datos relacionales (SELECT, INSERT, JOIN).',
    'nosql': 'Bases no relacionales (documentos, clave-valor). Flexibles para datos no tabulares.',
    'cache': 'Almacenamiento rápido temporal para evitar recalcular o re-pedir datos.',
    'latency': 'Tiempo de demora entre petición y respuesta. Crítico en UX y APIs.',
    'throughput': 'Cantidad de operaciones procesadas por unidad de tiempo.',
    'idempotente': 'Operación que da el mismo resultado si se repite (ej: PUT con mismo body).',
    'side effect': 'Efecto secundario: modificar estado externo, DOM, o variable global al ejecutar función.',
    'pure function': 'Función sin side effects: misma entrada siempre da misma salida.',
    'inyección': 'Vulnerabilidad donde datos del usuario se interpretan como código (SQL, XSS).',
    'xss': 'Cross-Site Scripting. Insertar JS malicioso en páginas vistas por otros usuarios.',
    'csrf': 'Ataque que fuerza acciones no deseadas usando la sesión autenticada del usuario.',
    'bcrypt': 'Algoritmo para hashear contraseñas de forma lenta y segura.',
    'dry': 'Don\'t Repeat Yourself. Evita duplicar lógica; abstrae en funciones reutilizables.',
    'kiss': 'Keep It Simple. Prefiere soluciones simples sobre ingeniería innecesaria.',
    'solid': 'Cinco principios de diseño OOP para código mantenible.',
    'tdd': 'Test-Driven Development. Escribir tests antes del código de producción.',
    'mock': 'Objeto falso que simula dependencias en tests (API, base de datos).',
    'fixture': 'Datos de prueba predefinidos y repetibles para tests.',
    'ci/cd': 'Integración y despliegue continuos. Automatiza tests y releases al hacer push.',
    'docker': 'Contenedores que empaquetan app + dependencias para ejecutar igual en cualquier servidor.',
    'kubernetes': 'Orquestador de contenedores a escala. Gestiona réplicas, redes y despliegues.',
    'microservicio': 'Servicio pequeño e independiente que hace una cosa bien. Se comunica por red.',
    'monolito': 'Aplicación en un solo despliegue/código base. Más simple al inicio, más pesado al escalar.',
    'websocket': 'Conexión bidireccional persistente entre cliente y servidor (chat, tiempo real).',
    'sse': 'Server-Sent Events. Servidor empuja actualizaciones al cliente por HTTP.',
    'lazy loading': 'Cargar recursos solo cuando se necesitan (imágenes, módulos). Mejora performance.',
    'tree shaking': 'En el build, eliminar exports y código no usados del bundle final para reducir el tamaño del JS que descarga el navegador.',
    'hydration': 'En SSR, el cliente “activa” HTML estático con interactividad JS (React, etc.).',
    'ssr': 'Server-Side Rendering. HTML generado en servidor antes de enviar al navegador.',
    'csr': 'Client-Side Rendering. El navegador construye DOM con JS tras cargar bundle.',
    'spa': 'Single Page Application. Una página HTML, navegación manejada por JS.',
    'pwa': 'Progressive Web App. Web con capacidades nativas (offline, instalable).',
    'wasm': 'WebAssembly. Código binario rápido en navegador (Pyodide, juegos, editores).',
    'server side': 'Sinónimo de server-side: la lógica y el HTML se generan en el servidor (PHP, Laravel, Django) antes de llegar al navegador.',
    'client side': 'Sinónimo de client-side: HTML, CSS y JS se ejecutan en el navegador del usuario tras descargar la página.',
    'plantilla': 'Archivo reutilizable (Blade, EJS, Pug) que mezcla HTML con datos. Evita copiar cabecera, menú y pie en cada página.',
    'maquetación': 'Armar la estructura visual con HTML y CSS: secciones, grid, tipografía y responsive. Base antes de añadir lógica JS.',
    'jinja': 'Motor de plantillas de Python usado en Flask y Django. Sintaxis {{ variable }} y {% for %} en el servidor.',
    'nunjucks': 'Motor de plantillas para Node.js inspirado en Jinja. Herencia de layouts y filtros; extensión .njk.',
    'liquid': 'Lenguaje de plantillas de Shopify y Jekyll. Sintaxis {{ }} y {% %} para temas y contenido dinámico.',
    'razor': 'Sintaxis de plantillas de ASP.NET (.cshtml). Mezcla C# con HTML para vistas en el servidor.',
    'partial': 'Fragmento de plantilla reutilizable: un formulario, una tarjeta o el menú que incluyes en varias páginas.',
    'layout': 'Plantilla maestra con estructura común (head, nav, footer). Las vistas hijas solo rellenan el contenido central.',
    'directiva': 'Instrucción en motores como Blade (@if, @foreach) o EJS (<% %>) que añade lógica al generar HTML.',
    'interpolación': 'Insertar datos en HTML con {{ nombre }} (Blade, Handlebars) o <%= nombre %> (EJS). El valor se escapa para evitar XSS.',
    'vanilla': 'JavaScript, CSS o HTML sin frameworks ni librerías. Útil para entender fundamentos antes de React o Tailwind.',
    'vanilla js': 'JavaScript puro del navegador, sin React, Vue ni jQuery. Manipulas el DOM con APIs nativas.',
    'jquery': 'Librería clásica que simplificaba el DOM con selectores como $(".clase"). Hoy muchos proyectos usan JS nativo o frameworks modernos.',
    'htmx': 'Librería que añade interactividad vía atributos HTML (hx-get, hx-swap) sin escribir mucho JavaScript.',
    'alpine.js': 'Framework ligero declarativo en HTML (x-data, x-show). Interactividad pequeña sin montar una SPA completa.',
    'json-ld': 'Datos estructurados en JSON dentro de <script type="application/ld+json">. Google los usa para rich snippets.',
    'schema.org': 'Vocabulario estándar para describir entidades (Product, Article, Organization) en datos estructurados y SEO.',
    'datos estructurados': 'Marcado que explica a buscadores qué es cada bloque (receta, producto, FAQ). Mejora resultados enriquecidos en Google.',
    'rich snippet': 'Resultado de búsqueda enriquecido: estrellas, precio, FAQ. Depende de datos estructurados y HTML semántico correcto.',
    'lighthouse': 'Herramienta de Chrome que audita performance, SEO, accesibilidad y buenas prácticas. Puntúa de 0 a 100.',
    'encabezado': 'Títulos h1–h6 que jerarquizan el contenido. Un solo h1 por página suele ser buena práctica para SEO y lectura.',
    'h1': 'Encabezado principal de la página. Debe resumir el tema; es señal fuerte para buscadores y lectores de pantalla.',
    'meta tags': 'Etiquetas <meta> en el head: description, viewport, robots, Open Graph. Invisibles pero cruciales para SEO y redes.',
    'progressive enhancement': 'Construir primero HTML funcional y accesible; luego añadir CSS y JS como mejora. Si falla JS, el contenido sigue usable.',
    'graceful degradation': 'Diseñar para navegadores modernos y ofrecer alternativa aceptable en entornos limitados (sin JS o CSS avanzado).',
    'manipulación del dom': 'Crear, mover o borrar nodos HTML con JavaScript (createElement, appendChild, classList). Base de interactividad web.',
    'innerhtml': 'Propiedad que asigna HTML como string al elemento. Rápida pero peligrosa con datos de usuario sin sanitizar (riesgo XSS).',
    'textcontent': 'Propiedad segura que solo inserta texto plano, sin interpretar etiquetas. Preferible para mostrar datos de usuario.',
    'web components': 'Estándar con custom elements y Shadow DOM para crear etiquetas HTML reutilizables encapsuladas (<mi-boton>).',
    'shadow dom': 'Árbol DOM aislado dentro de un componente. Los estilos externos no lo afectan; útil en design systems.',
    'preprocesador': 'Herramienta que extiende CSS o HTML (Sass, Pug) y compila a código estándar que entiende el navegador.',
    'utility class': 'Clase CSS de una sola responsabilidad (mt-4, flex, text-center). Tailwind las usa en lugar de componentes con nombre semántico.',
    'code splitting': 'Dividir el bundle JS en trozos que se cargan bajo demanda (por ruta o componente). Acelera la carga inicial.',
    'dynamic import': 'import() en JS que carga un módulo en runtime. Base de lazy loading de componentes en SPAs.',
    'hreflang': 'Atributo que indica idioma y región de una página (hreflang="es"). Ayuda a Google a mostrar la versión correcta por país.',
    'breadcrumbs': 'Migas de pan: navegación jerárquica (Inicio > Blog > Artículo). Mejora UX y puede aparecer en resultados de Google.',
    'paginación': 'Dividir listados en páginas (?page=2). Enlaces crawlables ayudan a SEO; infinite scroll solo con cuidado.',
    'wireframe': 'Boceto de baja fidelidad de una pantalla: cajas y texto provisional. Define estructura antes del diseño visual final.',
    'eslint': 'Linter de JavaScript que detecta errores, malas prácticas y estilo inconsistente antes de ejecutar el código.',
    'prettier': 'Formateador automático de código. Unifica indentación y comillas en HTML, CSS, JS y JSON del equipo.',
    'nav': 'Etiqueta <nav> para bloques de navegación (menú principal, breadcrumbs). Landmark semántico para a11y y SEO.',
    'main': 'Etiqueta <main> con el contenido principal único de la página. Los lectores de pantalla saltan aquí desde el menú.',
    'article': 'Contenido autocontenido: post de blog, noticia o tarjeta de producto. Puede tener su propio h1 interno.',
    'section': 'Agrupa un bloque temático con encabezado (h2–h6). No reemplaza a div; aporta estructura semántica.',
    'aside': 'Contenido relacionado pero secundario: sidebar, publicidad, enlaces relacionados.',
    'figure': 'Imagen, diagrama o código con pie opcional <figcaption>. Agrupa contenido ilustrativo con contexto.',
    'figcaption': 'Pie de una figure. Describe la imagen o gráfico para accesibilidad y contexto editorial.',
    'fieldset': 'Agrupa inputs relacionados en un formulario. Suele ir con <legend> como título del grupo.',
    'legend': 'Título accesible de un fieldset. Anuncia el propósito del grupo de campos a lectores de pantalla.',
    'label': 'Etiqueta asociada a un input con for=id. Clic en label enfoca el campo; obligatorio para accesibilidad.',
    'placeholder': 'Texto provisional en inputs que desaparece al escribir. No sustituye a label ni a descripción accesible.',
    'required': 'Atributo HTML que exige rellenar el campo antes de enviar. Validación nativa del navegador.',
    'autocomplete': 'Atributo que sugiere o rellena valores guardados (nombre, email). Mejora UX en formularios largos.',
    'srcset': 'Atributo en <img> con varias resoluciones. El navegador elige la imagen según densidad y ancho de pantalla.',
    'picture': 'Elemento que sirve distintas imágenes según media query (WebP en modernos, JPEG en legacy).',
    'svg': 'Gráficos vectoriales en XML embebidos en HTML. Escalan sin perder calidad; ideales para iconos.',
    'canvas': 'Superficie de dibujo 2D controlada por JavaScript. Juegos, gráficos y manipulación de píxeles.',
    'datalist': 'Lista de sugerencias para un input. Autocompletado nativo sin JavaScript.',
    'details': 'Widget desplegable nativo con <summary> como título. Acordeón sin JS para FAQs.',
    'summary': 'Encabezado clicable de un elemento details. Visible siempre; al pulsar muestra u oculta el contenido.',
    'display': 'Propiedad CSS que define el tipo de caja: block, inline, flex, grid, none. Cambia cómo fluye el layout.',
    'flex': 'Valor de display:flex o shorthand de flex-grow/shrink/basis. Activa flexbox en el contenedor o tamaño del hijo.',
    'align-items': 'En flexbox, alinea hijos en el eje transversal (vertical si flex-direction es row).',
    'justify-content': 'En flexbox, distribuye hijos en el eje principal (horizontal si row): center, space-between, etc.',
    'gap': 'Espacio entre hijos en flex o grid sin margin manual en cada elemento.',
    'grid-template-columns': 'Define columnas en CSS Grid: repeat(3, 1fr) o 200px 1fr. Base del layout bidimensional.',
    'fr': 'Unidad fraccional en Grid: reparte espacio libre proporcionalmente (1fr 2fr).',
    'rem': 'Unidad CSS relativa al font-size del root (html). 1.5rem escala con la tipografía base del sitio.',
    'em': 'Unidad relativa al font-size del elemento padre. Útil en componentes; puede acumularse si anidas mucho.',
    'vh': '1% de la altura del viewport. 100vh = pantalla completa; cuidado con barras móviles que cambian altura.',
    'vw': '1% del ancho del viewport. Útil para tipografía fluida o secciones full-bleed.',
    'calc': 'Función CSS: calc(100% - 2rem). Combina unidades distintas en una sola propiedad.',
    'clamp': 'Función CSS: clamp(min, preferido, max). Tipografía o espaciado fluido sin media queries extra.',
    'object-fit': 'Cómo una imagen o video llena su caja: cover (recorta), contain (ajusta sin recortar).',
    'aspect-ratio': 'Relación ancho/alto fija (16/9). Evita saltos de layout mientras cargan imágenes o videos.',
    'transform': 'Mueve, rota o escala elementos (translate, rotate, scale) sin afectar el flujo del documento.',
    'opacity': 'Transparencia de 0 a 1. Afecta visualmente; combinar con visibility para deshabilitar clics.',
    'visibility': 'hidden oculta el elemento pero conserva su espacio; display:none lo saca del flujo.',
    'sticky': 'position:sticky fija el elemento al hacer scroll hasta que su contenedor sale del viewport.',
    'fixed': 'position:fixed respecto al viewport. Navbar flotante o botón volver arriba.',
    'absolute': 'position:absolute respecto al ancestro posicionado más cercano. Overlays y tooltips.',
    'relative': 'position:relative mantiene el flujo y sirve de referencia para hijos absolute.',
    'float': 'Propiedad legacy que envuelve texto alrededor de imágenes. Hoy flex/grid suelen reemplazarla.',
    'clearfix': 'Patrón CSS para contener floats y que el padre no colapse en altura.',
    'const': 'Declara constante en JS: no se reasigna el binding. Objetos y arrays sí pueden mutarse por dentro.',
    'let': 'Variable con block scope en JS. Preferible a var; permite reasignación dentro del bloque.',
    'var': 'Variable con function scope y hoisting en JS. Evitar en código moderno por bugs de scope.',
    'función': 'Bloque reutilizable de código. En JS: function nombre() {} o const nombre = () => {}.',
    'clase': 'Plantilla de objetos en JS (class) o Python (class). Agrupa datos y métodos con herencia.',
    'this': 'En JS, referencia al contexto de ejecución: el objeto en métodos o el global/window mal usado.',
    'null': 'En JS, ausencia intencional de valor. typeof null es "object" (bug histórico del lenguaje).',
    'undefined': 'En JS, variable declarada sin valor o propiedad inexistente. Distinto de null semánticamente.',
    'array': 'Lista ordenada de valores indexados desde 0. En JS: [1,2,3]; métodos map, filter, push.',
    'objeto': 'Colección de pares clave-valor. En JS: {nombre: "Ana"}; base de JSON y modelos de datos.',
    'string': 'Cadena de texto. En JS entre comillas; métodos: slice, split, includes, trim.',
    'número': 'Tipo numérico en JS o Python. Cuidado con decimales flotantes y NaN en comparaciones.',
    'nan': 'Not a Number en JS. Resultado de operaciones inválidas (parseInt("abc")). NaN !== NaN.',
    'typeof': 'Operador JS que devuelve el tipo como string: "number", "string", "undefined", "object".',
    'evento': 'Acción del usuario o del sistema: click, submit, keydown, load. Se escucha con addEventListener.',
    'addEventListener': 'Registra un handler para un evento DOM sin sobrescribir onclick. Soporta múltiples listeners.',
    'preventDefault': 'Cancela el comportamiento por defecto del navegador (enviar form, seguir enlace).',
    'stopPropagation': 'Evita que el evento burbujee a elementos padre. Útil en modales y menús anidados.',
    'burbujeo': 'Fase en que el evento sube del hijo al padre. Delegación de eventos aprovecha esta fase.',
    'delegación': 'Un solo listener en el padre maneja eventos de hijos dinámicos. Menos listeners, más rendimiento.',
    'def': 'Palabra clave Python para definir funciones: def nombre(arg): con indentación obligatoria.',
    'pip': 'Gestor de paquetes Python. pip install django instala librerías desde PyPI.',
    'virtualenv': 'Entorno Python aislado con dependencias propias. Evita conflictos entre proyectos en la misma máquina.',
    'lista': 'Tipo Python ordenado y mutable: [1, 2, 3]. Equivalente conceptual al array de JavaScript.',
    'diccionario': 'Tipo Python clave-valor: {"a": 1}. Similar al objeto JS o JSON.',
    'tupla': 'Secuencia Python inmutable: (1, 2). Útil como clave de dict o datos que no deben cambiar.',
    'none': 'Valor nulo en Python (None). Equivalente a null en JS; convención con mayúscula inicial.',
    'elif': 'Else if en Python. Encadena condiciones sin repetir la indentación de varios if separados.',
    'with': 'En Python, context manager: with open(f) as archivo garantiza cerrar el recurso al salir.',
    'fastapi': 'Framework Python moderno para APIs con tipos, validación automática y documentación OpenAPI.',
    'flask': 'Microframework Python para webs y APIs. Mínimo por defecto; Jinja para plantillas.',
    'postgresql': 'Base de datos relacional open source robusta. Muy usada con Django, Rails y Node (Prisma).',
    'mysql': 'Base de datos relacional popular en hosting compartido y WordPress. Sintaxis SQL estándar.',
    'sqlite': 'Base SQL embebida en un archivo. Ideal para prototipos, apps móviles y desarrollo local.',
    'redis': 'Almacén en memoria clave-valor. Cache, sesiones, colas y rate limiting de alta velocidad.',
    'mongodb': 'Base NoSQL orientada a documentos JSON. Esquemas flexibles; menos joins que SQL.',
    'join': 'Operación SQL que combina filas de tablas relacionadas (INNER, LEFT). Base de datos normalizadas.',
    'clave primaria': 'Columna única que identifica cada fila (id). Referenciada por claves foráneas.',
    'clave foránea': 'Columna que apunta al id de otra tabla. Mantiene integridad relacional (user_id → users.id).',
    'índice': 'Estructura en BD que acelera búsquedas por columna. Mejora SELECT; tiene coste en INSERT/UPDATE.',
    'nginx': 'Servidor web y reverse proxy. Sirve estáticos y reenvía peticiones a Node, PHP o Python.',
    'apache': 'Servidor web histórico con .htaccess. Aún común en hosting tradicional y PHP.',
    'deploy': 'Publicar la aplicación en un servidor o plataforma (Vercel, Railway). Build + variables de entorno.',
    'vercel': 'Plataforma de hosting optimizada para frontend y Next.js. Deploy desde git con preview URLs.',
    'netlify': 'Hosting para sitios estáticos y funciones serverless. CI/CD integrado desde repositorio.',
    'jest': 'Framework de tests unitarios para JavaScript. describe, it, expect en proyectos React y Node.',
    'vitest': 'Runner de tests rápido compatible con Vite. API similar a Jest para proyectos modernos.',
    'cypress': 'Tests end-to-end en navegador real. Simula clics y formularios contra tu app desplegada o local.',
    'playwright': 'Automatización de navegadores (Chromium, Firefox, WebKit) para E2E y scraping.',
    'test unitario': 'Prueba una función o componente aislado con mocks. Rápido y localiza bugs con precisión.',
    'test e2e': 'Prueba el flujo completo como usuario real: login, carrito, checkout. Más lento pero más realista.',
    'merge': 'Fusionar una branch en otra en git. Integra cambios tras revisión o CI verde.',
    'rebase': 'Reaplicar commits sobre otra base en git. Historial lineal; no usar en branches públicas compartidas sin cuidado.',
    'conflicto': 'Git no puede fusionar automáticamente cambios en la misma línea. Debes resolver manualmente.',
    'openapi': 'Especificación estándar de APIs REST (antes Swagger). Documenta endpoints, params y respuestas.',
    'postman': 'Cliente para probar APIs manualmente. Colecciones, variables y tests de integración.',
    'rate limit': 'Límite de peticiones por IP o usuario en un intervalo. Protege APIs de abuso y bots.',
    'infinite scroll': 'Cargar más contenido al llegar al final del scroll. UX fluida; peor para SEO si no hay enlaces.',
    'thymeleaf': 'Motor de plantillas Java/Spring. HTML válido con atributos th:text en el servidor.',
    'smarty': 'Motor de plantillas PHP clásico con sintaxis {variable}. Precursor de muchos patrones actuales.',
    'storybook': 'Entorno para desarrollar y documentar componentes UI aislados (React, Vue) con casos de prueba visuales.',
    'figma': 'Herramienta de diseño UI colaborativa. Prototipos, design tokens y handoff a desarrollo.',
    'mockup': 'Diseño visual de alta fidelidad de una pantalla. Colores, tipografía y componentes reales.',
    'design system': 'Biblioteca de componentes, tokens y reglas visuales compartidos (botones, colores, espaciado).',
    'typography': 'Sistema tipográfico: familias, tamaños, interlineado y jerarquía h1–p. Base de legibilidad web.',
    'font-weight': 'Grosor de la fuente: 400 normal, 600 semibold, 700 bold. Afecta jerarquía visual.',
    'line-height': 'Interlineado CSS. 1.5–1.6 suele ser óptimo para párrafos largos en pantalla.',
    'contraste': 'Diferencia de luminosidad entre texto y fondo. WCAG exige mínimos para accesibilidad.',
    'focus': 'Estado cuando un elemento recibe foco por teclado. Debe ser visible (:focus-visible) para a11y.',
    'tabindex': 'Orden de foco por teclado. 0 incluye en orden natural; -1 permite foco programático sin tab.',
    'skip link': 'Enlace oculto hasta foco que salta al main. Obligatorio en sitios accesibles para teclado.',
    'tailwind preflight': 'Reset de estilos base de Tailwind (basado en modern-normalize). Parte consistente entre navegadores.',
    'autoprefixer': 'Plugin PostCSS que añade prefijos -webkit- y -moz- según compatibilidad de browsers.',
    'source map': 'Archivo que mapea JS/CSS minificado al código fuente. Esencial para depurar en producción.',
    'minify': 'Reducir tamaño de CSS/JS/HTML quitando espacios y nombres cortos. Mejora tiempo de carga.',
    'gzip': 'Compresión HTTP que reduce tamaño de texto en tránsito. El servidor envía Content-Encoding: gzip.',
    'brotli': 'Compresión más eficiente que gzip para textos. Común en CDNs y servidores modernos.',
    'service worker': 'Script en segundo plano que intercepta peticiones. Base de PWAs offline y cache.',
    'manifest': 'Archivo JSON (manifest.webmanifest) con nombre, iconos y colores para instalar la PWA.',
    'local storage': 'Sinónimo de localStorage: almacenamiento persistente en el navegador hasta que el usuario borre datos.',
    'session storage': 'Almacenamiento por pestaña; se borra al cerrar la pestaña. Útil para datos temporales de sesión.',
    'indexeddb': 'Base de datos en el navegador para grandes volúmenes y objetos complejos. Usada por apps offline.',
    'web worker': 'Hilo JS separado del main. Ejecuta cálculos pesados sin bloquear la UI.',
    'same-origin': 'Política: mismo protocolo, dominio y puerto. CORS relaja esto para APIs en otros dominios.',
    'cors preflight': 'Petición OPTIONS que el navegador envía antes de CORS “complejo” para verificar permisos del servidor.',
    'middleware de auth': 'Capa que verifica JWT o sesión antes de llegar al controlador. Protege rutas privadas.',
    'controlador': 'Función o clase que recibe la petición HTTP, aplica lógica y devuelve respuesta en MVC.',
    'modelo': 'Capa que representa datos y reglas de negocio. En MVC habla con la BD vía ORM o SQL.',
    'vista': 'Capa de presentación: plantilla HTML o componente React que muestra datos al usuario.',
    'mvc': 'Model-View-Controller. Separa datos, UI y lógica de peticiones. Patrón base en Laravel y Django.',
    'mvvm': 'Model-View-ViewModel. Vue y Angular aproximan este patrón con binding bidireccional.',
    'inyección de dependencias': 'Pasar dependencias desde fuera en lugar de crearlas dentro. Facilita tests y desacoplamiento.',
    'código legado': 'Sistema antiguo en producción difícil de modificar. Leerlo con calma es habilidad senior esencial.',
    'pseint': 'PSeInt (Pseudocódigo, Sentencias e Intérpretes). Herramienta educativa con sintaxis en español: Leer, Escribir, Si, Mientras, Para, <-.',
    'pseudocódigo': 'Descripción del algoritmo en lenguaje casi natural, sin depender de un lenguaje real. Base para pruebas de escritorio y diseño.',
    'prueba de escritorio': 'Simulación manual del algoritmo con datos de ejemplo: tabla con variables, pasos e instrucciones. Detecta errores antes de programar.',
    'algoritmo': 'Secuencia finita de pasos ordenados que resuelve un problema. Entrada → proceso → salida.',
    'contador': 'Variable que incrementa en cada iteración para controlar repeticiones o contar eventos.',
    'mod': 'Operador módulo (MOD en PSeInt): residuo de una división entera. Ej: 10 MOD 3 = 1.',
    'finmientras': 'Cierre del bloque Mientras en pseudocódigo PSeInt. Marca dónde termina el bucle.',
    'finpara': 'Cierre del bloque Para en pseudocódigo PSeInt.',
    'finsi': 'Cierre del bloque Si en pseudocódigo PSeInt.'
  };

  const SKIP_TAGS = new Set(['CODE', 'PRE', 'SCRIPT', 'STYLE', 'BUTTON', 'A', 'TEXTAREA']);
  let popover = null;
  let activeTerm = null;

  function getSortedTerms() {
    return Object.keys(TERMS).sort((a, b) => b.length - a.length);
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function termBoundaryPattern(term) {
    const escaped = escapeRegex(term);
    if (/[\s-]/.test(term)) {
      return `(?<![\\w-])(${escaped})(?![\\w-])`;
    }
    return `\\b(${escaped})\\b`;
  }

  function wrapText(text) {
    if (!text || !text.trim()) return [document.createTextNode(text || '')];

    const sorted = getSortedTerms();
    let parts = [{ type: 'text', value: text }];

    sorted.forEach((term) => {
      const re = new RegExp(termBoundaryPattern(term), 'gi');
      const next = [];
      parts.forEach((part) => {
        if (part.type !== 'text') { next.push(part); return; }
        let last = 0;
        let m;
        const val = part.value;
        re.lastIndex = 0;
        while ((m = re.exec(val)) !== null) {
          if (m.index > last) next.push({ type: 'text', value: val.slice(last, m.index) });
          next.push({ type: 'term', value: m[1], key: term.toLowerCase() });
          last = m.index + m[0].length;
        }
        if (last < val.length) next.push({ type: 'text', value: val.slice(last) });
      });
      parts = next;
    });

    const frag = document.createDocumentFragment();
    parts.forEach((p) => {
      if (p.type === 'text') frag.appendChild(document.createTextNode(p.value));
      else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'glossary-term';
        btn.dataset.term = p.key;
        btn.textContent = p.value;
        btn.title = 'Ver definición';
        frag.appendChild(btn);
      }
    });
    return [frag];
  }

  function processTextNode(node) {
    const wrapped = wrapText(node.textContent);
    if (wrapped.length === 1 && wrapped[0].nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      node.replaceWith(wrapped[0]);
    } else {
      const frag = document.createDocumentFragment();
      wrapped.forEach((w) => frag.appendChild(w));
      node.replaceWith(frag);
    }
  }

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement && !SKIP_TAGS.has(node.parentElement.tagName) && !node.parentElement.closest('.glossary-term, .glossary-popover')) {
        if (node.textContent.trim().length > 2) processTextNode(node);
      }
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (SKIP_TAGS.has(node.tagName) || node.classList?.contains('glossary-popover')) return;
      Array.from(node.childNodes).forEach(walk);
    }
  }

  function applyTo(container) {
    if (!container) return;
    walk(container);
    bindTerms(container);
  }

  function ensurePopover() {
    if (popover) return popover;
    popover = document.createElement('div');
    popover.id = 'glossary-popover';
    popover.className = 'glossary-popover';
    popover.hidden = true;
    popover.innerHTML = `
      <button type="button" class="glossary-popover-close" aria-label="Cerrar">✕</button>
      <div class="glossary-popover-term"></div>
      <div class="glossary-popover-def"></div>`;
    document.body.appendChild(popover);
    popover.querySelector('.glossary-popover-close').onclick = hide;
    document.addEventListener('click', (e) => {
      if (!popover.hidden && !e.target.closest('.glossary-popover') && !e.target.closest('.glossary-term')) hide();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
    return popover;
  }

  function show(termKey, anchorEl) {
    const def = TERMS[termKey];
    if (!def) return;
    const pop = ensurePopover();
    pop.querySelector('.glossary-popover-term').textContent = anchorEl.textContent || termKey;
    pop.querySelector('.glossary-popover-def').textContent = def;
    pop.hidden = false;
    activeTerm = termKey;

    const rect = anchorEl.getBoundingClientRect();
    const popRect = pop.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.left;

    if (left + 380 > window.innerWidth) left = window.innerWidth - 390;
    if (left < 8) left = 8;
    if (top + popRect.height > window.innerHeight) top = rect.top - popRect.height - 8;

    pop.style.top = `${top + window.scrollY}px`;
    pop.style.left = `${left}px`;
    anchorEl.classList.add('glossary-term-active');
  }

  function hide() {
    if (!popover) return;
    popover.hidden = true;
    document.querySelectorAll('.glossary-term-active').forEach((el) => el.classList.remove('glossary-term-active'));
    activeTerm = null;
  }

  function bindTerms(root) {
    root.querySelectorAll('.glossary-term').forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.dataset.term;
        if (!popover?.hidden && activeTerm === key) hide();
        else show(key, btn);
      });
    });
  }

  return { applyTo, hide, TERMS };
})();