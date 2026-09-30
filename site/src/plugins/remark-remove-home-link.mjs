import { visit } from 'unist-util-visit';

export function remarkRemoveHomeLink() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      // Check if this node is an HTML node containing the home link
      if (node.type === 'html' && node.value.includes('⇐🏠')) {
        parent.children.splice(index, 1);
        return [visit.SKIP, index];
      }
      
      // Check if it's a link node containing the home link HTML
      if (node.type === 'link') {
        const hasHomeLink = node.children.some(
          child => child.type === 'html' && child.value.includes('⇐🏠')
        );
        
        if (hasHomeLink || (node.url && node.url.includes('README.md') && node.children.some(c => c.value && c.value.includes('⇐🏠')))) {
          parent.children.splice(index, 1);
          return [visit.SKIP, index];
        }
      }

      // Check text nodes just in case it got parsed as text
      if (node.type === 'text' && node.value.includes('⇐🏠')) {
        parent.children.splice(index, 1);
        return [visit.SKIP, index];
      }
    });
  };
}
