# Sistema Operativo de Iteración — Portfolio 3D

**Fecha:** 2026-03-19
**Complemento de:** `2026-03-19-execution-plan.md`
**Propósito:** Sistema repetible de revisión, validación, tracking y mejora.

---

## 1. BACKLOG INICIAL PRIORIZADO

### P0 — Bloquea lanzamiento

| ID | Item | Fase | Dependencia | Estado |
|---|---|---|---|---|
| B-001 | Contenido About completo (bio real, skills, idiomas, trayectoria) | F1 | — | Pendiente |
| B-002 | Proyectos con contexto profesional (problema, solución, rol, resultado) | F1 | — | Parcial (4 proyectos sin case study) |
| B-003 | Link a CV descargable (PDF) | F1 | — | Pendiente |
| B-004 | Email + LinkedIn + GitHub visibles y funcionales | F1 | — | Parcial |
| B-005 | Skip para intro cinematic | F2 | — | Pendiente |
| B-006 | Nav o acceso directo a secciones dentro del overlay | F2 | B-001, B-002 | Pendiente |
| B-007 | `prefers-reduced-motion` implementado | F5 | — | Pendiente |
| B-008 | Skip-to-content link | F5 | — | Pendiente |
| B-009 | Contraste ≥ 4.5:1 verificado en todo texto | F5 | — | No verificado |
| B-010 | Fallback 2D (PortfolioContent) con contenido completo | F1 | B-001, B-002 | Parcial |

### P1 — Importante pre-launch

| ID | Item | Fase | Dependencia | Estado |
|---|---|---|---|---|
| B-011 | Test de legibilidad del overlay con 5+ personas | F3 | B-001, B-002 | Pendiente |
| B-012 | Test de percepción profesional con 8+ personas | F4 | F3 completada | Pendiente |
| B-013 | Performance test en hardware modesto (Intel HD o equiv.) | F5 | — | Pendiente |
| B-014 | GPU detection + fallback automático a 2D | F5 | B-013 | Pendiente |
| B-015 | Keyboard navigation en capa HTML completa | F5 | — | Pendiente |
| B-016 | Focus ring visible en interactivos HTML | F5 | — | Pendiente |
| B-017 | Sentry custom events + performance transactions | F5 | — | Parcial (Sentry instalado) |
| B-018 | Analytics básicos (funnel: load → work → contact) | F6 | — | Pendiente |
| B-019 | Decisión informada sobre arcade (mantener/modificar/eliminar) | F4 | B-012 | Pendiente |
| B-020 | Cross-browser testing (Chrome, Firefox, Safari) | F6 | F5 | Pendiente |

### P2 — Post-launch

| ID | Item | Fase | Dependencia |
|---|---|---|---|
| B-021 | Reemplazar arcade con demos técnicas relevantes (si aplica) | F7 | B-019 |
| B-022 | Labels personalizados en objetos desk | F7+ | F6 |
| B-023 | HDRI environment | F7+ | F6 |
| B-024 | Loading screen con branding | F7+ | F6 |
| B-025 | Hover effects en objetos del escritorio | F7+ | F6 |

### P3 — Experimental

| ID | Item | Fase | Dependencia |
|---|---|---|---|
| B-026 | Easter eggs (Konami, F1) | F8+ | F6 lanzada |
| B-027 | Sección Lab completa | F7+ | B-019 validado positivamente |
| B-028 | Audio/sonido (mute por defecto) | F8+ | F6 lanzada |

---

## 2. CHECKLISTS POR FASE

### Checklist Fase 0: Auditoría

- [ ] Inventario de contenido actual documentado
- [ ] Gaps de contenido listados
- [ ] Screenshot del overlay a tamaño real en 1080p guardado
- [ ] FPS medido en máquina de desarrollo
- [ ] FPS medido en al menos 1 dispositivo no-dev (si disponible)
- [ ] Mapa de hipótesis H1-H7 revisado
- [ ] Bugs conocidos documentados

