const LearnContent = (function () {
  'use strict';

  const TECH_TOPICS = {
    html: {
      principiante: {
        concept: 'La estructura HTML define el esqueleto semántico de toda página web.',
        detailed: 'Aprenderás a elegir la etiqueta correcta para cada tipo de contenido, anidar elementos sin romper el DOM, y usar atributos obligatorios (alt, for, type). HTML no es solo “que se vea”: es la base de accesibilidad, SEO y mantenibilidad.',
        whyInThisCase: 'En producción, un markup incorrecto rompe formularios, confunde lectores de pantalla y hace que CSS/JS fallen. Este reto simula un caso donde la estructura importa tanto como el diseño.',
        otherApproaches: 'Podrías usar etiquetas genéricas como div para todo, pero pierdes semántica. Otra vía es generar HTML desde un framework (React, Vue), pero debes entender qué markup produce. También existen plantillas server-side (Blade, EJS) que renderizan la misma estructura.',
        whenToUse: 'Siempre al crear páginas, emails transaccionales, componentes reutilizables y documentación web.'
      },
      intermedio: {
        concept: 'Formularios, cards y landings requieren HTML semántico alineado al negocio.',
        detailed: 'Profundizarás en formularios accesibles, relaciones label-input, validación nativa, landmarks (header, main, section) y contenido independiente (article). Estos patrones aparecen en el 80% de sitios profesionales.',
        whyInThisCase: 'El escenario representa un flujo real de usuario (registro, compra, contacto). Sin la estructura adecuada, pierdes conversiones y cumplimiento legal (accesibilidad).',
        otherApproaches: 'Component libraries (Bootstrap, Material) abstraen el HTML. Web Components encapsulan markup. CMS como WordPress generan HTML automáticamente, pero tú debes saber editarlo.',
        whenToUse: 'Landings, checkout, dashboards, portales de clientes y cualquier UI con formularios.'
      },
      avanzado: {
        concept: 'Landings y dashboards exigen jerarquía clara y landmarks para SEO y a11y.',
        detailed: 'Trabajarás con secciones anidadas, un solo h1, tablas de datos semánticas, skip links y roles ARIA cuando el HTML nativo no alcanza. Es lo que diferencia un sitio amateur de uno profesional.',
        whyInThisCase: 'Google y los lectores de pantalla “leen” tu estructura antes que tus estilos. Un dashboard mal maquetado es ilegible para usuarios reales y bots.',
        otherApproaches: 'Frameworks SPA generan DOM dinámico; SSR (Next, Nuxt) devuelve HTML completo. PDF y apps nativas usan otros modelos, pero la web sigue siendo HTML.',
        whenToUse: 'Sitios públicos, admin panels, documentación técnica y productos que deben rankear en buscadores.'
      },
      experto: {
        concept: 'WCAG y HTML avanzado: accesibilidad no es opcional en software serio.',
        detailed: 'Dominarás caption en tablas, scope en th, aria-label, skip navigation, dialog, template y patrones que cumplen estándares internacionales. Esto es requisito en gobierno, salud y banca.',
        whyInThisCase: 'Un hospital o banco sin accesibilidad enfrenta demandas y excluye usuarios. El reto refleja restricciones legales y de usabilidad reales.',
        otherApproaches: 'Librerías a11y (Reach UI, Radix) proveen componentes accesibles. Audit tools (axe, Lighthouse) detectan fallos, pero no reemplazan saber HTML.',
        whenToUse: 'Software regulado, apps con usuarios diversos, y cualquier producto que aspire a inclusión real.'
      }
    },
    css: {
      principiante: {
        concept: 'CSS controla presentación: colores, espaciado, tipografía y layout básico.',
        detailed: 'Entenderás el modelo de caja, especificidad básica, unidades (px, rem, %), y cómo seleccionar elementos con clases e IDs. Es el vocabulario visual de toda interfaz.',
        whyInThisCase: 'Sin estilos coherentes, incluso el mejor HTML parece roto. Este caso refleja un componente que el diseñador entregó y tú debes implementar fielmente.',
        otherApproaches: 'Frameworks CSS (Tailwind, Bootstrap) ofrecen clases utilitarias. CSS-in-JS (styled-components) escribe estilos en JavaScript. Sass/Less añaden variables y mixins al CSS clásico.',
        whenToUse: 'Todo proyecto con UI: desde un botón hasta un design system completo.'
      },
      intermedio: {
        concept: 'Flexbox, Grid y media queries son el estándar para layouts modernos.',
        detailed: 'Aprenderás a alinear y distribuir espacio en una y dos dimensiones, crear grids responsivos, y adaptar UI a móvil sin duplicar HTML. Son las herramientas del 90% de layouts actuales.',
        whyInThisCase: 'El escenario es un catálogo o navbar real que debe funcionar en móvil y desktop. Float y tables para layout son legacy; Flex/Grid resuelven esto hoy.',
        otherApproaches: 'Container queries adaptan por tamaño del contenedor, no del viewport. Frameworks grid (Bootstrap col) abstraen CSS Grid. Position absolute funciona pero es frágil para layouts fluidos.',
        whenToUse: 'Navbars, cards, dashboards, e-commerce, cualquier interfaz responsive.'
      },
      avanzado: {
        concept: 'Transiciones, animaciones y layouts complejos mejoran UX sin JavaScript.',
        detailed: 'Trabajarás con transition, transform, animation, aspect-ratio, object-fit y técnicas para cards con alturas variables. El CSS moderno reduce dependencia de JS para efectos visuales.',
        whyInThisCase: 'Micro-interacciones y layouts pulidos aumentan conversión. Este reto modela un componente de producto SaaS o e-commerce con requisitos visuales estrictos.',
        otherApproaches: 'Librerías de animación (GSAP, Framer Motion) para JS. SVG/CSS para iconos animados. Canvas/WebGL para efectos pesados fuera del alcance de CSS.',
        whenToUse: 'Productos consumer, marketing sites, y apps donde la percepción de calidad importa.'
      },
      experto: {
        concept: 'Variables CSS, theming y features modernas habilitan design systems escalables.',
        detailed: 'Custom properties (--var), dark mode, clamp(), container queries y cascade layers permiten temas dinámicos y mantenibles. Es arquitectura CSS, no solo estilos sueltos.',
        whyInThisCase: 'Apps con tema claro/oscuro o white-label necesitan centralizar tokens de diseño. Hardcodear colores no escala con equipos grandes.',
        otherApproaches: 'Design tokens en JSON + Style Dictionary. Tailwind con tema extendido. CSS-in-JS con ThemeProvider. Cada uno tiene trade-offs de runtime y bundle.',
        whenToUse: 'Design systems, SaaS multi-tenant, apps con preferencia de usuario (dark mode).'
      }
    },
    javascript: {
      principiante: {
        concept: 'Funciones, operadores y tipos son los bloques de toda lógica en JS.',
        detailed: 'Practicarás declarar funciones, usar return, operar con números/strings/booleanos, y entender truthy/falsy. Es la base sobre la que se construye DOM, APIs y frameworks.',
        whyInThisCase: 'El escenario traduce un requisito de negocio simple (total, descuento, validación) a código. Así trabajan juniors en equipos reales: ticket → función.',
        otherApproaches: 'Arrow functions vs function declarations. Métodos de array (reduce) vs bucles for. Operador ternario vs if/else. Cada estilo tiene su lugar según legibilidad del equipo.',
        whenToUse: 'Calculadoras, validaciones, transformaciones de datos en frontend y Node.js.'
      },
      intermedio: {
        concept: 'Arrays, objetos y métodos funcionales resuelven casos de negocio cotidianos.',
        detailed: 'Dominarás map, filter, reduce, destructuring, spread, y validación de inputs. Son patrones que verás en carritos, filtros, reportes y formularios en cada codebase.',
        whyInThisCase: 'E-commerce, CRMs y dashboards procesan listas constantemente. Este reto replica un filtro o cálculo que un PM pediría en un sprint.',
        otherApproaches: 'Bucles for tradicionales logran lo mismo. Lodash/ramda ofrecen utilidades. SQL o backend podrían hacer el filtro, pero el cliente a menudo necesita preview instantáneo.',
        whenToUse: 'Carritos, búsquedas, tablas filtrables, formateo de datos de API.'
      },
      avanzado: {
        concept: 'Agrupación, ordenación, paginación y transformación de datos complejos.',
        detailed: 'Aprenderás a encadenar operaciones, manejar inmutabilidad, edge cases (arrays vacíos, duplicados) y estructuras anidadas. Es el día a día de features “medianas” en producción.',
        whyInThisCase: 'Catálogos con miles de items, reportes con múltiples criterios y APIs que devuelven JSON anidado requieren este nivel de manipulación.',
        otherApproaches: 'Programación funcional pura con pipe. Bibliotecas como date-fns para fechas. Delegar al backend con GraphQL filters. La elección depende de performance y UX.',
        whenToUse: 'Admin panels, analytics, comparadores, integraciones con APIs REST.'
      },
      experto: {
        concept: 'Patrones de diseño: debounce, memoize, curry, retry — performance y arquitectura.',
        detailed: 'Entenderás closures, higher-order functions, control de frecuencia de eventos, caché y composición. Son técnicas que separan código junior de senior en code reviews.',
        whyInThisCase: 'Búsquedas en vivo, scroll infinito y APIs con rate limits son problemas reales de escala. Sin estos patrones, la app se siente lenta o rompe el servidor.',
        otherApproaches: 'RxJS para streams reactivos. Web Workers para trabajo pesado. Librerías (lodash.debounce) vs implementación propia. Throttle en lugar de debounce según el caso.',
        whenToUse: 'Search bars, resize handlers, autoguardado, retry de fetch, librerías internas.'
      }
    },
    python: {
      principiante: {
        concept: 'Sintaxis Python, funciones, tipos básicos y el zen de la legibilidad.',
        detailed: 'Practicarás def, return, indentación, listas, strings y operadores. Python prioriza código legible — ideal para scripts, automatización y backend.',
        whyInThisCase: 'El escenario simula un script que un equipo de datos o backend ejecutaría: procesar entrada, devolver resultado. Es el primer paso antes de Django/FastAPI.',
        otherApproaches: 'Comprensiones de lista vs bucles explícitos. Funciones built-in (sum, len) vs implementación manual. Tipado con type hints para mayor claridad en equipos grandes.',
        whenToUse: 'Scripts, ETL simple, APIs, ciencia de datos, automatización de tareas.'
      },
      intermedio: {
        concept: 'Reglas de negocio, strings, listas y condicionales en casos reales.',
        detailed: 'Trabajarás con split, formateo, redondeo monetario, filtrado y validación. Python brilla procesando texto y datos tabulares sin boilerplate.',
        whyInThisCase: 'Facturación, análisis de reseñas y reportes son tareas diarias en empresas. Este reto modela una regla que vendría del área de negocio.',
        otherApproaches: 'Regex para texto complejo. Pandas para datos masivos. Decimal para dinero en lugar de float. Cada opción según precisión y volumen.',
        whenToUse: 'Facturación, NLP básico, limpieza de CSV, microservicios ligeros.'
      },
      avanzado: {
        concept: 'Estructuras de datos, agregaciones y una pasada sobre colecciones.',
        detailed: 'Aprenderás dicts, defaultdict, sorted, múltiples métricas en un loop, y devolver estructuras claras. Es el patrón de scripts de reporte y pipelines ETL.',
        whyInThisCase: 'Dashboards de ventas y jobs nocturnos agregan miles de registros. Hacerlo en una pasada es eficiente y profesional.',
        otherApproaches: 'collections.Counter para conteos. SQL GROUP BY en base de datos. Generadores para datasets enormes que no caben en memoria.',
        whenToUse: 'Reportes, ETL, cron jobs, análisis de logs, APIs que devuelven resúmenes.'
      },
      experto: {
        concept: 'Validación compuesta, decoradores, recursión y diseño de funciones robustas.',
        detailed: 'Dominarás validación multi-criterio, decoradores para cross-cutting concerns, recursión controlada y separación de responsabilidades. Código que aguanta revisión de seguridad.',
        whyInThisCase: 'Auth, contraseñas y datos sensibles exigen validación rigurosa. Un fallo aquí es vulnerabilidad real, no ejercicio académico.',
        otherApproaches: 'Pydantic para validación con schemas. bcrypt/argon2 para passwords (nunca texto plano). zxcvbn para fortaleza. Decorador vs clase según testabilidad.',
        whenToUse: 'Autenticación, librerías internas, pipelines críticos, código compartido entre equipos.'
      }
    },
    logica: {
      principiante: {
        concept: 'Pensamiento algorítmico: entrada, proceso y salida con pseudocódigo PSeInt.',
        detailed: 'Aprenderás a leer algoritmos secuenciales, seguir asignaciones y ejecutar pruebas de escritorio a mano. Es el paso previo a cualquier lenguaje de programación.',
        whyInThisCase: 'Antes de escribir código debes poder predecir qué hace un algoritmo con datos concretos. Las pruebas de escritorio detectan errores de lógica sin compilar.',
        otherApproaches: 'Diagramas de flujo, tablas de verdad o ejecutar en PSeInt/Python. La prueba de escritorio entrena la lectura mental que usas en debugging.',
        whenToUse: 'Exámenes de lógica, fundamentos de programación, diseño de algoritmos y onboarding sin IDE.'
      },
      intermedio: {
        concept: 'Bucles, acumuladores y contadores en pseudocódigo.',
        detailed: 'Dominarás Mientras, Para, MOD y variables que cambian en cada iteración. La traza paso a paso es obligatoria para no perder el estado del programa.',
        whyInThisCase: 'Los bugs más comunes en bucles son off-by-one y acumuladores mal inicializados. La prueba de escritorio los revela antes de codificar.',
        otherApproaches: 'Simular con hoja de cálculo, dibujar tabla de estados o ejecutar en intérprete. La tabla manual sigue siendo la más rápida en exámenes.',
        whenToUse: 'Sumatorias, conteos, validaciones repetidas y menús en consola.'
      },
      avanzado: {
        concept: 'Condiciones compuestas, bucles anidados y operador MOD.',
        detailed: 'Trabajarás con AND/OR, banderas, máximos/mínimos y patrones de búsqueda. Cada nivel de anidamiento multiplica el cuidado en la traza.',
        whyInThisCase: 'Algoritmos de filtrado y reportes combinan varias condiciones. Un error en la tabla de escritorio se propaga a todo el programa.',
        otherApproaches: 'Simplificar el algoritmo antes de trazar, probar con entradas pequeñas primero, o refactorizar a funciones auxiliares.',
        whenToUse: 'Reportes, validaciones compuestas, búsqueda de extremos y lógica de negocio.'
      },
      experto: {
        concept: 'Algoritmos clásicos: primos, Fibonacci, cadenas y múltiples variables.',
        detailed: 'Evaluarás trazas largas con varias variables que se actualizan en distinto orden. Es el nivel de exámenes de selección y entrevistas de fundamentos.',
        whyInThisCase: 'Sin dominar la traza compleja, depurar código en producción con estado compartido es mucho más difícil.',
        otherApproaches: 'Invariantes de bucle, invariantes de estado, o reducir el problema a casos base. La escritorio sigue siendo la herramienta universal sin dependencias.',
        whenToUse: 'Evaluaciones técnicas, certificaciones de lógica y diseño previo a implementar.'
      }
    }
  };

  function build({ tech, level, title, context, scenario }) {
    const base = TECH_TOPICS[tech]?.[level] || TECH_TOPICS.javascript.principiante;
    const ctx = context || scenario || 'un proyecto web profesional';

    return {
      concept: base.concept,
      whenToUse: base.whenToUse,
      detailed: `${base.detailed} En este reto (${title}), aplicarás esto en el contexto de ${ctx.replace(/^[^\w]*/, '')}.`,
      whyInThisCase: scenario
        ? `${base.whyInThisCase} Escenario: ${scenario}`
        : `${base.whyInThisCase} El caso concreto es: ${ctx}.`,
      otherApproaches: base.otherApproaches
    };
  }

  const READING_EXTRA = {
    detailed: 'Leer código es interpretar intención, flujo y efectos sin ejecutar. Identificarás variables, seguirás el orden de ejecución, reconocerás patrones y predecirás resultados o bugs. Es la habilidad #1 en code reviews y debugging.',
    whyInThisCase: 'En equipos reales pasas más tiempo leyendo código ajeno que escribiendo desde cero. Este ejercicio replica un fragmento que encontrarías en un PR, incidente de producción o sesión de onboarding.',
    otherApproaches: 'Puedes usar debugger paso a paso, dibujar el flujo en papel, o ejecutar en consola — pero aquí entrenas la lectura mental que usas cuando no tienes IDE. También ayuda explicar el código en voz alta (técnica rubber duck).'
  };

  function enrich(challenge) {
    if (!challenge.learn) challenge.learn = {};
    const built = build({
      tech: challenge.tech,
      level: challenge.level,
      title: challenge.title,
      context: challenge.scenario,
      scenario: challenge.scenario
    });

    if (challenge.type === 'desk-test') {
      challenge.learn.detailed = challenge.learn.detailed || built.detailed;
      challenge.learn.whyInThisCase = challenge.learn.whyInThisCase || built.whyInThisCase;
      challenge.learn.otherApproaches = challenge.learn.otherApproaches || built.otherApproaches;
      challenge.learn.whenToUse = challenge.learn.whenToUse || built.whenToUse;
      challenge.learn.concept = challenge.learn.concept || built.concept;
      return challenge;
    }

    if (challenge.type === 'reading') {
      challenge.learn.detailed = challenge.learn.detailed || `${READING_EXTRA.detailed} Tecnología: ${challenge.tech}.`;
      challenge.learn.whyInThisCase = challenge.learn.whyInThisCase || (challenge.scenario
        ? `${READING_EXTRA.whyInThisCase} Contexto: ${challenge.scenario}`
        : READING_EXTRA.whyInThisCase);
      challenge.learn.otherApproaches = challenge.learn.otherApproaches || READING_EXTRA.otherApproaches;
      challenge.learn.whenToUse = challenge.learn.whenToUse || built.whenToUse;
      return challenge;
    }

    challenge.learn = { ...built, ...challenge.learn };
    if (!challenge.learn.detailed) challenge.learn.detailed = built.detailed;
    if (!challenge.learn.whyInThisCase) challenge.learn.whyInThisCase = built.whyInThisCase;
    if (!challenge.learn.otherApproaches) challenge.learn.otherApproaches = built.otherApproaches;
    if (!challenge.learn.concept) challenge.learn.concept = built.concept;
    if (!challenge.learn.whenToUse) challenge.learn.whenToUse = built.whenToUse;
    return challenge;
  }

  function renderHtml(learn) {
    if (!learn) return '';
    const sections = [
      { key: 'concept', icon: '📚', title: 'Qué aprendes' },
      { key: 'detailed', icon: '📖', title: 'Explicación detallada' },
      { key: 'whyInThisCase', icon: '🎯', title: 'Por qué en este caso' },
      { key: 'otherApproaches', icon: '🔄', title: 'Otras formas de resolverlo' },
      { key: 'whenToUse', icon: '💡', title: 'Cuándo usarlo en producción' }
    ];
    return sections
      .filter((s) => learn[s.key])
      .map((s) => `<div class="learn-section"><h4>${s.icon} ${s.title}</h4><p>${escapeLearn(learn[s.key])}</p></div>`)
      .join('');
  }

  function escapeLearn(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  return { build, enrich, renderHtml, escapeLearn };
})();