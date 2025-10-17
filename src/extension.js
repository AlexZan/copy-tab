const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

/**
 * Get configuration value with workspace override support
 * @param {string} key - Configuration key (without 'copyTab.' prefix)
 * @returns {any} - Configuration value
 */
function getConfig(key) {
	const config = vscode.workspace.getConfiguration("copyTab");
	return config.get(key);
}

/**
 * Check if a file matches the file filter patterns
 * @param {string} fileName - Name of the file to check
 * @param {string[]} filters - Array of glob patterns
 * @returns {boolean} - True if file should be included
 */
function shouldIncludeFile(fileName, filters) {
	if (!filters || filters.length === 0) {
		return true; // No filters means include everything
	}

	// Separate include and exclude patterns
	const includePatterns = filters.filter((f) => !f.startsWith("!"));
	const excludePatterns = filters
		.filter((f) => f.startsWith("!"))
		.map((f) => f.substring(1));

	// Check exclude patterns first
	for (const pattern of excludePatterns) {
		if (minimatch(fileName, pattern)) {
			return false;
		}
	}

	// If no include patterns, include by default (after exclude check)
	if (includePatterns.length === 0) {
		return true;
	}

	// Check if file matches any include pattern
	for (const pattern of includePatterns) {
		if (minimatch(fileName, pattern)) {
			return true;
		}
	}

	return false;
}

/**
 * Simple glob pattern matcher (minimatch-like functionality)
 * @param {string} str - String to test
 * @param {string} pattern - Glob pattern
 * @returns {boolean} - True if matches
 */
function minimatch(str, pattern) {
	// Convert glob pattern to regex
	const regexPattern = pattern
		.replace(/\./g, "\\.")
		.replace(/\*/g, ".*")
		.replace(/\?/g, ".");
	const regex = new RegExp(`^${regexPattern}$`);
	return regex.test(str);
}

/**
 * Format file path based on user configuration
 * @param {string} filePath - Full file path
 * @param {string} format - Format type: 'filename', 'relative', 'absolute'
 * @param {string} workspaceRoot - Workspace root path
 * @returns {string} - Formatted path
 */
function formatFilePath(filePath, format, workspaceRoot) {
	switch (format) {
		case "absolute":
			return filePath;
		case "relative":
			if (workspaceRoot && filePath.startsWith(workspaceRoot)) {
				return path.relative(workspaceRoot, filePath);
			}
			return filePath;
		case "filename":
		default:
			return filePath?.split(/[/\\]/).pop() || "unknown-file";
	}
}

/**
 * Add line numbers to file content
 * @param {string} content - File content
 * @returns {string} - Content with line numbers
 */
function addLineNumbers(content) {
	const lines = content.split("\n");
	const maxDigits = lines.length.toString().length;
	return lines
		.map((line, index) => {
			const lineNum = (index + 1).toString().padStart(maxDigits, " ");
			return `${lineNum} | ${line}`;
		})
		.join("\n");
}

/**
 * Parse .gitignore file and return a set of patterns to ignore
 * @param {string} rootPath - The workspace root path
 * @param {boolean} respectGitignore - Whether to respect gitignore
 * @returns {Set<string>} - Set of directory/file names to ignore
 */
function parseGitignore(rootPath, respectGitignore) {
	const ignoreDirs = new Set([".git", ".gitignore"]);

	if (!respectGitignore) {
		return ignoreDirs; // Only return base ignores
	}

	try {
		const gitignorePath = path.join(rootPath, ".gitignore");
		if (fs.existsSync(gitignorePath)) {
			const content = fs.readFileSync(gitignorePath, "utf-8");
			const lines = content.split("\n");
			lines.forEach((line) => {
				line = line.trim();
				// Skip comments and empty lines
				if (line && !line.startsWith("#")) {
					// Remove trailing slashes
					line = line.replace(/\/$/, "");
					ignoreDirs.add(line);
				}
			});
		}
	} catch (error) {
		console.log(`[CopyTab] Error reading .gitignore: ${error.message}`);
	}

	return ignoreDirs;
}

/**
 * Sort entries based on sort order configuration
 * @param {fs.Dirent[]} entries - Array of file/directory entries
 * @param {string} sortOrder - Sort order: 'alphabetical', 'type', 'modified'
 * @param {string} dirPath - Directory path for modified sort
 * @returns {fs.Dirent[]} - Sorted entries
 */
function sortEntries(entries, sortOrder, dirPath) {
	switch (sortOrder) {
		case "type":
			// Directories first, then files, both alphabetically
			return entries.sort((a, b) => {
				if (a.isDirectory() && !b.isDirectory()) return -1;
				if (!a.isDirectory() && b.isDirectory()) return 1;
				return a.name.localeCompare(b.name);
			});

		case "modified":
			// Sort by last modified time (newest first)
			return entries.sort((a, b) => {
				try {
					const aPath = path.join(dirPath, a.name);
					const bPath = path.join(dirPath, b.name);
					const aStat = fs.statSync(aPath);
					const bStat = fs.statSync(bPath);
					return bStat.mtime.getTime() - aStat.mtime.getTime();
				} catch (error) {
					return a.name.localeCompare(b.name);
				}
			});

		case "alphabetical":
		default:
			return entries.sort((a, b) => a.name.localeCompare(b.name));
	}
}

/**
 * Build a file tree structure for the workspace
 * @param {string} rootPath - The workspace root path
 * @param {number} maxDepth - Maximum depth to traverse
 * @param {boolean} respectGitignore - Whether to respect gitignore
 * @param {string} sortOrder - Sort order for entries
 * @returns {string} - A formatted file tree string
 */
