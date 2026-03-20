# Plan de Ejecución y Validación — Portfolio 3D Interactivo

**Fecha:** 2026-03-19
**Estado del proyecto:** Producción funcional (10/10 UX criteria pass)
**Stack:** Next.js 16 + R3F + Three.js + GSAP + Tailwind v4
**Modelo actual:** Desk scene con cámara seated, overlay DOM en monitor + arcade en MacBook

---

## NOTA CRÍTICA: Calibración con realidad

El proyecto NO es un concepto hipotético. Ya existe un portfolio funcional con:
- Escena 3D de escritorio (desk-scene-clean.glb, 3.1MB)
- Sistema de cámara: loading → intro (cinematic) → seated → macbook
- Portfolio en monitor (DOM overlay proyectado desde coordenadas 3D)
- Arcade en MacBook (iframe con juegos: Snake, Breakout, Pong, Tetris)
- Fallback mobile a PortfolioContent 2D
- Playwright tests pasando
- Sentry integrado

Este plan NO diseña desde cero. Evalúa lo que existe, identifica gaps, y define la ruta de validación y mejora disciplinada.

---

## 1. REPLANTEAMIENTO ESTRATÉGICO INICIAL

### 1.1 Estado actual vs concepto original

| Elemento del concepto original | Estado actual | Evaluación |
|---|---|---|
| Entorno 3D interactivo | ✅ Implementado (desk scene) | Funciona. No es mundo abierto — es escena contenida. Decisión correcta. |
| Primera persona | ❌ No implementado | Correctamente descartado. La cámara seated simula perspectiva sin controles FPS. |
| Portfolio visible dentro del espacio | ✅ Implementado (DOM overlay en monitor) | Funciona técnicamente. Requiere validación de legibilidad y UX real. |
| Contenido profesional real | ⚠️ Parcial | 4 proyectos cargados. Falta profundidad (case studies), CV, about completo. |
| Demos/minijuegos | ✅ Implementado (arcade en MacBook) | Snake, Breakout, Pong, Tetris. Requiere validación de percepción profesional. |
| Segunda pantalla | ✅ Implementado (MacBook = arcade) | Funciona como concepto dual monitor/macbook. Requiere validación de valor. |

### 1.2 Núcleo validable

Lo que ya funciona y debe validarse con usuarios reales:

1. **Primera impresión del hero 3D** — ¿comunica profesionalidad + creatividad en < 5 segundos?
2. **Legibilidad del portfolio en monitor** — ¿se puede leer y navegar el contenido en ~520×380px?
3. **Findability** — ¿el usuario encuentra proyectos, about y contacto sin fricción?
4. **Percepción profesional** — ¿hiring managers ven esto como portfolio serio o como juguete?
5. **Performance en hardware real** — ¿funciona en laptops corporativas con GPU integrada?

### 1.3 Hipótesis a comprobar

| ID | Hipótesis | Riesgo si es falsa | Cómo validar |
|---|---|---|---|
| H1 | La desk scene comunica "creative developer" en < 5 segundos | El portfolio no cumple diferenciación | Test de 5 segundos con mockup/screenshot |
| H2 | El contenido del monitor es legible y navegable | El usuario no puede evaluar tu trabajo | Prueba de tareas: "encuentra el proyecto de IA" |
| H3 | El arcade no reduce percepción profesional | Los juegos hacen que parezca hobby, no portfolio | Encuesta A/B: con arcade vs sin arcade |
| H4 | La transición seated→macbook es intuitiva | El usuario no descubre el arcade o se confunde | Observación: ¿encuentran el botón? ¿vuelven? |
| H5 | El portfolio funciona en Intel HD Graphics a 30fps+ | Excluyes recruiters con hardware modesto | Test de performance en hardware real |
| H6 | El contenido es suficiente para evaluar candidatura | El portfolio impresiona visualmente pero no informa | Prueba: "¿contratarías a esta persona? ¿para qué?" |
| H7 | El fallback mobile es competitivo con portfolios 2D | Mobile users tienen experiencia inferior | Comparativa: mobile fallback vs portfolio 2D de referencia |

### 1.4 Riesgos altos

| Riesgo | Severidad | Estado actual |
|---|---|---|
| Portfolio en monitor demasiado pequeño para leer case studies | Crítica | El viewport es ~520×380px. Insuficiente para contenido denso. |
| Arcade percibido como gimmick por hiring managers | Alta | No validado. 4 juegos genéricos sin relación con perfil profesional. |
| Contenido profesional insuficiente | Crítica | No hay case studies, no hay CV descargable, about es superficial. |
| Performance en hardware modesto | Alta | No testeado fuera de MacBook de desarrollo. |
| Accesibilidad rota | Crítica | Canvas opaco, no hay skip-to-content, no hay reduced-motion, no hay nav por teclado. |
| SEO inexistente | Alta | Todo vive en canvas + overlays. No hay HTML semántico indexable. |

### 1.5 Componentes que deben retrasarse

| Componente | Por qué retrasar |
|---|---|
| Easter eggs (Konami code, F1 car) | Pulido cosmético. Inútil si el contenido base no funciona. |
| HDRI environment / background premium | Mejora visual que no resuelve ningún gap funcional. |
| Personalización de labels de objetos | Nice-to-have. No afecta empleabilidad. |
| Loading screen con branding | Secundario hasta validar que la experiencia post-carga funciona. |

### 1.6 Versión mínima validable (MVP de validación)

**Lo que debe existir antes de cualquier test con usuarios:**

1. Contenido profesional completo en el monitor (about real, proyectos con contexto, contacto visible, CV link)
2. Fallback 2D accesible (skip-to-content, HTML semántico, funciona sin JS/WebGL)
3. Nav persistente o mecanismo claro para acceder a secciones sin explorar
4. Performance medida en al menos 3 dispositivos reales (1 laptop modesta)

---

## 2. ORDEN DE VALIDACIÓN

### Secuencia óptima de validación (reduce riesgo máximo primero)

```
PASO 1: Contenido profesional
   ¿Hay suficiente contenido para evaluar candidatura?
   → Si NO: no importa cuán bueno sea el 3D, el portfolio falla.

PASO 2: Claridad y comprensión
   ¿En 5 segundos se entiende quién eres y qué haces?
   → Si NO: rediseñar hero/intro antes de seguir.

PASO 3: Findability / Arquitectura de información
   ¿El usuario encuentra Work, About, Contact en < 2 clics?
   → Si NO: añadir navegación 2D persistente.

PASO 4: Legibilidad del contenido en monitor
   ¿Se puede leer y evaluar el trabajo dentro del overlay de 520×380px?
   → Si NO: rediseñar cómo se presenta el contenido (expandir overlay, abrir en 2D, etc.)

PASO 5: Percepción profesional
   ¿Hiring managers lo ven como portfolio serio?
   → Si NO: simplificar, eliminar arcade, reducir espectáculo.

PASO 6: Performance
   ¿Funciona a 30fps+ en hardware modesto?
   → Si NO: reducir escena, eliminar post-processing, simplificar.

PASO 7: Accesibilidad
   ¿Funciona con teclado, screen reader, reduced-motion?
   → Si NO: implementar capa accesible antes de lanzar.

PASO 8: Valor del arcade/experiments
   ¿El arcade suma o resta?
   → Si RESTA: eliminarlo o reemplazarlo con demos relevantes.

PASO 9: Mobile
   ¿El fallback mobile es competitivo?
   → Si NO: mejorar PortfolioContent como portfolio 2D de primera clase.

PASO 10: Memorabilidad + diferenciación
   ¿Se recuerda el trabajo, no solo la experiencia?
   → Si solo se recuerda el 3D: rebalancear prominencia contenido vs escena.
```

**Por qué este orden:**
- Pasos 1-3 son prerrequisitos funcionales. Si fallan, nada más importa.
- Pasos 4-5 validan si el formato elegido (3D + overlay) funciona para la audiencia real.
- Pasos 6-7 son requisitos técnicos que pueden matar el proyecto si se ignoran.
- Pasos 8-10 son optimización — solo valen la pena si 1-7 pasan.

---

## 3. PLAN POR FASES

### FASE 0: Auditoría y alineación estratégica

**Objetivo:** Evaluar honestamente el estado actual y definir qué gaps son críticos.

