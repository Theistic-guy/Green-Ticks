import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSiteUrlForPath } from '../src/plugins/remark-link-resolver.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.resolve(__dirname, '..');
const vaultRoot = path.resolve(siteDir, '..');

// We scan the core knowledge base folders
const dirsToScan = ['Problems', 'Notes', 'Templates', 'Write-Ups'];

function extractWikiLinks(text) {
  const links = [];
  // Wiki links
  const wikiRegex = /\[\[(.*?)\]\]/g;
  let match;
  while ((match = wikiRegex.exec(text)) !== null) {
    const inner = match[1];
    const parts = inner.split('|');
    const target = parts[0];
    const cleanTarget = target.split('#')[0].trim();
    if (cleanTarget.length > 0) {
      links.push(cleanTarget);
    }
  }
  
  // Standard markdown links [text](url)
  const mdRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  while ((match = mdRegex.exec(text)) !== null) {
    let url = match[2].trim();
    // Ignore external
    if (url.startsWith('http')) continue;
    // Strip hash
    url = url.split('#')[0];
    if (url.endsWith('.md')) {
      links.push(url);
    }
  }
  
  return links;
}

function scanDirectory(dir, fileList) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (entry.name.endsWith('.md')) {
      fileList.push(fullPath);
    }
  }
}

const allFiles = [];
for (const d of dirsToScan) {
  scanDirectory(path.join(vaultRoot, d), allFiles);
}

const nodes = [];
const links = [];

function resolveTarget(sourcePath, targetName) {
  // Pass 1: standard relative
  const standardResolve = path.resolve(path.dirname(sourcePath), targetName);
  if (fs.existsSync(standardResolve) && fs.statSync(standardResolve).isFile()) {
    return standardResolve;
  }
  if (fs.existsSync(standardResolve + '.md')) {
    return standardResolve + '.md';
  }
  
  // Pass 2: hacked suffix matching
  let targetSuffix = path.normalize(targetName);
  if (!targetSuffix.endsWith('.md')) targetSuffix += '.md';
  const matches = allFiles.filter(f => f.endsWith(targetSuffix));
  if (matches.length > 0) return matches[0];
  
  return null;
}

// First Pass: create nodes
for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const url = getSiteUrlForPath(filePath, vaultRoot);
  
  let title = path.basename(filePath, '.md');
  const titleMatch = content.match(/^Title:\s*(.+)$/m);
  if (titleMatch) title = titleMatch[1].replace(/['"]/g, '').trim();
  
  const relPath = path.relative(vaultRoot, filePath);
  const group = relPath.split(path.sep)[0].toLowerCase();
  
  nodes.push({ id: url, title, url, group });
}

// Second Pass: create links
// To optimize, we map url -> node for fast lookup
const nodeIds = new Set(nodes.map(n => n.id));

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceUrl = getSiteUrlForPath(filePath, vaultRoot);
  
  const extracted = extractWikiLinks(content);
  for (const targetText of extracted) {
    // Ignore external
    if (targetText.startsWith('http')) continue;
    
    const resolvedPath = resolveTarget(filePath, targetText);
    if (resolvedPath) {
       const targetUrl = getSiteUrlForPath(resolvedPath, vaultRoot);
       if (nodeIds.has(targetUrl)) {
         links.push({ source: sourceUrl, target: targetUrl });
       }
    }
  }
}

const outputData = { nodes, links };
const publicDir = path.join(siteDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
fs.writeFileSync(path.join(publicDir, 'graph-data.json'), JSON.stringify(outputData, null, 2));
console.log('Graph data generated with', nodes.length, 'nodes and', links.length, 'links.');
