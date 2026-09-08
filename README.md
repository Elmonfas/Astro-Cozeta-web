<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logos/cozeta-logo-horizontal-negativo-transparent.svg">
    <img alt="COZETA Instalaciones Petrolíferas" src="public/logos/cozeta-logo-horizontal.svg" width="420">
  </picture>
</p>

<p align="center">
  Web corporativa de <strong>COZETA Instalaciones Petrolíferas</strong> — instalación y legalización de<br>
  puntos de transferencia de carburantes desde Bétera (Valencia). Fundada en 1996.
</p>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
  <img alt="Sitio estático" src="https://img.shields.io/badge/Sitio-100%25%20est%C3%A1tico-2E7D32">
</p>

---

Sitio estático construido con [Astro](https://astro.build) + TypeScript, sin frameworks de UI. CSS propio con variables, JavaScript mínimo (menú móvil, banner de cookies, animaciones al hacer scroll) y contenido de servicios gestionado como content collection. Única excepción: el hero de la home usa [`@google/model-viewer`](https://modelviewer.dev/) para mostrar el logo en 3D interactivo (ver más abajo).

## Índice

- [Arrancar el proyecto](#arrancar-el-proyecto)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Logotipo](#logotipo)
- [Dónde cambiar cada cosa](#dónde-cambiar-cada-cosa)
- [Formulario de contacto](#formulario-de-contacto)
- [Imágenes](#imágenes)
- [SEO técnico incluido](#seo-técnico-incluido)
- [Checklist antes de lanzar](#checklist-antes-de-lanzar)
- [Notas de implementación](#notas-de-implementación)

## Arrancar el proyecto

Requiere Node.js 22.12 o superior.

```sh
npm install
npm run dev
```

Esto abre el sitio en `http://localhost:4321`.

```sh
npm run build     # genera el sitio estático en ./dist
npm run preview   # sirve ./dist localmente para revisar el build
```

## Estructura del proyecto

```
src/
├── content/servicios/*.md   → Contenido de los 7 servicios (texto, FAQ, "qué incluye", proceso)
├── content.config.ts        → Esquema (schema) de la content collection de servicios
├── components/               → Header, Footer, CookieBanner, ServiceCard, Icon, etc.
├── layouts/Layout.astro     → <head> común: SEO, Open Graph, JSON-LD LocalBusiness
├── lib/site.ts               → Datos de la empresa (dirección, teléfono, equipo, cifras, nav)
├── pages/                    → Rutas del sitio (una carpeta por sección)
└── styles/global.css         → Variables CSS, tipografía, componentes base (botones, tarjetas, grid)

public/
├── images/placeholders/      → Fotos placeholder + README con la lista de fotos reales a subir
├── images/proyectos-real/    → Fotos reales de obra ejecutada, usadas en /proyectos/ y home
├── logos/                     → Logotipo real de COZETA en todas sus variantes (SVG + PNG)
├── models/                    → Modelos 3D (logo y terminal PAYWAY) para el hero y /servicios/medios-de-pago/
├── robots.txt
└── favicon.svg / favicon.ico / apple-touch-icon.png
```

## Logotipo

El logo real de COZETA ya está integrado en el sitio:

- **Header** (fondo claro): `public/logos/cozeta-logo-horizontal.svg`.
- **Footer** (fondo oscuro): `public/logos/cozeta-logo-horizontal-negativo-transparent.svg` — es la versión "negativo" del logo sin el rectángulo de fondo que trae el fichero original, para que se apoye directamente sobre el azul oscuro del footer.
- **Favicon**: generado a partir de `public/logos/cozeta-isotipo.svg` (`favicon.svg`, `favicon.ico` multi-resolución y `apple-touch-icon.png`).
- **Imagen Open Graph** (`public/images/og-cozeta.png`): logo sobre el fondo corporativo oscuro, para previsualizaciones en redes sociales y WhatsApp.

`public/logos/` conserva también el resto de variantes originales (isotipo, vertical, negativo, monocromo, versión "flat") por si se necesitan para papelería, redes sociales o materiales impresos.

### Modelos 3D

El hero de la home muestra `public/models/cozeta-mark.glb` (el logo en 3D) con [`<model-viewer>`](https://modelviewer.dev/), a través del componente [`src/components/LogoModel3D.astro`](src/components/LogoModel3D.astro): gira solo, y el usuario puede arrastrar para rotarlo manualmente (arrastre vertical deshabilitado para no interferir con el scroll de la página). Se desactiva la rotación automática si el usuario tiene activado "reducir movimiento" en su sistema.

En la home y en `/servicios/medios-de-pago/` también se muestra `public/models/payway-classic.glb` (el terminal de pago desatendido PAYWAY Classic) a través de [`src/components/PaywayViewer.astro`](src/components/PaywayViewer.astro), con un balanceo de cámara suave dentro de un rango frontal fijo.

Esto añade la única dependencia de JavaScript de terceros del proyecto (`@google/model-viewer`, ~1 MB minificado) y solo se carga en las páginas que lo usan. Si en algún momento preferís volver a una imagen estática, basta con quitar el componente correspondiente y poner una `<img>` en su lugar; podéis desinstalar la dependencia con `npm uninstall @google/model-viewer`.

## Dónde cambiar cada cosa

- **Textos generales, teléfono, email, dirección, equipo, cifras destacadas:** [`src/lib/site.ts`](src/lib/site.ts). Se usa en el header, footer, JSON-LD y varias páginas, así que solo hay que tocarlo en un sitio.
- **Textos de cada servicio** (título, descripción, "qué incluye", pasos del proceso, FAQ): un fichero Markdown por servicio en `src/content/servicios/`. El campo `order` controla el orden en que aparecen en la home y en `/servicios/`.
- **Colores y tipografía:** variables en la cabecera de [`src/styles/global.css`](src/styles/global.css) (`--color-primary`, `--color-accent`, `--font-heading`, `--font-body`, etc.). Cambiarlas ahí se propaga a todo el sitio.
- **Iconos:** [`src/components/Icon.astro`](src/components/Icon.astro), un icono SVG en línea por `name`.
- **Imágenes:** ver el apartado [Imágenes](#imágenes).
- **Textos legales** (aviso legal, privacidad, cookies): `src/pages/aviso-legal/`, `src/pages/politica-de-privacidad/`, `src/pages/politica-de-cookies/`. Contienen los marcadores `[CIF]` y `[Registro Mercantil]` pendientes de rellenar.
- **Formulario de contacto:** ver el apartado siguiente.

## Formulario de contacto

El formulario de `/contacto/` envía los mensajes vía [Formspree](https://formspree.io) (funciona con cualquier hosting, incluido AWS — no depende de Netlify Forms). El envío se hace por AJAX desde `src/pages/contacto/index.astro`, así que nunca sale de la web: si todo va bien redirige a `/contacto/gracias/` (página con el mismo estilo del sitio) y si falla muestra un aviso de error dentro del propio formulario.

- El ID del formulario está en la constante `FORMSPREE_ID` de [`src/pages/contacto/index.astro`](src/pages/contacto/index.astro).
- Los destinatarios de las notificaciones por email se gestionan desde el panel de Formspree (`formspree.io/forms/[ID]/settings` → *Emails*), no desde el código.
- Hay un campo honeypot (`_gotcha`) para filtrar spam básico, además del checkbox de RGPD obligatorio.

## Imágenes

Todas las fotos del sitio son ya reales (equipo, flota, obra ejecutada). Ver `public/images/placeholders/README.md` para el detalle de cada una — incluye un aviso sobre la resolución de las fotos del equipo (150×150 px, bastante justas), por si en algún momento conseguís retratos de mayor calidad.

## SEO técnico incluido

- Sitemap automático (`@astrojs/sitemap`) en `/sitemap-index.xml`, y `public/robots.txt` apuntando a él.
- `<title>`, meta description, Open Graph y canonical por página, definidos en `Layout.astro` y configurables por página con las props `title` / `description`.
- Datos estructurados Schema.org: `LocalBusiness` en todas las páginas (en el layout) y `Service` + `FAQPage` en cada página de servicio.
- Antes de publicar, edita `site` en `astro.config.mjs` si el dominio final no es `https://www.cozeta.es` (afecta a canonical, sitemap y Open Graph).

## Checklist antes de lanzar

- [ ] Si conseguís retratos del equipo en mayor resolución que los 150×150 px actuales, sustituidlos (ver `public/images/placeholders/README.md`).
- [ ] Rellenar `[CIF]` y `[Registro Mercantil]` en las tres páginas legales.
- [ ] Revisar y ajustar las cifras destacadas de la home (años, instalaciones, % legalizadas) en `src/lib/site.ts` si cambian.
- [ ] Ampliar `/proyectos/` con más obra a medida que esté disponible (sigue el mismo patrón que las 7 fotos ya incorporadas).
- [ ] Confirmar el dominio definitivo y actualizarlo en `astro.config.mjs` (`site:`).
- [ ] Conectar el dominio en el proveedor de hosting y comprobar el certificado HTTPS.
- [ ] Verificar el destinatario final (`info@cozeta.es`) en el panel de Formspree (`formspree.io/forms/[ID]/settings` → *Emails*) y hacer un envío de prueba real ya en producción.
- [ ] Dar de alta el dominio en Google Search Console y enviar el sitemap (`/sitemap-index.xml`).
- [ ] Revisar el texto de política de cookies si en el futuro se añade una herramienta de analítica (Google Analytics, Plausible, etc.), ya que ahora mismo el sitio no usa ninguna.
- [ ] Comprobar en un móvil real que el botón flotante de llamada y el menú funcionan como se espera.

## Notas de implementación

- No se usa ningún framework de UI (React, Vue…); toda la interactividad (menú móvil, banner de cookies, envío del formulario) es JavaScript vanilla incluido directamente en los componentes `.astro`.
- El aviso de cookies solo guarda la elección del usuario en `localStorage`; no carga ningún script de analítica ni de terceros, así que no hay nada que bloquear técnicamente al rechazar.

---

<p align="center">Desarrollado por <strong>Pedro Monfort Caro</strong></p>
