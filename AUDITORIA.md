# Auditoría pre-producción — cozeta.es

Revisión completa del sitio antes del despliegue en AWS.
Estado inicial: commit `0f4c4f6`. Fecha de auditoría: 2026-09-09.

Leyenda: `[x]` hecho · `[ ]` pendiente · `[!]` PENDIENTE de dato o decisión del cliente

---

## Resumen ejecutivo

Se han encontrado y corregido **46 problemas reales**. Los cinco más graves:

| # | Problema | Impacto |
|---|---|---|
| 1 | El mapa de Google Maps se carga **antes** de aceptar cookies | Incumplimiento RGPD/LSSI sancionable |
| 2 | Errata en el H1 de `/empresa/`: "sector pretrolifero" | Visible, en el encabezado principal |
| 3 | El motor 3D (1 MB / 280 KB gz) + modelo (472 KB) están en el hero de la home | LCP en móvil |
| 4 | 11 de 17 `<title>` están por debajo de 50 caracteres y sin keyword local | Pérdida de posicionamiento |
| 5 | `README.md` interno y `.DS_Store` se publican en el sitio | Fuga de notas internas |

---

## 1. Contenido y redacción

### 1.1 Ortografía y gramática

- [x] **CRÍTICO** — `src/pages/empresa/index.astro:37`: H1 dice *"Más de 30 años en el sector **pretrolifero**"*. Doble error: transposición de letras y falta de tilde. Correcto: *"petrolífero"*.
- [x] `src/pages/politica-de-cookies/index.astro`: carácter suelto `e` antes de `<h2>3.` (corregido en commit anterior, verificado).
- [x] Revisados los 7 ficheros de `src/content/servicios/*.md`: tildes, concordancia y puntuación correctas. Sin cambios necesarios.
- [x] Comillas y guiones: el sitio usa correctamente `—` (raya) y comillas tipográficas. Excepción corregida: `'as built'` en `ingenieria.md` usaba comillas rectas.

### 1.2 Tratamiento (tú / vosotros) — **estaba mezclado**

El sitio usa **vosotros** en todo el contenido comercial (dirigido a la empresa cliente), pero estos puntos usaban **tú**:

- [x] `src/pages/404.astro` — página entera en tú ("Prueba a volver", "¿Prefieres hablar con nosotros? Llámanos").
- [x] `src/components/CookieBanner.astro` — "Puedes aceptarlas".
- [x] `src/pages/politica-de-cookies/index.astro` — "te explicamos", "tu navegador", "Puedes".
- [x] `src/pages/politica-de-privacidad/index.astro` — "nos facilitas", "tus datos", "Puedes ejercer".
- [x] `src/pages/contacto/index.astro:51` — mensaje de error "Prueba de nuevo o escríbenos".
- [x] `src/pages/contacto/index.astro:20` — meta description "para **tu** instalación".
- [x] `src/components/LogoModel3D.astro:13` — alt "arrástra**lo** para girarlo".

**Decisión aplicada:** se unifica todo en **vosotros**, que ya era el registro dominante (~90 % del contenido) y encaja con un cliente B2B (operadores, cooperativas, administraciones). Incluye botones, formularios, errores y textos legales.

### 1.3 Repeticiones detectadas (lista solicitada antes de reescribir)

| Texto repetido | Veces | Dónde |
|---|---|---|
| `¿Necesitáis una instalación nueva o una revisión?` | 8 | `CtaBanner` (7 páginas) + sección `.closing` de la home |
| `Contadnos qué necesitáis y os preparamos un presupuesto sin compromiso.` | 8 | Igual que la anterior |
| `¿Hablamos de vuestro proyecto?` + `Contadnos qué necesitáis y os preparamos una propuesta técnica y económica sin compromiso.` | 7 | Aside de cada página de servicio |
| `Contadnos qué necesitáis…` (4 variantes casi idénticas) | 4 | `CtaBanner`, home, aside de servicio, intro de contacto |
| `Pedir presupuesto` (único CTA del sitio) | 66 | Todo el sitio |
| `Ver servicios` | 3 | Home, 404 |

Problema de fondo: en **cada página de servicio aparecen dos CTA casi idénticos** (el aside lateral y el banner final), separados por dos secciones. Y la home **duplica a mano el componente `CtaBanner`** en su sección de cierre, con exactamente los mismos textos.

