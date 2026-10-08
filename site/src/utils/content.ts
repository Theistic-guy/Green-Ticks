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

    const slug = slugify(file.replace(/\.md$/, ''));
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
 * Compute the co-occurring facets (unique topics, companies, tags, groups)
 * for a given list of problems. Removes the base dimension value if provided.
 */
export function computeFacets(problems: Problem[], baseValue?: string) {
  const facets = {
    topics: new Set<string>(),
    companies: new Set<string>(),
    otherTags: new Set<string>(),
    groups: new Set<string>()
  };

  for (const p of problems) {
    p.topics.forEach(t => facets.topics.add(t));
    p.companies.forEach(c => facets.companies.add(c));
    p.otherTags.forEach(t => facets.otherTags.add(t));
    p.groups.forEach(g => facets.groups.add(g));
  }

  // Remove empty/unspecified strings
  facets.companies.delete('Not Specified');
  
  if (baseValue) {
    facets.topics.delete(baseValue);
    facets.companies.delete(baseValue);
    facets.otherTags.delete(baseValue);
    facets.groups.delete(baseValue);
  }

  return {
    topics: Array.from(facets.topics).sort(),
    companies: Array.from(facets.companies).sort(),
    otherTags: Array.from(facets.otherTags).sort(),
    groups: Array.from(facets.groups).sort()
  };
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
    
    function sortTree(nodes: any[]) {
      nodes.sort((a, b) => {
        const aIsFolder = a.children ? 1 : 0;
        const bIsFolder = b.children ? 1 : 0;
        if (aIsFolder !== bIsFolder) return bIsFolder - aIsFolder;
        return a.label.localeCompare(b.label);
      });
      for (const node of nodes) {
        if (node.children) sortTree(node.children);
      }
    }

    sortTree(root);
    return root;
  }

  return [
    {
      label: 'Explore',
      icon: 'compass',
      children: [
        { label: 'Problems', href: '/problems', count: problems.length },
        { label: 'Topics', href: '/topics' },
        { label: 'Companies', href: '/companies' },
        { label: 'Misc Tags', href: '/misc' },
        { label: 'Groups', href: '/groups' },
      ]
    },
    {
      label: 'Templates',
      icon: 'file-text',
      href: '/templates',
      children: buildTree(templates, 'templates')
    },
    {
      label: 'Notes',
      icon: 'book',
      href: '/notes',
      children: buildTree(notes, 'notes')
    }
  ];
}

import { marked } from 'marked';

/**
 * Load "Top" or "Bottom" section contents for a given category and slug.
 * 
 * Looks in:
 * 1. assets/{category} Sections/{Position}/*.md  (Global for the category)
 * 2. assets/{category} Sections/{slug}/{position}.md (Old script individual file)
 * 3. assets/{category} Sections/{slug}/{Position}/*.md (User's new folder structure)
 * 
 * Returns rendered HTML string.
 */
export function loadSectionContent(category: string, slug: string, position: 'Top' | 'Bottom'): string {
  const chunks: string[] = [];
  const baseDir = path.join(VAULT_ROOT, 'assets', `${category} Sections`);
  
  if (!fs.existsSync(baseDir)) return '';

  const isTop = position === 'Top';
  const fileName = `${position.toLowerCase()}.md`;

  const validateAndRead = (folder: string) => {
    const folderPath = path.join(baseDir, folder);
    if (!fs.existsSync(folderPath)) return '';

    // Validate that only top.md, bottom.md, or system files exist in the folder
    const files = fs.readdirSync(folderPath, { withFileTypes: true });
    for (const f of files) {
      if (f.isDirectory()) {
        throw new Error(`Invalid subdirectory found in ${folderPath}: ${f.name}`);
      }
      if (f.name !== 'top.md' && f.name !== 'bottom.md' && f.name !== '.gitkeep' && f.name !== '.DS_Store') {
        throw new Error(`Invalid file found in custom section ${folderPath}: ${f.name}. Only top.md and bottom.md are allowed.`);
      }
    }

    const file = path.join(folderPath, fileName);
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8').trim();
      if (content && content.toLowerCase() !== 'placeholder') {
        return content;
      }
    }
    return '';
  };

  const allChunk = validateAndRead('All');
  const slugChunk = validateAndRead(slug);

  // Merge order:
  // For 'Top': All first, then individual
  // For 'Bottom': individual first, then All
  if (isTop) {
    if (allChunk) chunks.push(allChunk);
    if (slugChunk) chunks.push(slugChunk);
  } else {
    if (slugChunk) chunks.push(slugChunk);
    if (allChunk) chunks.push(allChunk);
  }

  if (chunks.length === 0) return '';

  // Render markdown to HTML
  const rawMarkdown = chunks.join('\n\n---\n\n');
  return marked.parse(rawMarkdown) as string;
}