function buildFileTree(rootPath, maxDepth, respectGitignore, sortOrder) {
	const ignoreDirs = parseGitignore(rootPath, respectGitignore);

	function buildTree(dir, prefix = "", depth = 0) {
		if (depth > maxDepth) return "";

		try {
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			let tree = "";
			const dirs = entries.filter((e) => e.isDirectory());
			const files = entries.filter((e) => e.isFile());

			// Sort directories and files based on configuration
			const sortedDirs = sortEntries(dirs, sortOrder, dir);
			const sortedFiles = sortEntries(files, sortOrder, dir);

			// Filter ignored directories
			const visibleDirs = sortedDirs.filter((d) => !ignoreDirs.has(d.name));
			const allEntries = [...sortedFiles, ...visibleDirs];

			allEntries.forEach((entry, index) => {
				const isLast = index === allEntries.length - 1;
				const connector = isLast ? "└── " : "├── ";
				const nextPrefix = prefix + (isLast ? "    " : "│   ");

				if (entry.isFile()) {
					tree += prefix + connector + entry.name + "\n";
				} else if (!ignoreDirs.has(entry.name)) {
					tree += prefix + connector + entry.name + "/\n";
					tree += buildTree(path.join(dir, entry.name), nextPrefix, depth + 1);
				}
			});

			return tree;
		} catch (error) {
			console.log(`[CopyTab] Error reading directory: ${error.message}`);
			return "";
		}
	}

	const rootName = path.basename(rootPath) || "project";
	return rootName + "/\n" + buildTree(rootPath);
}

function activate(context) {
	let openDocuments = [];
	let statusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100,
	);
	statusBarItem.text = "🟢 CopyTab: Tracking";
	statusBarItem.command = "extension.copyAllOpenFiles";

	vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (editor && !openDocuments.includes(editor.document.uri)) {
			openDocuments.push(editor.document.uri);
			console.log(
				`[CopyTab] Document ${editor.document.uri} added to tracking.`,
			);
		}
		updateStatusBarItem();
	});

	vscode.workspace.onDidCloseTextDocument((document) => {
		openDocuments = openDocuments.filter(
			(uri) => uri.toString() !== document.uri.toString(),
		);
		console.log(`[CopyTab] Document ${document.uri} removed from tracking.`);
		updateStatusBarItem();
	});

	let disposable = vscode.commands.registerCommand(
		"extension.copyAllOpenFiles",
		async () => {
			// Read all configuration settings
			const config = {
				treeDepth: getConfig("treeDepth"),
				filePathFormat: getConfig("filePathFormat"),
				includeProjectStructure: getConfig("includeProjectStructure"),
				respectGitignore: getConfig("respectGitignore"),
				sectionHeaders: getConfig("sectionHeaders"),
				sortOrder: getConfig("sortOrder"),
				includeLineNumbers: getConfig("includeLineNumbers"),
				fileSeparator: getConfig("fileSeparator"),
				fileFilters: getConfig("fileFilters"),
			};

			let allContent = "";
			const workspaceRoot =
				vscode.workspace.workspaceFolders &&
				vscode.workspace.workspaceFolders.length > 0
					? vscode.workspace.workspaceFolders[0].uri.fsPath
					: null;

			// Add workspace structure at the top if enabled and workspace is open
			if (
				config.includeProjectStructure &&
				workspaceRoot
			) {
				try {
					const fileTree = buildFileTree(
						workspaceRoot,
						config.treeDepth,
						config.respectGitignore,
						config.sortOrder,
					);
					allContent += config.sectionHeaders.structure + "\n";
					allContent += fileTree;
					allContent += "\n" + config.sectionHeaders.contents + "\n\n";
				} catch (error) {
					console.log(`[CopyTab] Error building file tree: ${error.message}`);
				}
			}

			// Process each open document
			for (let uri of openDocuments) {
				let document = await vscode.workspace.openTextDocument(uri);

				// Get file name/path based on configuration
				const fileName = formatFilePath(
					document.fileName,
					config.filePathFormat,
					workspaceRoot,
				);

				// Apply file filters
				const simpleFileName = document.fileName?.split(/[/\\]/).pop() || "";
				if (!shouldIncludeFile(simpleFileName, config.fileFilters)) {
					console.log(`[CopyTab] Skipping ${fileName} due to file filters`);
					continue;
				}

				// Add file header
				allContent += `File: ${fileName}\n`;

				// Get file content
				let content = document.getText();

				// Add line numbers if enabled
				if (config.includeLineNumbers) {
					content = addLineNumbers(content);
				}

				// Add content
				allContent += content;

				// Add separator
				allContent += config.fileSeparator;
			}

			await vscode.env.clipboard.writeText(allContent);
			vscode.window.showInformationMessage(
				"Copied all open files to clipboard!",
			);
		},
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(statusBarItem);

	function updateStatusBarItem() {
		if (openDocuments.length > 0) {
			console.log("[CopyTab] Showing status bar item.");
			statusBarItem.show();
		} else {
			console.log("[CopyTab] Hiding status bar item.");
			statusBarItem.hide();
		}
	}

	if (vscode.window.activeTextEditor) {
		openDocuments.push(vscode.window.activeTextEditor.document.uri);
		console.log(
			`[CopyTab] Document ${vscode.window.activeTextEditor.document.uri} added to tracking.`,
		);
		updateStatusBarItem();
	}
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
