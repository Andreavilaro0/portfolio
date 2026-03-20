# Exploración Creativa Multiagente — Portfolio Web

**Fecha:** 2026-03-19
**Contexto:** Evaluación de direcciones creativas para el portfolio, calibrada con el estado real del proyecto (desk scene 3D funcional).
**Método:** Análisis multiagente simulado con roles especializados.

---

## FASE 1: HIPÓTESIS

### ¿Qué significa "novedad" en este portfolio?

No significa "nunca visto". Significa una combinación inusual de elementos familiares ejecutada con craft superior. La novedad real en portfolios web viene de:

1. **Integración no convencional de 3D y contenido** — no 3D por 3D, sino 3D que mejora la comprensión
2. **Narrative design** — el portfolio cuenta una historia, no solo lista proyectos
3. **Interacción con propósito** — cada interacción revela algo sobre el creador
4. **Craft visible** — la ejecución técnica es evidente sin ser ruidosa
5. **Personalidad integrada** — no un template con datos cambiados, sino un artefacto personal

### Qué quiere lograr el portfolio

| Objetivo | Prioridad | Métrica proxy |
|---|---|---|
| Contratación (entrevistas, ofertas) | 1 | % hiring managers que contactarían |
| Claridad de perfil (qué hago, qué sé) | 1 | Test de 5 segundos |
| Recuerdo después de la visita | 2 | Test de memorabilidad 24h |
| Demostración de skill técnico | 2 | Percepción de creatividad > 5/7 |
| Diferenciación vs otros portfolios | 3 | "¿Habías visto algo así?" |

### Qué NO sacrificar por creatividad

| Aspecto | Línea roja |
|---|---|
| Tiempo hasta primer proyecto | No > 20 segundos bajo ningún concepto |
| Legibilidad del contenido | No se puede requerir zoom o esfuerzo extra para leer |
| Contacto accesible | Siempre a 1-2 clics máximo |
| Funcionalidad sin JS/WebGL | Contenido debe existir en HTML |
| Performance en laptop modesta | > 30fps o fallback automático |
| Profesionalidad percibida | > 5/7 con hiring managers reales |

---

## FASE 2: DIRECCIONES CONCEPTUALES

### Dirección A: "Desk Scene" (ACTUAL)

**Idea:** Escritorio 3D personal como metáfora. Portfolio en monitor, arcade en MacBook. Cámara cinematográfica → posición seated.

**Novedad:** Media. La desk scene como portfolio ya existe (Bruno Simon tiene elementos similares, Yuri Artiukh, etc.), pero la ejecución con overlay DOM proyectado es técnicamente sofisticada.

**Demuestra:** R3F, Three.js, GSAP, sistema de cámara, proyección 3D→DOM, diseño de interacción.

**Riesgos UX:** Legibilidad del overlay. Discoverability del scroll. Arcade como distracción.

**Riesgos contratación:** Puede parecer "proyecto de clase" si el contenido es superficial. El arcade puede restar.

**Vs portfolio clásico:** Más memorable, menos eficiente para tareas. Trade-off aceptable si el contenido es fuerte.

**Veredicto del equipo:**
- UX Research: ⚠️ Validar legibilidad y findability
- Accessibility: ⚠️ Sin keyboard nav ni reduced-motion actualmente
- Performance: ✅ GLB de 3.1MB es razonable
- Hiring Signal: ⚠️ Depende de la calidad del contenido
- **Recomendación: MANTENER como base. Resolver gaps antes de explorar nuevas direcciones.**

---

### Dirección B: "Lab Portfolio" — Grid 2D con microexperimentos 3D

**Idea:** Portfolio 2D limpio y profesional. Cada proyecto tiene un micro-experiment 3D embebido como thumbnail interactivo (shader, partículas, geometría generativa). Sección Lab separada con demos completas.

**Novedad:** Media-alta. La combinación de grid profesional + thumbnails 3D interactivos no es común. Cada thumbnail es una mini-demostración de skill.

**Demuestra:** Range técnico (un shader diferente por proyecto), diseño de sistemas (grid escalable), craft visual.

**Riesgos UX:** Múltiples canvas podrían degradar performance. Los thumbnails interactivos pueden distraer.

**Riesgos técnicos:** N canvas × M shaders = problemas de GPU en dispositivos modestos.

**Riesgos contratación:** Bajo. El formato grid es familiar. El 3D suma sin dominar.

**Vs portfolio clásico:** Más memorable. Casi tan eficiente. Mejor ratio novedad/riesgo.