### Checklist Fase 1: Contenido

- [ ] About: nombre, bio de 2-3 oraciones, especialidad, skills, idiomas
- [ ] Proyecto 1: título, descripción, problema/solución, rol, tech, links
- [ ] Proyecto 2: ídem
- [ ] Proyecto 3: ídem
- [ ] Proyecto 4 (opcional): ídem
- [ ] CV: PDF generado y link funcional
- [ ] Contacto: email clickable, LinkedIn url, GitHub url
- [ ] Contenido revisado por 2 personas externas
- [ ] Mismo contenido reflejado en PortfolioContent (mobile fallback)
- [ ] Idioma decidido (EN/ES/ambos)

### Checklist Fase 2: Findability

- [ ] Mecanismo de nav implementado o justificadamente innecesario
- [ ] First-click test completado con 5+ personas
- [ ] Resultado: > 80% encuentra Work al primer intento
- [ ] Skip intro implementado y visible
- [ ] Indicador de scroll en monitor overlay (si el test revela que falta)

### Checklist Fase 3: Legibilidad

- [ ] Test de lectura con 5+ personas completado
- [ ] Tamaño de texto mínimo verificado (≥ 14px equivalente en overlay)
- [ ] Facilidad de lectura > 5/7 en encuesta
- [ ] Si falla: solución implementada (expandir overlay / ruta 2D / otro)
- [ ] Decisión documentada: contenido detallado → inline / expandido / 2D

### Checklist Fase 4: Percepción

- [ ] Encuesta con 8+ personas completada
- [ ] Profesionalidad > 5/7
- [ ] Creatividad > 5/7
- [ ] > 60% contactaría
- [ ] Test de memorabilidad a 24h completado
- [ ] > 50% recuerda al menos 1 proyecto
- [ ] Test A/B arcade completado (o decisión sin A/B documentada)
- [ ] Decisión sobre arcade documentada en decision log

### Checklist Fase 5: Tech

- [ ] FPS > 30 en hardware modesto verificado
- [ ] LCP < 2.5s en 4G simulado
- [ ] `prefers-reduced-motion` funciona (intro desactivada, parallax desactivado)
- [ ] Skip-to-content funciona
- [ ] Keyboard navigation: Tab recorre todos los interactivos HTML
- [ ] Focus ring visible en todos los elementos focusables
- [ ] Contraste ≥ 4.5:1 verificado (axe o manual)
- [ ] Lighthouse accessibility > 90
- [ ] GPU detection implementada
- [ ] Fallback automático funciona si FPS < 25
- [ ] Sentry: performance transactions configuradas
- [ ] Sentry: webglcontextlost capturado
- [ ] web-vitals reportando

### Checklist Fase 6: Integración

- [ ] Contenido final cargado
- [ ] QA de navegación pasada
- [ ] QA de discoverability pasada
- [ ] QA visual pasada
- [ ] QA de contenido pasada
- [ ] QA de accesibilidad pasada
- [ ] QA de rendimiento pasada
- [ ] Cross-browser: Chrome ✓, Firefox ✓, Safari ✓
- [ ] Cross-resolution: 1080p ✓, 1440p ✓
- [ ] Mobile fallback verificado
- [ ] Meta tags y OG image configurados
- [ ] Sentry verificado (test error capturado)
- [ ] Analytics verificados (test event recibido)
- [ ] Error handling: WebGL context lost → mensaje amigable + fallback

### Checklist Fase 7: Lab (condicional)

- [ ] Decisión arcade ejecutada (de F4)
- [ ] Si Lab: 2-3 demos técnicas relevantes implementadas
- [ ] Si Lab: cada demo aislada en su propio canvas
- [ ] Si Lab: fallback estático (GIF/video) para mobile
- [ ] Lab no compite con Work en prominencia

### Checklist Fase 8: Launch

