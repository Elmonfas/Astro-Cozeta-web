// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.cozeta.es',

  // Explícito a propósito: sin esto, /empresa y /empresa/ podían resolver las
  // dos y generar contenido duplicado. La canónica siempre lleva barra final,
  // y CloudFront redirige la versión sin barra (ver DEPLOY.md).
  trailingSlash: 'always',
  build: { format: 'directory' },

  integrations: [
    sitemap({
      // /contacto/gracias/ es la página de destino del formulario sin JS:
      // no aporta nada en buscadores y va marcada como noindex.
      // /netoil/ es un placeholder pendiente de contenido y fotos reales,
      // también noindex hasta que se rellene (ver src/pages/netoil/index.astro).
      filter: (page) => !page.includes('/contacto/gracias') && !page.includes('/netoil'),
    }),
  ],

  vite: {
    build: {
      // El único chunk que supera el aviso de 500 kB es @google/model-viewer,
      // una dependencia externa de tamaño fijo que ya se carga bajo demanda.
      // Se sube el umbral para que el build quede limpio y cualquier aviso
      // futuro sea de código propio y sí merezca atención.
      chunkSizeWarningLimit: 1100,
    },
  },
});
