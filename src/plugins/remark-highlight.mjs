import { visit } from 'unist-util-visit';

/**
 * Remark plugin to support ==highlight== syntax.
 */
export function remarkHighlight() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value.includes('==')) return;

      const regex = /==(.+?)==/g;
      const children = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(node.value)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          children.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index)
          });
        }

        // Add the highlight node
        children.push({
          type: 'html',
          value: `<mark>${match[1]}</mark>`,
          data: {
            hName: 'mark'
          }
        });

        lastIndex = regex.lastIndex;
      }

      // Add remaining text
      if (lastIndex < node.value.length) {
        children.push({
          type: 'text',
          value: node.value.slice(lastIndex)
        });
      }

      if (children.length > 0) {
        parent.children.splice(index, 1, ...children);
        // Skip the newly added children to avoid infinite loop or redundant processing
        return [visit.SKIP, index + children.length];
      }
    });
  };
}
