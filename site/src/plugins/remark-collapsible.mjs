import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { visit } from 'unist-util-visit';
import { remark } from 'remark';

function buildModuleNodes(modulePath, target, file) {
  if (file.data.visitedCollapsibles.has(modulePath)) {
    return [{ type: 'html', value: `<div class="error" style="color:red; border:1px solid red; padding:10px;">Infinite recursion detected for ${target}</div>` }];
  }
  
  file.data.visitedCollapsibles.add(modulePath);
  
  const raw = fs.readFileSync(modulePath, 'utf8');
  const { data, content } = matter(raw);
  
  const title = data.Title || target;
  const level = parseInt(data['Heading Level'] || data.Heading || 3, 10);
  
  // Parse the inner content into an AST
  const parsedInnerAst = remark().parse(content);
  
  // Inject a hidden heading so Astro's TOC scanner picks it up
  const hiddenStart = { type: 'html', value: `<div style="display: none;" aria-hidden="true">` };
  const fakeHeading = { 
    type: 'heading', 
    depth: level, 
    children: [{ type: 'text', value: title }] 
  };
  const hiddenEnd = { type: 'html', value: `</div>` };
  
  // We need to inject the HTML wrapper around the inner AST nodes
  const startNode = { type: 'html', value: `<details class="collapsible-module"><summary class="collapsible-header level-${level}"><span class="collapsible-title">${title}</span><span class="toggle-icon"></span></summary><div class="collapsible-content">` };
  const endNode = { type: 'html', value: `</div></details>` };
  
  file.data.visitedCollapsibles.delete(modulePath);

  return [hiddenStart, fakeHeading, hiddenEnd, startNode, ...parsedInnerAst.children, endNode];
}

export function remarkCollapsible() {
  return async (tree, file) => {
    const siteDir = path.resolve(process.cwd());
    const vaultRoot = path.resolve(siteDir, '..');
    
    // We need to keep track of visited files to prevent infinite recursion
    if (!file.data.visitedCollapsibles) {
      file.data.visitedCollapsibles = new Set();
    }
    
    // 1. Process text nodes for [[...]]
    const nodesToProcess = [];
    visit(tree, 'text', (node, index, parent) => {
      if (!parent) return;
      const text = node.value;
      const regex = /\[\[(.*?)\]\]/g;
      const matches = [...text.matchAll(regex)];
      if (matches.length > 0) {
        nodesToProcess.push({ node, index, parent, matches, text });
      }
    });

    for (const { node, index, parent, matches, text } of nodesToProcess) {
      const newNodes = [];
      let lastIndex = 0;
      
      for (const m of matches) {
        const fullMatch = m[0];
        const inner = m[1];
        const matchStart = m.index;
        
        const parts = inner.split('|');
        const target = parts[0].trim();
        
        if (lastIndex < matchStart) {
          newNodes.push({ type: 'text', value: text.slice(lastIndex, matchStart) });
        }
        
        lastIndex = matchStart + fullMatch.length;
        
        // Resolve path to Collapsible Modules
        let modulePath = path.resolve(vaultRoot, 'assets', 'Collapsible Modules', target);
        if (!target.endsWith('.md')) modulePath += '.md';
        
        if (fs.existsSync(modulePath)) {
          const replacementNodes = buildModuleNodes(modulePath, target, file);
          newNodes.push(...replacementNodes);
        } else {
          // Not a collapsible module, leave as text so other plugins handle it
          newNodes.push({ type: 'text', value: fullMatch });
        }
      }
      
      if (lastIndex < text.length) {
        newNodes.push({ type: 'text', value: text.slice(lastIndex) });
      }
      
      parent.children.splice(index, 1, ...newNodes);
    }

    // 2. Process link nodes for [label](url) targeting Collapsible Modules
    const linksToProcess = [];
    visit(tree, 'link', (node, index, parent) => {
      if (!parent) return;
      const cleanUrl = decodeURIComponent(node.url || '');
      if (cleanUrl.includes('Collapsible Modules')) {
        linksToProcess.push({ node, index, parent, cleanUrl });
      }
    });

    for (const { node, index, parent, cleanUrl } of linksToProcess) {
      let modulePath = path.resolve(vaultRoot, cleanUrl);
      if (!modulePath.endsWith('.md')) modulePath += '.md';
      if (!fs.existsSync(modulePath)) {
        modulePath = path.resolve(vaultRoot, 'assets', 'Collapsible Modules', path.basename(cleanUrl));
        if (!modulePath.endsWith('.md')) modulePath += '.md';
      }
      if (fs.existsSync(modulePath)) {
        const targetName = path.basename(modulePath, '.md');
        const replacementNodes = buildModuleNodes(modulePath, targetName, file);
        parent.children.splice(index, 1, ...replacementNodes);
      }
    }
  };
}