**Veredicto:**
- UX Research: ✅ Grid es un patrón probado. Los thumbnails 3D son descubribles por hover.
- Accessibility: ✅ HTML semántico base. Canvas por thumbnail con fallback estático.
- Performance: ⚠️ Múltiples canvas requiere lazy rendering. Solo animar lo visible.
- Hiring Signal: ✅ Profesional por defecto, creativo por descubrimiento.
- **Recomendación: Excelente alternativa. Considerar como evolución futura o como fallback si la desk scene no valida.**

---

### Dirección C: "Narrative Scroll" — Scroll storytelling con escenas 3D

**Idea:** Portfolio tipo scroll largo donde el scroll controla escenas 3D que cuentan tu historia. Sección 1: quién eres (escena intro). Sección 2: qué haces (herramientas flotando). Sección 3: proyectos (cada uno con mini-escena). Sección 4: contacto.

**Novedad:** Media. Scroll-triggered 3D existe (Apple, algunos creative studios). Pero aplicado a portfolio personal con escenas narrativas es menos común.

**Demuestra:** GSAP ScrollTrigger + R3F, storytelling visual, diseño narrativo.

**Riesgos UX:** Si el scroll es el único medio de navegación, findability sufre. Performance del scroll + 3D simultáneo.

**Riesgos técnicos:** Sincronizar scroll con cámara 3D es técnicamente complejo y propenso a jank.

**Riesgos contratación:** Medio-bajo. El scroll es familiar. El 3D suma contexto.

**Vs portfolio clásico:** Más inmersivo. Más lento para tareas directas. Requiere nav directa además del scroll.

**Veredicto:**
- UX Research: ⚠️ Necesita nav directa además de scroll. Scroll-only es slow para recruiters.
- Performance: ⚠️ ScrollTrigger + R3F es costoso. Requires careful optimization.
- Hiring Signal: ✅ Narrativo es profesional si bien ejecutado.
- **Recomendación: Viable pero mayor esfuerzo técnico que Dirección A o B. No priorizar a menos que las otras fallen.**

---

### Dirección D: "Terminal Portfolio" — CLI estética + detalles 3D

**Idea:** Portfolio presentado como una terminal/CLI estilizada. Comandos simulados revelan contenido. Elementos 3D decorativos alrededor. Neofetch para about. `ls projects/` para ver trabajo. `cat resume.pdf` para CV.

**Novedad:** Media. Terminal portfolios existen. La combinación con elementos 3D es menos vista.

**Demuestra:** Personalidad (builder mindset), familiaridad con CLI, diseño de interacción textual.

**Riesgos UX:** Alto. La metáfora CLI es excluyente para no-técnicos. Recruiters de RRHH no escriben comandos. Discoverability depende de conocer los comandos.

**Riesgos contratación:** Alto para audiencia no-técnica. Bajo para audiencia developer.

**Vs portfolio clásico:** Más memorable para devs. Peor para recruiters. Trade-off desfavorable si la audiencia es mixta.

**Veredicto:**
- UX Research: ❌ Excluyente por diseño. Viola reconocimiento sobre recuerdo.
- Accessibility: ❌ Navegación por comandos no es accesible.
- Hiring Signal: ⚠️ Solo funciona si la audiencia es 100% técnica.
- **Recomendación: DESCARTAR como dirección principal. Puede inspirar un easter egg o un modo alternativo.**

---

### Dirección E: "Showcase Espacial" — Galería 3D con hotspots

**Idea:** Un espacio 3D tipo galería/museo donde cada proyecto es una "pieza" exhibida. No primera persona — cámara orbit con puntos de teletransporte. Cada pieza tiene un hotspot que abre overlay 2D con case study.

**Novedad:** Media-alta. Portfolio como galería de arte no es nuevo conceptualmente, pero la ejecución en web 3D con buen UX sí es rara.

**Demuestra:** Diseño espacial, R3F, Three.js, sensibilidad estética.

**Riesgos UX:** Orientación espacial. "¿Ya vi todo?" Tiempo hasta primer proyecto mayor que grid.

**Riesgos técnicos:** Más geometría que la desk scene. Más complejo de mantener.

**Riesgos contratación:** Medio. Impresiona visualmente. Puede sentirse pretencioso.

**Vs portfolio clásico:** Más memorable. Significativamente menos eficiente para tareas.

**Veredicto:**
- UX Research: ⚠️ Orientación espacial sigue siendo problema. Mejor que FPS pero peor que 2D.
- Accessibility: ⚠️ Canvas-dependent. Mismos problemas que desk scene.
- Hiring Signal: ⚠️ Depende de la ejecución. "Museo" puede ser pretencioso.
- **Recomendación: DESCARTAR. La desk scene ya resuelve la metáfora espacial con menos riesgo.**