- [x] Home: sección `.closing` reescrita para no repetir el `CtaBanner` (cambia el ángulo: refuerza cercanía/plazo en vez de repetir la oferta de presupuesto).
- [x] Aside de página de servicio: texto propio por servicio, ya no clona el banner final.
- [x] `CtaBanner` con variantes por contexto en vez de un único texto por defecto.
- [x] CTA diversificados: "Pedir presupuesto", "Solicitar visita técnica", "Contar mi proyecto", "Hablar con un técnico", etc., según la página.

### 1.4 Coherencia de nombres y datos

- [x] Nombre de empresa: `site.legalName` es *COZETA Tecnología y Construcción SL*, pero el `alt` de los logos, la meta description del aviso legal y el README seguían diciendo *COZETA Instalaciones Petrolíferas*.
- [x] Se introduce `site.tradeName` (*COZETA Instalaciones Petrolíferas*, nombre comercial) separado de `site.legalName` (razón social), y cada sitio usa el que corresponde: razón social en textos legales y copyright; nombre comercial en marca, `alt` y Open Graph.
- [x] Teléfono: formato único `96 380 87 62` en pantalla y `+34963808762` en `tel:` — ya era coherente, verificado en las 17 páginas.
- [x] Email: `info@cozeta.es` en todas partes, verificado.
- [x] `site.mapsEmbedQuery` usa el nombre comercial. **Comprobado en Google Maps:** la ficha existe como *Cozeta Instalaciones Petroliferas* (4,7 ★ con 11 opiniones, teléfono y web correctos) y el pin resuelve bien. No hay que tocar nada.

### 1.5 Encabezados decorativos o vacíos

- [x] Home: `<h2 class="visually-hidden">Servicios</h2>` era un encabezado genérico e invisible. Sustituido por un H2 real y descriptivo, visible.
- [x] `/proyectos/` y `/servicios/`: no tenían H2 (ver 2.3).

---

## 2. SEO on-page

### 2.1 Titles

Antes: 11 de 17 títulos por debajo de 50 caracteres, sin keyword ni referencia local.

- [x] Reescritos todos los títulos a 50-60 caracteres, keyword principal delante y marca al final.
- [x] Verificado que no hay duplicados.

### 2.2 Meta descriptions

- [x] Home: 192 caracteres (se truncaba en Google) → reducida al rango.
- [x] `/proyectos/` (123), `/servicios/ingenieria/` (127), `/servicios/puertos/` (126), `/politica-de-cookies/` (111): ampliadas.
- [x] Todas con propuesta de valor + llamada a la acción. Sin duplicados.
- [x] Las descripciones de servicio ya no son idénticas al párrafo de introducción visible: `description` (meta, con CTA) e `intro` (texto en página) son campos separados.

### 2.3 Jerarquía de encabezados

- [x] `/proyectos/`: saltaba de H1 a H3 (las tarjetas eran H3 sin H2 por encima). Añadido H2 de sección.
- [x] `/servicios/`: mismo salto H1 → H3 en las `ServiceCard`. Añadido H2 de sección.
- [x] Verificado: 1 solo H1 por página en las 17 páginas.

### 2.4 URLs

- [x] Todas en minúsculas, con guiones, coherentes con la estructura (`/servicios/<slug>/`). Sin cambios necesarios.
- [x] `trailingSlash` fijado explícitamente (ver 3.1).

### 2.5 Enlazado interno y páginas huérfanas

- [x] Verificado con el build: **0 enlaces internos rotos**.
- [x] `/contacto/gracias/` era huérfana **e indexable**, y estaba en el sitemap. Ahora `noindex` + excluida del sitemap (es una página de destino post-envío, no de búsqueda).
- [x] `/404.html` huérfana: correcto, ya estaba fuera del sitemap.
- [x] Anchor text: no había ningún "haz clic aquí". Sí había 66 anclas idénticas (`Pedir presupuesto`) — diversificadas.
- [x] Añadido enlazado interno contextual entre servicios relacionados (antes cada página de servicio solo recibía 3 enlaces).

### 2.6 Imágenes

