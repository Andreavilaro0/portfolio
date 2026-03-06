export interface Ingredient {
  amount: string
  name: string
}

export interface MethodStep {
  title: string
  description: string
  tip?: string
}

export interface TastingNote {
  label: string
  text: string
}

export interface Recipe {
  slug: string
  title: string
  category: string
  difficulty: number // 1-5
  prepTime: string
  serves: string
  tags: string[]
  chefNote: string
  thumbnail: string
  heroImage: string
  ingredients: Ingredient[]
  method: MethodStep[]
  tastingNotes: TastingNote[]
}

export const recipes: Recipe[] = [
  {
    slug: 'clara-civicaid-voice',
    title: 'Clara CivicAid Voice',
    category: 'AI & Civic Tech',
    difficulty: 5,
    prepTime: '48 hours (hackathon)',
    serves: '200+ citizens',
    tags: ['AI', 'Voice UX', 'Civic Tech'],
    chefNote: 'Built under pressure. Best things always are.',
    thumbnail: '/images/projects/clara-thumb.webp',
    heroImage: '/images/projects/clara-hero.webp',
    ingredients: [
      { amount: '2 cups', name: 'React 19 (with Server Components, freshly compiled)' },
      { amount: '1 tbsp', name: 'Framer Motion (for the waveform garnish)' },
      { amount: '500ml', name: 'ElevenLabs SDK (speech-to-text, room temperature)' },
      { amount: '1 generous portion', name: 'Gemini Pro (intent classification, finely tuned)' },
      { amount: 'A pinch of', name: 'Tailwind v4 (to taste)' },
      { amount: 'Zest of', name: 'Vercel (for deployment freshness)' },
    ],
    method: [
      {
        title: 'Prep the voice pipeline (Day 1, 6 hours)',
        description:
          'Set up the ElevenLabs SDK for real-time speech capture. Configure chunked audio streaming to avoid latency spikes.',
        tip: 'ElevenLabs buffers 250ms by default. We reduced it to 100ms for snappier feedback, but test on slow connections.',
      },
      {
        title: 'Fold in the classification layer (Day 1, 8 hours)',
        description:
          "Wire Gemini Pro to receive transcribed text and return a category: infrastructure, safety, environment, services. Fine-tuned the prompt with 50 real civic complaints from Madrid's open data portal.",
      },
      {
        title: 'Build the waveform visualizer (Day 2, 4 hours)',
        description:
          'Used Framer Motion to animate an SVG waveform that responds to audio input amplitude. Skeleton waveform shows during ElevenLabs processing lag — users never see a blank screen.',
      },
      {
        title: 'Season with Tailwind and serve (Day 2, 6 hours)',
        description:
          'Responsive layout, dark/light toggle, OG meta tags. Final Lighthouse: 96 performance, 100 accessibility.',
      },
      {
        title: 'Plate and present (Day 2, final hours)',
        description:
          'Live demo to judges. 200+ complaints processed. Voice-first UX praised as "intuitive and humane."',
      },
    ],
    tastingNotes: [
      {
        label: 'Flavor profile',
        text: 'Warm and accessible. The voice interface removes friction — users speak naturally, no forms.',
      },
      {
        label: 'Texture',
        text: 'Smooth real-time response. The waveform gives constant visual feedback. No dead air.',
      },
      {
        label: 'Finish',
        text: 'A lasting impression. Judges said: "This is what civic tech should feel like." First place.',
      },
    ],
  },
  {
    slug: 'asti-robotics',
    title: 'ASTI Robotics',
    category: '3D & Robotics',
    difficulty: 4,
    prepTime: '3 weeks',
    serves: 'Competition judges + industry panel',
    tags: ['Three.js', 'Robotics', '3D Visualization'],
    chefNote: 'Where code meets the physical world.',
    thumbnail: '/images/projects/asti-thumb.webp',
    heroImage: '/images/projects/asti-hero.webp',
    ingredients: [
      { amount: '3 cups', name: 'Three.js (spatial rendering, slow-roasted)' },
      { amount: '1 cup', name: 'React 19 (component architecture)' },
      { amount: '2 tbsp', name: 'Framer Motion (UI transitions)' },
      { amount: 'A dash of', name: 'Python (backend processing)' },
      { amount: 'To taste', name: 'Tailwind v4 (responsive styling)' },
    ],
    method: [
      {
        title: 'Research the domain (Week 1)',
        description: 'Deep dive into ASTI robotics workflows, warehouse automation, and 3D visualization requirements.',
      },
      {
        title: 'Build the 3D scene (Week 2)',
        description: 'Construct the Three.js environment with robot arm models, path visualization, and interactive camera controls.',
      },
      {
        title: 'Polish and present (Week 3)',
        description: 'Fine-tune animations, optimize for mobile, prepare demo for competition judges.',
      },
    ],
    tastingNotes: [
      { label: 'Flavor profile', text: 'Technical depth with visual clarity. Complex systems made tangible.' },
      { label: 'Texture', text: 'Smooth 60fps rendering. Interactive without overwhelming.' },
      { label: 'Finish', text: 'Finalist. Judges praised the bridge between engineering and visual storytelling.' },
    ],
  },
  {
    slug: 'capturing-moments',
    title: 'Capturing Moments',
    category: 'Photography & Web',
    difficulty: 3,
    prepTime: '2 weeks',
    serves: 'Photography community',
    tags: ['Photography', 'Gallery', 'Performance'],
    chefNote: 'Sometimes the simplest dishes are the hardest to perfect.',
    thumbnail: '/images/projects/moments-thumb.webp',
    heroImage: '/images/projects/moments-hero.webp',
    ingredients: [
      { amount: '2 cups', name: 'React 19 (gallery architecture)' },
      { amount: '1 cup', name: 'Next.js (image optimization, SSR)' },
      { amount: 'A generous pour of', name: 'CSS Grid (masonry layout)' },
      { amount: 'Garnish with', name: 'Framer Motion (subtle transitions)' },
    ],
    method: [
      {
        title: 'Design the gallery system (Week 1)',
        description: 'Masonry grid layout with lazy loading, blurhash placeholders, and responsive breakpoints.',
      },
      {
        title: 'Optimize for speed (Week 2)',
        description: 'WebP/AVIF conversion, srcset for responsive images, skeleton loading states. Target: sub-2s LCP.',
      },
    ],
    tastingNotes: [
      { label: 'Flavor profile', text: 'Clean and fast. The images are the hero — the UI gets out of the way.' },
      { label: 'Texture', text: 'Buttery smooth scrolling. Images load progressively, no layout shift.' },
      { label: 'Finish', text: 'Lighthouse 98. Proof that performance is a feature.' },
    ],
  },
  {
    slug: 'os-simulation',
    title: 'OS Simulation',
    category: 'Systems & UI',
    difficulty: 4,
    prepTime: '4 weeks',
    serves: 'CS students + professors',
    tags: ['Systems', 'OS', 'Simulation', 'Education'],
    chefNote: 'Understanding the machine by rebuilding it.',
    thumbnail: '/images/projects/os-thumb.webp',
    heroImage: '/images/projects/os-hero.webp',
    ingredients: [
      { amount: '3 cups', name: 'Python (process scheduling, memory management)' },
      { amount: '1 cup', name: 'React 19 (visualization dashboard)' },
      { amount: '2 tbsp', name: 'Node.js (backend simulation engine)' },
      { amount: 'A pinch of', name: 'Tailwind v4 (dashboard styling)' },
    ],
    method: [
      {
        title: 'Build the kernel simulator (Week 1-2)',
        description: 'Process scheduling algorithms (FIFO, SJF, Round Robin), memory allocation, and deadlock detection.',
      },
      {
        title: 'Create the visual dashboard (Week 3)',
        description: 'Real-time visualization of process queues, memory maps, and CPU utilization graphs.',
      },
      {
        title: 'Test and document (Week 4)',
        description: 'Edge cases, documentation for CS coursework, and interactive tutorial mode.',
      },
    ],
    tastingNotes: [
      { label: 'Flavor profile', text: 'Educational and interactive. Abstract concepts become visible and manipulable.' },
      { label: 'Texture', text: 'Real-time updates. Watch processes compete for resources in slow motion.' },
      { label: 'Finish', text: 'Used as a teaching tool. Proof that the best way to learn systems is to build them.' },
    ],
  },
]
