import { visit } from 'unist-util-visit';

export function remarkInlineTags() {
  return (tree) => {
    // Regex matches hashtags like #leetcode, #Sliding-Window, etc.
    // It looks for a '#' followed by word characters or hyphens.
    // The negative lookbehind/lookahead ensures we don't match # inside URLs or normal text without spaces.
    // But since JS regex doesn't support lookbehind broadly enough until recently, we can just split on space.
    // Actually, a simple regex matching `/(^|\s)(#[a-zA-Z0-9_-]+)/g` works.
    const hashtagRegex = /(^|\s)(#[a-zA-Z0-9_/-]+)/g;

    visit(tree, 'text', (node, index, parent) => {
      // If parent is a link, heading, or code block, we probably shouldn't mess with it.
      // Unist 'text' nodes don't inherently know their parents, but we are inside visit which gives us the parent.
      if (!parent || parent.type === 'link' || parent.type === 'heading' || parent.type === 'code' || parent.type === 'inlineCode') {
        return;
      }

      const text = node.value;
      if (!text.includes('#')) return;

      // Reset regex state
      hashtagRegex.lastIndex = 0;
      
      const matches = [];
      let match;
      while ((match = hashtagRegex.exec(text)) !== null) {
        matches.push({
          fullMatch: match[0],
          prefix: match[1], // The space or start of string
          tag: match[2],    // The actual #tag
          index: match.index
        });
      }

      if (matches.length === 0) return;

      const newNodes = [];
      let lastIndex = 0;

      for (const m of matches) {
        const matchStart = m.index;
        const tagStart = matchStart + m.prefix.length;

        // Add text before the match
        if (lastIndex < tagStart) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, tagStart)
          });
        }

        // Add the HTML pill node
        newNodes.push({
          type: 'html',
          value: `<span class="inline-tag">${m.tag}</span>`
        });

        lastIndex = tagStart + m.tag.length;
      }

      // Add remaining text after the last match
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex)
        });
      }

      // Replace the current text node with the new nodes
      parent.children.splice(index, 1, ...newNodes);
      
      // Tell visit to continue after the inserted nodes.
      return index + newNodes.length;
    });
  };
}
