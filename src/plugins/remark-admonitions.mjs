import { visit } from "unist-util-visit";

const ADMONITION_MARKER_RE =
	/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO|SUCCESS|DANGER|CITE)\]([+-])?/i;

const DEFAULT_ADMONITION_LABELS = {
	note: "Note",
	info: "Info",
	success: "Success",
	warning: "Warning",
	danger: "Danger",
	cite: "Cite",
	tip: "Tip",
	important: "Important",
	caution: "Caution",
};

/**
 * 将 Obsidian 风格 callout 标记从文本节点头部剥离出来。
 * @param {import('mdast').Text} textNode
 * @returns {{ type: string; foldMarker?: string; remainingText: string } | null}
 */
function parseAdmonitionMarker(textNode) {
	if (textNode.type !== "text") return null;

	const match = textNode.value.match(ADMONITION_MARKER_RE);
	if (!match) return null;

	return {
		type: match[1].toLowerCase(),
		foldMarker: match[2],
		remainingText: textNode.value
			.slice(match[0].length)
			.replace(/^[ \t]+/, ""),
	};
}

export function remarkAdmonitions() {
	return (tree) => {
		visit(tree, "blockquote", (node, index, parent) => {
			if (!node.children || node.children.length === 0) return;

			const firstChild = node.children[0];
			if (firstChild.type !== "paragraph") return;
			if (!firstChild.children || firstChild.children.length === 0)
				return;

			const firstTextNode = firstChild.children[0];
			const marker = parseAdmonitionMarker(firstTextNode);
			if (!marker) return;

			const type = marker.type;

			const titleChildren = [];
			const bodyChildren = [];
			let isTitleLine = true;

			// Handle the first text node specially
			let firstNodeRemainingText = marker.remainingText;
			const firstNewlineIndex = firstNodeRemainingText.indexOf("\n");

			if (firstNewlineIndex !== -1) {
				const titlePart = firstNodeRemainingText.slice(
					0,
					firstNewlineIndex,
				);
				if (titlePart)
					titleChildren.push({ type: "text", value: titlePart });

				isTitleLine = false;
				const bodyPart = firstNodeRemainingText.slice(
					firstNewlineIndex + 1,
				);
				if (bodyPart)
					bodyChildren.push({ type: "text", value: bodyPart });
			} else {
				if (firstNodeRemainingText)
					titleChildren.push({
						type: "text",
						value: firstNodeRemainingText,
					});
			}

			// Process remaining children of the first paragraph
			for (let i = 1; i < firstChild.children.length; i++) {
				const child = firstChild.children[i];

				if (isTitleLine) {
					if (child.type === "text") {
						const newlineIndex = child.value.indexOf("\n");
						if (newlineIndex !== -1) {
							isTitleLine = false;
							const titlePart = child.value.slice(
								0,
								newlineIndex,
							);
							if (titlePart)
								titleChildren.push({
									type: "text",
									value: titlePart,
								});

							const bodyPart = child.value.slice(
								newlineIndex + 1,
							);
							if (bodyPart)
								bodyChildren.push({
									type: "text",
									value: bodyPart,
								});
						} else {
							titleChildren.push(child);
						}
					} else {
						// Rich text nodes stay in title if we are still on title line
						titleChildren.push(child);
					}
				} else {
					bodyChildren.push(child);
				}
			}

			const newNodeChildren = [];

			// Add label node
			newNodeChildren.push({
				type: "paragraph",
				data: { directiveLabel: true },
				children:
					titleChildren.length > 0
						? titleChildren
						: [
								{
									type: "text",
									value:
										DEFAULT_ADMONITION_LABELS[type] ??
										type.toUpperCase(),
								},
							],
			});

			// Add body
			if (bodyChildren.length > 0) {
				newNodeChildren.push({
					type: "paragraph",
					children: bodyChildren,
				});
			}

			// Add other paragraphs from the blockquote
			for (let i = 1; i < node.children.length; i++) {
				newNodeChildren.push(node.children[i]);
			}

			const directiveNode = {
				type: "containerDirective",
				name: type,
				attributes: {
					"has-directive-label": true,
					"data-callout-fold": marker.foldMarker ?? "",
				},
				children: newNodeChildren,
				data: {
					hName: type,
					hProperties: {
						class: `admonition ${type}`,
					},
				},
			};

			parent.children[index] = directiveNode;
		});
	};
}
