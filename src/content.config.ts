import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    // intro = frase corta de la actividad, la misma en la tarjeta y en la cabecera.
    intro: z.string(),
    description: z.string(),
    seoTitle: z.string(),
    order: z.number(),
    icon: z.string(),
  }),
});

export const collections = { servicios };
