import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    // description = meta description (con gancho y llamada a la acción).
    // intro = primer párrafo visible en la página. Antes eran el mismo texto.
    description: z.string(),
    intro: z.string(),
    // Título propio para el <title> de la página, con keyword y ubicación.
    seoTitle: z.string(),
    order: z.number(),
    icon: z.string(),
    // Textos de llamada a la acción propios de cada servicio: sin esto, las 7
    // páginas repetían literalmente las mismas dos frases dos veces cada una.
    aside: z.object({ titulo: z.string(), texto: z.string(), boton: z.string() }),
    cta: z.object({ titulo: z.string(), texto: z.string(), boton: z.string() }),
    incluye: z.array(z.string()),
    proceso: z.array(z.object({
      titulo: z.string(),
      texto: z.string(),
    })),
    faq: z.array(z.object({
      pregunta: z.string(),
      respuesta: z.string(),
    })),
  }),
});

export const collections = { servicios };