- [x] `alt` de las fotos del equipo era `"Foto de X"` (redundante) → ahora describe persona y cargo.
- [x] `alt` de las fotos de obra era solo el nombre (`"Benzoil"`) → ahora descriptivo.
- [x] `alt=""` correcto en las imágenes decorativas de la home (duplicadas del índice).
- [x] Nombres de archivo: `team-luis-cuenca-hijo.jpg` exponía la relación familiar en una URL pública → renombrado.
- [x] Carpeta `public/images/placeholders/` contenía fotos reales y se servía con esa URL → renombrada a `public/images/equipo/`.

### 2.7 Enlaces externos

- [x] No hay ningún enlace externo con `target="_blank"` en el sitio. Los únicos recursos externos son el iframe de Maps y las fuentes de Google. Sin acción necesaria sobre `rel`.

---

## 3. SEO técnico

- [x] **3.1** `astro.config.mjs` no fijaba `trailingSlash` ni `build.format`: `/empresa` y `/empresa/` podían resolver ambas. Fijado `trailingSlash: 'always'` + `build.format: 'directory'`, coherente con los canonical y con la configuración de CloudFront documentada en `DEPLOY.md`.
- [x] **3.2** Componente SEO: `Layout.astro` ya obligaba `title` y `description` por props de TypeScript (no se puede olvidar ninguna). Ampliado con `keywords`, `ogType` y `noindex`, y extraído el `<head>` a `src/components/Seo.astro`.
- [x] **3.3** `site` configurado y `@astrojs/sitemap` generando `/sitemap-index.xml`; `robots.txt` lo referencia. Verificado en el build.
- [x] **3.4** Canonical presente en las 17 páginas. Verificado.
- [x] **3.5** JSON-LD: había `LocalBusiness` (incompleto), `Service` y `FAQPage`. Añadidos `WebSite` y `BreadcrumbList`; `LocalBusiness` completado con `logo`, `image`, `geo`, `openingHoursSpecification`, `priceRange` y `areaServed` real.
- [x] **3.6** Open Graph: faltaban `og:image:width`, `og:image:height` y `og:image:alt`. Añadidos. Imagen social verificada a 1200×630.
- [x] **3.7** Favicon: había `favicon.svg`, `favicon.ico` y `apple-touch-icon.png` (180×180). Faltaba `site.webmanifest` → añadido.
- [x] **3.8** `lang="es"`, `charset` y `viewport` correctos. Verificado.
- [x] **3.9** Página 404 personalizada: existe y es útil. Añadidos enlaces a las secciones principales.
- [x] **3.10** `hreflang`: no aplica, el sitio es monolingüe. Documentado.
- [x] **3.11** `dist/.DS_Store` y `dist/images/placeholders/README.md` se publicaban. El README interno era accesible en `https://www.cozeta.es/images/placeholders/README.md` e incluía notas internas sobre la procedencia de las fotos. Ambos eliminados del build. Verificado: el `dist` final no contiene ningún `.md`, `.DS_Store` ni `.env`.

---

## 4. Rendimiento y Core Web Vitals

### Qué limita cada métrica (medido sobre el build de producción)

| Métrica | Limitante detectado | Acción |
|---|---|---|
| **LCP** | En móvil, `.hero-media` (el logo 3D) se coloca *encima* del H1 (`order: -1`). El `<canvas>` solo pinta tras descargar 1 MB de JS + 472 KB de GLB. | 3D diferido y fuera del camino crítico; el H1 pasa a ser el LCP |
| **LCP** | Fuentes cargadas con `@import` dentro del CSS → cadena HTML → CSS → CSS de Google → WOFF2 | `preconnect` + `<link>` directo en el `<head>` |
| **CLS** | `.preview-img` y `.index-thumb` sin `width`/`height` | Dimensiones explícitas |
| **INP** | `requestAnimationFrame` infinito en `PaywayViewer`, incluso con el modelo fuera de pantalla y con el balanceo pausado | Se detiene el bucle fuera del viewport |

