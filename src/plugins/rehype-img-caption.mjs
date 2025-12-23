/**
 * rehype plugin to wrap images with figure and add figcaption from alt text
 * 将图片包装在 figure 标签中，并将 alt 文本转换为 figcaption
 */
import { visit } from 'unist-util-visit';

export function rehypeImgCaption() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // 1. 处理被 <p> 包裹的单张图片 (Markdown 默认行为)
      if (node.tagName === 'p' && node.children.length === 1 && node.children[0].type === 'element' && node.children[0].tagName === 'img') {
        const imgNode = node.children[0];
        const figure = createFigure(imgNode);
        
        if (figure && parent && typeof index === 'number') {
          parent.children[index] = figure;
          return; // 已处理，跳过
        }
      }

      // 2. 处理独立的 <img> 标签
      if (node.tagName === 'img') {
        // 如果父节点已经是 figure，跳过
        if (parent?.tagName === 'figure') return;
        
        const figure = createFigure(node);
        if (figure && parent && typeof index === 'number') {
          parent.children[index] = figure;
        }
      }
    });
  };
}

function createFigure(imgNode) {
  // 获取 alt 文本
  const alt = imgNode.properties?.alt;
  if (!alt || typeof alt !== 'string') return null;

  const altText = alt.trim();
  
  // Debug: 打印处理的 alt 文本，帮助排查问题
  // console.log(`[rehype-img-caption] Checking alt: "${altText}"`);

  // 忽略空白 alt
  if (altText === '') return null;
  
  // 忽略默认文件名格式 (例如 image.png, image.jpg 等)
  // 使用正则匹配更稳健
  // 增加对 "image.png" 的精确匹配检查，防止正则意外失效
  if (altText.toLowerCase() === 'image.png') return null;

  if (/^image\.(png|jpg|jpeg|webp|gif|bmp|svg)$/i.test(altText)) {
    return null;
  }

  // 创建 figcaption 节点
  const figcaption = {
    type: 'element',
    tagName: 'figcaption',
    properties: {},
    children: [{ type: 'text', value: altText }]
  };

  // 创建 figure 节点
  return {
    type: 'element',
    tagName: 'figure',
    properties: { className: ['img-caption'] },
    children: [
      { ...imgNode }, // 复制原始图片节点
      figcaption
    ]
  };
}
