const CHALLENGES_CSS = [
  {
    id: 'css-centrar-div',
    tech: 'css',
    level: 'principiante',
    title: 'Centrar un elemento',
    scenario: null,
    description: `<p>Centra el cuadrado horizontal y verticalmente dentro del contenedor usando Flexbox.</p>`,
    learn: {
      concept: 'Flexbox alinea hijos en un eje principal y cruzado con pocas líneas de CSS.',
      whenToUse: 'Centrar modales, loaders, cards en pantalla, navbar items. Es el método moderno preferido sobre margin:auto en muchos casos.'
    },
    htmlScaffold: `<div id="contenedor"><div class="caja">Centrado</div></div>`,
    starterCode: `#contenedor {
  width: 300px;
  height: 200px;
  background: #1e1e28;
  /* Centra .caja aquí */
  
}

.caja {
  width: 80px;
  height: 80px;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}`,
    tests: [
      { type: 'style', selector: '#contenedor', property: 'display', expected: 'flex', name: 'Contenedor flex' },
      { type: 'style', selector: '#contenedor', property: 'justifyContent', match: ['center'], name: 'Centrado horizontal' },
      { type: 'style', selector: '#contenedor', property: 'alignItems', match: ['center'], name: 'Centrado vertical' }
    ],
    hint: 'display: flex; justify-content: center; align-items: center;',
    feedback: {
      general: {
        why: 'Sin flex en el padre, el hijo no puede centrarse solo con text-align.',
        fix: 'Aplica flex + justify-content + align-items al #contenedor, no a .caja.',
        whenToUse: 'Centrado en contenedores de tamaño fijo o conocido. Para layouts completos combina con gap y flex-direction.'
      }
    }
  },
  {
    id: 'css-tipografia',
    tech: 'css',
    level: 'principiante',
    title: 'Estilos de texto',
    scenario: null,
    description: `<p>Estiliza el título y el párrafo: el h1 debe ser más grande, negrita y color índigo; el párrafo con interlineado cómodo.</p>`,
    learn: {
      concept: 'La tipografía define jerarquía visual y legibilidad.',
      whenToUse: 'Artículos, blogs, documentación. font-size + font-weight para títulos; line-height 1.5–1.7 para párrafos largos.'
    },
    htmlScaffold: `<article><h1 class="titulo">Bienvenido</h1><p class="texto">Contenido del artículo.</p></article>`,
    starterCode: `.titulo {
  /* Estilos del título */
  
}

.texto {
  /* Estilos del párrafo */
  
}`,
    tests: [
      { type: 'style', selector: '.titulo', property: 'fontWeight', match: ['700', 'bold'], name: 'Título en negrita' },
      { type: 'style', selector: '.titulo', property: 'fontSize', minPx: 24, name: 'Título grande' },
      { type: 'style', selector: '.texto', property: 'lineHeight', minNum: 1.4, name: 'Interlineado legible' }
    ],
    hint: 'font-size: 2rem; font-weight: 700; line-height: 1.6;',
    feedback: {
      general: {
        why: 'Texto sin jerarquía visual confunde al usuario sobre qué leer primero.',
        fix: 'Títulos grandes y bold; párrafos con line-height >= 1.4 para lectura prolongada.',
        whenToUse: 'Define una escala tipográfica (h1–h6) y reutilízala en todo el sitio.'
      }
    }
  },
  {
    id: 'css-navbar-responsive',
    tech: 'css',
    level: 'intermedio',
    title: 'Navbar responsive',
    scenario: '📱 Tu app debe verse bien en móvil y desktop. El menú horizontal en pantallas grandes debe apilarse en móvil.',
    description: `<p>Estiliza la navbar: flex horizontal con espacio entre logo y menú; en pantallas &lt; 600px el menú se apila verticalmente.</p>`,
    learn: {
      concept: 'Media queries cambian estilos según el viewport. Mobile-first escribe estilos base para móvil y amplía con min-width.',
      whenToUse: 'Navbars, grids, sidebars. Breakpoint común: 768px (tablet) o 600px (móvil grande).'
    },
    htmlScaffold: `<header class="navbar"><span class="logo">Brand</span><ul class="menu"><li><a href="#">Inicio</a></li><li><a href="#">Blog</a></li><li><a href="#">Contacto</a></li></ul></header>`,
    starterCode: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #1e1e28;
}

.menu {
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Media query para móvil */

`,
    tests: [
      { type: 'style', selector: '.navbar', property: 'display', expected: 'flex', name: 'Navbar flex' },
      { type: 'style', selector: '.menu', property: 'display', expected: 'flex', name: 'Menú horizontal' },
      { type: 'mediaRule', contains: '600px', name: 'Media query 600px' },
      { type: 'cssContains', value: 'flex-direction', name: 'Cambio de dirección en móvil' }
    ],
    hint: '@media (max-width: 600px) { .navbar { flex-direction: column; } }',
    feedback: {
      general: {
        why: 'Sin media query el menú se desborda o queda ilegible en pantallas estrechas.',
        fix: 'Agrega @media (max-width: 600px) cambiando flex-direction a column en .navbar o .menu.',
        whenToUse: 'Todo sitio público necesita responsive. Prueba en DevTools con vista móvil.'
      }
    }
  },
  {
    id: 'css-grid-productos',
    tech: 'css',
    level: 'intermedio',
    title: 'Grid de productos',
    scenario: '🛍️ Tu e-commerce muestra productos en grid adaptable: 3 columnas en desktop, 1 en móvil.',
    description: `<p>Usa CSS Grid en <code>.grid</code> para crear columnas adaptables con <code>repeat</code> y <code>gap</code>.</p>`,
    learn: {
      concept: 'CSS Grid define filas y columnas en dos dimensiones simultáneamente.',
      whenToUse: 'Catálogos, dashboards, galerías de fotos. Más potente que flex para layouts bidimensionales.'
    },
    htmlScaffold: `<div class="grid"><div class="card">A</div><div class="card">B</div><div class="card">C</div><div class="card">D</div></div>`,
    starterCode: `.grid {
  /* Grid de productos aquí */
  
}

.card {
  background: #252532;
  padding: 1rem;
  border-radius: 8px;
}`,
    tests: [
      { type: 'style', selector: '.grid', property: 'display', expected: 'grid', name: 'Display grid' },
      { type: 'style', selector: '.grid', property: 'gap', minPx: 8, name: 'Espacio entre cards' },
      { type: 'cssContains', value: 'grid-template-columns', name: 'Columnas definidas' }
    ],
    hint: 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;',
    feedback: {
      general: {
        why: 'Flex en wrap puede dejar huecos irregulares; grid da control exacto de columnas.',
        fix: 'display: grid + grid-template-columns: repeat(3, 1fr) + gap.',
        whenToUse: 'Cuando necesitas alinear en filas Y columnas. Combina con auto-fill/minmax para responsive automático.'
      }
    }
  },
  {
    id: 'css-card-flex',
    tech: 'css',
    level: 'avanzado',
    title: 'Card con footer fijo',
    scenario: '💼 SaaS muestra planes de precios. El botón "Contratar" debe quedar siempre al pie de la card aunque el contenido varíe.',
    description: `<p>La card usa flex column; el contenido crece y el botón queda abajo con <code>margin-top: auto</code>.</p>`,
    learn: {
      concept: 'margin-top: auto en flex empuja el elemento al extremo opuesto del eje.',
      whenToUse: 'Cards de precios, posts con CTA, sidebars con botón fijo al fondo.'
    },
    htmlScaffold: `<div class="card"><div class="card-body"><h3>Plan Pro</h3><p>Descripción del plan con texto variable.</p></div><button class="card-cta">Contratar</button></div>`,
    starterCode: `.card {
  display: flex;
  flex-direction: column;
  height: 200px;
  background: #1e1e28;
  padding: 1rem;
  border-radius: 8px;
}

.card-body {
  /* Debe ocupar espacio disponible */
  
}

.card-cta {
  /* Debe quedar al fondo */
  
}`,
    tests: [
      { type: 'style', selector: '.card', property: 'flexDirection', match: ['column'], name: 'Flex column' },
      { type: 'style', selector: '.card-cta', property: 'marginTop', expected: 'auto', name: 'CTA al fondo' }
    ],
    hint: 'En .card-cta: margin-top: auto;',
    feedback: {
      general: {
        why: 'Sin margin-top auto los botones quedan pegados al texto y las cards se ven desalineadas en un grid.',
        fix: 'Card flex column + margin-top: auto en el botón.',
        whenToUse: 'Grids de cards con alturas iguales y acciones alineadas al fondo.'
      }
    }
  },
  {
    id: 'css-variables-dark',
    tech: 'css',
    level: 'experto',
    title: 'Tema con variables CSS',
    scenario: '🌙 Tu app ofrece modo oscuro. Centraliza colores en variables para cambiar el tema sin duplicar reglas.',
    description: `<p>Define variables <code>--bg</code> y <code>--text</code> en <code>:root</code> y úsalas en <code>.app</code>. Agrega clase <code>.dark</code> que sobrescriba las variables.</p>`,
    learn: {
      concept: 'Custom properties (--var) permiten theming dinámico y se pueden cambiar en runtime con JavaScript.',
      whenToUse: 'Dark mode, white-label, design systems. Mejor que Sass variables porque viven en el navegador.'
    },
    htmlScaffold: `<div class="app dark"><p>Modo oscuro activo</p></div>`,
    starterCode: `:root {
  /* Variables de tema claro */
  
}

.dark {
  /* Sobrescribe para tema oscuro */
  
}

.app {
  /* Usa las variables */
  
}`,
    tests: [
      { type: 'cssContains', value: '--bg', name: 'Variable --bg definida' },
      { type: 'cssContains', value: '--text', name: 'Variable --text definida' },
      { type: 'style', selector: '.app', property: 'backgroundColor', notTransparent: true, name: 'Fondo aplicado' },
      { type: 'style', selector: '.app', property: 'color', notTransparent: true, name: 'Color de texto aplicado' }
    ],
    hint: ':root { --bg: #fff; --text: #111; } .dark { --bg: #0f0f12; --text: #f0f0f5; } .app { background: var(--bg); color: var(--text); }',
    feedback: {
      general: {
        why: 'Colores hardcodeados en cada regla hacen imposible cambiar tema sin refactor masivo.',
        fix: 'Centraliza en :root, consume con var(), sobrescribe en .dark.',
        whenToUse: 'Cualquier app con tema claro/oscuro o marca personalizable.'
      }
    }
  }
];