**Preguntas que responde:**
- ¿El contenido actual es suficiente para un portfolio profesional real?
- ¿Qué falta para que un hiring manager pueda evaluar candidatura?
- ¿Hay deuda de accesibilidad que bloquea lanzamiento?

**Entregables:**
- [ ] Inventario de contenido actual vs contenido necesario
- [ ] Lista de gaps de accesibilidad (audit manual)
- [ ] Medición de performance en 3 dispositivos reales
- [ ] Screenshot del portfolio en monitor a tamaño real → ¿es legible?
- [ ] Mapa de hipótesis (H1-H7 de sección 1.3)

**Hipótesis:** El proyecto está más cerca de lo que parece de ser validable, pero tiene gaps de contenido críticos.

**Riesgos que ataca:** Construir sobre una base incompleta. Validar features avanzadas cuando lo básico falta.

**Métodos de validación:**
- Auto-revisión con checklist (ver sección 7)
- Medición de FPS con `performance.now()` en 3 dispositivos
- Lectura del monitor overlay en pantalla real (no dev tools)

**Métricas:**
- Número de gaps de contenido identificados
- FPS en dispositivo más débil disponible
- Tamaño real del texto en monitor overlay (px)

**Criterios de éxito:** Gaps identificados, plan de contenido definido, performance baseline establecida.

**Criterios de fracaso:** N/A — esta fase es diagnóstica. Fracasa si no produce un inventario honesto.

**Decision gate → Fase 1:**
- ✅ Inventario completo existe
- ✅ Se sabe qué contenido falta
- ✅ Se tiene baseline de FPS

---

### FASE 1: Contenido profesional completo

**Objetivo:** Llenar el portfolio con contenido real suficiente para evaluación profesional.

**Preguntas que responde:**
- ¿Un hiring manager puede evaluar mi candidatura con este contenido?
- ¿Mi especialidad queda clara?
- ¿Hay forma de contactarme y ver mi CV?

**Entregables:**
- [ ] About completo: bio, especialidad, trayectoria, skills, idiomas
- [ ] 3-4 proyectos con contexto: problema, solución, rol, resultado, tech
- [ ] CV/resume descargable (link a PDF)
- [ ] Contacto visible: email, LinkedIn, GitHub
- [ ] Contenido escrito en inglés + español (o decisión de idioma)

**Hipótesis:** H6 — El contenido es suficiente para evaluar candidatura.

**Riesgos que ataca:** El portfolio impresiona visualmente pero no informa.

**Métodos de validación:**
- Peer review: 2-3 personas del sector leen solo el contenido (sin 3D) y evalúan
- Checklist de contenido mínimo de portfolio profesional

**Métricas:**
- ¿Puede alguien describir qué haces después de leer el contenido? (Sí/No)
- ¿Puede alguien nombrar 2+ proyectos y su contexto? (Sí/No)
- ¿Hay CTA de contacto visible? (Sí/No)

**Criterios de éxito:** 3/3 personas del peer review pueden describir especialidad + nombrar proyectos.

**Criterios de fracaso:** El contenido es demasiado superficial para evaluar candidatura.

**Decision gate → Fase 2:**
- ✅ Contenido revisado por al menos 2 personas
- ✅ About, Work (con contexto), Contact, CV link existen
- 🚫 Bloqueante: si el contenido no comunica especialidad, no avanzar a validación de formato

---

### FASE 2: Navegación y findability

**Objetivo:** Garantizar que el usuario encuentra todo el contenido sin fricción.

**Preguntas que responde:**
- ¿El usuario sabe que hay contenido disponible sin tener que descubrirlo?
- ¿Puede llegar a Work, About, Contact desde cualquier punto?
- ¿Hay indicación de qué secciones existen?

**Entregables:**
- [ ] Nav persistente o mecanismo de acceso directo a secciones
- [ ] Indicadores claros de contenido disponible (dentro del monitor overlay)
- [ ] Wireframe/mockup de la nav propuesta
- [ ] First-click test con 5+ personas

**Hipótesis:** El usuario puede encontrar proyectos en < 2 interacciones.

**Riesgos que ataca:**
- El usuario no sabe que hay contenido scrollable en el monitor
- No hay forma de ir directamente a una sección
- El botón "Arcade" es más visible que el contenido profesional

**Métodos de validación:**
- First-click test: "¿Dónde harías clic para ver proyectos de esta persona?"
- Observación: ¿el usuario scrollea el monitor sin que se lo digan?

**Métricas:**
- % first-click correcto para encontrar Work: target > 80%
- % que encuentra Contact sin ayuda: target > 90%
- Tiempo hasta primer proyecto: target < 15 segundos post-carga

**Criterios de éxito:** > 80% encuentran Work al primer intento.

**Criterios de fracaso:** < 50% encuentran Work → requiere nav 2D fuera del monitor.

**Decision gate → Fase 3:**
- ✅ First-click test pasado
- ✅ Nav implementada o validada como innecesaria
- 🚫 Si findability falla: implementar nav HTML persistente FUERA del canvas antes de continuar

---

### FASE 3: Legibilidad y UX del contenido en monitor

**Objetivo:** Validar que el contenido dentro del overlay de monitor es legible, navegable y útil.

**Preguntas que responde:**
- ¿Se puede leer texto a 14px dentro de un overlay de ~520×380px?
- ¿El scroll dentro del overlay es intuitivo?
- ¿Los case studies (si existen) se pueden evaluar a esa escala?
- ¿El contraste es suficiente?

**Entregables:**
- [ ] Medición de tamaño de texto real en pantallas de 1080p y 1440p
- [ ] Test de lectura con 5+ personas
- [ ] Decisión: ¿el contenido detallado vive dentro del overlay o se abre en vista expandida?
- [ ] Prototipo de vista expandida si es necesaria

**Hipótesis:** H2 — El contenido del monitor es legible y navegable.

**Riesgos que ataca:**
- Texto demasiado pequeño para lectura sostenida
- Scroll dentro del overlay no es descubrible
- Case studies no caben en el formato
- El overlay compite con la escena 3D por atención visual

**Métodos de validación:**
- Prueba de tareas: "Lee el proyecto CLARA y dime qué tecnologías usa"
- Medición de tiempo de lectura vs portfolio 2D equivalente
- Encuesta: "¿Fue fácil leer el contenido?" (escala 1-7)

**Métricas:**
- Tasa de éxito en tarea de lectura: target > 90%
- Facilidad de lectura percibida: target > 5/7
- Tiempo de lectura vs 2D baseline: no más de 1.5x

**Criterios de éxito:** Contenido legible sin esfuerzo perceptible.

**Criterios de fracaso:** Usuarios reportan dificultad para leer o tardan > 2x vs 2D.

**Si falla — opciones:**
1. Expandir overlay a pantalla casi completa al hacer clic en proyecto
2. Abrir case studies en ruta 2D (/projects/clara) fuera del canvas
3. Aumentar tamaño mínimo del overlay

**Decision gate → Fase 4:**
- ✅ Legibilidad validada O solución de expansión implementada
- ✅ Patrón de contenido detallado decidido (inline vs expandido vs ruta 2D)
- 🚫 No avanzar si el contenido no se puede leer cómodamente

---

### FASE 4: Percepción profesional y valor del formato

**Objetivo:** Validar que el formato 3D + overlay genera percepción profesional positiva.

**Preguntas que responde:**
- ¿Hiring managers ven esto como portfolio serio?
- ¿El 3D suma o distrae?
- ¿El arcade resta profesionalidad?
- ¿Se recuerda el trabajo o solo la experiencia?

**Entregables:**
- [ ] Encuesta con 8-12 personas del sector (mix: recruiters, hiring managers, devs, diseñadores)
- [ ] Test A/B informal: versión con arcade vs sin arcade
- [ ] Test de recuerdo: "¿Qué proyectos viste?" a las 24 horas
- [ ] Scorecard de percepción

**Hipótesis:** H1, H3, H5 — El formato comunica creatividad sin sacrificar profesionalidad.

**Riesgos que ataca:**
- FM-01: Se recuerda la experiencia más que el trabajo
- FM-04: Parece amateur
- FM-06: Los minijuegos bajan la señal profesional