- [ ] QA final completada (re-run de todas las checklists)
- [ ] Performance retest OK
- [ ] Accessibility retest OK
- [ ] 3 personas nuevas completan T1-T6 exitosamente
- [ ] 3-5 hiring managers/recruiters dan feedback positivo
- [ ] Analytics funcionales
- [ ] Sentry funcional
- [ ] Domain configurado
- [ ] Deploy exitoso
- [ ] Smoke test post-deploy en producción

---

## 3. SCORECARDS DE VALIDACIÓN

### Scorecard: Percepción profesional

```
Evaluador: ________________  Fecha: ________  Dispositivo: ________

Después de explorar el portfolio durante 2 minutos:

1. Profesionalidad    [1] [2] [3] [4] [5] [6] [7]
2. Creatividad        [1] [2] [3] [4] [5] [6] [7]
3. Claridad           [1] [2] [3] [4] [5] [6] [7]
4. Facilidad de uso   [1] [2] [3] [4] [5] [6] [7]

5. ¿Qué hace esta persona? ________________________________
6. ¿Qué proyectos recuerdas? ________________________________
7. ¿La contactarías para un rol técnico?  [ ] Sí  [ ] No  [ ] Tal vez
8. ¿El formato ayuda o distrae?  [ ] Ayuda  [ ] Neutro  [ ] Distrae
9. Comentario libre: ________________________________

Score total: __/28 (target > 20)
```

### Scorecard: Task completion

```
Participante: ________  Fecha: ________  Dispositivo: ________

Tarea                          | Éxito | Tiempo | Errores | Notas
-------------------------------|-------|--------|---------|------
T1: ¿Qué hace esta persona?   | S/N   | ___s   | ___     |
T2: Encuentra proyecto de IA   | S/N   | ___s   | ___     |
T3: ¿Qué tech usa?            | S/N   | ___s   | ___     |
T4: Encuentra contacto         | S/N   | ___s   | ___     |
T5: Descarga CV                | S/N   | ___s   | ___     |
T6: Vuelve a lista proyectos   | S/N   | ___s   | ___     |

Success rate: __/6 (target > 5/6)
Avg time: ___s
Total errors: ___
```

### Scorecard: Performance

```
Dispositivo: ________________  GPU: ________________
Browser: ________  Resolución: ________  Fecha: ________

Métrica              | Valor   | Target  | Status
---------------------|---------|---------|-------
FPS medio            | ___     | > 45    | OK/FAIL
FPS P25              | ___     | > 30    | OK/FAIL
LCP                  | ___s    | < 2.5s  | OK/FAIL
TBT                  | ___ms   | < 200ms | OK/FAIL
CLS                  | ___     | < 0.1   | OK/FAIL
GLB load time        | ___s    | < 3s    | OK/FAIL
Total JS bundle      | ___KB   | < 500KB | OK/FAIL
Memoria pico         | ___MB   | < 300MB | OK/FAIL
WebGL crashes        | ___     | 0       | OK/FAIL
```

### Scorecard: Accesibilidad

```
Fecha: ________  Herramienta: ________

Check                                    | Status | Notas
-----------------------------------------|--------|------
Keyboard: Tab navega todos interactivos  | P/F    |
Keyboard: Enter/Space activa buttons     | P/F    |
Keyboard: No hay traps                   | P/F    |
Focus ring visible                       | P/F    |
Skip-to-content funcional                | P/F    |
prefers-reduced-motion respetado         | P/F    |
Contraste texto ≥ 4.5:1                  | P/F    |
Screen reader lee contenido completo     | P/F    |
Alt text en imágenes                     | P/F    |
HTML semántico (headings, landmarks)     | P/F    |
Lighthouse accessibility score           | ___/100|
axe violations críticas                  | ___    |
axe violations serias                    | ___    |

Pass: 0 critical, < 3 serious, Lighthouse > 90
```

---

## 4. PLANTILLAS

### 4.1 Plantilla de Issue Log