---

### Dirección F: "Portfolio Modular" — Composable blocks con personalidad

**Idea:** Portfolio 2D con bloques modulares arrastrables/reorganizables. Cada bloque es un mini-componente (proyecto, skill, about, link). Los bloques tienen microanimaciones 3D. El usuario puede reorganizar la vista.

**Novedad:** Alta. Portfolios arrastrables son muy raros. La metáfora de "construcción" conecta con builder mindset.

**Riesgos UX:** Muy altos. ¿Por qué el usuario reorganizaría tu portfolio? Añade fricción sin beneficio para sus tareas. La personalización la aprovechas tú, no el visitante.

**Riesgos contratación:** Puede parecer "UX experiment" más que portfolio funcional.

**Veredicto:**
- UX Research: ❌ Reorganización no es una tarea del usuario. Fricción injustificada.
- **Recomendación: DESCARTAR. Novedad alta pero utilidad cero para el visitante.**

---

### Dirección G: "Process Portfolio" — Storytelling de proceso por proyecto

**Idea:** Cada proyecto no es solo un case study estático sino un recorrido interactivo por el proceso: problema → investigación → decisiones → implementación → resultado. Timeline interactivo con elementos visuales que cambian según la etapa.

**Novedad:** Media. Process-oriented portfolios existen en UX. Hacerlo con interacción rica es menos común en dev portfolios.

**Demuestra:** Pensamiento de proceso, comunicación, profundidad técnica.

**Riesgos UX:** Bajos si el timeline es intuitivo. La información es lo que el visitante quiere ver.

**Riesgos contratación:** Bajo. Demuestra madurez profesional.

**Veredicto:**
- UX Research: ✅ La información es relevante. El formato la enriquece.
- Hiring Signal: ✅ Muy valorado por hiring managers.
- **Recomendación: NO como dirección principal, SÍ como patrón para case studies individuales. Compatible con Dirección A.**

---

### Dirección H: "Dual Mode" — Portfolio profesional + playground

**Idea:** Portfolio 2D profesional e impecable como default. Toggle visible para "Experience mode" que activa la desk scene 3D. El usuario elige. Analytics miden qué modo se usa más.

**Novedad:** Media. El concepto de dual-mode no es nuevo pero raramente se ejecuta bien.

**Demuestra:** Range (2D y 3D), respeto por el usuario, craft en ambos modos.

**Riesgos UX:** Duplicar QA. Mantener dos experiencias. Riesgo de que una sea inferior.

**Riesgos contratación:** Bajo. El default es profesional. El 3D es opt-in.

**Veredicto:**
- UX Research: ✅ Respeta preferencias del usuario. Default seguro.
- Accessibility: ✅ Mode 2D es inherentemente más accesible.
- Hiring Signal: ✅ Profesional por defecto. Creativo por elección.
- **Recomendación: CONSIDERAR como evolución de la desk scene. El PortfolioContent actual es el embrión del modo 2D.**

---

## FASE 3: BENCHMARK CRÍTICO

| Criterio | A: Desk (actual) | B: Lab Grid | C: Narrative Scroll | D: Terminal | G: Process | H: Dual Mode | Portfolio 2D clásico |
|---|---|---|---|---|---|---|---|
| **Claridad inicial** | 3/5 | 5/5 | 4/5 | 2/5 | 4/5 | 5/5 | 5/5 |
| **Tiempo a primer proyecto** | 15-20s | 3-5s | 10-15s | 20s+ | 5-10s | 3-5s (2D) / 15s (3D) | 3-5s |
| **Facilidad de contacto** | 3/5 | 5/5 | 4/5 | 2/5 | 4/5 | 5/5 | 5/5 |
| **Discoverability** | 2/5 | 5/5 | 3/5 | 1/5 | 4/5 | 5/5 | 5/5 |
| **Accesibilidad** | 2/5 | 4/5 | 3/5 | 1/5 | 4/5 | 4/5 | 5/5 |
| **Legibilidad** | 3/5 | 5/5 | 4/5 | 3/5 | 5/5 | 5/5 | 5/5 |
| **Carga cognitiva** | Alta | Baja | Media | Alta | Baja-media | Baja (2D) | Baja |
| **Performance esperada** | Media | Media | Media-baja | Alta | Alta | Alta (2D) / Media (3D) | Alta |
| **Señal profesional** | 3/5 | 4/5 | 4/5 | 3/5 | 5/5 | 5/5 | 4/5 |
| **Memorabilidad** | 4/5 | 3/5 | 4/5 | 4/5 | 3/5 | 3/5 | 2/5 |
| **Novedad** | 3/5 | 4/5 | 3/5 | 3/5 | 3/5 | 3/5 | 1/5 |