**Métodos de validación:**
- Encuesta estructurada (ver sección 5 para preguntas)
- Test A/B: grupo A ve portfolio completo, grupo B ve versión sin arcade
- Entrevista corta post-visita: "¿Contratarías a esta persona? ¿Para qué rol?"

**Métricas:**
- Profesionalidad percibida: target > 5/7
- Creatividad percibida: target > 5/7
- "¿Contactarías a esta persona?": target > 60% sí
- Recuerdo de proyectos a 24h: target > 50% nombra al menos 1

**Criterios de éxito:** Profesionalidad > 5/7 Y creatividad > 5/7 Y recuerdo de proyectos > 50%.

**Criterios de fracaso:**
- Profesionalidad < 4/7 → Simplificar drásticamente el 3D
- Recuerdo de proyectos < 30% → El 3D domina, rebalancear
- Arcade reduce profesionalidad significativamente → Eliminar arcade

**Decision gate → Fase 5:**
- ✅ Percepción profesional validada positivamente
- ✅ Decisión sobre arcade: mantener / modificar / eliminar
- 🚫 Si profesionalidad < 4/7: parar y rediseñar antes de continuar

---

## 4. GATES DE AVANCE ENTRE FASES

### Gate 0→1: Auditoría completa

| Criterio | Evidencia requerida | Bloquea si |
|---|---|---|
| Inventario de contenido | Documento con gaps listados | No se ha hecho inventario |
| FPS baseline | Medición en al menos 1 dispositivo no-dev | No se tiene baseline |
| Screenshot legibilidad | Captura real del overlay a tamaño real | No se ha verificado |

### Gate 1→2: Contenido suficiente

| Criterio | Evidencia requerida | Bloquea si |
|---|---|---|
| About completo | Texto revisado por 2 personas | About ausente o superficial |
| 3+ proyectos con contexto | Problema, solución, rol, resultado, tech | Proyectos sin contexto profesional |
| Contacto + CV | Link funcional a PDF + email visible | No hay forma de contactar |
| Peer review positivo | 2/3 personas pueden describir especialidad | Contenido no comunica perfil |

### Gate 2→3: Findability validada

| Criterio | Evidencia requerida | Bloquea si |
|---|---|---|
| First-click test | > 80% encuentra Work al primer intento | < 60% encuentra Work |
| Nav funcional | Mecanismo de acceso directo existe | Solo se puede scrollear sin indicador |

### Gate 3→4: Legibilidad validada

| Criterio | Evidencia requerida | Bloquea si |
|---|---|---|
| Test de lectura | > 90% completa tarea de lectura | < 70% completa tarea |
| Facilidad percibida | > 5/7 en encuesta | < 4/7 en encuesta |
| Decisión de patrón | Inline / expandido / ruta 2D decidido | Sin decisión sobre contenido detallado |

### Gate 4→5: Percepción profesional positiva

| Criterio | Evidencia requerida | Bloquea si |
|---|---|---|
| Profesionalidad | > 5/7 con 8+ evaluadores | < 4/7 → rediseñar |
| Recuerdo de trabajo | > 50% nombra 1+ proyecto | < 30% → rebalancear |
| Decisión arcade | Mantener/modificar/eliminar decidido | Sin decisión basada en datos |

### Gates específicos para features de alto riesgo

**Primera persona libre:**
- Estado: NO implementada. Correctamente descartada.
- Gate: NO reintroducir a menos que exista evidencia de que el formato seated es insuficiente para la audiencia técnica/creativa Y que se puede implementar como modo opcional sin romper accesibilidad.
- Evidencia necesaria para considerar: > 30% de usuarios técnicos piden explícitamente poder explorar la escena libremente.

**Arcade / minijuegos:**
- Estado: Implementado (4 juegos genéricos en MacBook).
- Gate: Resultado de test A/B en Fase 4.
- Eliminar si: profesionalidad con arcade < profesionalidad sin arcade por > 1 punto en escala 1-7.
- Modificar si: profesionalidad similar pero juegos son irrelevantes → reemplazar con demos técnicas relevantes.
- Mantener si: profesionalidad similar o mejor + usuarios técnicos lo valoran.

**Portfolio embebido en monitor 3D:**
- Estado: Implementado como overlay DOM.
- Gate: Resultado de test de legibilidad en Fase 3.
- Eliminar overlay si: legibilidad < 4/7 Y ninguna variante de tamaño lo resuelve.
- Expandir si: legibilidad mejora significativamente al agrandar el overlay.
- Sacar a 2D si: el contenido detallado necesita más espacio del que el overlay puede dar.

**Versión mobile:**
- Estado: Fallback 2D (PortfolioContent) existe.
- Gate: No lanzar sin validar que el fallback mobile es competitivo con un portfolio 2D estándar.
- Evidencia: comparativa lado a lado con 3 portfolios 2D de referencia.

**Overlays de contenido sobre canvas:**
- Estado: Funcionando con clampRect y cross-fade.
- Gate: Conocido bug con drei Html transform (documentado en memory). Validar estabilidad en resize, zoom y diferentes resoluciones.
- Bloquea launch si: overlay se desalinea en > 10% de viewports comunes.

---

## 5. SISTEMA DE VALIDACIÓN UX

### 5.1 Test de 5 segundos

| Campo | Detalle |
|---|---|
| **Objetivo** | Validar que la primera impresión comunica identidad y propósito |
| **Cuándo** | Fase 0 (con screenshot) y Fase 4 (con prototipo funcional) |
| **Muestra** | 20-30 personas (mix: técnicos, no-técnicos, recruiters si es posible) |
| **Método** | Mostrar screenshot o grabación de 5 segundos del hero. Ocultar. Preguntar. |
| **Preguntas** | 1. ¿Qué hace esta persona? 2. ¿Es un portfolio? 3. ¿Qué recuerdas? 4. ¿Qué palabra describe el tono? |
| **Señales de éxito** | > 80% identifica "portfolio" o "developer". > 60% menciona alguna especialidad. |
| **Señales de fracaso** | < 50% identifica propósito. Respuestas tipo "un juego", "una demo", "no sé". |
| **Herramientas** | UsabilityHub/Maze (remoto) o Google Forms con imagen embebida. |

### 5.2 First-click testing

| Campo | Detalle |
|---|---|
| **Objetivo** | Validar que los usuarios encuentran secciones clave al primer intento |
| **Cuándo** | Fase 2 (findability) |
| **Muestra** | 15-20 personas |
| **Método** | Mostrar screenshot/mockup. Preguntar: "¿Dónde harías clic para [tarea]?" |
| **Tareas** | 1. Ver proyectos. 2. Contactar. 3. Saber más sobre esta persona. 4. Descargar CV. |
| **Señales de éxito** | > 85% acierta en proyectos. > 90% acierta en contacto. |
| **Señales de fracaso** | < 60% acierta en cualquier tarea → nav o layout necesita rediseño. |

### 5.3 Pruebas de tareas (moderadas)

| Campo | Detalle |
|---|---|
| **Objetivo** | Validar que usuarios completan tareas reales en el portfolio funcional |
| **Cuándo** | Fase 3 (legibilidad) y Fase 4 (percepción) |
| **Muestra** | 5-8 personas por ronda |
| **Método** | Compartir pantalla o sesión presencial. Dar tareas. Observar. |
| **Tareas** | T1: "Dime qué hace esta persona" (< 10s). T2: "Encuentra un proyecto de IA" (< 20s). T3: "¿Qué tecnologías usa?" (< 30s). T4: "Encuentra cómo contactarla" (< 15s). T5: "Descarga su CV" (< 15s). T6: "Vuelve a la lista de proyectos" (< 10s). |
| **Señales a observar** | Hesitación, clics erróneos, scrolleo perdido, preguntas al facilitador, frustración verbal, abandono de tarea. |
| **Métricas** | Task success rate (target > 90%). Time on task. Error rate. |
| **Señales de fracaso** | Success rate < 70% en cualquier tarea → bloquea avance. |

### 5.4 Evaluación heurística

| Campo | Detalle |
|---|---|
| **Objetivo** | Identificar violaciones de usabilidad antes de testear con usuarios |
| **Cuándo** | Final de Fase 1, antes de cada ronda de testing |
| **Muestra** | 3-5 evaluadores (pueden ser peers con conocimiento UX) |
| **Método** | Cada evaluador recorre el portfolio y documenta violaciones usando las 10 heurísticas de Nielsen |
| **Formato de reporte** | Heurística violada + descripción + ubicación + severidad (0-4) |
| **Señales de acción** | Severidad 3-4: corregir antes de testing con usuarios. Severidad 1-2: backlog. |