- [x] **4.1** Motor 3D: `@google/model-viewer` pesa **1,0 MB sin comprimir / 280 KB gzip**, más `cozeta-mark.glb` (472 KB) y `payway-classic.glb` (157 KB). Verificado que Astro **no** lo inyecta en las páginas de servicio que no lo usan (solo `/` y `/servicios/medios-de-pago/`), eso ya estaba bien.
- [x] **4.2** Carga diferida: ambos visores importan el motor bajo demanda (`IntersectionObserver` + `requestIdleCallback`), con póster visible desde el primer pintado. El hero deja de competir por ancho de banda con el LCP.
- [x] **4.3** El póster del logo 3D era `/favicon.svg` (un icono diminuto estirado). Sustituido por un póster real.
- [x] **4.4** Fuentes: se cargaban 12 archivos desde Google. **Unbounded 500, 800 y 900 y JetBrains Mono 600 no se usan en ninguna parte** del CSS.
- [x] **4.5** Fuentes **autoalojadas** en `public/fonts/` (`src/styles/fonts.css`): solo subconjunto latin y solo los 8 pesos en uso. Además de quitar la cadena de peticiones, elimina el envío de la IP del visitante a Google, que es el mismo problema de RGPD que tenía el mapa (ver 7.1). `font-display: swap` conservado y precarga de las dos fuentes del primer texto visible. **Cero peticiones externas en todo el sitio**, verificado en el navegador.
- [x] **4.6** Islas hidratadas: el proyecto **no usa ningún framework de UI ni directivas `client:*`**. Todo el JS es vanilla en `<script>` de componente, que Astro ya difiere con `type="module"`. Nada que optimizar aquí.
- [x] **4.7** Imágenes migradas a `astro:assets` (`src/assets/`): WebP con `srcset` y `sizes`, `width`/`height` explícitos. Ahorros reales del build: Benzoil 79→23 kB, LOWCOST 75→21 kB, póster PAYWAY 88→14 kB. Siguen en `public/` solo las que se referencian por URL absoluta: imagen OG, favicons y modelos `.glb`.
- [x] **4.8** Warning del build "chunks larger than 500 kB": procede de `model-viewer`, que es una dependencia externa de tamaño fijo. Silenciado de forma explícita y justificada con `chunkSizeWarningLimit`, para que el build quede limpio sin ocultar avisos propios.
- [x] **4.9** `scroll-behavior: smooth` global sin excepción para `prefers-reduced-motion`. Corregido.
- [x] **4.10** CSS/JS muerto: revisado. Sin dependencias sin usar en `package.json` (`astro`, `@astrojs/sitemap` y `@google/model-viewer`, las tres en uso).
- [x] **4.11** `public/logos/` publicaba **16 ficheros**, de los que el sitio solo usa 3. Los otros 13 (PNG y variantes para papelería) se servían en producción sin que nadie los pidiera. Movidos a `marca/`, fuera del build.
- [x] **4.12** Resultado medido sobre el build de producción: la home arranca con **~3 kB de JavaScript propio** (antes 280 kB gzip de motor 3D en el camino crítico) y el peso total publicado baja de 4,3 MB a **3,6 MB**. **CLS medido = 0**.

> **Nota honesta sobre LCP/INP:** no se han podido medir de forma fiable en este entorno (el panel del navegador no pinta de forma continua, y `astro preview` no reproduce la compresión ni la latencia de CloudFront). Los cambios atacan las causas identificadas, pero **la medición real hay que hacerla con PageSpeed Insights una vez desplegado**. Está incluido en el checklist final de `DEPLOY.md`.

---

## 5. Accesibilidad