---

## FASE 4: SELECCIÓN Y PODA

### Descartadas

| Dirección | Razón |
|---|---|
| D: Terminal | Excluyente para no-técnicos. Discoverability destruida. |
| E: Galería espacial | Riesgo de orientación sin beneficio claro sobre desk scene. |
| F: Modular arrastrable | Novedad sin utilidad. Fricción injustificada. |

### Mantener / profundizar

| Dirección | Estado | Siguiente paso |
|---|---|---|
| **A: Desk Scene** | Base actual. Funcional. | Resolver gaps (contenido, accesibilidad, findability). Validar con usuarios. |
| **B: Lab Grid** | Mejor alternativa. | Diseñar como evolución futura o fallback si A no valida. |
| **G: Process** | Patrón de case study. | Integrar en los case studies de A, no como dirección separada. |
| **H: Dual Mode** | Evolución lógica. | El PortfolioContent (mobile fallback) es el embrión. Mejorar y hacerlo el modo 2D. |

### Recomendación consolidada: Evolución progresiva A → A+H

```
AHORA:           Desk Scene (A) con gaps resueltos
                 ↓ validar
SI VALIDA:       Desk Scene + Dual Mode (A+H)
                 Portfolio 2D profesional como default
                 Desk Scene 3D como "Experience mode" opt-in
                 ↓ validar
SI NO VALIDA:    Lab Grid (B)
                 Portfolio 2D con thumbnails 3D interactivos
                 ↓ validar
FALLBACK FINAL:  Portfolio 2D clásico con microinteracciones
                 (lo que PortfolioContent debería ser de todos modos)
```

---

## FASE 5: FAILURE MODES POR DIRECCIÓN

### Para Dirección A (actual — desk scene)

| ID | Failure mode | Causa | Impacto | Severidad | Detección | Mitigación |
|---|---|---|---|---|---|---|
| FM-A1 | Overlay ilegible | 520×380px insuficiente | No evalúan trabajo | Crítica | Test de lectura F3 | Expandir overlay o abrir en 2D |
| FM-A2 | Scroll no descubierto | Sin indicador | Contenido invisible | Alta | Observación F3 | Scroll indicator visible |
| FM-A3 | Arcade distrae | Juegos > trabajo | Jerarquía invertida | Alta | Analytics: ratio arcade/work | Reducir prominencia o eliminar |
| FM-A4 | Intro cansa en revisita | 5s sin skip | Frustración | Media | Repeat visit test | Skip button |
| FM-A5 | Parece proyecto escolar | Contenido superficial | No genera entrevistas | Crítica | Encuesta percepción F4 | Case studies con profundidad |

### Para Dirección H (dual mode — evolución)

| ID | Failure mode | Causa | Impacto | Severidad | Detección | Mitigación |
|---|---|---|---|---|---|---|
| FM-H1 | Nadie usa modo 3D | Toggle no descubrible o no interesante | 3D desperdiciado | Media | Analytics: % uso 3D | Mejorar CTA o aceptar que 2D es suficiente |
| FM-H2 | Modo 2D inferior | No recibe misma atención que 3D | 50%+ usuarios ven versión inferior | Alta | Comparativa calidad | Tratar 2D como producto principal |
| FM-H3 | Duplicación QA | Dos experiencias a mantener | Bugs en uno de los modos | Media | QA cross-mode | Contenido compartido, presentación diferente |

---

## FASE 6: INSTRUMENTACIÓN SENTRY PARA VALIDACIÓN

### Configuración recomendada inmediata

```typescript
// sentry.client.config.ts — extender la config existente

Sentry.init({
  // ... existing config ...

  tracesSampleRate: 0.3, // 30% de sesiones para performance

  beforeBreadcrumb(breadcrumb) {
    // Filtrar breadcrumbs excesivos de R3F render loop
    if (breadcrumb.category === 'console' && breadcrumb.message?.includes('r3f')) {
      return null
    }
    return breadcrumb
  },
})

// Custom events para portfolio-specific tracking
export function trackModeChange(from: string, to: string) {
  Sentry.addBreadcrumb({
    category: 'portfolio.mode',
    message: `${from} → ${to}`,
    level: 'info',
  })
}

export function trackInteraction(element: string, action: string) {
  Sentry.addBreadcrumb({
    category: 'portfolio.interaction',
    message: `${action}: ${element}`,
    level: 'info',
  })
}
```

### Performance transactions clave

