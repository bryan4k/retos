const LEVELS = {
  principiante: { label: 'Principiante', order: 1, color: '#22c55e' },
  intermedio: { label: 'Intermedio', order: 2, color: '#3b82f6' },
  avanzado: { label: 'Avanzado', order: 3, color: '#f59e0b' },
  experto: { label: 'Experto', order: 4, color: '#ef4444' }
};

const TECHNOLOGIES = {
  html: {
    label: 'HTML',
    icon: '📄',
    color: '#e34c26',
    editorMode: 'htmlmixed',
    description: 'Estructura y semántica web'
  },
  css: {
    label: 'CSS',
    icon: '🎨',
    color: '#264de4',
    editorMode: 'css',
    description: 'Estilos, layout y diseño responsive'
  },
  javascript: {
    label: 'JavaScript',
    icon: '⚡',
    color: '#f7df1e',
    editorMode: 'javascript',
    description: 'Lógica, DOM y APIs del navegador'
  },
  python: {
    label: 'Python',
    icon: '🐍',
    color: '#3776ab',
    editorMode: 'python',
    description: 'Scripts, datos y automatización'
  },
  logica: {
    label: 'Lógica',
    icon: '🧠',
    color: '#a855f7',
    editorMode: 'python',
    description: 'Pruebas de escritorio estilo PSeInt',
    deskTest: true
  }
};