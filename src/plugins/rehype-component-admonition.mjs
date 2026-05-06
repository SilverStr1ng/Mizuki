/// <reference types="mdast" />
import { h } from "hastscript";

const DEFAULT_TITLES = {
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
 * Creates an admonition component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} [properties.title] - An optional title.
 * @param {('note'|'info'|'success'|'warning'|'danger'|'cite'|'tip'|'important'|'caution')} type - The admonition type.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created admonition component.
 */
export function AdmonitionComponent(properties, children, type) {
	if (!Array.isArray(children) || children.length === 0)
		return h(
			"div",
			{ class: "hidden" },
			'Invalid admonition directive. (Admonition directives must be of block type ":::note{name="name"} <content> :::")',
		);

	let label = null;
	if (properties?.["has-directive-label"]) {
		label = children[0]; // The first child is the label
		// biome-ignore lint/style/noParameterAssign: <check later>
		children = children.slice(1);
	}

	const titleContent = label
		? Array.isArray(label.children)
			? label.children
			: label
		: (DEFAULT_TITLES[type] ?? type.toUpperCase());

	return h("blockquote", { class: `admonition bdm-${type}` }, [
		h("div", { class: "bdm-header" }, [
			h("span", { class: "bdm-title" }, titleContent),
		]),
		h("div", { class: "bdm-content" }, children),
	]);
}
