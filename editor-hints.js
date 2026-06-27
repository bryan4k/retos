/**
 * Autocompletado contextual para el editor CodeMirror.
 * Tab: completa etiquetas HTML, palabras reservadas, propiedades CSS, APIs JS y Python.
 */
const EditorHints = (function () {
  'use strict';

  const VOID_TAGS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
    'meta', 'param', 'source', 'track', 'wbr'
  ]);

  const HTML_TAGS = {
    html: '', head: '', body: '', title: '',
    meta: ' charset="UTF-8"',
    link: ' rel="stylesheet" href=""',
    script: '', style: '',
    header: '', nav: '', main: '', footer: '', section: '', article: '', aside: '',
    h1: '', h2: '', h3: '', h4: '', h5: '', h6: '',
    p: '', span: '', div: '', br: '', hr: '', pre: '', code: '', blockquote: '',
    ul: '', ol: '', li: '', dl: '', dt: '', dd: '',
    table: '', thead: '', tbody: '', tfoot: '', tr: '', th: '', td: '', caption: '',
    form: ' action="" method="post"', fieldset: '', legend: '', label: ' for=""',
    input: ' type="text" name=""', textarea: ' name=""', select: ' name=""',
    option: ' value=""', button: ' type="button"', datalist: '', output: '',
    img: ' src="" alt=""', picture: '', source: '', video: ' controls', audio: ' controls',
    figure: '', figcaption: '', svg: '', canvas: '',
    a: ' href=""', iframe: ' src="" title=""',
    details: '', summary: '', dialog: '',
    template: '', slot: '', wbr: '', data: ' value=""', time: ' datetime=""',
    mark: '', small: '', strong: '', em: '', address: '', cite: '', abbr: ' title=""',
    sup: '', sub: '', del: '', ins: '', kbd: '', samp: '', var: ''
  };

  const HTML_ATTRS = [
    'class', 'id', 'style', 'title', 'lang', 'dir', 'hidden', 'tabindex', 'role',
    'href', 'target', 'rel', 'download', 'src', 'alt', 'width', 'height', 'loading',
    'srcset', 'sizes', 'type', 'name', 'value', 'placeholder', 'required', 'disabled',
    'readonly', 'min', 'max', 'step', 'pattern', 'autocomplete', 'for', 'action',
    'method', 'enctype', 'charset', 'content', 'viewport', 'aria-label', 'aria-hidden',
    'aria-describedby', 'aria-labelledby', 'data-', 'colspan', 'rowspan', 'scope',
    'open', 'controls', 'muted', 'loop', 'poster', 'datetime', 'cite', 'draggable'
  ];

  const CSS_PROPS = [
    'display', 'position', 'top', 'right', 'bottom', 'left', 'z-index', 'float', 'clear',
    'flex', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
    'justify-content', 'align-items', 'align-content', 'align-self', 'gap', 'row-gap', 'column-gap',
    'grid', 'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
    'grid-column', 'grid-row', 'grid-area', 'place-items', 'place-content',
    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'border', 'border-radius', 'border-width', 'border-style', 'border-color',
    'box-sizing', 'box-shadow', 'outline', 'overflow', 'overflow-x', 'overflow-y',
    'color', 'background', 'background-color', 'background-image', 'background-size',
    'background-position', 'opacity', 'visibility', 'cursor', 'pointer-events',
    'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing',
    'text-align', 'text-decoration', 'text-transform', 'white-space', 'word-break',
    'list-style', 'object-fit', 'aspect-ratio', 'transform', 'transition', 'animation',
    'content', 'filter', 'backdrop-filter', 'clip-path', 'user-select', 'resize'
  ];

  const CSS_VALUES = [
    'none', 'block', 'inline', 'inline-block', 'flex', 'grid', 'relative', 'absolute',
    'fixed', 'sticky', 'static', 'hidden', 'auto', 'inherit', 'initial', 'unset',
    'center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly',
    'stretch', 'bold', 'normal', 'italic', 'underline', 'uppercase', 'lowercase',
    'capitalize', 'nowrap', 'wrap', 'cover', 'contain', 'solid', 'dashed', 'dotted',
    'transparent', 'pointer', 'not-allowed', '100%', '100vh', '100vw', '1rem', '1em',
    '0', '1px', '2px', '4px', '8px', '16px', '24px', '32px', 'var(--', 'calc(',
    'rgb(', 'rgba(', 'hsl(', 'linear-gradient(', 'ease', 'ease-in-out', 'forwards'
  ];

  const JS_KEYWORDS = [
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
    'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if',
    'import', 'in', 'instanceof', 'let', 'new', 'return', 'super', 'switch', 'this',
    'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'async', 'await',
    'of', 'static', 'get', 'set', 'from', 'as', 'true', 'false', 'null', 'undefined', 'NaN'
  ];

  const JS_SNIPPETS = [
    'console.log()', 'document.querySelector()', 'document.getElementById()',
    'document.createElement()', 'addEventListener()', 'preventDefault()', 'stopPropagation()',
    'fetch()', 'JSON.parse()', 'JSON.stringify()', 'Array.from()', 'Object.keys()',
    'Object.values()', 'Object.entries()', 'setTimeout()', 'clearTimeout()',
    'setInterval()', 'clearInterval()', 'parseInt()', 'parseFloat()', 'Math.max()',
    'Math.min()', 'Math.floor()', 'Math.ceil()', 'Math.round()', 'localStorage.getItem()',
    'localStorage.setItem()', 'sessionStorage.getItem()', 'classList.add()',
    'classList.remove()', 'classList.toggle()', 'classList.contains()', 'innerHTML',
    'textContent', 'appendChild()', 'removeChild()', 'push()', 'pop()', 'shift()',
    'unshift()', 'map()', 'filter()', 'reduce()', 'forEach()', 'find()', 'findIndex()',
    'includes()', 'indexOf()', 'slice()', 'splice()', 'join()', 'split()', 'trim()',
    'toLowerCase()', 'toUpperCase()', 'startsWith()', 'endsWith()', 'replace()',
    'Promise.resolve()', 'Promise.reject()', 'async function', 'export default',
    'export const', 'import from', '=>', '===', '!==', '&&', '||', '??', '?.'
  ];

  const PYTHON_KEYWORDS = [
    'False', 'True', 'None', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
    'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
    'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass',
    'raise', 'return', 'try', 'while', 'with', 'yield'
  ];

  const PYTHON_BUILTINS = [
    'print()', 'len()', 'range()', 'str()', 'int()', 'float()', 'bool()', 'list()',
    'dict()', 'set()', 'tuple()', 'type()', 'isinstance()', 'enumerate()', 'zip()',
    'map()', 'filter()', 'sorted()', 'reversed()', 'min()', 'max()', 'sum()', 'abs()',
    'round()', 'open()', 'input()', 'any()', 'all()', 'hasattr()', 'getattr()',
    'setattr()', 'super()', 'self', 'classmethod', 'staticmethod', 'property',
    'f""', 'if __name__ == "__main__":', 'def __init__(self):', 'except Exception as e:',
    'with open() as', 'for i in range()', 'list comprehension', '[x for x in]', '{k: v for}'
  ];

  function getSubMode(editor, cur) {
    const mode = editor.getModeAt(cur).name;
    if (mode === 'css' || mode === 'javascript' || mode === 'python') return mode;

    const before = editor.getValue().slice(0, editor.indexFromPos(cur));
    const scriptOpen = before.lastIndexOf('<script');
    const scriptClose = before.lastIndexOf('</script>');
    if (scriptOpen > scriptClose) return 'javascript';

    const styleOpen = before.lastIndexOf('<style');
    const styleClose = before.lastIndexOf('</style>');
    if (styleOpen > styleClose) return 'css';

    return 'html';
  }

  function getContext(editor) {
    const cur = editor.getCursor();
    const line = editor.getLine(cur.line);
    const before = line.slice(0, cur.ch);
    const sub = getSubMode(editor, cur);

    if (sub === 'javascript') {
      const word = before.match(/([\w$.-]*)$/);
      if (!word || !word[1]) return null;
      return { kind: 'javascript', prefix: word[1], from: { line: cur.line, ch: cur.ch - word[1].length } };
    }

    if (sub === 'css') {
      const word = before.match(/([\w$-]*)$/);
      if (!word || !word[1]) return null;
      return { kind: 'css', prefix: word[1].toLowerCase(), from: { line: cur.line, ch: cur.ch - word[1].length } };
    }

    if (sub === 'python') {
      const word = before.match(/([\w]*)$/);
      if (!word || !word[1]) return null;
      return { kind: 'python', prefix: word[1], from: { line: cur.line, ch: cur.ch - word[1].length } };
    }

    const tagAfterLt = before.match(/<([\w-]*)$/);
    if (tagAfterLt) {
      return {
        kind: 'html-tag',
        prefix: tagAfterLt[1].toLowerCase(),
        from: { line: cur.line, ch: cur.ch - tagAfterLt[1].length - 1 },
        hasLt: true
      };
    }

    const attrCtx = before.match(/<[\w-]+\s+([\w-]*)$/);
    if (attrCtx) {
      const prefix = attrCtx[1].toLowerCase();
      return {
        kind: 'html-attr',
        prefix,
        from: { line: cur.line, ch: cur.ch - attrCtx[1].length }
      };
    }

    const word = before.match(/([\w-]*)$/);
    if (!word || !word[1]) return null;

    return {
      kind: 'html-word',
      prefix: word[1].toLowerCase(),
      from: { line: cur.line, ch: cur.ch - word[1].length }
    };
  }

  function htmlTagSnippet(tag, attrs) {
    if (VOID_TAGS.has(tag)) {
      const text = attrs ? `<${tag}${attrs}>` : `<${tag}>`;
      return {
        text,
        displayText: `<${tag}>`,
        cursorOffset: text.length
      };
    }
    const open = `<${tag}${attrs}>`;
    const text = `${open}</${tag}>`;
    return {
      text,
      displayText: `<${tag}>`,
      cursorOffset: open.length
    };
  }

  function makeCompletion(text, displayText, from, to, cursorOffset) {
    const offset = cursorOffset != null ? cursorOffset : text.length;
    return {
      text,
      displayText: displayText || text,
      from,
      to,
      hint(cm, _data, completion) {
        cm.replaceRange(completion.text, completion.from, completion.to, 'complete');
        cm.setCursor({
          line: completion.from.line,
          ch: completion.from.ch + (completion.cursorOffset != null ? completion.cursorOffset : completion.text.length)
        });
      },
      from,
      to,
      cursorOffset: offset
    };
  }

  function filterList(items, prefix, getText) {
    const p = prefix.toLowerCase();
    if (!p) return items.slice(0, 40);
    return items
      .filter((item) => getText(item).toLowerCase().startsWith(p))
      .slice(0, 40);
  }

  function buildHtmlTagCompletions(ctx, to) {
    const tags = Object.keys(HTML_TAGS);
    const matched = filterList(tags, ctx.prefix, (t) => t);
    return matched.map((tag) => {
      const attrs = HTML_TAGS[tag];
      const snip = htmlTagSnippet(tag, attrs);
      return makeCompletion(snip.text, snip.displayText, ctx.from, to, snip.cursorOffset);
    });
  }

  function buildHtmlWordCompletions(ctx, to) {
    const tags = Object.keys(HTML_TAGS);
    const matched = filterList(tags, ctx.prefix, (t) => t);
    return matched.map((tag) => {
      const attrs = HTML_TAGS[tag];
      const snip = htmlTagSnippet(tag, attrs);
      return makeCompletion(snip.text, snip.displayText, ctx.from, to, snip.cursorOffset);
    });
  }

  function buildHtmlAttrCompletions(ctx, to) {
    const matched = filterList(HTML_ATTRS, ctx.prefix, (a) => a);
    return matched.map((attr) => {
      const text = attr.endsWith('-') ? attr : `${attr}=""`;
      const cursorOffset = attr.endsWith('-') ? text.length : text.length - 1;
      return makeCompletion(text, attr, ctx.from, to, cursorOffset);
    });
  }

  function buildCssCompletions(editor, ctx, to) {
    const line = editor.getLine(ctx.from.line);
    const segment = line.slice(0, to.ch);
    const colonIdx = segment.lastIndexOf(':');
    const semiIdx = segment.lastIndexOf(';');
    const inValue = colonIdx > semiIdx;

    const pool = inValue ? CSS_VALUES : CSS_PROPS;
    const matched = filterList(pool, ctx.prefix, (x) => x);
    return matched.map((item) => {
      const text = inValue ? item : `${item}: `;
      return makeCompletion(text, item, ctx.from, to, text.length);
    });
  }

  function buildJsCompletions(ctx, to, editor) {
    const pool = [...JS_KEYWORDS, ...JS_SNIPPETS];
    const matched = filterList(pool, ctx.prefix, (x) => x);

    const token = editor.getTokenAt(to);
    const local = [];
    if (token && token.type === 'variable') {
      const docWords = collectWords(editor, /^[\w$]+$/);
      docWords.forEach((w) => {
        if (w.toLowerCase().startsWith(ctx.prefix.toLowerCase())) local.push(w);
      });
    }

    const seen = new Set();
    const all = [...matched, ...local].filter((x) => {
      const k = x.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).slice(0, 40);

    return all.map((item) => makeCompletion(item, item, ctx.from, to, item.length));
  }

  function buildPythonCompletions(ctx, to) {
    const pool = [...PYTHON_KEYWORDS, ...PYTHON_BUILTINS];
    const matched = filterList(pool, ctx.prefix, (x) => x);
    return matched.map((item) => makeCompletion(item, item, ctx.from, to, item.length));
  }

  function collectWords(editor, re) {
    const words = new Set();
    const max = Math.min(editor.lineCount(), 120);
    for (let i = 0; i < max; i++) {
      const line = editor.getLine(i);
      line.split(/\W+/).forEach((w) => {
        if (w && re.test(w) && w.length > 1) words.add(w);
      });
    }
    return [...words];
  }

  function getHint(editor) {
    const ctx = getContext(editor);
    if (!ctx) return null;
    if (!ctx.prefix && ctx.kind !== 'html-tag') return null;

    const to = editor.getCursor();
    let list = [];

    switch (ctx.kind) {
      case 'html-tag':
        list = buildHtmlTagCompletions(ctx, to);
        break;
      case 'html-attr':
        list = buildHtmlAttrCompletions(ctx, to);
        break;
      case 'html-word':
        list = buildHtmlWordCompletions(ctx, to);
        break;
      case 'css':
        list = buildCssCompletions(editor, ctx, to);
        break;
      case 'javascript':
        list = buildJsCompletions(ctx, to, editor);
        break;
      case 'python':
        list = buildPythonCompletions(ctx, to);
        break;
      default:
        break;
    }

    if (!list.length) return null;
    return { list, from: list[0].from, to: list[0].to };
  }

  function pickCompletion(cm, completion) {
    if (completion.hint) {
      completion.hint(cm, null, completion);
    } else {
      cm.replaceRange(completion.text, completion.from, completion.to, 'complete');
    }
  }

  function tabHandler(cm) {
    if (cm.state.completionActive) {
      cm.state.completionActive.pick();
      return;
    }

    const result = getHint(cm);
    if (!result || !result.list.length) {
      if (cm.somethingSelected()) cm.indentSelection('add');
      else cm.execCommand('insertSoftTab');
      return;
    }

    if (result.list.length === 1) {
      pickCompletion(cm, result.list[0]);
      return;
    }

    CodeMirror.showHint(cm, () => result, { completeSingle: false, closeOnUnfocus: true });
  }

  function hintForMode(editor) {
    return getHint(editor);
  }

  function registerHelpers() {
    ['htmlmixed', 'text/html', 'xml', 'css', 'javascript', 'python'].forEach((mode) => {
      CodeMirror.registerHelper('hint', mode, hintForMode);
    });
  }

  function bindEditor(editor, extraKeys) {
    registerHelpers();

    editor.setOption('extraKeys', {
      Tab: tabHandler,
      'Ctrl-Space': 'autocomplete',
      ...extraKeys
    });
  }

  return { bindEditor, getHint, tabHandler };
})();