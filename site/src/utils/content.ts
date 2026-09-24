/**
 * Content loading utilities for reading the Obsidian vault.
 *
 * Since the vault lives one directory up from the Astro project,
 * we use Node fs/path to read files directly at build time.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

/** Root of the Green-Ticks vault (parent of site/) */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VAULT_ROOT = path.resolve(__dirname, '..', '..', '..');

/**
 * Normalize a frontmatter field that can be either a string, an array, or undefined
 * into a consistent string array.
 */
export function asList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [String(value)];
}

/**
 * Slugify a string for use in URLs.
 * Matches the Python build_indexes.py slugify() behavior.
 */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove combining diacriticals
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled';
}

/**
 * Generate a heading anchor ID from heading text.
 * Handles emojis, special characters, and spaces — compatible with
 * Obsidian-style linking (e.g., #💡-the-core-problem).
 */
export function headingToId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\p{Emoji_Presentation}\p{Emoji}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Shape of a parsed problem file */
export interface Problem {
  slug: string;
  filePath: string;
  title: string;
  topics: string[];
  platforms: string[];
  companies: string[];
  difficulty: string;
  link: string;
  otherTags: string[];
  rating: number | null;
  groups: string[];
  rawContent: string;
}

/**
 * Read and parse all problem .md files from the Problems/ directory.
 */
export function loadProblems(): Problem[] {
  const problemsDir = path.join(VAULT_ROOT, 'Problems');
  if (!fs.existsSync(problemsDir)) return [];

  const files = fs.readdirSync(problemsDir).filter((f) => f.endsWith('.md')).sort();
  const problems: Problem[] = [];

  for (const file of files) {
    const filePath = path.join(problemsDir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    const slug = file.replace(/\.md$/, '');
    const ratingRaw = data.Rating;
    let rating: number | null = null;
    if (ratingRaw != null && ratingRaw !== '') {
      const str = String(ratingRaw).trim();
      const starCount = [...str].filter((c) => c === '⭐').length;
      rating = starCount > 0 ? starCount : parseInt(str, 10) || null;
    }

    problems.push({
      slug,
      filePath,
      title: String(data.Title || slug),
      topics: asList(data.Topics),
      platforms: asList(data.Platform),
      companies: asList(data.Companies),
      difficulty: String(data.Difficulty || 'Not Specified'),
      link: String(data.Link || ''),
      otherTags: asList(data['Other Tags']),
      rating,
      groups: asList(data.Groups),
      rawContent: content,
    });
  }

  return problems;
}

/** Shape of a generic markdown page (notes, templates, etc.) */
export interface MarkdownPage {
  slug: string;
  title: string;
  filePath: string;
  rawContent: string;
  /** Relative path segments for breadcrumbs, e.g. ['Extras', 'Queue patterns'] */
  pathSegments: string[];
}

/**
 * Recursively load all .md files from a directory.
 */
export function loadMarkdownDir(dirName: string): MarkdownPage[] {
  const dir = path.join(VAULT_ROOT, dirName);
  if (!fs.existsSync(dir)) return [];

  const pages: MarkdownPage[] = [];

  function walk(currentDir: string, segments: string[]) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, [...segments, entry.name]);
      } else if (entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md') {
        const name = entry.name.replace(/\.md$/, '');
        const slug = [...segments, name].map(slugify).join('/');
        const title = name.includes('-') && !name.includes(' ')
          ? name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : name;

        pages.push({
          slug,
          title,
          filePath: fullPath,
          rawContent: fs.readFileSync(fullPath, 'utf-8'),
          pathSegments: [...segments, name],
        });
      }
    }
  }

  walk(dir, []);
  return pages;
}

/**
 * Load the companies.json logo mapping.
 */
export function loadCompanyLogos(token: string): Record<string, string> {
  const jsonPath = path.join(VAULT_ROOT, 'assets', 'companies.json');
  if (!fs.existsSync(jsonPath)) return {};

  const data: Record<string, string> = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const logos: Record<string, string> = {};

  if (!token || token === 'your_token_here') return logos;

  for (const [company, domain] of Object.entries(data)) {
    logos[company] = `https://img.logo.dev/${domain}?token=${token}`;
  }
  return logos;
}

/**
 * Group problems by a multi-value field (topics, companies, etc.)
 */
export function groupByField(
  problems: Problem[],
  field: keyof Pick<Problem, 'topics' | 'platforms' | 'companies' | 'otherTags' | 'groups'>
): Record<string, Problem[]> {
  const groups: Record<string, Problem[]> = {};
  for (const p of problems) {
    for (const val of p[field]) {
      if (!groups[val]) groups[val] = [];
      groups[val].push(p);
    }
  }
  return groups;
}

/**
 * Group problems by difficulty.
 */
export function groupByDifficulty(problems: Problem[]): Record<string, Problem[]> {
  const groups: Record<string, Problem[]> = {};
  for (const p of problems) {
    if (!groups[p.difficulty]) groups[p.difficulty] = [];
    groups[p.difficulty].push(p);
  }
  return groups;
}

/** Difficulty sort order */
const DIFFICULTY_ORDER: Record<string, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
  'Not Specified': 3,
};

export function sortDifficulty(a: string, b: string): number {
  return (DIFFICULTY_ORDER[a] ?? 99) - (DIFFICULTY_ORDER[b] ?? 99);
}

/**
 * Generate sidebar navigation tree.
 */
export function getSidebar(): any[] {
  const problems = loadProblems();
  const notes = loadMarkdownDir('Notes');
  const templates = loadMarkdownDir('Templates');

  // Helper to build a nested tree from paths
  function buildTree(pages: MarkdownPage[], basePath: string) {
    const root: any[] = [];
    
    for (const page of pages) {
      const parts = page.pathSegments;
      let currentLevel = root;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLeaf = i === parts.length - 1;
        
        let existingNode = currentLevel.find((n: any) => n.label === part);
        
        if (!existingNode) {
          existingNode = { 
            label: part, 
            href: isLeaf ? `/${basePath}/${page.slug}` : undefined,
            children: isLeaf ? undefined : []
          };
          currentLevel.push(existingNode);
        }
        
        if (!isLeaf) {
          currentLevel = existingNode.children;
        }
      }
    }
    
    return root;
  }

  return [
    {
      label: 'Explore',
      children: [
        { label: 'Problems', href: '/problems', count: problems.length },
        { label: 'Topics', href: '/topics' },
        { label: 'Companies', href: '/companies' }
      ]
    },
    {
      label: 'Templates',
      href: '/templates',
      children: buildTree(templates, 'templates')
    },
    {
      label: 'Notes',
      href: '/notes',
      children: buildTree(notes, 'notes')
    }
  ];
}