### 5.5 Accessibility review

| Campo | Detalle |
|---|---|
| **Objetivo** | Verificar que el portfolio no excluye usuarios |
| **Cuándo** | Fase 5 (dedicada) + verificación en cada fase |
| **Método** | Combinación de herramienta automática + revisión manual |
| **Checklist mínimo** | 1. Navegar todo el portfolio solo con teclado. 2. Activar `prefers-reduced-motion` → ¿respeta? 3. Usar VoiceOver/NVDA en la versión HTML. 4. Verificar contraste de todo texto (ratio ≥ 4.5:1). 5. ¿Existe skip-to-content? 6. ¿Existe versión funcional sin WebGL? 7. ¿Focus es visible en elementos interactivos? 8. ¿Hay alt text en imágenes? |
| **Herramientas** | axe DevTools, Lighthouse accessibility, manual keyboard testing |
| **Criterio de pase** | 0 issues críticos. < 3 issues serios. |

### 5.6 Test de percepción profesional

| Campo | Detalle |
|---|---|
| **Objetivo** | Medir si el formato genera confianza profesional |
| **Cuándo** | Fase 4 |
| **Muestra** | 8-12 personas (priorizar hiring managers y recruiters reales) |
| **Método** | Visita libre de 2 minutos → encuesta |
| **Preguntas (escala 1-7)** | 1. ¿Qué tan profesional se ve este portfolio? 2. ¿Qué tan creativo? 3. ¿Contactarías a esta persona para un rol técnico? 4. ¿El formato ayuda o distrae de entender su trabajo? 5. ¿Qué recuerdas? (abierta) |
| **Señales de éxito** | Profesionalidad > 5/7. Creatividad > 5/7. > 60% contactaría. |
| **Señales de fracaso** | Profesionalidad < 4/7. Comentarios tipo "parece juego". |

### 5.7 Test de memorabilidad

| Campo | Detalle |
|---|---|
| **Objetivo** | Verificar que se recuerda el TRABAJO, no solo la experiencia |
| **Cuándo** | Fase 4, 24 horas después de visita |
| **Muestra** | Mismas personas del test de percepción |
| **Método** | Mensaje a las 24h: "¿Qué recuerdas del portfolio que viste ayer?" |
| **Señales de éxito** | > 50% nombra al menos 1 proyecto específico |
| **Señales de fracaso** | > 70% solo recuerda "el 3D" o "los juegos" sin nombrar trabajo |

### 5.8 Performance testing

| Campo | Detalle |
|---|---|
| **Objetivo** | Garantizar que la experiencia funciona en hardware real |
| **Cuándo** | Fase 5 (dedicada) + smoke test en cada fase |
| **Método** | Cargar en dispositivos reales + medir con herramientas |
| **Dispositivos mínimos** | 1. MacBook de desarrollo (baseline). 2. Laptop con GPU integrada (Intel/AMD). 3. Laptop Windows gama media. 4. iPhone (Safari). 5. Android gama media. |
| **Métricas** | FPS (target > 30 P75). LCP (< 2.5s). TBT (< 200ms). Bundle size. GLB load time. |
| **Herramientas** | Chrome DevTools Performance, web-vitals, `performance.now()` custom, Lighthouse |
| **Criterio de pase** | FPS > 30 en todos los desktops. LCP < 3s en 4G. Mobile fallback funcional. |

---

## 6. SISTEMA DE QA Y DETECCIÓN DE ERRORES

### 6.1 Categorías de errores

| ID | Categoría | Cómo detectar | Cómo medir | Severidad | Impacto | Solución tipo |
|---|---|---|---|---|---|---|
| QA-01 | **Usuario no entiende qué hacer** | Test de tareas: usuario se queda inmóvil > 10s | % usuarios que necesitan ayuda para empezar | Crítica | Abandono inmediato | Añadir indicadores visuales, CTA explícito |
| QA-02 | **No encuentra proyectos** | First-click test falla < 60% | Task success rate para T2 | Crítica | Portfolio no cumple función | Implementar nav 2D persistente |
| QA-03 | **No entiende quién soy** | Test de 5 seg: < 50% identifica profesión | % respuestas correctas | Crítica | No genera interés | Texto de identidad más prominente |
| QA-04 | **Parece juego, no portfolio** | Encuesta: profesionalidad < 4/7 | Escala percepción profesional | Alta | Pierde oportunidades de contratación | Reducir/eliminar arcade, simplificar 3D |
| QA-05 | **Motion excesivo** | Prueba con reduced-motion activado | ¿Se respeta? Sí/No | Alta | Exclusión + náusea | Implementar `prefers-reduced-motion` |
| QA-06 | **Mala legibilidad** | Test de lectura: < 70% completa | Facilidad percibida < 4/7 | Alta | Contenido no se evalúa | Agrandar overlay, mejorar tipografía, sacar a 2D |
| QA-07 | **Rutas sin retorno claro** | Observación: usuario en arcade no sabe volver | % que encuentra botón "Portfolio" | Media | Frustración | Hacer botón de retorno más visible |
| QA-08 | **Hotspots invisibles** | Observación: no descubren interactivos | % que interactúa con objetos del escritorio | Media | Features desperdiciadas | Añadir signifiers (glow, cursor change) |
| QA-09 | **Contenido atrapado en 3D** | Accessibility audit: ¿contenido accesible sin WebGL? | Sí/No | Crítica | Exclusión total | Arquitectura progressive enhancement |
| QA-10 | **Bajo FPS** | Performance test en hardware modesto | FPS P25 | Alta | Percepción de baja calidad | Reducir escena, eliminar post-processing |
| QA-11 | **Loading frustrante** | Medir tiempo de carga en 3G/4G | LCP en segundos | Alta | Abandono pre-contenido | Lazy loading, mostrar contenido 2D durante carga |
| QA-12 | **Arcade distrae del contenido** | Analytics: tiempo en arcade vs Work | Ratio arcade/work | Media | Jerarquía invertida | Reducir prominencia o eliminar |
| QA-13 | **Mala señal profesional** | Encuesta: "¿contratarías?" < 40% | % de respuestas positivas | Crítica | Objetivo del portfolio falla | Rediseño de contenido y formato |
| QA-14 | **Mala experiencia en laptop promedio** | Test en Intel HD Graphics | FPS + percepción | Alta | Excluye audiencia principal (recruiters) | Detección de GPU + fallback |
| QA-15 | **Mala experiencia mobile** | Test en iPhone + Android | Funcionalidad del fallback | Alta | ~50% tráfico web es mobile | Mejorar PortfolioContent como portfolio 2D real |

### 6.2 QA por área

**QA de navegación:**
- [ ] ¿Se puede llegar a Work desde cualquier estado?
- [ ] ¿Se puede llegar a Contact desde cualquier estado?
- [ ] ¿El botón Portfolio←→Arcade funciona en ambas direcciones?
- [ ] ¿La transición de cámara seated↔macbook es suave?
- [ ] ¿Hay forma de volver al inicio/loading?

**QA de discoverability:**
- [ ] ¿El usuario sabe que el monitor tiene contenido scrollable?
- [ ] ¿Los objetos interactivos del escritorio son descubribles?
- [ ] ¿El CTA del arcade es visible pero no dominante?
- [ ] ¿Hay indicación de cuánto contenido existe?

**QA visual:**
- [ ] ¿El overlay del monitor se alinea con la pantalla 3D?
- [ ] ¿Al resize del browser el overlay se recalcula?
- [ ] ¿El cross-fade entre modos es suave?
- [ ] ¿No hay z-fighting entre overlay y canvas?
- [ ] ¿Las sombras y luces se ven correctas?

**QA de contenido:**
- [ ] ¿About tiene bio, especialidad, skills?
- [ ] ¿Cada proyecto tiene contexto, rol, resultado?
- [ ] ¿Hay link a CV descargable?
- [ ] ¿Email y LinkedIn son funcionales?
- [ ] ¿Los links externos abren correctamente?