```markdown
## Issue Log — [Fase X]

| ID | Fecha | Categoría | Descripción | Severidad | Estado | Asignado | Resolución |
|---|---|---|---|---|---|---|---|
| ISS-001 | YYYY-MM-DD | QA-XX | Descripción breve | P0/P1/P2/P3 | Abierto/En progreso/Cerrado | — | — |

### Categorías:
- NAV: Navegación
- DISC: Discoverability
- LEG: Legibilidad
- ACC: Accesibilidad
- PERF: Performance
- VIS: Visual
- CONT: Contenido
- INT: Interacción
- STAB: Estabilidad

### Severidades:
- P0: Bloquea lanzamiento. Fix inmediato.
- P1: Degrada experiencia significativamente. Fix antes de launch.
- P2: Problema menor. Fix en siguiente iteración.
- P3: Mejora cosmética. Backlog.
```

### 4.2 Plantilla de Decision Log

```markdown
## Decision Log

| ID | Fecha | Decisión | Contexto | Alternativas consideradas | Evidencia | Resultado esperado | Revisable en |
|---|---|---|---|---|---|---|---|
| DEC-001 | YYYY-MM-DD | Qué se decidió | Por qué se necesitaba decidir | Opciones A, B, C | Qué datos informaron la decisión | Qué se espera lograr | Cuándo re-evaluar |
```

### 4.3 Plantilla de Readout (reporte de hallazgos)

```markdown
## Readout — [Método] — [Fecha]

### Contexto
- Fase: X
- Método: (test de 5 seg / prueba de tareas / encuesta / etc.)
- Muestra: N personas (descripción del perfil)

### Hallazgos principales
1. Hallazgo con dato concreto
2. Hallazgo con dato concreto
3. Hallazgo con dato concreto

### Métricas
| Métrica | Resultado | Target | Status |
|---|---|---|---|
| ... | ... | ... | OK/FAIL |

### Citas textuales relevantes
- "..." — Participante X (perfil)

### Interpretación
Qué significan estos hallazgos para el proyecto.

### Decisiones derivadas
| Decisión | Acción | Prioridad |
|---|---|---|
| ... | ... | P0/P1/P2 |

### Qué validar next
Lo que estos hallazgos sugieren investigar a continuación.
```

### 4.4 Plantilla de QA UX

```markdown
## QA UX — [Fecha] — [Fase X]

### Navegación
- [ ] Work accesible desde cualquier estado
- [ ] Contact accesible desde cualquier estado
- [ ] Transición seated↔macbook funciona
- [ ] Back/retorno funciona en ambas direcciones
- [ ] Skip intro funciona

### Discoverability
- [ ] Monitor overlay indica que es scrollable
- [ ] CTA arcade visible pero no dominante
- [ ] Interactivos del desk son descubribles

### Tareas
- [ ] T1: Identidad en < 5s ✓
- [ ] T2: Primer proyecto en < 15s ✓
- [ ] T3: Contacto en < 2 clics ✓
- [ ] T4: CV descargable ✓
- [ ] T5: Volver a proyectos ✓

### Issues encontrados
| ID | Descripción | Severidad |
|---|---|---|
```

### 4.5 Plantilla de QA Accesibilidad

```markdown
## QA Accesibilidad — [Fecha]

### Keyboard
- [ ] Tab order lógico
- [ ] Todos los interactivos alcanzables con Tab
- [ ] Enter/Space activa elementos
- [ ] Escape cierra modales/overlays
- [ ] No keyboard traps
- [ ] Focus ring visible en cada elemento

### Motion
- [ ] prefers-reduced-motion desactiva: intro animation, parallax, transitions
- [ ] Versión sin motion es funcional

### Screen Reader
- [ ] Contenido completo legible
- [ ] Headings con jerarquía correcta (h1 > h2 > h3)
- [ ] Links tienen texto descriptivo
- [ ] Imágenes tienen alt text
- [ ] Landmarks presentes (nav, main, footer)

### Contraste
- [ ] Body text: ratio ≥ 4.5:1
- [ ] Headings: ratio ≥ 3:1
- [ ] Links distinguibles sin color

### Herramientas
- [ ] axe DevTools: 0 critical, 0 serious
- [ ] Lighthouse accessibility: > 90
```

