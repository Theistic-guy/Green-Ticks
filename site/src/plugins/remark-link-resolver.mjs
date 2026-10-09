import path from 'node:path';
import fs from 'node:fs';
import { visit } from 'unist-util-visit';

// Simple slugify that matches your content.ts logic
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Global cache of all markdown files in the vault to avoid re-scanning
let vaultFilesCache = [];
let isInitialized = false;

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

function initVaultFiles(vaultRoot) {
  if (isInitialized) return;
  const dirsToScan = ['Problems', 'Notes', 'Templates', 'Companies', 'Topics', 'Platforms', 'Miscellaneous Tags', 'Groups'];
  
  for (const d of dirsToScan) {
    scanDirectory(path.join(vaultRoot, d), vaultFilesCache);
  }
  isInitialized = true;
}

/**
 * Converts an absolute system path of a markdown file into its final Astro URL.
 */
function getSiteUrlForPath(absolutePath, vaultRoot) {
  // Get relative path from vault root (e.g., "Problems\two-sum.md" or "Notes\Algorithms\binary-search.md")
  const relPath = path.relative(vaultRoot, absolutePath);
  
  // Normalize slashes for processing
  const parts = relPath.split(path.sep);
  const topDir = parts[0];
  
  // Remove the .md extension from the filename
  const fileName = parts.pop().replace(/\.md$/, '');
  
  // Slugify all remaining parts (directories and filename)
  const slugifiedParts = parts.slice(1).map(slugify);
  slugifiedParts.push(slugify(fileName));
  
  const slugPath = slugifiedParts.join('/');

  switch (topDir) {
    case 'Problems': return `/problems/${slugPath}`;
    case 'Notes': return `/notes/${slugPath}`;
    case 'Templates': return `/templates/${slugPath}`;
    case 'Companies': return `/companies/${slugPath}`;
    case 'Topics': return `/topics/${slugPath}`;
    case 'Platforms': return `/platforms/${slugPath}`;
    case 'Miscellaneous Tags': return `/misc/${slugPath}`;
    case 'Groups': return `/groups/${slugPath}`;
    default:
      // Fallback for root files like README.md
      if (fileName.toLowerCase() === 'readme') return '/';
      return `/${slugPath}`;
  }
}

export function remarkLinkResolver() {
  return (tree, file) => {
    // The vault root is the parent directory of the 'site' folder
    // file.history[0] is the absolute path to the current markdown file being processed
    const currentFilePath = file.history[0];
    const siteDir = path.resolve(process.cwd()); // usually points to /site
    const vaultRoot = path.resolve(siteDir, '..');
    
    initVaultFiles(vaultRoot);

    visit(tree, 'link', (node) => {
      let url = node.url;
      
      // 1. Skip external URLs and anchors
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('#')) {
        return;
      }

      // Decode URI components (e.g., %20 to space) just in case
      try {
        url = decodeURI(url);
      } catch (e) {
        // ignore malformed URIs
      }

      // 2. Extract heading hash if present
      let hash = '';
      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        hash = url.substring(hashIndex);
        url = url.substring(0, hashIndex);
      }

      // If it doesn't end in .md, it's likely not a vault file link (could be an image or something else)
      // Though image links are usually visited as 'image' nodes, not 'link'.
      if (!url.toLowerCase().endsWith('.md') && url.length > 0) {
        // We will only rewrite .md links.
        return;
      }

      let resolvedFile = null;

      // PASS 1: Standard Relative Resolution
      // Resolve the link relative to the current file's directory
      const currentDir = path.dirname(currentFilePath);
      const standardResolve = path.resolve(currentDir, url);
      
      if (fs.existsSync(standardResolve) && fs.statSync(standardResolve).isFile()) {
        resolvedFile = standardResolve;
      } else {
        // PASS 2: Fallback "Hacked" Resolution
        // The user might have written `Problems/two-sum.md` from inside `Notes/some.md`.
        // We look for a file in our global cache that ends with the normalized target path.
        
        // Normalize the target url to system path separators (e.g. "Problems/two-sum.md" -> "Problems\two-sum.md" on Windows)
        const targetSuffix = path.normalize(url);
        
        // Find all files that end with this exact suffix
        const matches = vaultFilesCache.filter(f => f.endsWith(targetSuffix));
        
        if (matches.length === 1) {
          resolvedFile = matches[0];
        } else if (matches.length > 1) {
          // If multiple matches (e.g. query was just "index.md"), try to find one that shares the most directory structure
          // Or just pick the first one as a best-effort.
          resolvedFile = matches[0];
        }
      }

      // PASS 3: Generate the final Astro URL
      if (resolvedFile) {
        const finalUrl = getSiteUrlForPath(resolvedFile, vaultRoot);
        
        // Re-attach hash (and slugify the hash text to match Github/Astro heading IDs)
        if (hash) {
          const hashText = hash.substring(1);
          // Astro automatically slugifies headings for IDs
          node.url = `${finalUrl}#${slugify(hashText)}`;
        } else {
          node.url = finalUrl;
        }
      }
    });
  };
}