**QA de accesibilidad:**
- [ ] ¿Keyboard-only navigation funciona en todo el HTML?
- [ ] ¿Focus ring visible en elementos interactivos?
- [ ] ¿`prefers-reduced-motion` desactiva animaciones?
- [ ] ¿Screen reader puede leer todo el contenido?
- [ ] ¿Contraste ≥ 4.5:1 en todo texto?
- [ ] ¿Existe skip-to-content?
- [ ] ¿Alt text en imágenes?

**QA de rendimiento:**
- [ ] FPS > 30 en GPU integrada
- [ ] LCP < 2.5s en conexión 4G
- [ ] TBT < 200ms
- [ ] GLB < 4MB
- [ ] No memory leaks en transiciones de modo
- [ ] No se compilan shaders después del intro

**QA cross-device:**
- [ ] Desktop 1920×1080 → overlay posición correcta
- [ ] Desktop 1440×900 → overlay posición correcta
- [ ] Desktop 2560×1440 → overlay escala correcta
- [ ] Mobile < 480px → fallback 2D se activa
- [ ] Tablet → ¿qué experiencia recibe?
- [ ] Safari → WebGL funciona
- [ ] Firefox → WebGL funciona

---

## 7. SELF-CRITIQUE LOOPS

### 7.1 Loop estratégico

**Cuándo:** Al inicio de cada fase. Antes de cada decisión de feature.
**Inputs:** Estado actual, objetivos, resultados de validación previos.

**Checklist:**
- [ ] ¿El portfolio puede lograr su objetivo (contratación) sin esta feature?
- [ ] ¿Esta decisión acerca o aleja del MVP validable?
- [ ] ¿Estoy construyendo para impresionar o para informar?
- [ ] ¿Esto tiene valor sin el 3D? Si no, es dependencia peligrosa.
- [ ] ¿Puedo validar esto antes de construirlo?

**Criterio de pase:** Todas "sí" o justificación explícita para cada "no".
**Acción si falla:** Posponer feature. Volver a validar fundamentos.

### 7.2 Loop UX

**Cuándo:** Después de implementar cualquier cambio de interacción o layout.
**Inputs:** El cambio implementado + las tareas T1-T6.

**Checklist:**
- [ ] ¿T1 (quién soy) sigue resolviéndose en < 5 segundos?
- [ ] ¿T2 (proyectos) accesible en < 15 segundos?
- [ ] ¿T3 (contacto) accesible en < 2 clics?
- [ ] ¿El cambio reduce o aumenta pasos para llegar al contenido?
- [ ] ¿Hay nuevo esfuerzo de aprendizaje?
- [ ] ¿Se puede deshacer/volver atrás fácilmente?

**Criterio de pase:** Ninguna tarea empeorada.
**Acción si falla:** Revertir cambio o añadir mitigación antes de merge.

### 7.3 Loop accesibilidad

**Cuándo:** Antes de cada merge/deploy.
**Inputs:** Diff del cambio.

**Checklist:**
- [ ] ¿El nuevo contenido tiene equivalente en HTML accesible?
- [ ] ¿Los nuevos interactivos funcionan con teclado?
- [ ] ¿Se respeta reduced-motion?
- [ ] ¿El contraste del nuevo texto es ≥ 4.5:1?
- [ ] ¿No se introdujo dependencia exclusiva de canvas?

**Criterio de pase:** Todo "sí".
**Acción si falla:** Fix obligatorio antes de merge.

### 7.4 Loop performance

**Cuándo:** Después de añadir assets, shaders, efectos o componentes.
**Inputs:** Medición de FPS antes y después.

**Checklist:**
- [ ] ¿FPS bajó más de 5 puntos?
- [ ] ¿Bundle size creció más de 200KB?
- [ ] ¿LCP empeoró más de 500ms?
- [ ] ¿Se añadió post-processing?
- [ ] ¿Se añadieron texturas > 1K?

**Criterio de pase:** No degradación medible o degradación justificada.
**Acción si falla:** Optimizar o revertir.

### 7.5 Loop hiring/recruiter perspective

**Cuándo:** Final de Fase 1, Fase 4, Fase 6, pre-launch.
**Inputs:** Portfolio en estado actual.

**Checklist:**
- [ ] Si tengo 60 segundos, ¿entiendo qué hace esta persona?
- [ ] ¿Puedo ver su trabajo en < 15 segundos?
- [ ] ¿Puedo contactarla en < 2 clics?
- [ ] ¿El portfolio comunica profesionalidad?
- [ ] ¿Me queda claro para qué tipo de rol aplicar?
- [ ] ¿Puedo descargar su CV?
- [ ] ¿El formato me distrae del contenido?

**Criterio de pase:** Todo "sí".
**Acción si falla:** Priorizar el fix sobre cualquier feature nueva.

### 7.6 Loop contenido/legibilidad

**Cuándo:** Después de cambios en MonitorPortfolio, overlay sizing, o tipografía.
**Inputs:** Screenshot del contenido a tamaño real en pantalla 1080p.

**Checklist:**
- [ ] ¿El texto body es legible sin entrecerrar los ojos?
- [ ] ¿Los títulos tienen jerarquía visual clara?
- [ ] ¿Los links son distinguibles?
- [ ] ¿Hay suficiente contraste con el fondo?
- [ ] ¿El scroll es descubrible?
- [ ] ¿El contenido no se trunca?

**Criterio de pase:** Todo "sí" verificado en screenshot real (no dev tools zoom).
**Acción si falla:** Ajustar tipografía, tamaño de overlay o sacar contenido a vista expandida.

---

## 8. FRAMEWORK DE EVALUACIÓN DE FEATURES

### Matriz de evaluación

Escala: 1 (muy bajo/negativo) → 5 (muy alto/positivo)

| Feature | Valor UX | Valor profesional | Coste técnico | Riesgo confusión | Impacto accesibilidad | Impacto rendimiento | Facilidad validación | Dependencias | **Score** | **Decisión** |
|---|---|---|---|---|---|---|---|---|---|---|
| **Escena desk 3D (hero)** | 4 | 5 | Ya hecho | 2 | 3 | 3 | 4 | Ninguna | Alta | ✅ Mantener |
| **Overlay monitor (portfolio)** | 4 | 5 | Ya hecho | 2 | 3 | 2 | 4 | Escena 3D | Alta | ✅ Mantener, validar legibilidad |
| **Cámara intro cinematic** | 3 | 4 | Ya hecho | 1 | 2 | 2 | 3 | Escena 3D | Media-alta | ✅ Mantener, añadir skip |
| **Arcade en MacBook** | 2 | 2 | Ya hecho | 3 | 2 | 2 | 4 | Escena 3D | Baja-media | ⚠️ Validar. Posible eliminar/reemplazar |
| **Primera persona libre** | 1 | 2 | Alto | 5 | 1 | 1 | 2 | Escena + controles | Muy baja | ❌ No implementar |
| **Movimiento libre (WASD)** | 1 | 2 | Alto | 5 | 1 | 1 | 2 | Escena + físicas | Muy baja | ❌ No implementar |
| **Segunda pantalla separada** | 1 | 1 | Alto | 4 | 2 | 1 | 2 | Toda la arch. | Muy baja | ❌ Eliminar concepto |
| **Minijuegos genéricos** | 1 | 1 | Ya hecho | 4 | 2 | 2 | 3 | Arcade | Baja | ⚠️ Reemplazar con demos relevantes |
| **Portfolio renderizado en textura 3D** | 1 | 2 | Alto | 4 | 1 | 1 | 2 | WebGL | Muy baja | ❌ No implementar (overlay DOM es mejor) |
| **Overlays HTML sobre canvas** | 4 | 4 | Ya hecho | 2 | 3 | 3 | 4 | Canvas | Alta | ✅ Mantener (patrón actual) |
| **Intro inmersiva** | 3 | 3 | Ya hecho | 2 | 2 | 2 | 3 | Cámara | Media | ✅ Mantener con skip obligatorio |
| **Mobile 3D** | 2 | 2 | Muy alto | 3 | 2 | 1 | 2 | GPU mobile | Baja | ❌ Mantener fallback 2D |
| **Rutas rápidas (nav directa)** | 5 | 4 | Bajo | 1 | 5 | 5 | 5 | Ninguna | Muy alta | ✅ Implementar como prioridad |
| **`prefers-reduced-motion`** | 3 | 3 | Bajo | 1 | 5 | 5 | 5 | Ninguna | Muy alta | ✅ Implementar como obligatorio |
| **Fallback 2D completo** | 5 | 5 | Medio | 1 | 5 | 5 | 5 | Contenido | Muy alta | ✅ Mejorar PortfolioContent |
| **Skip-to-content** | 4 | 3 | Muy bajo | 1 | 5 | 5 | 5 | HTML | Muy alta | ✅ Implementar inmediatamente |
| **Demos técnicas relevantes** | 3 | 4 | Medio | 2 | 3 | 3 | 3 | Lab section | Media-alta | ⚠️ Posponer hasta validar arcade |
| **Easter eggs** | 2 | 2 | Bajo | 1 | 4 | 4 | 2 | Todo lo demás | Baja | ⏸️ Posponer |
| **HDRI environment** | 2 | 2 | Bajo | 1 | 4 | 3 | 2 | Escena 3D | Baja | ⏸️ Posponer |

