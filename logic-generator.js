const LogicGenerator = (function () {
  'use strict';

  const PER_GROUP = 50;
  const LEVELS_LIST = ['principiante', 'intermedio', 'avanzado', 'experto'];

  const SCENARIOS = [
    'una tienda que calcula totales', 'un cajero automático', 'un sistema de notas escolares',
    'una app de inventario', 'un control de acceso', 'un sorteo de rifas',
    'un cálculo de nómina básica', 'un medidor de consumo', 'un juego de adivinanzas',
    'un validador de formularios', 'un contador de visitas', 'un algoritmo de descuentos'
  ];

  const LEARN = {
    principiante: {
      concept: 'La lógica secuencial y las decisiones simples son la base de todo algoritmo.',
      whenToUse: 'Antes de escribir código en cualquier lenguaje: entender el problema, los datos y el flujo.'
    },
    intermedio: {
      concept: 'Bucles y acumuladores permiten repetir pasos y procesar colecciones de datos.',
      whenToUse: 'Menús, validaciones repetidas, sumar listas y simular procesos paso a paso.'
    },
    avanzado: {
      concept: 'Bucles anidados, contadores y banderas resuelven búsquedas y comparaciones.',
      whenToUse: 'Tablas, reportes, búsqueda de máximos/mínimos y validaciones compuestas.'
    },
    experto: {
      concept: 'Combinar condiciones, módulo y múltiples variables exige trazas cuidadosas.',
      whenToUse: 'Exámenes de lógica, entrevistas técnicas y diseño de algoritmos sin IDE.'
    }
  };

  function buildStarterCode(inputs, pseudocode) {
    const lines = [
      '# Implementa el algoritmo PSeInt en Python',
      '# Usa print() para mostrar el resultado que pide el problema',
      ''
    ];
    if (pseudocode) {
      lines.push('# --- Pseudocódigo de referencia ---');
      pseudocode.split('\n').forEach((line) => lines.push(`# ${line}`));
      lines.push('');
    }
    lines.push('# --- Datos de entrada ---');
    Object.entries(inputs || {}).forEach(([k, v]) => {
      if (k === 'lecturas') {
        const nums = String(v).split(',').map((s) => s.trim());
        lines.push(`lecturas = [${nums.join(', ')}]`);
      } else if (typeof v === 'string') {
        lines.push(`${k} = ${JSON.stringify(v)}`);
      } else {
        lines.push(`${k} = ${v}`);
      }
    });
    lines.push(
      '',
      '# --- Tu solución (escribe el código aquí) ---',
      ''
    );
    return lines.join('\n');
  }

  function enrichChallenge(ch) {
    const lastOut = [...(ch.traceTable || [])].reverse().find((r) => r.salida != null && r.salida !== '—');
    ch.expectedOutput = lastOut ? String(lastOut.salida) : '';
    ch.starterCode = buildStarterCode(ch.inputs, ch.pseudocode);
    ch.tech = 'logica';
    ch.type = 'desk-test';
    ch.code = ch.pseudocode;
    ch.tests = [{ name: 'Salida del programa', type: 'stdout', expected: ch.expectedOutput }];
    ch.hint = ch.approach;
    ch.feedback = {
      general: {
        why: ch.explanation?.why || 'La salida de tu programa no coincide con lo esperado.',
        fix: ch.explanation?.fix || ch.approach,
        whenToUse: ch.explanation?.whenToUse || LEARN[ch.level]?.whenToUse
      },
      code: {
        why: 'Tu programa no produce la salida esperada con los datos de entrada.',
        fix: 'Compara tu Python con el pseudocódigo: misma lógica, mismos print().',
        whenToUse: 'Ejecutar código confirma que la lógica funciona con cualquier entrada similar.'
      }
    };
    return ch;
  }

  function item(id, level, title, scenario, problem, approach, pseudocode, inputs, trace) {
    const tail = [...arguments].slice(9);
    const explanation = tail.find((x) => x && typeof x === 'object' && 'why' in x) || { why: '' };
    const expIdx = tail.indexOf(explanation);
    const wrong = (expIdx >= 0 && tail[expIdx + 1] && typeof tail[expIdx + 1] === 'object') ? tail[expIdx + 1] : {};
    return enrichChallenge({
      id,
      level,
      title,
      scenario,
      problem,
      approach,
      pseudocode,
      inputs,
      traceTable: trace,
      learn: LEARN[level],
      explanation: {
        why: explanation.why,
        fix: explanation.fix || explanation.trace || approach,
        whenToUse: explanation.when || LEARN[level].whenToUse
      },
      wrongExplanations: wrong || {}
    });
  }

  function principianteTemplates(i) {
    const n = (i % 9) + 2;
    const a = n + 3;
    const b = n + 1;
    const bank = [
      () => {
        const s = a + b;
        return item(
          `log-prin-${String(i + 1).padStart(2, '0')}`, 'principiante', 'Suma de dos números',
          `🧮 Caso en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'El algoritmo lee dos enteros y debe mostrar su suma.',
          'Lee ambos datos, guárdalos en variables, suma en una tercera y escribe el resultado.',
          `Algoritmo SumaDos\n  Leer a\n  Leer b\n  s <- a + b\n  Escribir s\nFinAlgoritmo`,
          { a, b },
          [
            { paso: 1, instruccion: 'Leer a', vars: { a, b, s: '—' } },
            { paso: 2, instruccion: 'Leer b', vars: { a, b, s: '—' } },
            { paso: 3, instruccion: 's <- a + b', vars: { a, b, s } },
            { paso: 4, instruccion: 'Escribir s', vars: { a, b, s }, salida: String(s) }
          ],
          '¿Qué valor se escribe al final?',
          [String(s), String(a), String(b), String(a * b)],
          0,
          { why: `s toma a+b = ${a}+${b} = ${s}.`, trace: 'Sigue la tabla: después de la asignación s vale la suma.' },
          { 1: 'Ese es solo el primer número leído.', 2: 'Ese es el segundo número.', 3: 'Multiplicaste en lugar de sumar.' }
        );
      },
      () => {
        const precio = n * 10;
        const desc = n + 2;
        const total = precio - desc;
        return item(
          `log-prin-${String(i + 1).padStart(2, '0')}`, 'principiante', 'Precio con descuento',
          `🏷️ Descuento en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Se lee precio y descuento; se muestra el total a pagar.',
          'Resta el descuento al precio y escribe el resultado final.',
          `Algoritmo Descuento\n  Leer precio\n  Leer desc\n  total <- precio - desc\n  Escribir total\nFinAlgoritmo`,
          { precio, desc },
          [
            { paso: 1, instruccion: 'Leer precio', vars: { precio, desc, total: '—' } },
            { paso: 2, instruccion: 'Leer desc', vars: { precio, desc, total: '—' } },
            { paso: 3, instruccion: 'total <- precio - desc', vars: { precio, desc, total } },
            { paso: 4, instruccion: 'Escribir total', vars: { precio, desc, total }, salida: String(total) }
          ],
          '¿Cuál es el total mostrado?',
          [String(total), String(precio + desc), String(desc), String(precio)],
          0,
          { why: `total = ${precio} - ${desc} = ${total}.` }
        );
      },
      () => {
        const edad = n + 15;
        const mayor = edad >= 18;
        const msg = mayor ? 'Mayor' : 'Menor';
        return item(
          `log-prin-${String(i + 1).padStart(2, '0')}`, 'principiante', '¿Mayor de edad?',
          `🪪 Control en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Si la edad es mayor o igual a 18, escribe "Mayor"; si no, "Menor".',
          'Compara edad con 18. Solo entra al Entonces si la condición es verdadera.',
          `Algoritmo Edad\n  Leer edad\n  Si edad >= 18 Entonces\n    Escribir "Mayor"\n  Sino\n    Escribir "Menor"\n  FinSi\nFinAlgoritmo`,
          { edad },
          [
            { paso: 1, instruccion: 'Leer edad', vars: { edad } },
            { paso: 2, instruccion: 'Si edad >= 18', vars: { edad, condicion: mayor ? 'V' : 'F' } },
            { paso: 3, instruccion: mayor ? 'Escribir "Mayor"' : 'Escribir "Menor"', vars: { edad }, salida: msg }
          ],
          '¿Qué mensaje se escribe?',
          [msg, 'Mayor', 'Menor', '18'],
          0,
          { why: `${edad} >= 18 es ${mayor ? 'verdadero' : 'falso'}, por eso sale "${msg}".` }
        );
      },
      () => {
        const x = n * 2;
        const y = n * 3;
        const prod = x * y;
        return item(
          `log-prin-${String(i + 1).padStart(2, '0')}`, 'principiante', 'Producto de variables',
          `📦 Cálculo en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Lee x e y, calcula p <- x * y y muestra p.',
          'Multiplica después de leer ambos valores.',
          `Algoritmo Producto\n  Leer x\n  Leer y\n  p <- x * y\n  Escribir p\nFinAlgoritmo`,
          { x, y },
          [
            { paso: 1, instruccion: 'Leer x', vars: { x, y, p: '—' } },
            { paso: 2, instruccion: 'Leer y', vars: { x, y, p: '—' } },
            { paso: 3, instruccion: 'p <- x * y', vars: { x, y, p: prod } },
            { paso: 4, instruccion: 'Escribir p', vars: { x, y, p: prod }, salida: String(prod) }
          ],
          'Después de "p <- x * y", ¿cuánto vale p?',
          [String(prod), String(x + y), String(x), String(y)],
          0,
          { why: `p = ${x} × ${y} = ${prod}.` }
        );
      },
      () => {
        const num = n + 10;
        const doble = num * 2;
        return item(
          `log-prin-${String(i + 1).padStart(2, '0')}`, 'principiante', 'Doble de un número',
          `🔢 Operación en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Lee un número y escribe su doble.',
          'Asigna num*2 a la variable d antes de escribir.',
          `Algoritmo Doble\n  Leer num\n  d <- num * 2\n  Escribir d\nFinAlgoritmo`,
          { num },
          [
            { paso: 1, instruccion: 'Leer num', vars: { num, d: '—' } },
            { paso: 2, instruccion: 'd <- num * 2', vars: { num, d: doble } },
            { paso: 3, instruccion: 'Escribir d', vars: { num, d: doble }, salida: String(doble) }
          ],
          '¿Qué se escribe?',
          [String(doble), String(num), String(num + 2), String(num / 2)],
          0,
          { why: `d = ${num} × 2 = ${doble}.` }
        );
      }
    ];
    return bank[i % bank.length]();
  }

  function intermedioTemplates(i) {
    const n = (i % 5) + 3;
    const bank = [
      () => {
        let s = 0;
        const rows = [];
        for (let k = 1; k <= n; k++) {
          s += k;
          rows.push({ paso: k + 1, instruccion: `i=${k}: s <- s + i`, vars: { i: k, s } });
        }
        rows.unshift({ paso: 1, instruccion: 'i <- 1, s <- 0', vars: { i: 1, s: 0 } });
        rows.push({ paso: n + 2, instruccion: 'Escribir s', vars: { i: n, s }, salida: String(s) });
        return item(
          `log-int-${String(i + 1).padStart(2, '0')}`, 'intermedio', 'Suma del 1 al n',
          `🔁 Acumulador en ${SCENARIOS[i % SCENARIOS.length]}.`,
          `Suma los enteros del 1 al ${n} usando un bucle Mientras.`,
          'Inicializa i en 1 y s en 0. En cada vuelta suma i a s y aumenta i hasta pasar n.',
          `Algoritmo SumaHastaN\n  Leer n\n  i <- 1\n  s <- 0\n  Mientras i <= n Hacer\n    s <- s + i\n    i <- i + 1\n  FinMientras\n  Escribir s\nFinAlgoritmo`,
          { n },
          rows,
          `Con n = ${n}, ¿qué valor final tiene s?`,
          [String(s), String(n), String(n * 2), String(n + 1)],
          0,
          { why: `Es la suma 1+2+…+${n} = ${s}.`, trace: 'Actualiza s en cada iteración antes de incrementar i.' }
        );
      },
      () => {
        const lim = n + 2;
        let c = 0;
        const rows = [{ paso: 1, instruccion: 'c <- 0', vars: { c, x: '—' } }];
        for (let x = 1; x <= lim; x++) {
          if (x % 2 === 0) c++;
          rows.push({ paso: x + 1, instruccion: `x=${x}`, vars: { x, c } });
        }
        rows.push({ paso: lim + 2, instruccion: 'Escribir c', vars: { c }, salida: String(c) });
        return item(
          `log-int-${String(i + 1).padStart(2, '0')}`, 'intermedio', 'Contar pares',
          `📊 Conteo en ${SCENARIOS[i % SCENARIOS.length]}.`,
          `Cuenta cuántos pares hay entre 1 y ${lim}.`,
          'Recorre con Para y aumenta c solo cuando x es divisible entre 2.',
          `Algoritmo ContarPares\n  Leer lim\n  c <- 0\n  Para x <- 1 Hasta lim Hacer\n    Si x MOD 2 = 0 Entonces\n      c <- c + 1\n    FinSi\n  FinPara\n  Escribir c\nFinAlgoritmo`,
          { lim },
          rows,
          `¿Cuántos pares hay del 1 al ${lim}?`,
          [String(c), String(lim), String(Math.floor(lim / 2) + 1), String(lim - c)],
          0,
          { why: `Hay ${c} números pares en ese rango.` }
        );
      },
      () => {
        const base = n + 1;
        const exp = n % 3 + 2;
        const res = base ** exp;
        return item(
          `log-int-${String(i + 1).padStart(2, '0')}`, 'intermedio', 'Potencia repetida',
          `⚡ Cálculo en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Multiplica base por sí misma exp veces usando un bucle.',
          'Inicia r en 1 y multiplica por base en cada iteración del Para.',
          `Algoritmo Potencia\n  Leer base\n  Leer exp\n  r <- 1\n  Para k <- 1 Hasta exp Hacer\n    r <- r * base\n  FinPara\n  Escribir r\nFinAlgoritmo`,
          { base, exp },
          [
            { paso: 1, instruccion: 'Leer base, exp', vars: { base, exp, r: '—' } },
            { paso: 2, instruccion: 'r <- 1', vars: { base, exp, r: 1 } },
            { paso: 3, instruccion: `Bucle ${exp} veces`, vars: { base, exp, r: res } },
            { paso: 4, instruccion: 'Escribir r', vars: { base, exp, r: res }, salida: String(res) }
          ],
          `¿Cuánto vale r al final? (${base}^${exp})`,
          [String(res), String(base * exp), String(base + exp), String(exp)],
          0,
          { why: `${base}^${exp} = ${res}.` }
        );
      },
      () => {
        const nums = [n, n + 2, n - 1, n + 5];
        const max = Math.max(...nums);
        return item(
          `log-int-${String(i + 1).padStart(2, '0')}`, 'intermedio', 'Encontrar el mayor',
          `📈 Comparación en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Lee 4 números y muestra el mayor.',
          'Compara cada lectura con max; si es mayor, actualiza max.',
          `Algoritmo MayorDeCuatro\n  max <- -99999\n  Para j <- 1 Hasta 4 Hacer\n    Leer x\n    Si x > max Entonces\n      max <- x\n    FinSi\n  FinPara\n  Escribir max\nFinAlgoritmo`,
          { lecturas: nums.join(', ') },
          nums.map((x, idx) => ({
            paso: idx + 1,
            instruccion: `Leer x = ${x}`,
            vars: { x, max: Math.max(-99999, ...nums.slice(0, idx + 1)) }
          })).concat([{ paso: 5, instruccion: 'Escribir max', vars: { max }, salida: String(max) }]),
          '¿Qué valor se escribe?',
          [String(max), String(nums[0]), String(nums.reduce((a, b) => a + b, 0)), String(nums.length)],
          0,
          { why: `El mayor de [${nums.join(', ')}] es ${max}.` }
        );
      },
      () => {
        const fact = n;
        let f = 1;
        const rows = [{ paso: 1, instruccion: 'f <- 1', vars: { f, i: '—' } }];
        for (let k = 1; k <= fact; k++) {
          f *= k;
          rows.push({ paso: k + 1, instruccion: `i=${k}`, vars: { i: k, f } });
        }
        rows.push({ paso: fact + 2, instruccion: 'Escribir f', vars: { f }, salida: String(f) });
        return item(
          `log-int-${String(i + 1).padStart(2, '0')}`, 'intermedio', `Factorial de ${fact}`,
          `🧮 Factorial en ${SCENARIOS[i % SCENARIOS.length]}.`,
          `Calcula ${fact}! multiplicando del 1 al ${fact}.`,
          'Acumula en f el producto de cada i en el bucle Para.',
          `Algoritmo Factorial\n  Leer n\n  f <- 1\n  Para i <- 1 Hasta n Hacer\n    f <- f * i\n  FinPara\n  Escribir f\nFinAlgoritmo`,
          { n: fact },
          rows,
          `¿Cuánto vale f? (${fact}!)`,
          [String(f), String(fact * 2), String(fact + 1), String(fact)],
          0,
          { why: `${fact}! = ${f}.` }
        );
      }
    ];
    return bank[i % bank.length]();
  }

  function avanzadoTemplates(i) {
    const n = (i % 4) + 3;
    const bank = [
      () => {
        const rows = [];
        let s = 0;
        for (let r = 1; r <= 2; r++) {
          for (let c = 1; c <= n; c++) {
            s += c;
            rows.push({ paso: rows.length + 1, instruccion: `r=${r}, c=${c}`, vars: { r, c, s } });
          }
        }
        rows.push({ paso: rows.length + 1, instruccion: 'Escribir s', vars: { s }, salida: String(s) });
        return item(
          `log-ava-${String(i + 1).padStart(2, '0')}`, 'avanzado', 'Bucles anidados',
          `🔀 Matriz en ${SCENARIOS[i % SCENARIOS.length]}.`,
          `Suma c en cada combinación de r (1..2) y c (1..${n}).`,
          'El bucle externo controla r; el interno recorre c y acumula en s.',
          `Algoritmo Anidado\n  Leer n\n  s <- 0\n  Para r <- 1 Hasta 2 Hacer\n    Para c <- 1 Hasta n Hacer\n      s <- s + c\n    FinPara\n  FinPara\n  Escribir s\nFinAlgoritmo`,
          { n },
          rows,
          `Con n=${n}, ¿valor final de s?`,
          [String(s), String(n * 2), String(n + 2), String(2 * n * n)],
          0,
          { why: `Se suma 1..${n} dos veces: ${s}.` }
        );
      },
      () => {
        const num = n * 7 + 3;
        const dig = num % 10;
        return item(
          `log-ava-${String(i + 1).padStart(2, '0')}`, 'avanzado', 'Último dígito',
          `🔢 Módulo en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Obtiene el último dígito de un número con MOD 10.',
          'El residuo de dividir entre 10 es el dígito de las unidades.',
          `Algoritmo UltimoDigito\n  Leer num\n  d <- num MOD 10\n  Escribir d\nFinAlgoritmo`,
          { num },
          [
            { paso: 1, instruccion: 'Leer num', vars: { num, d: '—' } },
            { paso: 2, instruccion: 'd <- num MOD 10', vars: { num, d: dig } },
            { paso: 3, instruccion: 'Escribir d', vars: { num, d: dig }, salida: String(dig) }
          ],
          `Con num = ${num}, ¿qué escribe?`,
          [String(dig), String(Math.floor(num / 10)), String(num), '0'],
          0,
          { why: `${num} MOD 10 = ${dig}.` }
        );
      },
      () => {
        const lim = n + 4;
        let cnt = 0;
        const rows = [];
        for (let v = 1; v <= lim; v++) {
          if (v % 3 === 0 && v % 2 === 0) cnt++;
          rows.push({ paso: v, instruccion: `v=${v}`, vars: { v, cnt } });
        }
        rows.push({ paso: lim + 1, instruccion: 'Escribir cnt', vars: { cnt }, salida: String(cnt) });
        return item(
          `log-ava-${String(i + 1).padStart(2, '0')}`, 'avanzado', 'Múltiplos de 6',
          `📐 Filtro en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Cuenta números divisibles entre 2 y 3 (múltiplos de 6).',
          'La condición usa AND: ambos residuos deben ser 0.',
          `Algoritmo Multiplos6\n  Leer lim\n  cnt <- 0\n  Para v <- 1 Hasta lim Hacer\n    Si v MOD 2 = 0 Y v MOD 3 = 0 Entonces\n      cnt <- cnt + 1\n    FinSi\n  FinPara\n  Escribir cnt\nFinAlgoritmo`,
          { lim },
          rows,
          `Del 1 al ${lim}, ¿cuántos múltiplos de 6 hay?`,
          [String(cnt), String(Math.floor(lim / 3)), String(Math.floor(lim / 2)), String(lim)],
          0,
          { why: `Hay ${cnt} múltiplos de 6 en el rango.` }
        );
      },
      () => {
        const a = n + 1;
        const b = n + 4;
        const mcd = (function gcd(x, y) { return y ? gcd(y, x % y) : x; })(a, b);
        return item(
          `log-ava-${String(i + 1).padStart(2, '0')}`, 'avanzado', 'MCD por restas',
          `🔁 Algoritmo clásico en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Calcula el máximo común divisor restando el menor al mayor.',
          'Repite hasta que ambos sean iguales; ese valor es el MCD.',
          `Algoritmo MCD\n  Leer a\n  Leer b\n  Mientras a <> b Hacer\n    Si a > b Entonces\n      a <- a - b\n    Sino\n      b <- b - a\n    FinSi\n  FinMientras\n  Escribir a\nFinAlgoritmo`,
          { a, b },
          [
            { paso: 1, instruccion: 'Leer a, b', vars: { a, b } },
            { paso: 2, instruccion: 'Bucle hasta igualdad', vars: { a: mcd, b: mcd } },
            { paso: 3, instruccion: 'Escribir a', vars: { a: mcd }, salida: String(mcd) }
          ],
          `MCD(${a}, ${b}) = ?`,
          [String(mcd), String(a + b), String(a * b), String(a - b)],
          0,
          { why: `El MCD de ${a} y ${b} es ${mcd}.` }
        );
      }
    ];
    return bank[i % bank.length]();
  }

  function expertoTemplates(i) {
    const n = (i % 3) + 4;
    const bank = [
      () => {
        const num = n * 11 + 5;
        let esPrimo = num > 1;
        let d = 2;
        const rows = [{ paso: 1, instruccion: 'Leer num', vars: { num, esPrimo: 'V', d: 2 } }];
        while (d * d <= num) {
          if (num % d === 0) esPrimo = false;
          rows.push({ paso: rows.length + 1, instruccion: `d=${d}`, vars: { num, d, esPrimo: esPrimo ? 'V' : 'F' } });
          d++;
        }
        const out = esPrimo ? 'Primo' : 'No primo';
        rows.push({ paso: rows.length + 1, instruccion: 'Escribir resultado', vars: { esPrimo: esPrimo ? 'V' : 'F' }, salida: out });
        return item(
          `log-exp-${String(i + 1).padStart(2, '0')}`, 'experto', '¿Es primo?',
          `🧪 Prueba en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Determina si num es primo probando divisores hasta √num.',
          'Si algún d divide a num, marca esPrimo en falso y detén la búsqueda mental.',
          `Algoritmo Primo\n  Leer num\n  esPrimo <- Verdadero\n  d <- 2\n  Mientras d*d <= num Y esPrimo Hacer\n    Si num MOD d = 0 Entonces\n      esPrimo <- Falso\n    FinSi\n    d <- d + 1\n  FinMientras\n  Si esPrimo Entonces Escribir "Primo"\n  Sino Escribir "No primo"\n  FinSi\nFinAlgoritmo`,
          { num },
          rows,
          `¿num = ${num} es primo?`,
          [out, 'Primo', 'No primo', 'Indeterminado'],
          0,
          { why: `${num} ${esPrimo ? 'no tiene' : 'tiene'} divisores propios en el rango probado.` }
        );
      },
      () => {
        const rows = [];
        let a = 0;
        let b = 1;
        let t = 0;
        for (let k = 1; k <= n; k++) {
          t = a + b;
          rows.push({ paso: k, instruccion: `k=${k}`, vars: { a, b, t } });
          a = b;
          b = t;
        }
        rows.push({ paso: n + 1, instruccion: 'Escribir t', vars: { t }, salida: String(t) });
        return item(
          `log-exp-${String(i + 1).padStart(2, '0')}`, 'experto', 'Fibonacci paso a paso',
          `📐 Secuencia en ${SCENARIOS[i % SCENARIOS.length]}.`,
          `Calcula el término n de Fibonacci con variables a, b, t.`,
          'En cada vuelta: t=a+b, luego desplaza a←b y b←t.',
          `Algoritmo Fibonacci\n  Leer n\n  a <- 0\n  b <- 1\n  Para k <- 1 Hasta n Hacer\n    t <- a + b\n    a <- b\n    b <- t\n  FinPara\n  Escribir t\nFinAlgoritmo`,
          { n },
          rows,
          `¿Qué t se escribe tras ${n} iteraciones?`,
          [String(t), String(a), String(b), String(n)],
          0,
          { why: `Tras ${n} pasos el término generado es ${t}.` }
        );
      },
      () => {
        const texto = `a${n}b`;
        let voc = 0;
        const rows = [];
        for (let p = 1; p <= texto.length; p++) {
          const ch = texto[p - 1];
          const esV = 'aeiou'.includes(ch);
          if (esV) voc++;
          rows.push({ paso: p, instruccion: `ch='${ch}'`, vars: { p, ch, voc } });
        }
        rows.push({ paso: texto.length + 1, instruccion: 'Escribir voc', vars: { voc }, salida: String(voc) });
        return item(
          `log-exp-${String(i + 1).padStart(2, '0')}`, 'experto', 'Contar vocales',
          `📝 Cadena en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Recorre cada carácter y cuenta si es vocal.',
          'Compara ch con a,e,i,o,u; incrementa voc cuando coincide.',
          `Algoritmo Vocales\n  Leer texto\n  voc <- 0\n  Para p <- 1 Hasta Longitud(texto) Hacer\n    ch <- texto[p]\n    Si ch='a' O ch='e' O ch='i' O ch='o' O ch='u' Entonces\n      voc <- voc + 1\n    FinSi\n  FinPara\n  Escribir voc\nFinAlgoritmo`,
          { texto },
          rows,
          `En "${texto}", ¿cuántas vocales hay?`,
          [String(voc), String(texto.length), String(voc + 1), '0'],
          0,
          { why: `La cadena tiene ${voc} vocal(es).` }
        );
      },
      () => {
        const x = n + 2;
        const y = n + 7;
        const z = n + 1;
        const sorted = [x, y, z].sort((a, b) => a - b);
        const med = sorted[1];
        return item(
          `log-exp-${String(i + 1).padStart(2, '0')}`, 'experto', 'Mediana de tres',
          `⚖️ Comparación en ${SCENARIOS[i % SCENARIOS.length]}.`,
          'Encuentra el valor del medio entre tres números distintos.',
          'Ordena x, y, z de menor a mayor; el valor central es la mediana.',
          `Algoritmo Mediana3\n  Leer x, y, z\n  Si x > y Entonces Intercambiar(x, y) FinSi\n  Si y > z Entonces Intercambiar(y, z) FinSi\n  Si x > y Entonces Intercambiar(x, y) FinSi\n  med <- y\n  Escribir med\nFinAlgoritmo`,
          { x, y, z },
          [
            { paso: 1, instruccion: 'Leer x,y,z', vars: { x, y, z } },
            { paso: 2, instruccion: 'Ordenar: bubble mental', vars: { orden: sorted.join(', ') } },
            { paso: 3, instruccion: 'med <- y (central)', vars: { med }, salida: String(med) }
          ],
          `Valores: x=${x}, y=${y}, z=${z}. ¿Cuál es el del medio?`,
          [String(med), String(Math.max(x, y, z)), String(Math.min(x, y, z)), String(x + y + z)],
          0,
          { why: `Ordenados [${sorted.join(', ')}], el central es ${med}.` }
        );
      }
    ];
    return bank[i % bank.length]();
  }

  function generateLevel(level) {
    const list = [];
    const prefix = { principiante: 'pri', intermedio: 'int', avanzado: 'ava', experto: 'exp' }[level];
    const fn = {
      principiante: principianteTemplates,
      intermedio: intermedioTemplates,
      avanzado: avanzadoTemplates,
      experto: expertoTemplates
    }[level];

    for (let i = 0; i < PER_GROUP; i++) {
      const ex = fn(i);
      ex.id = `log-${prefix}-${String(i + 1).padStart(2, '0')}`;
      list.push(ex);
    }
    return list;
  }

  function generateAll() {
    const all = [];
    LEVELS_LIST.forEach((level) => {
      all.push(...generateLevel(level));
    });
    return all;
  }

  return { generateAll, PER_GROUP };
})();