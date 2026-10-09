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
    updated: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "updated property must be exactly in DD-MM-YYYY format (e.g. 31-12-2024)").refine((val) => {
      const parts = val.split('-');
      const mm = parseInt(parts[1], 10);
      const dd = parseInt(parts[0], 10);
      return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31;
    }, { message: "Invalid date or month out of bounds. Must be DD-MM-YYYY." }).optional(),
  }).passthrough(),
});

const notesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: pathToFileURL(path.join(VAULT_ROOT, 'Notes')) }),
  schema: z.object({
    Title: z.string().optional(),
    updated: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "updated property must be exactly in DD-MM-YYYY format (e.g. 31-12-2024)").refine((val) => {
      const parts = val.split('-');
      const mm = parseInt(parts[1], 10);
      const dd = parseInt(parts[0], 10);
      return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31;
    }, { message: "Invalid date or month out of bounds. Must be DD-MM-YYYY." }).optional(),
  }).passthrough(),
});

const templatesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: pathToFileURL(path.join(VAULT_ROOT, 'Templates')) }),
  schema: z.object({
    Title: z.string().optional(),
    updated: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "updated property must be exactly in DD-MM-YYYY format (e.g. 31-12-2024)").refine((val) => {
      const parts = val.split('-');
      const mm = parseInt(parts[1], 10);
      const dd = parseInt(parts[0], 10);
      return mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31;
    }, { message: "Invalid date or month out of bounds. Must be DD-MM-YYYY." }).optional(),
  }).passthrough(),
});

export const collections = {
  problems: problemsCollection,
  notes: notesCollection,
  templates: templatesCollection,
};
