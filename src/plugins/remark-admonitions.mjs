import { visit } from 'unist-util-visit';

export function remarkAdmonitions() {
  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      if (!node.children || node.children.length === 0) return;
      
      const firstChild = node.children[0];
      if (firstChild.type !== 'paragraph') return;
      
      if (!firstChild.children || firstChild.children.length === 0) return;
      
      const firstTextNode = firstChild.children[0];
      if (firstTextNode.type !== 'text') return;
      
      const text = firstTextNode.value;
      // Regex to match [!TYPE] Title
      // Supports: NOTE, TIP, IMPORTANT, WARNING, CAUTION, INFO, SUCCESS, DANGER, CITE
      const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO|SUCCESS|DANGER|CITE)\](?:[ \t]+(.*))?$/m);
      
      if (!match) return;
      
      const type = match[1].toLowerCase();
      const title = match[2];
      
      // Split text to separate the marker line from the rest
      const lines = text.split('\n');
      const firstLineLength = lines[0].length;
      
      const newChildren = [];
      
      // If there is a title, create a label node
      if (title) {
        newChildren.push({
          type: 'paragraph',
          data: { directiveLabel: true },
          children: [{ type: 'text', value: title }]
        });
      }
      
      // Handle the rest of the content
      // We remove the first line (marker + title) from the first text node
      
      // Check if there is content after the first line in the same text node
      let hasRestOfText = false;
      if (text.length > firstLineLength) {
          // There is a newline and potentially more text
          const restOfText = text.substring(firstLineLength + 1); // +1 for the newline
          if (restOfText.length > 0) {
              firstTextNode.value = restOfText;
              hasRestOfText = true;
          }
      }
      
      if (hasRestOfText) {
          newChildren.push(firstChild);
      } else {
          // The first text node is exhausted (it only contained the marker/title)
          // We remove it from the paragraph
          firstChild.children.shift();
          
          // If the paragraph still has children (e.g. other inline elements), keep it
          if (firstChild.children.length > 0) {
              newChildren.push(firstChild);
          }
      }
      
      // Add remaining children of the blockquote (subsequent paragraphs, etc.)
      for (let i = 1; i < node.children.length; i++) {
        newChildren.push(node.children[i]);
      }
      
      const directiveNode = {
        type: 'containerDirective',
        name: type,
        attributes: {},
        children: newChildren,
        data: {
            hName: type,
            hProperties: {
                class: `admonition ${type}` // Optional, but good for default styling if component fails
            }
        }
      };
      
      parent.children[index] = directiveNode;
    });
  };
}