| Transaction | Trigger | Umbral alerta |
|---|---|---|
| `portfolio.scene_load` | GLB descargado + parseado + renderizado | > 5s |
| `portfolio.intro_animation` | Inicio → fin de intro cinematic | > 8s |
| `portfolio.mode_transition` | Clic en arcade/portfolio → transición completa | > 2s |
| `portfolio.first_contentful_paint` | Contenido del overlay visible | > 3s |

### Errores críticos a capturar

| Error | Cómo capturar | Acción automática |
|---|---|---|
| `webglcontextlost` | Event listener en canvas | Activar fallback 2D + reportar a Sentry |
| GLB fetch fail | Catch en useGLTF | Mostrar error amigable + fallback |
| Overlay projection NaN | Validación en ScreenAlignedOverlay | Usar posición fallback fija |
| Iframe arcade crash | Error event en iframe | Ocultar arcade silenciosamente |

---

## FASE 7-8: AUTOCRÍTICA + ITERACIÓN

### Estado actual evaluado contra criterios de éxito

| Criterio | Estado | Acción |
|---|---|---|
| Comunica quién soy | ⚠️ Parcial — about superficial | F1: Contenido completo |
| Acceso rápido a proyectos | ⚠️ 15-20s (intro + orientación) | F2: Skip intro + nav directa |
| Señal profesional fuerte | ⚠️ Sin validar | F4: Test de percepción |
| Novedad justificada | ✅ Desk scene es diferenciadora | Mantener |
| Accesibilidad base | ❌ No implementada | F5: Skip, keyboard, reduced-motion |
| Performance aceptable | ⚠️ No testeada en hardware modesto | F5: Test real |
| Estructura validable | ✅ Este documento la define | Ejecutar |
| Contenido vs experimentación separados | ⚠️ Arcade compite | F4: Decisión basada en datos |

### Decisión de la iteración

**La dirección actual (Desk Scene) es viable pero tiene gaps críticos que deben resolverse antes de cualquier mejora creativa.**

Prioridad inmediata:
1. Contenido profesional completo (el portfolio no puede evaluarse sin esto)
2. Skip intro + accesibilidad básica (excluye usuarios actualmente)
3. Validación con usuarios (no hay datos reales todavía)

NO hacer:
- No añadir HDRI, easter eggs, labels personalizados
- No crear Lab section
- No explorar nuevas direcciones creativas
- No optimizar lo que no se ha medido

---

## FASE 9: MATRIZ MANTENER / SIMPLIFICAR / POSPONER / ELIMINAR

| Feature | Mantener | Simplificar | Posponer | Eliminar |
|---|---|---|---|---|
| Desk scene 3D | ✅ | | | |
| Cámara intro cinematic | ✅ (con skip) | | | |
| Overlay portfolio en monitor | ✅ | Validar tamaño | | |
| Parallax mouse seated | ✅ | | | |
| Arcade MacBook (juegos) | | | | Evaluar en F4 |
| macOS desktop iframe | | ✅ Simplificar | | |
| Transición seated↔macbook | ✅ | | | |
| PortfolioContent mobile | ✅ | Mejorar como producto real | | |
| Primera persona | | | | ✅ No implementar |
| Mundo abierto | | | | ✅ No implementar |
| Easter eggs | | | ✅ Post-launch | |
| HDRI background | | | ✅ Post-launch | |
| Labels personalizados | | | ✅ Post-launch | |
| Loading branding | | | ✅ Post-launch | |
| Lab section | | | ✅ Depende de F4 | |
| Dual mode (A+H) | | | ✅ Evolución futura | |
| Sound/audio | | | ✅ Experimental | |

---

## RECOMENDACIÓN FINAL

### Dirección principal: Desk Scene mejorada (A)

La desk scene actual es una base sólida. No necesita más 3D. Necesita:
1. Contenido profesional real
2. Accesibilidad básica
3. Validación con usuarios

### Alternativa 1: Dual Mode (A+H)

Si la desk scene valida bien pero se necesita eficiencia para recruiters: añadir modo 2D como default con toggle a 3D. PortfolioContent ya existe como embrión.

### Alternativa 2: Lab Grid (B)

Si la desk scene no valida (percepción < 4/7 o legibilidad irrecuperable): migrar a grid 2D con thumbnails 3D interactivos. Preserva diferenciación con mejor usabilidad.

### Siguiente paso inmediato

Ejecutar Fase 0 y Fase 1 del execution plan. No explorar más direcciones creativas hasta que el contenido esté completo y se tenga al menos una ronda de validación con usuarios reales.

La creatividad del portfolio ya está implementada. Lo que falta es el fundamento profesional que le da propósito.