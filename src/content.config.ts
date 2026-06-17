import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    // Publish contract (spec §5): only true posts render. The sync step only
    // emits published posts, but we keep the flag as a build-time guard too.
    publish: z.boolean().default(false),
  }),
});

export const collections = { blog };
