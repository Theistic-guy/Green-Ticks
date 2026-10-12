import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSiteUrlForPath } from '../src/plugins/remark-link-resolver.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.resolve(__dirname, '..');
const vaultRoot = path.resolve(siteDir, '..');

// All knowledge base folders to scan and include in graph view
export const DIRS_TO_SCAN = [
  'Problems',
  'Notes',
  'Templates',
  'Write-Ups',
  'Companies',
  'Topics',
  'Platforms',
  'Miscellaneous Tags',
  'Groups'
];

export function extractLinks(text) {
  const links = [];
  
  // 1. Wiki links: [[target]] or [[target|display]] or [[target#heading]]
  const wikiRegex = /\[\[(.*?)\]\]/g;
  let match;
  while ((match = wikiRegex.exec(text)) !== null) {
    const inner = match[1];
    const target = inner.split('|')[0];
    const cleanTarget = target.split('#')[0].trim();
    if (cleanTarget.length > 0) {
      links.push(cleanTarget);
    }
  }

  // 2. Standard markdown links [text](url) with balanced parenthetical support
  const mdRegex = /\[([^\]]+)\]\(((?:[^()]+|\([^()]*\))+)\)/g;
  while ((match = mdRegex.exec(text)) !== null) {
    let url = match[2].trim();
    // Ignore external and anchor-only links
    if (/^(https?:\/\/|mailto:|#)/i.test(url)) continue;
    
    // Strip anchors and queries
    url = url.split('#')[0].split('?')[0].trim();
    if (!url) continue;

    // Decode URL-encoded characters (%20 -> space, etc.)
    try {
      url = decodeURIComponent(url);
    } catch (e) {
      // ignore
    }

    links.push(url);
  }

  return links;
}

export function scanDirectory(dir, fileList) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (entry.name.endsWith('.md')) {
      const baseName = entry.name.replace(/\.md$/i, '');
      if (baseName.includes('To-Do or Wishlist') || baseName.toLowerCase() === 'readme') {
        continue;
      }
      fileList.push(fullPath);
    }
  }
}

export function resolveTarget(sourcePath, rawTarget, vRoot, allFiles, filesByBasename) {
  let target = rawTarget.trim();
  try {
    target = decodeURIComponent(target);
  } catch (e) {}
  target = target.split('#')[0].split('?')[0].trim();
  if (!target) return null;

  // Ignore images and other binary assets
  if (/\.(png|jpe?g|svg|gif|webp|pdf|mp4|webm|ico)$/i.test(target)) {
    return null;
  }

  // 1. Root-relative paths (starting with / or \)
  if (target.startsWith('/') || target.startsWith('\\')) {
    const cleanRel = target.replace(/^[/\\]+/, '');
    const directVaultPath = path.join(vRoot, cleanRel);
    if (fs.existsSync(directVaultPath) && fs.statSync(directVaultPath).isFile()) {
      return directVaultPath;
    }
    if (fs.existsSync(directVaultPath + '.md') && fs.statSync(directVaultPath + '.md').isFile()) {
      return directVaultPath + '.md';
    }
  }

  // 2. Standard relative paths from source directory
  const standardResolve = path.resolve(path.dirname(sourcePath), target);
  if (fs.existsSync(standardResolve) && fs.statSync(standardResolve).isFile()) {
    return standardResolve;
  }
  if (fs.existsSync(standardResolve + '.md') && fs.statSync(standardResolve + '.md').isFile()) {
    return standardResolve + '.md';
  }

  // 3. Suffix matching against scanned files (e.g., "Extras/KMP algorithm.md" or "Problems/two-sum.md")
  let targetSuffix = path.normalize(target);
  if (!targetSuffix.toLowerCase().endsWith('.md')) targetSuffix += '.md';
  // Ensure boundary separator so "foo.md" does not match "some-other-foo.md"
  const sepSuffix = (targetSuffix.startsWith(path.sep) ? '' : path.sep) + targetSuffix.toLowerCase();
  const suffixMatch = allFiles.find(f => f.toLowerCase().endsWith(sepSuffix));
  if (suffixMatch) return suffixMatch;

  // 4. Basename matching (Obsidian wikilinks like [[Two Sum]] or [[KMP algorithm]])
  const base = path.basename(target, '.md').toLowerCase();
  if (filesByBasename.has(base)) {
    const matches = filesByBasename.get(base);
    // If multiple matches, prioritize one in the same directory
    const sameDir = matches.find(m => path.dirname(m) === path.dirname(sourcePath));
    return sameDir || matches[0];
  }

  return null;
}

export function generateGraphData(vRoot = vaultRoot) {
  const allFiles = [];
  for (const d of DIRS_TO_SCAN) {
    scanDirectory(path.join(vRoot, d), allFiles);
  }

  // Pre-index basenames for fast and accurate resolution
  const filesByBasename = new Map();
  for (const f of allFiles) {
    const base = path.basename(f, '.md').toLowerCase();
    if (!filesByBasename.has(base)) {
      filesByBasename.set(base, []);
    }
    filesByBasename.get(base).push(f);
  }

  const nodes = [];
  const links = [];

  // Pass 1: Build nodes
  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const url = getSiteUrlForPath(filePath, vRoot);

    let title = path.basename(filePath, '.md');
    const titleMatch = content.match(/^Title:\s*(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1].replace(/<[^>]+>/g, '').replace(/[\r\n]+/g, ' ').replace(/['"]/g, '').trim();
    }

    const relPath = path.relative(vRoot, filePath);
    let group = relPath.split(path.sep)[0].toLowerCase();
    if (group === 'miscellaneous tags') group = 'misc';

    nodes.push({ id: url, title, url, group });
  }

  // Pass 2: Build edges (links)
  const nodeIds = new Set(nodes.map(n => n.id));
  const edgeSet = new Set();

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const sourceUrl = getSiteUrlForPath(filePath, vRoot);
    if (!nodeIds.has(sourceUrl)) continue;

    const extracted = extractLinks(content);
    for (const targetText of extracted) {
      const resolvedPath = resolveTarget(filePath, targetText, vRoot, allFiles, filesByBasename);
      if (resolvedPath) {
        const targetUrl = getSiteUrlForPath(resolvedPath, vRoot);
        // Avoid self-loops and ensure target exists as a node
        if (targetUrl && nodeIds.has(targetUrl) && targetUrl !== sourceUrl) {
          const edgeKey = `${sourceUrl}->${targetUrl}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            links.push({ source: sourceUrl, target: targetUrl });
          }
        }
      }
    }
  }

  return { nodes, links };
}

// If run directly via CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const outputData = generateGraphData(vaultRoot);
  const publicDir = path.join(siteDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'graph-data.json'), JSON.stringify(outputData, null, 2));
  console.log(`Graph data generated with ${outputData.nodes.length} nodes and ${outputData.links.length} links.`);

  // Copy assets/Images into site/public/Images
  const imagesSource = path.join(vaultRoot, 'assets', 'Images');
  const imagesDest = path.join(publicDir, 'Images');
  if (fs.existsSync(imagesSource)) {
    fs.cpSync(imagesSource, imagesDest, { recursive: true });
    console.log('Copied assets/Images to public/Images.');
  }
}
