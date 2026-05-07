import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const cacheDirectories = [
	path.join(rootDir, ".astro"),
	path.join(rootDir, "node_modules", ".astro"),
];

/**
 * 删除 Astro 构建和内容缓存目录。
 * @param {string[]} directories - 待删除的目录列表。
 * @returns {void}
 */
function clearAstroCache(directories) {
	for (const directory of directories) {
		if (!fs.existsSync(directory)) {
			console.log(
				`Skip missing cache directory: ${path.relative(rootDir, directory) || directory}`,
			);
			continue;
		}

		fs.rmSync(directory, { recursive: true, force: true });
		console.log(
			`Cleared cache directory: ${path.relative(rootDir, directory)}`,
		);
	}
}

clearAstroCache(cacheDirectories);