### 4.6 Plantilla de QA Performance

```markdown
## QA Performance — [Fecha]

### Dispositivo: ________________
### GPU: ________________
### Browser/versión: ________________

### Métricas
| Métrica | Valor | Target | Pass |
|---|---|---|---|
| FPS estable (después de intro) | | > 30 | |
| LCP | | < 2.5s | |
| TBT | | < 200ms | |
| CLS | | < 0.1 | |
| First paint | | < 1s | |
| GLB load | | < 3s | |
| JS bundle (gzip) | | < 300KB | |
| Total transfer | | < 5MB | |

### Observaciones
- ¿Stuttering visible? S/N
- ¿Ventilador se activa? S/N
- ¿Calentamiento perceptible? S/N (mobile)
- ¿Transiciones suaves? S/N
```

---

## 5. MATRIZ DE SEVERIDAD DE ERRORES

| Severidad | Nombre | Definición | Ejemplos | Acción | Plazo |
|---|---|---|---|---|---|
| **P0** | Bloqueante | Impide completar tareas primarias. Excluye usuarios. Crash. | WebGL crash. No se puede ver Work. Keyboard trap. Texto invisible. | Fix inmediato. Bloquea deploy. | Antes de cualquier otra cosa. |
| **P1** | Crítico | Degrada experiencia significativamente. Afecta percepción. | FPS < 20. Overlay desalineado. Case study ilegible. Arcade rompe nav. | Fix antes de launch. | Dentro de la fase actual. |
| **P2** | Importante | Problema notable pero no bloquea tareas. | Hover effect no funciona. Scroll indicator ausente. Minor contrast issue. | Fix en siguiente iteración. | Dentro de 2 fases. |
| **P3** | Menor | Cosmético o edge case. | Typo. Color ligeramente off. Animation easing subóptimo. | Backlog. | Cuando haya tiempo. |

### Criterios para cerrar issues

| Criterio | Detalle |
|---|---|
| **P0** | Fix verificado en al menos 2 dispositivos. No regresión. |
| **P1** | Fix verificado. Test que lo detectó ahora pasa. |
| **P2** | Fix implementado. Visual check. |
| **P3** | Fix implementado. |
| **Won't fix** | Documentado con justificación. Aprobado en decision log. |
| **Duplicate** | Linked al issue original. |

---

## 6. CRITERIOS PARA AVANZAR O VOLVER ATRÁS

### Avanzar a siguiente fase

| Condición | Obligatoria |
|---|---|
| Todas las items P0 del checklist de la fase están completados | Sí |
| No hay issues P0 abiertos | Sí |
| No hay más de 3 issues P1 abiertos | Sí |
| Gate de la fase pasado (ver sección 4 del execution plan) | Sí |
| Self-critique loops ejecutados sin fail | Sí |

### Volver a fase anterior

| Señal | Acción |
|---|---|
| Test de usuarios revela que contenido es insuficiente | Volver a F1 |
| Findability test falla después de cambios | Volver a F2 |
| Nuevo contenido rompe legibilidad | Volver a F3 |
| Cambio técnico rompe performance | Volver a F5 |
| Issue P0 descubierto post-gate | Fix + re-run gate |

### Simplificar alcance

| Señal | Acción |
|---|---|
| Fase toma > 2x el tiempo estimado | Reducir entregables a mínimos |
| 3+ iteraciones sin pasar gate | Eliminar la feature más costosa |
| Performance irrecuperable | Eliminar post-processing, luego reducir escena |
| Accesibilidad irrecuperable en 3D | Migrar a 2D con acentos 3D |

---

## 7. FORMATO DE REPORTE POR ITERACIÓN

