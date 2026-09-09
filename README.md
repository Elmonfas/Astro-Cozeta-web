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

Sitio estático construido con [Astro](https://astro.build) + TypeScript, sin frameworks de UI. CSS propio con variables, JavaScript mínimo (menú móvil, banner de cookies, formulario, animaciones al hacer scroll) y contenido de servicios gestionado como content collection. Los visores 3D usan [`@google/model-viewer`](https://modelviewer.dev/), cargado bajo demanda (ver más abajo).

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

El hero de la home muestra `public/models/cozeta-mark.glb` (el logo en 3D) con [`<model-viewer>`](https://modelviewer.dev/), a través de [`src/components/LogoModel3D.astro`](src/components/LogoModel3D.astro). El usuario puede arrastrar para rotarlo (el arrastre vertical está deshabilitado para no interferir con el scroll).

**El motor 3D no forma parte de la carga inicial.** Hasta que se monta se ve el isotipo en SVG, que pinta al instante; el `import()` real ocurre cuando el navegador queda ocioso. Si el visitante tiene activado "reducir movimiento" o navega con ahorro de datos o conexión 2G, el 3D no llega a cargarse y se queda el SVG.

En la home y en `/servicios/medios-de-pago/` también se muestra `public/models/payway-classic.glb` (el terminal de pago desatendido PAYWAY Classic) a través de [`src/components/PaywayViewer.astro`](src/components/PaywayViewer.astro), con un balanceo de cámara suave dentro de un rango frontal fijo.

Esta es la única dependencia de JavaScript de terceros del proyecto (`@google/model-viewer`, ~1 MB sin comprimir / 280 KB gzip). Solo se descarga en las páginas que lo usan **y solo cuando hace falta**: el visor de PAYWAY espera a entrar en pantalla. Si en algún momento preferís volver a una imagen estática, basta con quitar el componente y dejar el póster; podéis desinstalar la dependencia con `npm uninstall @google/model-viewer`.

## Dónde cambiar cada cosa

- **Textos generales, teléfono, email, dirección, equipo, cifras destacadas:** [`src/lib/site.ts`](src/lib/site.ts). Se usa en el header, footer, JSON-LD y varias páginas, así que solo hay que tocarlo en un sitio.
- **Textos de cada servicio** (título, descripción, "qué incluye", pasos del proceso, FAQ): un fichero Markdown por servicio en `src/content/servicios/`. El campo `order` controla el orden en que aparecen en la home y en `/servicios/`.
- **Colores y tipografía:** variables en la cabecera de [`src/styles/global.css`](src/styles/global.css) (`--color-primary`, `--color-secondary`, `--font-heading`, `--font-body`, etc.). Cambiarlas ahí se propaga a todo el sitio.
- **Iconos:** [`src/components/Icon.astro`](src/components/Icon.astro), un icono SVG en línea por `name`.
- **Imágenes:** ver el apartado [Imágenes](#imágenes).
- **Textos legales** (aviso legal, privacidad, cookies): `src/pages/aviso-legal/`, `src/pages/politica-de-privacidad/`, `src/pages/politica-de-cookies/`. Los datos de la sociedad (CIF, registro mercantil, domicilio) salen de `src/lib/site.ts`, no están escritos a mano en cada página.
- **Formulario de contacto:** ver el apartado siguiente.

## Formulario de contacto

El formulario de `/contacto/` envía los mensajes vía [Formspree](https://formspree.io) (funciona con cualquier hosting, incluido AWS). El envío se hace por AJAX, así que **nunca se sale de la página**: valida en cliente, muestra el estado "Enviando…" y sustituye el formulario por la confirmación. `/contacto/gracias/` sigue existiendo como destino para navegadores sin JavaScript (`_next` de Formspree) y va marcada como `noindex`.

- El ID del formulario está en la variable de entorno `PUBLIC_FORMSPREE_ID` (ver [`.env.example`](.env.example)). El build falla a propósito si falta.
- Los destinatarios de las notificaciones por email se gestionan desde el panel de Formspree (`formspree.io/forms/[ID]/settings` → *Emails*), no desde el código.
- Hay un campo honeypot (`_gotcha`) para filtrar spam básico, además del checkbox de RGPD obligatorio.

## Imágenes

Todas las fotos del sitio son reales:

- `public/images/equipo/` — retratos del equipo directivo.
- `public/images/proyectos/` — obra ejecutada, usada en `/proyectos/` y en la home.
- `public/images/flota-cozeta.png` — furgonetas rotuladas, en `/empresa/`.
- `public/images/og-cozeta.png` — imagen social (1200×630).

**Pendiente:** los retratos de Luis J. Cuenca, Daniel Laínez y Mª Ángeles Ibáñez son de 150×150 px y se ven blandos en pantallas de alta densidad. Si conseguís versiones de 480×480 px o más, sustituidlas manteniendo el nombre de fichero.

## SEO técnico incluido

Todo el `<head>` vive en [`src/components/Seo.astro`](src/components/Seo.astro), y `title` y
`description` son props **obligatorias**: si alguien crea una página nueva y se las deja, el build
falla en vez de publicar una página sin metadatos.

- Sitemap automático (`@astrojs/sitemap`) en `/sitemap-index.xml`, con `robots.txt` apuntando a él. `/contacto/gracias/` queda excluida a propósito.
- `<title>`, meta description, canonical, Open Graph y Twitter Card por página.
- Datos estructurados Schema.org: `LocalBusiness` y `WebSite` en todas las páginas, `BreadcrumbList` en las de sección, y `Service` + `FAQPage` en cada servicio.
- `trailingSlash: 'always'` fijado en `astro.config.mjs`, para que no existan a la vez `/empresa` y `/empresa/`. CloudFront redirige la versión sin barra (ver [`DEPLOY.md`](DEPLOY.md)).
- Antes de publicar, edita `site` en `astro.config.mjs` si el dominio final no es `https://www.cozeta.es` (afecta a canonical, sitemap y Open Graph).

## Rendimiento

- **Fuentes autoalojadas** en `public/fonts/` (`src/styles/fonts.css`), solo subconjunto latin y solo los pesos que se usan. No se pide nada a Google: ni cadena de peticiones, ni transferencia de la IP del visitante a un tercero.
- **El motor 3D se carga bajo demanda**, nunca en la carga inicial. La home arranca con ~3 KB de JavaScript propio.
- Imágenes con `width`/`height` explícitos para no provocar saltos de maquetación.

## Privacidad

- No hay analítica, ni publicidad, ni seguimiento de ningún tipo.
- El **mapa de Google Maps de `/contacto/` no se carga por defecto**: hasta que el visitante acepta cookies (o pulsa el botón del propio mapa), no se hace ninguna petición a Google. Es el único tercero del sitio.
- El banner de cookies emite un evento `cozeta:consent` al que se engancha el mapa. Si en el futuro se añade analítica, debe escuchar ese mismo evento y no cargarse antes.

## Despliegue

Ver [`DEPLOY.md`](DEPLOY.md): S3 privado + CloudFront con OAC, certificado en ACM, cabeceras de
caché y seguridad, y el script [`deploy.sh`](deploy.sh) que sube el build e invalida la caché.

## Checklist antes de lanzar

- [ ] Copiar `.env.example` a `.env` y rellenar `PUBLIC_FORMSPREE_ID`.
- [ ] Verificar el destinatario final (`info@cozeta.es`) en el panel de Formspree (`formspree.io/forms/[ID]/settings` → *Emails*) y hacer un envío de prueba real ya en producción.
- [ ] Sustituir los retratos del equipo por versiones de 480×480 px o más (los actuales son de 150×150 px).
- [ ] Confirmar las coordenadas exactas de la nave en `site.geo` (`src/lib/site.ts`), ahora son las del polígono.
- [ ] Confirmar que la ficha de Google Business Profile coincide con `site.mapsEmbedQuery`.
- [ ] Revisar las cifras destacadas de la home (años, instalaciones, % legalizadas) en `src/lib/site.ts`.
- [ ] Ampliar `/proyectos/` con más obra según esté disponible (mismo patrón que las 7 ya incorporadas).
- [ ] Dar de alta el dominio en Google Search Console y enviar el sitemap.
- [ ] Recorrer el checklist final de [`DEPLOY.md`](DEPLOY.md).

## Notas de implementación

- No se usa ningún framework de UI (React, Vue…); toda la interactividad (menú móvil, banner de cookies, formulario, visores 3D) es JavaScript vanilla dentro de los componentes `.astro`.
- El aviso de cookies guarda la elección en `localStorage`, con `try/catch` porque en modo privado algunos navegadores lanzan al acceder.
- Si se añade analítica en el futuro hay que actualizar la política de cookies **y** engancharla al evento `cozeta:consent` para no cargarla antes del consentimiento.

---

<p align="center">Desarrollado por <strong>Pedro Monfort Caro</strong></p>
