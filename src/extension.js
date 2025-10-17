const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

/**
 * Parse .gitignore file and return a set of patterns to ignore
 * @param {string} rootPath - The workspace root path
 * @returns {Set<string>} - Set of directory/file names to ignore
 */
function parseGitignore(rootPath) {
	const ignoreDirs = new Set([
		".git",
		".gitignore",
	]);

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
 * Build a file tree structure for the workspace
 * @param {string} rootPath - The workspace root path
 * @returns {string} - A formatted file tree string
 */
function buildFileTree(rootPath) {
	const maxDepth = 3;
	const ignoreDirs = parseGitignore(rootPath);

	function buildTree(dir, prefix = "", depth = 0) {
		if (depth > maxDepth) return "";

		try {
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			let tree = "";
			const dirs = entries.filter((e) => e.isDirectory());
			const files = entries.filter((e) => e.isFile());

			// Sort directories and files
			dirs.sort((a, b) => a.name.localeCompare(b.name));
			files.sort((a, b) => a.name.localeCompare(b.name));

			// Filter ignored directories
			const visibleDirs = dirs.filter((d) => !ignoreDirs.has(d.name));
			const allEntries = [...files, ...visibleDirs];

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
			let allContent = "";

			// Add workspace structure at the top if workspace is open
			if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
				const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
				try {
					const fileTree = buildFileTree(workspaceRoot);
					allContent += "=== PROJECT STRUCTURE ===\n";
					allContent += fileTree;
					allContent += "\n=== FILE CONTENTS ===\n\n";
				} catch (error) {
					console.log(`[CopyTab] Error building file tree: ${error.message}`);
				}
			}

			for (let uri of openDocuments) {
				let document = await vscode.workspace.openTextDocument(uri);
				// Add the file name before the file's content
				const fileName = document.fileName?.split(/[/\\]/).pop() || "unknown-file"; // Get the file name from the path, handle both / and \
				allContent += `File: ${fileName}\n`; // Add file name to content
				allContent += document.getText() + "\n"; // Add file content
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