```markdown
## Reporte de Iteración #__

**Fecha:** YYYY-MM-DD
**Fase:** X
**Duración:** X horas/días

### Resumen ejecutivo
1-2 oraciones sobre qué se hizo y qué se aprendió.

### Trabajo completado
- [ ] Item 1
- [ ] Item 2
- [x] Item 3 (completado)

### Validación ejecutada
| Test | Resultado | Pass/Fail |
|---|---|---|
| ... | ... | ... |

### Issues encontrados
| ID | Severidad | Descripción |
|---|---|---|
| ISS-XXX | PX | ... |

### Decisiones tomadas
| ID | Decisión | Evidencia |
|---|---|---|
| DEC-XXX | ... | ... |

### Self-critique loop results
| Loop | Resultado | Acción |
|---|---|---|
| Estratégico | Pass/Fail | ... |
| UX | Pass/Fail | ... |
| Accesibilidad | Pass/Fail | ... |
| Performance | Pass/Fail | ... |
| Hiring perspective | Pass/Fail | ... |

### Métricas clave
| Métrica | Valor | Target | Delta vs anterior |
|---|---|---|---|

### Bloqueantes
- Bloqueante 1 (si hay)

### Plan para siguiente iteración
1. Prioridad 1
2. Prioridad 2
3. Prioridad 3

### ¿Listo para avanzar de fase?
[ ] Sí — todos los gates pasan
[ ] No — pendiente: _______________
```

---

## 8. INTEGRACIÓN CON SENTRY

### Eventos a trackear

| Evento Sentry | Tipo | Trigger | Severidad | Acción |
|---|---|---|---|---|
| `webglcontextlost` | Error | GPU sin memoria o crash | P0 | Fallback automático + log |
| `scene_load_failed` | Error | GLB no carga | P0 | Mostrar fallback 2D |
| `shader_compile_error` | Error | Shader incompatible con GPU | P1 | Fallback sin post-processing |
| `overlay_projection_error` | Error | Overlay se posiciona fuera de viewport | P1 | Usar posición fallback fija |
| `iframe_load_error` | Error | Arcade iframe falla | P2 | Ocultar arcade, mostrar mensaje |
| `unhandled_rejection` | Error | Cualquier promise sin catch | P1 | Investigar |
| `performance.lcp` | Transaction | LCP medido | Informativo | Alerta si > 4s |
| `performance.scene_load` | Transaction | Tiempo de carga de escena | Informativo | Alerta si > 8s |
| `performance.mode_transition` | Transaction | Tiempo de transición seated↔macbook | Informativo | Alerta si > 3s |

### Tags personalizados

```javascript
Sentry.setTag('gpu_renderer', renderer.info) // Intel HD, NVIDIA, etc.
Sentry.setTag('webgl_available', hasWebGL)
Sentry.setTag('reduced_motion', prefersReducedMotion)
Sentry.setTag('device_tier', 'high|medium|low')
Sentry.setTag('experience_mode', 'full_3d|fallback_2d|mobile')
```

### Breadcrumbs

```javascript
// Registrar transiciones de modo para contexto en errores
Sentry.addBreadcrumb({ category: 'mode', message: 'seated → macbook' })
Sentry.addBreadcrumb({ category: 'interaction', message: 'project_opened: clara' })
Sentry.addBreadcrumb({ category: 'performance', message: `fps_drop: ${fps}` })
```

### Alertas Sentry recomendadas

| Alerta | Condición | Acción |
|---|---|---|
| WebGL crash rate > 1% | `webglcontextlost` > 1% de sesiones en 24h | Investigar GPU específica, reducir VRAM |
| LCP degradation | LCP P75 > 4s por 2 días consecutivos | Revisar assets, CDN, bundle |
| Error spike | > 10 errores/hora (baseline es ~0) | Investigar inmediatamente |
| Mobile errors | Cualquier error en mobile fallback | Fix P0 — mobile debe ser estable |

---

*Este sistema está diseñado para ser repetible. Usa las plantillas en cada iteración, llena los scorecards en cada validación, documenta decisiones en el decision log, y ejecuta self-critique loops antes de cada merge.*