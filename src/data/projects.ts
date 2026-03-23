export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  id: string
  num: string
  color: string
  title: string
  subtitle: string
  desc: string
  context: string
  highlights: string[]
  tags: string[]
  links: ProjectLink[]
}

export const projects: Project[] = [
  {
    id: 'clara',
    num: '01',
    color: '#FF2D9B',
    title: 'CLARA — CIVICAID',
    subtitle: 'AI Voice Assistant',
    desc: 'Asistente de voz IA multilingüe para conectar poblaciones vulnerables con trámites gubernamentales. Soporte en 8 idiomas con voz y texto.',
    context: 'Hackathon OdiseIA4Good 2026 — 300+ participantes. Lideré equipo de 4 personas. Diseñé arquitectura del sistema y pipeline de procesamiento de voz.',
    highlights: [
      '1er lugar — OdiseIA4Good 2026',
      'Líder de proyecto',
      '469+ tests automatizados',
      'Arquitectura: React + Python + Gemini + ElevenLabs',
    ],
    tags: ['React', 'TypeScript', 'Python', 'Gemini', 'ElevenLabs'],
    links: [
      { label: 'demo', href: 'https://andreavilaro0.github.io/civicaid-voice/' },
      { label: 'code', href: 'https://github.com/Andreavilaro0/civicaid-voice' },
    ],
  },
  {
    id: 'photo',
    num: '02',
    color: '#00E5FF',
    title: 'CAPTURING MOMENTS',
    subtitle: 'Photography',
    desc: 'Portfolio editorial de street photography con diseño responsive, animaciones scroll-based y galería dinámica. Proyecto personal de diseño visual y frontend.',
    context: '',
    highlights: [
      'Diseño y desarrollo completo',
      'GSAP scroll animations',
    ],
    tags: ['HTML/CSS', 'JavaScript', 'GSAP'],
    links: [
      { label: 'view', href: 'https://andreavilaro0.github.io/plantilla/' },
    ],
  },
  {
    id: 'robotics',
    num: '03',
    color: '#00E5FF',
    title: 'ASTI ROBOTICS',
    subtitle: 'Zumo 32U4',
    desc: 'Robot autónomo Zumo 32U4 para competencia nacional. Programé el software completo: navegación, sensores y estrategia de competencia.',
    context: '',
    highlights: [
      'Finalista nacional — ASTI Robotics Challenge',
      'Software del robot completo en C++',
      '50+ equipos universitarios participantes',
    ],
    tags: ['C++', 'Arduino'],
    links: [
      { label: 'info', href: 'https://www.udit.es/proyectos-de-exito/tres-nuevos-equipos-de-estudiantes-de-udit-se-clasifican-para-la-final-del-asti-robotics-challenge/' },
    ],
  },
  {
    id: 'todo',
    num: '04',
    color: '#00E5FF',
    title: 'TASK DASHBOARD',
    subtitle: 'Productivity App',
    desc: 'Dashboard de tareas con widgets interactivos: mapa, calendario, estados, prioridades y filtros. Sprint de Frontend I en UDIT.',
    context: 'Sprint 6 — Frontend I, UDIT Madrid',
    highlights: [
      'Dashboard con widgets dinámicos',
      'Mapa interactivo integrado',
      'Filtros por estado y prioridad',
    ],
    tags: ['JavaScript', 'HTML', 'CSS'],
    links: [
      { label: 'demo', href: 'https://andreavilaro0.github.io/todo-list-dashboard/' },
      { label: 'code', href: 'https://github.com/Andreavilaro0/todo-list-dashboard' },
    ],
  },
  {
    id: 'os',
    num: '05',
    color: '#7B2FFF',
    title: 'KERNEL SIM',
    subtitle: 'OS Simulation',
    desc: 'Simulador de sistema operativo con gestión de procesos y memoria. Implementa FIFO, SJF y Round Robin compitiendo en tiempo real con visualización.',
    context: '',
    highlights: [
      'Simulación completa de scheduling',
      'Visualización en tiempo real',
    ],
    tags: ['C', 'Sistemas'],
    links: [
      { label: 'code', href: 'https://github.com/gabrielcclv/SistemasOperativos' },
    ],
  },
]
