/**
 * Content loading utilities for reading the Obsidian vault.
 *
 * Since the vault lives one directory up from the Astro project,
 * we use Node fs/path to read files directly at build time.
 */
import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

/** Root of the Green-Ticks vault (parent of site/) */
const VAULT_ROOT = path.resolve(process.cwd(), '..');

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
 * Extract and normalize Obsidian tags from frontmatter properties.
 * Handles:
 *  - YAML array: `tags: [theory, backtracking, recursion, dfs]`
 *  - YAML bullet list: `tags:\n  - recursion\n  - josephus`
 *  - Space-delimited hashtags: `Tags: #DSA #Trie #Tree`
 *  - Comma-delimited strings: `tags: dsa, math`
 *  - Variations in casing: `tags`, `Tags`, `tag`, `Tag`
 */
export function extractFrontmatterTags(data: any): string[] {
  if (!data || typeof data !== 'object') return [];
  const raw = data.tags ?? data.Tags ?? data.tag ?? data.Tag;
  if (!raw) return [];

  const rawList = Array.isArray(raw) ? raw : (typeof raw === 'string' ? [raw] : [String(raw)]);
  const tags: string[] = [];

  for (const entry of rawList) {
    if (typeof entry !== 'string') {
      const s = String(entry).trim();
      if (s) tags.push(s);
      continue;
    }
    const trimmed = entry.trim();
    if (!trimmed) continue;

    // Multiple hashtags in a single line, e.g. "#DSA #Trie #Tree"
    if (trimmed.includes('#')) {
      const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
      for (const tok of tokens) {
        const clean = tok.replace(/^#+/, '').trim();
        if (clean) tags.push(clean);
      }
    } else if (trimmed.includes(',')) {
      // Comma-separated tags
      const tokens = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      tags.push(...tokens);
    } else {
      // Single tag (could be "recursion", "josephus", or "two pointers")
      const clean = trimmed.replace(/^#+/, '').trim();
      if (clean) tags.push(clean);
    }
  }

  // Deduplicate case-insensitively while preserving original case
  const seen = new Set<string>();
  const uniqueTags: string[] = [];
  for (const t of tags) {
    const lower = t.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      uniqueTags.push(t);
    }
  }
  return uniqueTags;
}

export function validateUpdated(value: unknown, filePath: string): string | undefined {
  if (!value) return undefined;
  console.log(`[validateUpdated] Checking ${filePath}:`, value);
  const str = String(value).trim();
  if (!/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    throw new Error(`[Format Error] File ${filePath} has an invalid "updated" format. Expected DD-MM-YYYY but got "${str}".`);
  }
  const parts = str.split('-');
  const dd = parseInt(parts[0], 10);
  const mm = parseInt(parts[1], 10);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) {
    throw new Error(`[Format Error] File ${filePath} has an invalid "updated" date. Expected DD-MM-YYYY but got "${str}" (Month must be 1-12, Day must be 1-31).`);
  }
  return str;
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
  updated?: string;
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

    const extraTags = extractFrontmatterTags(data);
    const otherTags = [...new Set([
      ...asList(data['Other Tags']),
      ...asList(data['otherTags']),
      ...extraTags,
    ])];

    problems.push({
      slug,
      filePath,
      title: String(data.Title || slug),
      topics: asList(data.Topics),
      platforms: asList(data.Platform),
      companies: asList(data.Companies),
      difficulty: String(data.Difficulty || 'Not Specified'),
      link: String(data.Link || ''),
      otherTags,
      rating,
      groups: asList(data.Groups),
      rawContent: content,
      updated: validateUpdated(data.updated, filePath),
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
  updated?: string;
  tags?: string[];
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
        if (name === '☑To-Do or Wishlist or Do later list') continue;

        const slug = [...segments, name].map(slugify).join('/');
        const title = name.includes('-') && !name.includes(' ')
          ? name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : name;

        const rawText = fs.readFileSync(fullPath, 'utf-8');
        const { data, content } = matter(rawText);
        const pageTags = extractFrontmatterTags(data);

        pages.push({
          slug,
          title,
          filePath: fullPath,
          rawContent: content,
          pathSegments: [...segments, name],
          updated: validateUpdated(data.updated, fullPath),
          tags: pageTags,
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
 * Load the platforms logo mapping from assets/site-info.json.
 */
export function loadPlatformLogos(token: string): Record<string, string> {
  const jsonPath = path.join(VAULT_ROOT, 'assets', 'site-info.json');
  if (!fs.existsSync(jsonPath)) return {};

  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const info = JSON.parse(raw);
    const platformsMap: Record<string, string> = info.platforms || {};
    const logos: Record<string, string> = {};

    if (!token || token === 'your_token_here') return logos;

    for (const [platform, domain] of Object.entries(platformsMap)) {
      const url = `https://img.logo.dev/${domain}?token=${token}`;
      logos[platform] = url;
      logos[platform.toLowerCase()] = url;
      logos[platform.toUpperCase()] = url;
    }
    return logos;
  } catch (e) {
    return {};
  }
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
  const writeUps = loadMarkdownDir('Write-Ups');

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
        // Special pinning for "Extras" and "Overview"
        const getPriority = (label: string) => {
          if (label === 'Extras') return 1;
          if (label === 'Overview') return 2;
          return 99;
        };

        const priorityA = getPriority(a.label);
        const priorityB = getPriority(b.label);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

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
        { label: 'Platforms', href: '/platforms' },
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
    },
    {
      label: 'Write-Ups',
      icon: 'pen-tool',
      href: '/write-ups',
      children: buildTree(writeUps, 'write-ups')
    }
  ];
}

import { marked } from 'marked';

function extractWikiLinks(text: string) {
  const links: { target: string; display: string }[] = [];
  const regex = /\[\[(.*?)\]\]/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const inner = match[1];
    const parts = inner.split('|');
    links.push({
      target: parts[0].trim(),
      display: parts.length > 1 ? parts[1].trim() : parts[0].trim(),
    });
  }
  return links;
}

function renderCarouselHtml(containerPath: string): string {
  if (!fs.existsSync(containerPath)) return '';
  const containerRaw = fs.readFileSync(containerPath, 'utf8');
  const { data: containerData } = matter(containerRaw);

  const caption = containerData.Caption || '';
  const displayCount = parseInt(containerData['Display Count'] || 1, 10);
  const rotation = containerData.Rotation === true;
  const speedMap: Record<string, number> = { Slow: 5000, Medium: 3000, Fast: 1500 };
  const rotationSpeed = speedMap[containerData['Rotation Speed']] || 3000;
  const rawSize = String(containerData.Size || 'Medium').trim().toLowerCase();
  const validSizes = ['small', 'medium', 'large'];
  const size = validSizes.includes(rawSize) ? rawSize : 'medium';

  const rawAlign = String(containerData.Align || 'Center').trim().toLowerCase();
  const validAligns = ['left', 'center', 'right', 'justify'];
  const align = validAligns.includes(rawAlign) ? rawAlign : 'center';

  const cardsRaw = containerData.Cards ? String(containerData.Cards) : '';
  const cardLinks = extractWikiLinks(cardsRaw);

  const cardsHtmlArr = cardLinks.map((cardLink) => {
    let cardPath = path.resolve(path.dirname(containerPath), cardLink.target);
    if (!cardPath.endsWith('.md')) cardPath += '.md';
    if (!fs.existsSync(cardPath)) {
      cardPath = path.resolve(VAULT_ROOT, 'assets', 'Carousels', 'Carousel Cards', cardLink.target);
      if (!cardPath.endsWith('.md')) cardPath += '.md';
    }
    if (!fs.existsSync(cardPath)) return '';

    const cardRaw = fs.readFileSync(cardPath, 'utf8');
    const { data: cardData } = matter(cardRaw);

    const title = cardData.Title || '';
    const description = cardData.Description || '';

    let coverImg = '';
    if (cardData['Cover Img']) {
      const imgLinks = extractWikiLinks(String(cardData['Cover Img']));
      if (imgLinks.length > 0) {
        const imgTarget = imgLinks[0].target.trim();
        if (imgTarget.startsWith('http://') || imgTarget.startsWith('https://')) {
          coverImg = imgTarget;
        } else {
          coverImg = `/Images/${path.basename(imgTarget)}`;
        }
      } else {
        const rawImg = String(cardData['Cover Img']).trim();
        if (rawImg.startsWith('http://') || rawImg.startsWith('https://')) {
          coverImg = rawImg;
        } else {
          coverImg = `/Images/${path.basename(rawImg)}`;
        }
      }
    }

    let cardLinkUrl = '#';
    if (cardData.Link) {
      const lnks = extractWikiLinks(String(cardData.Link));
      if (lnks.length > 0) {
        const lnkTarget = lnks[0].target.trim();
        if (lnkTarget.startsWith('http://') || lnkTarget.startsWith('https://')) {
          cardLinkUrl = lnkTarget;
        } else {
          const cleanTarget = lnkTarget.replace(/^(\.\.\/)+/, '').replace(/^\//, '').replace(/\.md$/, '');
          cardLinkUrl = `/${cleanTarget.toLowerCase()}`;
        }
      } else {
        const rawLink = String(cardData.Link).trim();
        if (rawLink.startsWith('http://') || rawLink.startsWith('https://')) {
          cardLinkUrl = rawLink;
        }
      }
    }

    return `<div class="carousel-card">${coverImg ? `<img src="${coverImg}" class="carousel-card-img" alt="${title}" loading="lazy" onerror="this.style.display='none'" />` : ''}<div class="carousel-card-content">${title ? `<h3>${title}</h3>` : ''}${description ? `<p>${description}</p>` : ''}${cardLinkUrl !== '#' ? `<a href="${cardLinkUrl}" class="carousel-card-link">View More</a>` : ''}</div></div>`;
  });

  return `<green-carousel data-align="${align}" data-size="${size}" data-display="${displayCount}" data-rotation="${rotation}" data-speed="${rotationSpeed}"><div class="carousel-wrapper"><div class="carousel-track">${cardsHtmlArr.join('')}</div>${caption ? `<div class="carousel-caption">${caption}</div>` : ''}</div></green-carousel>`;
}

function renderCollapsibleHtml(modulePath: string, visited: Set<string>): string {
  if (!fs.existsSync(modulePath)) return '';
  if (visited.has(modulePath)) return '<div class="error">Infinite recursion detected</div>';
  visited.add(modulePath);

  const raw = fs.readFileSync(modulePath, 'utf8');
  const { data, content } = matter(raw);

  const title = data.Title || path.basename(modulePath, '.md');
  const level = parseInt(data['Heading Level'] || data.Heading || 3, 10);

  const innerHtml = renderVaultMarkdown(content, path.dirname(modulePath), visited);

  visited.delete(modulePath);

  return `<details class="collapsible-module"><summary class="collapsible-header level-${level}"><span class="collapsible-title">${title}</span><span class="toggle-icon"></span></summary><div class="collapsible-content">${innerHtml}</div></details>`;
}

export function renderVaultMarkdown(rawMarkdown: string, baseDir?: string, visited = new Set<string>()): string {
  if (!rawMarkdown) return '';
  const currentDir = baseDir || VAULT_ROOT;
  const blocks: string[] = [];

  const storeBlock = (html: string) => {
    const idx = blocks.length;
    blocks.push(html.trim());
    return `\n\n<div data-green-block="${idx}"></div>\n\n`;
  };

  // 1. Process Markdown links: !?[label](url)
  let processed = rawMarkdown.replace(/!?\[([^\]]*?)\]\(([^)]+?)\)/g, (fullMatch, label, url) => {
    const cleanUrl = decodeURIComponent(url.trim());
    
    // Check if Carousel Container
    if (cleanUrl.includes('Carousel Containers') || cleanUrl.includes('Carousels')) {
      let resolved = path.resolve(currentDir, cleanUrl);
      if (!resolved.endsWith('.md')) resolved += '.md';
      if (!fs.existsSync(resolved)) {
        resolved = path.resolve(VAULT_ROOT, 'assets', 'Carousels', 'Carousel Containers', path.basename(cleanUrl));
        if (!resolved.endsWith('.md')) resolved += '.md';
      }
      if (fs.existsSync(resolved)) {
        const html = renderCarouselHtml(resolved);
        return storeBlock(html);
      }
    }

    // Check if Collapsible Module
    if (cleanUrl.includes('Collapsible Modules')) {
      let resolved = path.resolve(currentDir, cleanUrl);
      if (!resolved.endsWith('.md')) resolved += '.md';
      if (!fs.existsSync(resolved)) {
        resolved = path.resolve(VAULT_ROOT, 'assets', 'Collapsible Modules', path.basename(cleanUrl));
        if (!resolved.endsWith('.md')) resolved += '.md';
      }
      if (fs.existsSync(resolved)) {
        const html = renderCollapsibleHtml(resolved, visited);
        return storeBlock(html);
      }
    }

    return fullMatch;
  });

  // 2. Process Wikilinks: !?[[target|display]] or [[target]]
  processed = processed.replace(/!?\[\[(.*?)\]\]/g, (fullMatch, inner) => {
    const parts = inner.split('|');
    const target = parts[0].trim();

    // Check if Carousel Container
    let containerPath = path.resolve(currentDir, target);
    if (!containerPath.endsWith('.md')) containerPath += '.md';
    if (!fs.existsSync(containerPath)) {
      containerPath = path.resolve(VAULT_ROOT, 'assets', 'Carousels', 'Carousel Containers', target);
      if (!containerPath.endsWith('.md')) containerPath += '.md';
    }
    if (fs.existsSync(containerPath) && containerPath.includes('Carousel Containers')) {
      const html = renderCarouselHtml(containerPath);
      return storeBlock(html);
    }

    // Check if Collapsible Module
    let modulePath = path.resolve(currentDir, target);
    if (!modulePath.endsWith('.md')) modulePath += '.md';
    if (!fs.existsSync(modulePath)) {
      modulePath = path.resolve(VAULT_ROOT, 'assets', 'Collapsible Modules', target);
      if (!modulePath.endsWith('.md')) modulePath += '.md';
    }
    if (fs.existsSync(modulePath) && modulePath.includes('Collapsible Modules')) {
      const html = renderCollapsibleHtml(modulePath, visited);
      return storeBlock(html);
    }

    return fullMatch;
  });

  // 3. Parse Markdown
  let htmlResult = marked.parse(processed) as string;

  // 4. Restore blocks and remove wrapping <p> if marked wrapped the placeholder
  htmlResult = htmlResult.replace(/(?:<p>\s*)?<div data-green-block="(\d+)"><\/div>(?:\s*<\/p>)?/g, (_, idx) => {
    return blocks[Number(idx)] || '';
  });

  return htmlResult;
}

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
  const baseDir = path.join(VAULT_ROOT, 'assets', 'Append Sections', `${category} Sections`);
  
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
  return renderVaultMarkdown(rawMarkdown, baseDir);
}