### Resumen de decisiones

| Decisión | Features |
|---|---|
| **✅ Mantener** | Desk scene, overlay monitor, intro cinematic, overlays HTML, fallback 2D |
| **✅ Implementar ya** | Skip-to-content, rutas rápidas (nav), prefers-reduced-motion |
| **⚠️ Validar primero** | Arcade en MacBook, minijuegos (reemplazar si no suman) |
| **⏸️ Posponer** | Easter eggs, HDRI, personalización de labels, loading branding |
| **❌ No implementar** | Primera persona, movimiento libre, segunda pantalla separada, portfolio en textura 3D, mobile 3D |

---

## 9. INSTRUMENTACIÓN Y MÉTRICAS

### 9.1 Métricas principales

| Métrica | Por qué importa | Fase | Cómo medir | Umbral OK | Umbral alerta | Acción si alerta |
|---|---|---|---|---|---|---|
| **Tiempo hasta entender quién soy** | Si falla, nada más importa | 0, 4 | Test de 5 seg | < 5s, > 80% acierto | > 5s, < 50% acierto | Rediseñar hero/identidad |
| **Tiempo hasta primer proyecto** | Objetivo primario del portfolio | 2, 3 | Analytics: evento `project_opened` | < 15s | > 30s | Añadir nav directa, reducir intro |
| **Tiempo hasta contacto** | Conversión final | 2, 6 | Analytics: evento `contact_clicked` | < 120s | > 300s o nunca | Hacer contacto persistente |
| **Abandono temprano** | ¿La experiencia retiene? | 5, 6 | Analytics: bounce < 20s | < 30% | > 50% | Cargar contenido 2D primero |
| **% que llega a Work** | Funnel crítico | 6 | Analytics: evento `work_section_viewed` | > 50% | < 30% | Findability rota → nav redesign |
| **% que llega a Contact** | Funnel de conversión | 6 | Analytics: evento `contact_section_viewed` | > 20% | < 10% | CTA más prominente |
| **Percepción profesional** | Empleabilidad | 4 | Encuesta 1-7 | > 5/7 | < 4/7 | Simplificar formato |
| **Percepción creatividad** | Diferenciación | 4 | Encuesta 1-7 | > 5/7 | < 4/7 | Mejorar craft visual |
| **Recuerdo de proyectos (24h)** | ¿Se recuerda el trabajo? | 4 | Follow-up a 24h | > 50% nombra 1 | < 30% | 3D domina → rebalancear |
| **Tasa uso modo 3D** | ¿El 3D aporta o solo existe? | 6+ | Feature flag + analytics | > 60% lo experimenta | < 30% lo experimenta | El 3D no carga o no impresiona |
| **Tasa uso arcade** | ¿Vale la pena mantenerlo? | 6+ | Evento `arcade_opened` | Informativo | arcade > work engagement | Jerarquía invertida → reducir |
| **Errores de navegación** | ¿El sistema confunde? | 3, 4 | Observación + analytics (clics en no-interactivos) | < 10% sesiones | > 25% sesiones | Mejorar signifiers |
| **FPS medio** | Performance = UX | 5, 6 | `requestAnimationFrame` delta → evento | > 45 P50 | < 30 P25 | Reducir escena |
| **LCP** | Carga = primera impresión | 5, 6 | web-vitals | < 2.5s | > 4s | Optimizar assets |
| **Crashes WebGL** | Estabilidad | 6+ | Sentry: `webglcontextlost` | 0% | > 1% sesiones | Reducir VRAM usage |
| **Mobile fallback funcional** | ~50% tráfico | 5 | Test manual + Sentry | 0 errores | Cualquier error | Fix obligatorio |

### 9.2 Implementación técnica

**Analytics (ligero, privacy-first):**
```
Plausible o Fathom con custom events:
- page_loaded (con timing)
- scene_loaded (con FPS snapshot)
- intro_completed
- intro_skipped
- work_section_viewed
- project_opened (con project_id)
- contact_clicked (con método: email/linkedin/github)
- arcade_opened
- arcade_game_played (con game_id)
- fallback_2d_activated (con reason: mobile/low_fps/no_webgl)
- mode_changed (seated/macbook)
```

**Performance RUM:**
```typescript
// Hook personalizado que samplea FPS cada 5 segundos
// Envía percentiles a analytics al final de la sesión
// Incluye GPU info de WEBGL_debug_renderer_info para segmentar
```

**Sentry (ya instalado):**
```
Configurar:
- Breadcrumbs para transiciones de modo
- Custom tags: gpu_renderer, is_mobile, webgl_available
- Performance transactions: scene_load, intro_animation, mode_transition
- Error boundaries en ExperienceWrapper y MonitorPortfolio
- webglcontextlost handler que reporta a Sentry
```

**Feature flags:**
```
Variable de sesión que registra:
- webgl_supported: boolean
- 3d_active: boolean
- reduced_motion: boolean
- device_tier: 'high' | 'medium' | 'low'
- fallback_reason: string | null
```

---

## 10. RIESGOS Y FAILURE MODES

| ID | Nombre | Causa raíz | Síntoma observable | Impacto UX | Impacto profesional | Impacto técnico | Detección | Fase detección | Acción correctiva |
|---|---|---|---|---|---|---|---|---|---|
| FM-01 | **Se recuerda gimmick, no trabajo** | 3D domina atención. Contenido insuficiente o poco prominente. | Test de recuerdo: > 70% solo nombra "el 3D". | Crítico — portfolio no cumple función. | Severo — no genera entrevistas. | Bajo. | Test de memorabilidad 24h. | Fase 4 | Rebalancear: contenido más grande, 3D más sutil. |
| FM-02 | **Usuario no sabe que hay scroll** | Overlay parece imagen estática. Sin scrollbar visible. | Observación: 0 scroll en monitor. | Alto — contenido invisible. | Alto — no ven proyectos. | Bajo. | Prueba de tareas. | Fase 3 | Añadir indicador de scroll o scroll snap visible. |
| FM-03 | **No sabe interactuar** | Sin onboarding. Affordances débiles. | Usuario inmóvil > 10s post-intro. | Alto — frustración. | Medio. | Bajo. | Observación. | Fase 3 | CTA explícito, cursor changes, tooltips sutiles. |
| FM-04 | **Tarda demasiado** | Loading + intro + orientación > 15s. | Bounce > 50%. Recruiters cierran tab. | Crítico. | Severo — pérdida de oportunidades. | Medio. | Analytics: time to first interaction. | Fase 5 | Skip intro, contenido 2D durante carga, reducir assets. |
| FM-05 | **Case studies ilegibles** | Overlay 520×380px insuficiente para texto denso. | Test lectura: < 70% éxito. Quejas de tamaño. | Alto. | Alto — no pueden evaluar trabajo. | Bajo. | Prueba de tareas Fase 3. | Fase 3 | Expandir overlay o abrir case studies en ruta 2D. |
| FM-06 | **3D rompe accesibilidad** | Canvas opaco. Sin HTML semántico. Sin keyboard nav. | Screen reader no lee nada. Tab no funciona. | Crítico — exclusión. | Medio (legal en algunos mercados). | Alto. | Audit accesibilidad. | Fase 5 | Progressive enhancement: Capa 1 HTML funcional. |
| FM-07 | **Parece amateur** | Baja calidad de ejecución 3D. Arcade genérico. UX con bugs. | Encuesta: profesionalidad < 4/7. | Crítico. | Severo. | Medio. | Test percepción Fase 4. | Fase 4 | Pulir ejecución o simplificar a 2D con acentos 3D. |
| FM-08 | **Solo funciona en equipos potentes** | Assets pesados, post-processing, shaders. | FPS < 20 en Intel HD. Stutter. Calentamiento. | Alto. | Alto — recruiter con laptop corporativa. | Alto. | Performance testing Fase 5. | Fase 5 | GPU detection + fallback. Reducir escena. |
| FM-09 | **Arcade baja señal profesional** | 4 juegos genéricos sin relación con perfil. | Test A/B: arcade reduce profesionalidad. | Medio. | Alto. | Bajo. | Test percepción Fase 4. | Fase 4 | Reemplazar con demos técnicas relevantes o eliminar. |
| FM-10 | **Proyecto crece sin foco** | Feature creep: easter eggs, HDRI, personalización antes de validar base. | Meses sin lanzar. Backlog infinito. | N/A. | Severo — portfolio nunca se lanza. | Alto. | Auto-revisión con loop estratégico. | Todas | Aplicar gates estrictos. Lanzar MVP primero. |

