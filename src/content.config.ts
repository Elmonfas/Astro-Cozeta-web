import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    order: z.number(),
    icon: z.string(),
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
