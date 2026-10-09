import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { visit } from 'unist-util-visit';

function extractWikiLinks(text) {
  const links = [];
  const regex = /\[\[(.*?)\]\]/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const inner = match[1];
    const parts = inner.split('|');
    links.push({
      target: parts[0],
      display: parts.length > 1 ? parts[1] : parts[0]
    });
  }
  return links;
}

function resolveAssetPath(target, currentDir, vaultRoot) {
  // If it's a web URL, return as is
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return target;
  }
  
  // Clean target
  target = target.trim();
  
  // If it doesn't have an extension, assume .md for cards, or try to find an image extension
  // But for cards it's usually .md. For images it could be .png, .jpg
  let ext = path.extname(target);
  
  let resolved = path.resolve(currentDir, target);
  if (!ext) {
    if (fs.existsSync(resolved + '.md')) resolved += '.md';
    else resolved = path.resolve(vaultRoot, 'assets', 'Images', target);
  }
  
  return resolved;
}

export function remarkCarousel() {
  return async (tree, file) => {
    const currentFilePath = file.history[0];
    const siteDir = path.resolve(process.cwd());
    const vaultRoot = path.resolve(siteDir, '..');
    
    // Collect all matches first
    const nodesToProcess = [];
    visit(tree, 'text', (node, index, parent) => {
      if (!parent) return;
      const text = node.value;
      const regex = /!?\[\[(.*?)\]\]/g;
      const matches = [...text.matchAll(regex)];
      if (matches.length > 0) {
        nodesToProcess.push({ node, index, parent, matches, text });
      }
    });
    
    // We import dynamically because getSiteUrlForPath is now exported
    const { getSiteUrlForPath } = await import('./remark-link-resolver.mjs');

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
        
        let containerPath = path.resolve(path.dirname(currentFilePath), target);
        if (!target.endsWith('.md')) containerPath += '.md';
        
        if (!fs.existsSync(containerPath)) {
          containerPath = path.resolve(vaultRoot, 'assets', 'Carousels', 'Carousel Containers', target);
          if (!target.endsWith('.md')) containerPath += '.md';
        }
        
        if (fs.existsSync(containerPath) && containerPath.includes('Carousel Containers')) {
          const containerRaw = fs.readFileSync(containerPath, 'utf8');
          const { data: containerData } = matter(containerRaw);
          
          const caption = containerData.Caption || '';
          const displayCount = parseInt(containerData['Display Count'] || 1, 10);
          const rotation = containerData.Rotation === true;
          const speedMap = { Slow: 5000, Medium: 3000, Fast: 1500 };
          const rotationSpeed = speedMap[containerData['Rotation Speed']] || 3000;
          
          const cardsRaw = containerData.Cards ? String(containerData.Cards) : '';
          const cardLinks = extractWikiLinks(cardsRaw);
          
          const cardsHtmlArr = await Promise.all(cardLinks.map(async cardLink => {
            let cardPath = path.resolve(path.dirname(containerPath), cardLink.target);
            if (!cardPath.endsWith('.md')) cardPath += '.md';
            
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
                   let resolvedMd = path.resolve(path.dirname(cardPath), lnkTarget);
                   if (!resolvedMd.endsWith('.md')) resolvedMd += '.md';
                   if (fs.existsSync(resolvedMd)) {
                     cardLinkUrl = getSiteUrlForPath(resolvedMd, vaultRoot);
                   }
                 }
              }
            }
            
            return `
              <div class="carousel-card">
                ${coverImg ? `<img src="${coverImg}" class="carousel-card-img" alt="${title}" loading="lazy" />` : ''}
                <div class="carousel-card-content">
                  ${title ? `<h3>${title}</h3>` : ''}
                  ${description ? `<p>${description}</p>` : ''}
                  ${cardLinkUrl !== '#' ? `<a href="${cardLinkUrl}" class="carousel-card-link">View More</a>` : ''}
                </div>
              </div>
            `;
          }));
          
          const cardsHtml = cardsHtmlArr.join('');
          
          const htmlStr = `
            <green-carousel data-display="${displayCount}" data-rotation="${rotation}" data-speed="${rotationSpeed}">
              <div class="carousel-wrapper">
                <div class="carousel-track">
                  ${cardsHtml}
                </div>
                ${caption ? `<div class="carousel-caption">${caption}</div>` : ''}
              </div>
            </green-carousel>
          `;
          
          newNodes.push({ type: 'html', value: htmlStr });
        } else {
          newNodes.push({ type: 'text', value: fullMatch });
        }
      }
      
      if (lastIndex < text.length) {
        newNodes.push({ type: 'text', value: text.slice(lastIndex) });
      }
      
      parent.children.splice(index, 1, ...newNodes);
    }
  };
}