---

## 11. PLAN DE PRIORIZACIÓN

### Nivel: Esencial (bloquea lanzamiento)

| # | Item | Justificación |
|---|---|---|
| 1 | Contenido profesional completo (about, proyectos con contexto, CV, contacto) | Sin esto, el portfolio no tiene función. |
| 2 | Nav o mecanismo de acceso directo a secciones | Sin esto, findability depende de exploración. |
| 3 | Fallback 2D funcional y competitivo (PortfolioContent mejorado) | Sin esto, ~50% del tráfico tiene experiencia inferior. |
| 4 | Skip para intro cinematic | Sin esto, visitantes recurrentes y recruiters con prisa abandonan. |
| 5 | `prefers-reduced-motion` respetado | Sin esto, exclusión activa + posible náusea. |
| 6 | Skip-to-content link | Accesibilidad mínima obligatoria. |
| 7 | Contraste ≥ 4.5:1 en todo texto | WCAG básico. |

### Nivel: Importante (mejora significativa, pre-launch ideal)

| # | Item | Justificación |
|---|---|---|
| 8 | Validación de legibilidad del overlay (+ fix si falla) | Determina si el patrón overlay funciona. |
| 9 | Performance testing en hardware modesto + fallback automático | Garantiza experiencia en audiencia real. |
| 10 | Keyboard navigation en capa HTML | Accesibilidad seria. |
| 11 | Sentry configurado con custom events y breadcrumbs | Observabilidad post-launch. |
| 12 | Analytics básicos (funnel: load → work → contact) | Medición de éxito. |
| 13 | Decisión informada sobre arcade (mantener/modificar/eliminar) | Basada en test de percepción. |

### Nivel: Opcional (mejora incremental, post-launch)

| # | Item | Justificación |
|---|---|---|
| 14 | Demos técnicas relevantes en lugar de arcade genérico | Mejor señal profesional que juegos. |
| 15 | Personalización de labels de objetos (F1, café de olla) | Personalidad. No afecta empleabilidad. |
| 16 | HDRI environment / background premium | Visual polish. |
| 17 | Loading screen con branding | Nice-to-have. |
| 18 | Hover effects en objetos del escritorio | Descubrimiento y delight. |

### Nivel: Experimental (solo con evidencia previa)

| # | Item | Justificación |
|---|---|---|
| 19 | Easter eggs (Konami, F1 car) | Solo si el portfolio base está pulido y lanzado. |
| 20 | Sonido/audio | Puede mejorar inmersión. Alto riesgo de molestar. Requiere mute por defecto. |
| 21 | Sección Lab con múltiples experiments | Solo si el arcade se valida positivamente y hay demanda. |

### Nivel: No recomendado

| # | Item | Justificación |
|---|---|---|
| — | Primera persona libre | Excluye audiencia, añade fricción, no validado. |
| — | Movimiento WASD | Mismo problema que primera persona. |
| — | Portfolio renderizado como textura 3D | Inferior a DOM overlay en todo aspecto. |
| — | Segunda pantalla separada | Fragmenta experiencia. |
| — | Mobile 3D | GPU insufficient. Fallback 2D es mejor decisión. |
| — | Minijuegos genéricos sin relación con perfil | Restan señal profesional sin aportar. |

---

## FASES 5-8 DEL ROADMAP (continuación de sección 3)

### FASE 5: Performance, accesibilidad y estabilidad técnica

**Objetivo:** Garantizar que la experiencia funciona en hardware real y no excluye usuarios.

**Preguntas:**
- ¿Funciona a 30fps+ en laptop con GPU integrada?
- ¿La capa HTML es navegable por teclado?
- ¿`prefers-reduced-motion` funciona?
- ¿Hay fallback automático para GPUs débiles?

**Entregables:**
- [ ] Test de FPS en 3+ dispositivos reales (incluir Intel HD o equivalente)
- [ ] Implementación de `prefers-reduced-motion` (desactiva intro, parallax, transiciones)
- [ ] Skip-to-content link funcional
- [ ] Keyboard navigation en MonitorPortfolio y nav
- [ ] GPU detection + fallback automático a 2D si FPS < 25
- [ ] Focus ring visible en todos los interactivos HTML
- [ ] Sentry configurado con performance transactions
- [ ] web-vitals reportando LCP, TBT, CLS

**Hipótesis:** H5 — El portfolio funciona en hardware modesto.

**Métodos de validación:**
- FPS measurement en 3 dispositivos
- Lighthouse accessibility audit (target > 90)
- Manual keyboard walkthrough
- axe DevTools scan

**Métricas:**
- FPS P25 > 30 en dispositivo más débil
- LCP < 2.5s en 4G simulado
- Lighthouse accessibility > 90
- 0 keyboard traps

**Criterios de éxito:** Performance y accesibilidad pasan todos los umbrales.

**Criterios de fracaso:**
- FPS < 20 en GPU integrada → reducir escena drásticamente o eliminar post-processing
- Keyboard navigation imposible → bloquea launch

**Decision gate → Fase 6:**
- ✅ FPS > 30 en hardware modesto
- ✅ Accesibilidad básica implementada (skip, keyboard, reduced-motion, contraste)
- ✅ Sentry + analytics configurados
- 🚫 No lanzar sin fallback funcional para hardware débil

---

### FASE 6: Integración de contenido real y polish

**Objetivo:** Poblar el portfolio con contenido profesional definitivo y pulir la experiencia completa.

**Preguntas:**
- ¿El contenido final se ve bien en el overlay?
- ¿Los links funcionan?
- ¿El CV es descargable?
- ¿La experiencia completa fluye sin bugs?

**Entregables:**
- [ ] Contenido final: about, proyectos, skills, contacto, CV link
- [ ] QA completa (todas las checklists de sección 6)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Cross-resolution testing (1080p, 1440p, 4K)
- [ ] Error handling: WebGL context lost, asset load failure, JS errors
- [ ] Meta tags, OG image, title, description para SEO básico
- [ ] Favicon y branding mínimo

**Hipótesis:** El portfolio completo cumple todos los criterios de éxito acumulados.

**Métodos de validación:**
- QA checklist completa
- Smoke test en 5 dispositivos/browsers
- Prueba de tareas con 3-5 personas nuevas
- Self-critique loops (todos)

**Criterios de éxito:**
- 0 bugs críticos
- Todas las tareas T1-T6 completables
- Contenido profesional y completo
- No regresiones de performance o accesibilidad

**Criterios de fracaso:**
- Bugs que bloquean tareas → fix antes de launch
- Contenido insuficiente → retrasar launch

**Decision gate → Fase 7:**
- ✅ QA completa pasada
- ✅ Contenido final integrado
- ✅ 0 bugs de severidad crítica/alta
- ✅ Smoke test en 5 dispositivos OK

---

### FASE 7: Experiments / Lab (solo si se justifica)

**Objetivo:** Evaluar si el arcade actual aporta o si debe reemplazarse con demos técnicas relevantes.

**Preguntas:**
- ¿El arcade suma o resta a la percepción profesional?
- ¿Las demos técnicas comunicarían mejor mi perfil?
- ¿Vale la pena invertir en una sección Lab?

