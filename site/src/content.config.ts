import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = path.resolve(__dirname, '..', '..');

const problemsCollection = defineCollection({
  loader: glob({ pattern: "*.md", base: pathToFileURL(path.join(VAULT_ROOT, 'Problems')) }),
  schema: z.object({
    Title: z.any().optional(),
    Topics: z.any().optional(),
    Platform: z.any().optional(),
    Companies: z.any().optional(),
    Difficulty: z.any().optional(),
    Link: z.any().optional(),
    'Other Tags': z.any().optional(),
    Rating: z.any().optional(),
    Groups: z.any().optional(),
  }).passthrough(),
});

const notesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: pathToFileURL(path.join(VAULT_ROOT, 'Notes')) }),
  schema: z.object({
    Title: z.string().optional(),
  }).passthrough(),
});

const templatesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: pathToFileURL(path.join(VAULT_ROOT, 'Templates')) }),
  schema: z.object({
    Title: z.string().optional(),
  }).passthrough(),
});

export const collections = {
  problems: problemsCollection,
  notes: notesCollection,
  templates: templatesCollection,
};