- [x] **5.1 (bug real)** El menú móvil cerrado (`max-height: 0; overflow: hidden`) mantenía sus **7 enlaces enfocables con teclado**. Verificado en navegador: con `data-open="false"`, `visibility: visible` y `tabIndex = 0`. Un usuario de teclado tabulaba por enlaces invisibles. Corregido con `visibility: hidden` transicionada, y **verificado después**: con el menú cerrado el enlace ya no acepta foco; abierto sí. Añadido además cierre con `Escape`.
- [x] **5.2** El botón de menú siempre anunciaba "Abrir menú", incluso abierto. Ahora alterna a "Cerrar menú".
- [x] **5.3** Áreas táctiles: los enlaces del menú móvil medían 20-21 px de alto (mínimo WCAG 2.2 AA: 24 px). Ampliados a 44 px.
- [x] **5.4** El `alt` del logo duplicaba el `aria-label` del enlace que lo envuelve (doble anuncio en lector de pantalla). El `alt` pasa a vacío.
- [x] **5.5** El banner de cookies usaba `role="dialog"` sin ser un diálogo real (no atrapa foco, no es modal). Cambiado a `role="region"` con `aria-label`, que es lo correcto para un aviso no modal.
- [x] **5.6** Contraste: verificados los pares de color reales del sitio. Todos superan AA (el más ajustado, `--color-secondary` #3F7D5A sobre blanco, da 4,9:1). Sin cambios.
- [x] **5.7** Foco visible: `:focus-visible` con `outline` de 3 px ya estaba bien resuelto en `global.css`.
- [x] **5.8** HTML semántico: `header`, `nav`, `main`, `section`, `footer` y skip link ya estaban correctos.
- [x] **5.9** Formulario: todos los campos tienen `label` real asociado y `autocomplete`. Verificado en navegador. Añadida asociación de errores con `aria-describedby`.

---

## 6. Formulario (Formspree — proveedor sin cambios)

- [x] **6.1** `FORMSPREE_ID` estaba escrito a fuego en `src/pages/contacto/index.astro:11`. Movido a variable de entorno `PUBLIC_FORMSPREE_ID`, con `.env.example` documentado.
- [x] **6.2** Validación en cliente antes de enviar, con mensajes propios en español y foco en el primer campo inválido.
- [x] **6.3** Estado de carga: el botón pasa a "Enviando…" y se deshabilita.
- [x] **6.4** Éxito sin salir de la página: mensaje de confirmación en el propio formulario. `/contacto/gracias/` se conserva como destino del envío sin JavaScript (`_next` de Formspree).
- [x] **6.7** Validación verificada en navegador: con el formulario vacío muestra los 4 errores de campo, marca `aria-invalid`, lleva el foco al primero y **no navega**.
- [!] **No se ha hecho un envío real** para no mandar un mensaje de prueba al buzón actual. Queda en el checklist de `DEPLOY.md` como comprobación obligatoria en producción.
- [x] **6.5** Honeypot `_gotcha` activo. Verificado.
- [x] **6.6** Casilla de consentimiento obligatoria con enlace a la política de privacidad. Verificado.
- [!] **PENDIENTE (cliente)**: cambiar el destinatario a `info@cozeta.es` en `formspree.io/forms/<ID>/settings` → *Emails* cuando haya acceso, y hacer un envío de prueba real en producción.

---

## 7. Confianza y cumplimiento

- [x] **7.1 CRÍTICO (RGPD/LSSI)** — El iframe de Google Maps en `/contacto/` se cargaba **inmediatamente**, antes de cualquier consentimiento, enviando la IP del visitante a Google. Sustituido por carga bajo demanda: se muestra un marcador con aviso y el mapa solo se carga tras aceptar cookies o al pulsar el usuario. **Verificado en navegador:** sin consentimiento, 0 iframes y 0 peticiones a Google; al pulsar «Aceptar todas», el mapa se monta correctamente.
- [x] **7.2** El banner decía *"para analizar la navegación"* cuando **no hay ninguna herramienta de analítica instalada**. Texto corregido para reflejar la realidad (cookies técnicas + mapa de terceros).
- [x] **7.3** Consentimiento previo: no hay analítica que bloquear; el único tercero (Maps) queda ahora efectivamente bloqueado hasta el consentimiento.
- [x] **7.4** Datos legales reales (CIF `B97651905`, Registro Mercantil de Valencia, domicilio social) presentes en aviso legal, privacidad y footer.
- [x] **7.5** Formspree citado como encargado del tratamiento, con mención de la transferencia internacional (EU-US Data Privacy Framework). Google Maps citado en privacidad y cookies.
- [x] **7.6** Datos de contacto completos y clicables (`tel:` y `mailto:`) en header, footer y contacto.
- [x] **7.7** Sin Lorem ipsum, sin enlaces `#` muertos, sin imágenes placeholder. Verificado por búsqueda en todo el árbol.
- [x] **7.8** Revisado en 375 px, 768 px y escritorio: sin desbordamiento horizontal en ninguna página.
- [!] **PENDIENTE (cliente)**: las fotos del equipo de Luis J. Cuenca, Daniel Laínez y Mª Ángeles Ibáñez son de **150×150 px**, insuficientes para pantallas de alta densidad (se ven blandas a 140 px en retina). Conviene sustituirlas por retratos de 480×480 px o más.

---

## 8. Preparación para el despliegue en AWS

- [x] **8.1** `npm run build` genera salida estática sin errores. Warning de tamaño de chunk resuelto (ver 4.8).
- [x] **8.2** `npm run preview` verificado: idéntico a desarrollo.
- [x] **8.3** Sin referencias a `localhost`, sin claves ni endpoints en el código. Verificado por búsqueda.
- [x] **8.4** `.env.example` creado y documentado.
- [x] **8.5** `.gitignore`: `dist/`, `node_modules/`, `.env`, `.DS_Store` correctamente ignorados. Verificado que no hay `.env` ni `.DS_Store` versionados.
- [x] **8.6** Archivos de desarrollo que no deben acabar en el build: `.DS_Store` y `README.md` de imágenes, eliminados.
- [x] **8.7** `dev.sh` apuntaba a `$HOME/.local/node/bin`, una ruta de otra máquina. Eliminado (se usa `npm run dev`).
- [x] **8.8** La configuración local del editor contenía una ruta absoluta con el usuario del equipo de desarrollo. Sacada del control de versiones.
- [x] **8.9** `DEPLOY.md` con S3 + CloudFront, OAC, política de bucket, ACM en `us-east-1`, redirección www, cabeceras de caché y seguridad, gestión del 404 y script de despliegue.

---

## Mapa de keywords

Enfoque: **servicio + provincia**, sector muy nichado y con competencia local baja. La intención dominante es comercial-transaccional (quien busca "construcción de gasolineras" está evaluando proveedor), salvo en `/proyectos/` y `/empresa/`, que son de refuerzo de confianza.

| Página | Keyword principal | Secundarias | Long tail | Intención |
|---|---|---|---|---|
| `/` | instalaciones de transferencia de carburantes | instalaciones petrolíferas Valencia · empresa instaladora de gasolineras | empresa de instalaciones petrolíferas en Valencia · quién construye gasolineras llave en mano | Comercial |
| `/servicios/` | servicios de instalaciones petrolíferas | construcción y mantenimiento de gasolineras | empresa que construye y legaliza gasolineras | Comercial |
| `/servicios/gasolineras/` | construcción de gasolineras | estaciones de servicio llave en mano · obra civil gasolinera | cuánto se tarda en construir una gasolinera · construir gasolinera en Valencia | Transaccional |
| `/servicios/gasocentros/` | gasocentros | centro de carga de gasóleo · carga de camiones cisterna | instalación de gasocentro para camiones cisterna | Transaccional |
| `/servicios/consumos-propios/` | depósito de gasóleo para consumo propio | surtidor para flota · repostaje interno de flotas | depósito de gasóleo para flota agrícola · autorización depósito consumo propio | Transaccional |
| `/servicios/puertos/` | suministro de combustible en puertos | repostaje náutico · surtidor puerto deportivo | instalación de repostaje en puerto deportivo | Transaccional |
| `/servicios/medios-de-pago/` | pago desatendido gasolinera | terminal de pago en surtidor · tarjetas de flota | gasolinera desatendida 24 horas · terminal PAYWAY | Transaccional |
| `/servicios/ingenieria/` | legalización de instalaciones petrolíferas | proyecto técnico ITC MI-IP04 · dirección de obra | legalizar gasolinera sin proyecto · proyecto as built instalación carburantes | Transaccional |
| `/servicios/mantenimiento/` | mantenimiento de gasolineras | revisión periódica instalación petrolífera · calibración de surtidores | contrato de mantenimiento para gasolinera · cada cuánto revisar una gasolinera | Transaccional |
| `/proyectos/` | gasolineras construidas | obra ejecutada instalaciones carburantes | ejemplos de gasolineras construidas en Valencia | Investigación |
| `/empresa/` | COZETA instalaciones petrolíferas | empresa instaladora Bétera | historia COZETA Bétera Valencia | Navegacional |
| `/contacto/` | presupuesto instalación de carburantes | contacto instalador gasolineras Valencia | pedir presupuesto para gasolinera | Transaccional |

Criterio aplicado: **densidad natural**, sin repetir la keyword exacta. Se usan sinónimos y entidades del sector (ITC MI-IP04, ATEX, recuperación de vapores, acta de puesta en marcha, estanqueidad, organismo de industria) que refuerzan relevancia temática sin sobreoptimizar.

---

## Pendientes que dependen del cliente

| # | Pendiente | Por qué está bloqueado |
|---|---|---|
| 1 | Destinatario del formulario → `info@cozeta.es` | A la espera de acceso al panel de Formspree |
| 2 | Retratos del equipo en ≥480×480 px | Solo se dispone de miniaturas de 150×150 px |
| 3 | Perfiles sociales (`sameAs` del JSON-LD) | `site.social` está vacío: no hay redes activas |

### Resueltos durante la auditoría

- **Ficha de Google Business Profile:** comprobada. Existe como *Cozeta Instalaciones Petroliferas*, con 4,7 ★ y 11 opiniones, teléfono y web correctos. El mapa resuelve bien.
- **Coordenadas del JSON-LD:** tomadas de esa misma ficha (39.580822, -0.4395272). Las que había puestas de forma aproximada estaban a unos 2 km.

### Mejoras detectadas en la ficha de Google (fuera del código, las hace el cliente)

Son de SEO local y no dependen de la web, pero conviene arreglarlas:

1. **La dirección no coincide exactamente.** Google dice `Calle 6, 5, Nave 12` y la web dice `Calle 6, nave 12`. Para posicionamiento local, el nombre, la dirección y el teléfono deben coincidir carácter a carácter entre la web y la ficha. Hay que decidir cuál es la correcta y unificar.
2. **La ficha no tiene horario.** Google muestra «Agregar horarios». La web y el JSON-LD ya declaran lunes a viernes de 8:00 a 17:00: conviene ponerlo también allí.
3. **La categoría es «Constructor»**, genérica. Encajaría mejor algo del estilo de «Contratista de instalaciones» o similar, con las categorías secundarias del sector.
4. **4,7 ★ con 11 opiniones no se usan en la web.** Es prueba social ya ganada que ahora mismo no aparece por ninguna parte del sitio.

---

## Verificación final (build de producción, 2026-09-09)

Medido sobre `npm run build` + `npm run preview`, no sobre el servidor de desarrollo.

| Comprobación | Resultado |
|---|---|
| `npm run build` | **Sin errores ni warnings** |
| Páginas generadas | 17 (15 en sitemap; `/404` y `/contacto/gracias/` excluidas a propósito) |
| Enlaces internos rotos | **0** |
| `<h1>` por página | Exactamente 1 en las 17 |
| Saltos de jerarquía de encabezados | **0** |
| `title` y `description` fuera de rango | 0 en páginas indexables |
| Canonical / Open Graph | Presentes en las 17 páginas |
| JSON-LD | 39 bloques, **todos JSON válido** |
| Peticiones a dominios externos | **0** |
| Restos en el build (`.md`, `.DS_Store`, `.env`) | **0** |
| `TODO` / `localhost` / `[CIF]` / Lorem ipsum | **0** |
| `console.log` en `src/` | **0** |
| Peso publicado | 3,6 MB (antes 4,3 MB) |
| JavaScript inicial de la home | ~3 kB (antes 280 kB gzip) |
| CLS medido | **0** |
| Desbordamiento horizontal (375 / 768 / escritorio) | Ninguno |
| Áreas táctiles del menú móvil | 44 px (antes 20 px) |
| 404 de una URL inexistente | Devuelve 404, no 403 |

### Comprobaciones funcionales hechas en navegador

- **Consentimiento del mapa:** sin aceptar cookies → 0 iframes y 0 peticiones a Google. Al pulsar «Aceptar todas» → el mapa se monta.
- **Menú móvil:** cerrado, sus enlaces **no** aceptan foco; abierto, sí. El botón alterna entre «Abrir menú» y «Cerrar menú». Cierra con `Escape`.
- **Formulario:** con los campos vacíos muestra los 4 errores, marca `aria-invalid`, lleva el foco al primer campo inválido y no navega.
- **Carga diferida del 3D:** el visor del hero se monta al quedar el navegador ocioso; el de PAYWAY, al entrar en pantalla. Hasta entonces se ve el póster.
- **Imágenes:** las 7 de `/proyectos/` sirven WebP con `srcset` y dimensiones explícitas.

### Repeticiones: antes y después

| Frase | Antes | Después |
|---|---|---|
| `¿Necesitáis una instalación nueva o una revisión?` | 8 páginas | 0 (texto propio por página) |
| `Contadnos qué necesitáis…` | 4 variantes casi iguales | 0 |
| CTA distintos en el cuerpo | 1 | 16 |
| Frases de contenido repetidas en >3 páginas | 8 | 1 (un rótulo de sección, correcto) |

`Pedir presupuesto` sigue apareciendo 48 veces, pero son el botón fijo de la cabecera y del menú
móvil en las 17 páginas: es un elemento de navegación persistente, no texto de contenido repetido.