**Prerequisitos:** Fases 1-6 completadas. Resultado de test A/B de arcade (Fase 4).

**Entregables (condicionales):**
- [ ] Si arcade resta → eliminarlo o reemplazarlo
- [ ] Si arcade es neutro → mantener pero reducir prominencia
- [ ] Si arcade suma → mantener y posiblemente expandir a Lab
- [ ] Si se crea Lab → sección con 2-3 demos técnicas relevantes (ej: shader demo, physics sim, generative art)

**Criterio clave:** Solo construir Lab si hay evidencia de que aporta (de Fase 4).

**Decision gate → Fase 8:**
- ✅ Decisión sobre arcade ejecutada
- ✅ Si Lab existe, está aislado del portfolio principal
- 🚫 No construir Lab si no hay evidencia de valor

---

### FASE 8: QA final, polish y validación pre-launch

**Objetivo:** Asegurar que todo funciona perfectamente antes de lanzar.

**Entregables:**
- [ ] Ronda final de QA completa
- [ ] Performance retest en hardware modesto
- [ ] Accessibility retest
- [ ] Prueba de tareas con 3 personas nuevas (validación final)
- [ ] Test de percepción profesional con 3-5 hiring managers/recruiters
- [ ] Decision log actualizado con todas las decisiones tomadas
- [ ] Analytics verificados (eventos llegan correctamente)
- [ ] Sentry verificado (errores se capturan)
- [ ] Domain custom configurado (si aplica)
- [ ] Deploy a producción

**Criterios de launch:**
- Task success rate > 90% (T1-T6)
- Profesionalidad > 5/7
- FPS > 30 en hardware modesto
- 0 bugs críticos
- Accesibilidad básica implementada
- Analytics y Sentry funcionales

---

## 12. ENTREGABLES POR FASE

| Fase | Artefactos |
|---|---|
| **F0: Auditoría** | Inventario de contenido, gaps list, FPS baseline, screenshot legibilidad, mapa de hipótesis |
| **F1: Contenido** | About completo, proyectos con contexto, CV link, contacto, peer review results |
| **F2: Findability** | Wireframe de nav, first-click test results, implementación de nav si necesaria |
| **F3: Legibilidad** | Test de lectura results, decisión inline vs expandido vs 2D, prototipo de solución |
| **F4: Percepción** | Scorecard de percepción, test A/B arcade results, test memorabilidad, decision log |
| **F5: Tech** | FPS report por dispositivo, accessibility audit, Sentry config, web-vitals setup, GPU fallback |
| **F6: Integración** | Contenido final, QA checklist completa, cross-browser report, smoke test results |
| **F7: Lab** | Decisión arcade documentada, Lab (si procede), demos relevantes (si procede) |
| **F8: Launch** | QA final, retest results, decision log final, deploy checklist, analytics verification |

---

## 13. CONDICIONES DE "NO SEGUIR"

### El 3D no está aportando

**Evidencia:**
- Profesionalidad con 3D ≤ profesionalidad sin 3D (test comparativo)
- > 70% de usuarios recuerdan solo el 3D, no el trabajo
- Tasa de llegada a Work < 30%
- Performance < 25fps en > 40% de dispositivos

**Acción:** Migrar a portfolio 2D con microinteracciones 3D (shaders en hover, partículas, scroll animations). Mantener la escena desk como página separada "/desk" para demos técnicas.

### Primera persona no funciona

**Estado:** No implementada. Correctamente descartada. No reintroducir.

**Evidencia que justificaría reconsiderar (improbable):**
- > 30% de audiencia técnica pide explícitamente exploración libre
- Se puede implementar como modo opcional sin romper accesibilidad
- La audiencia principal es exclusivamente creative developers (no recruiters)

### Los minijuegos deben eliminarse

**Evidencia:**
- Test A/B: arcade reduce profesionalidad > 1 punto (escala 1-7)
- Comentarios cualitativos negativos de hiring managers
- Tiempo en arcade >> tiempo en Work (jerarquía invertida)

**Acción:** Eliminar iframe arcade. Reemplazar el espacio MacBook con: a) una demo técnica relevante (shader, generative art), b) nada (simplificar a una sola pantalla), o c) "Currently building" con link a GitHub.

### Portfolio debe pasar a híbrido o 2D

**Evidencia:**
- Performance irrecuperable (< 25fps incluso con escena reducida)
- Percepción profesional < 4/7 tras dos iteraciones de mejora
- Legibilidad del overlay irrecuperable sin abandonar el formato
- Accesibilidad imposible de alcanzar con el patrón actual

**Acción:** Preservar PortfolioContent como portfolio principal. Añadir hero 3D como componente opcional (canvas contenido, no fullscreen). Mover la experiencia desk a "/lab/desk-scene" como demo técnica.

### Recorte radical necesario

**Evidencia:**
- Después de 3 iteraciones, los tests siguen fallando
- El proyecto lleva > 4 semanas sin estar listo para launch
- Feature creep evidente (más de 20 items en backlog sin lanzar)

**Acción:** Lanzar PortfolioContent (fallback mobile) como portfolio principal. Punto. Iterrar desde ahí. El 3D puede añadirse después como mejora progresiva, no como requisito.

---

## 14. RECOMENDACIÓN FINAL DE EJECUCIÓN

### Mejor versión inicial del portfolio

**Un portfolio híbrido que ya casi existe:**

La escena desk 3D funciona como hero inmersivo con overlay de portfolio en el monitor. Es una decisión de diseño sólida que demuestra competencia técnica sin requerir que el usuario aprenda controles nuevos. La cámara seated simula primera persona sin los riesgos de navegación libre.

Lo que falta no es más 3D. Lo que falta es:
1. **Contenido profesional real** (case studies con contexto, about completo, CV)
2. **Accesibilidad básica** (keyboard, reduced-motion, skip-to-content)
3. **Validación con usuarios reales** (percepción, findability, legibilidad)
4. **Decisión informada sobre el arcade**

### MVP validable

```
MVP = Lo que ya existe
    + Contenido profesional completo (Fase 1)
    + Nav o acceso directo a secciones (Fase 2)
    + Skip intro
    + Skip-to-content
    + prefers-reduced-motion
    + Test con 5-8 personas reales
```

Esto es alcanzable en días, no semanas. No requiere nueva ingeniería 3D.

### Qué debería esperar para fases posteriores

- **Fase 4+ decisions:** No eliminar ni modificar el arcade sin datos de percepción
- **Lab/experiments:** Solo si el arcade se valida positivamente
- **Easter eggs, HDRI, personalización:** Solo después de lanzar y obtener analytics reales
- **Performance optimization agresiva:** Solo si se detectan problemas en hardware real

### Qué NO hacer todavía

1. No añadir features 3D (HDRI, partículas, nuevos objetos) antes de validar contenido
2. No personalizar labels y easter eggs antes de que el portfolio informe sobre ti profesionalmente
3. No crear sección Lab antes de decidir qué pasa con el arcade
4. No invertir en mobile 3D — el fallback 2D es la decisión correcta
5. No pulir loading screen antes de que lo que viene después del loading esté validado

### Cómo evitar sobreconstruir

1. **Seguir los gates.** No avanzar de fase sin evidencia.
2. **Priorizar contenido sobre decoración.** Siempre.
3. **Lanzar temprano.** Un portfolio con contenido real y escena 3D funcional es lanzable HOY con los fixes esenciales (skip, accesibilidad, contenido).
4. **Medir antes de mejorar.** No optimizar lo que no se ha medido.
5. **Aplicar self-critique loops** después de cada cambio.

### Cómo mantener foco en UX y empleabilidad

La pregunta que debe gobernar cada decisión:

> **"¿Esto ayuda a un hiring manager a decidir contactarme en 60 segundos?"**

Si la respuesta es no, es polish. Y el polish viene después del contenido, la claridad y la validación.

---

## APÉNDICE: Fases restantes del roadmap (Fases 5-8)

Las fases 5-8 están detalladas arriba en la sección "FASES 5-8 DEL ROADMAP".

---

*Este documento es un blueprint operativo. Cada sección está diseñada para alimentar decisiones basadas en evidencia, no en intuición. Seguir los gates, medir antes de construir, y no avanzar sin validación.*
