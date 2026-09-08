# Fotos de esta carpeta

Ya no quedan placeholders SVG: todas las fotos de esta carpeta son reales.

| Fichero | Dónde se usa | Nota |
|---|---|---|
| `team-luis-cuenca.jpg` | `/empresa/` | Luis Cuenca (Gerente) |
| `team-daniel-lainez.jpg` | `/empresa/` | Daniel Laínez (Ejecución) |
| `team-begona-urizar.jpg` | `/empresa/` | Begoña Urizar (Finanzas) |
| `team-angeles-ibanez.jpg` | `/empresa/` | Mª Ángeles Ibáñez (Proyectos) |
| `empresa-flota.png` | `/empresa/` | Furgonetas de la flota con el logo de COZETA (fondo transparente) |

**Calidad de las fotos del equipo:** son thumbnails de 150×150 px (probablemente recortados de LinkedIn o similar), bastante más pequeños de lo ideal para una web. Se ven aceptables en las tarjetas actuales, pero si en algún momento tenéis retratos en mayor resolución (idealmente 480×480 px o más), sustituidlos manteniendo el mismo nombre de fichero — se notará más nitidez, especialmente en pantallas grandes o de alta densidad.

Las fotos de obra ejecutada (`/proyectos/`, destacados de la home y hero) están en [`public/images/proyectos-real/`](../proyectos-real/) (LOWCOST, SOEX 2, Autoil Museros, Benzoil, Dieself, Gasoprix, Cooperativa Sant Josep). Si añadís más obra, seguid el mismo patrón: JPG optimizado, ~1000 px de ancho, añadido a `proyectos` en `src/pages/proyectos/index.astro`.

La imagen Open Graph (`public/images/og-cozeta.png`, 1200×630 px) usa el logo real de COZETA sobre el fondo corporativo, para previsualizaciones en redes sociales y WhatsApp.

Formato recomendado para fotos nuevas: JPG o WebP optimizado, máx. ~300 KB por imagen (PNG solo si necesitáis transparencia, como en `empresa-flota.png`).
