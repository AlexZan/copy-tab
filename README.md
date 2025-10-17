# CopyTab

## Description

Copy the content of all your open tabs with an intelligent project structure visualization. Perfect for sharing your code with LLMs (ChatGPT, Claude, etc.), AI coding assistants, or collaborators. CopyTab now includes a project file tree that shows your workspace structure alongside your code.

## Features

- **📋 Copy All Open Files**: With a simple command, copy the text content from all open files in your editor.
- **🌳 Project File Tree**: Automatic visual directory tree showing your project structure - perfect for LLMs to understand your codebase layout.
- **🚫 Smart Filtering**: Respects your `.gitignore` file to exclude build artifacts, dependencies, and temporary files.
- **📁 Intelligent Depth Limiting**: Shows up to 3 levels of directory nesting to keep output clean and readable.
- **🌐 Cross-Language Support**: Works with any file type VS Code supports - Python, JavaScript, TypeScript, Go, Rust, C++, Java, and more.
- **⚡ Real-time Tracking**: The extension automatically tracks the files you're working on and includes them in the output.
- **📍 Status Bar Indicator**: A convenient status bar item shows when the extension is actively tracking files. Click it to instantly copy all content to your clipboard.
- **🔄 Cross-Platform Compatible**: Proper handling of Windows (`\`) and Unix (`/`) path separators.
- **🎯 Filename Headers**: Each file's content is clearly labeled with its filename for better organization.

## How to Use

1. **Open Files**: Open the files you want to copy in VS Code tabs. Make sure to click on each tab you want included so the extension tracks them.
2. **Copy**: Click the **"🟢 CopyTab: Tracking"** status bar button (bottom right of VS Code) or run **"Copy All Open Files"** from the Command Palette (Ctrl+Shift+P).
3. **Paste**: Paste the clipboard contents into your LLM chat, documentation, or wherever you need it.

### Output Format

The copied content includes:

```
=== PROJECT STRUCTURE ===
my-project/
├── src/
│   ├── components/
│   ├── utils/
│   └── index.js
├── package.json
└── README.md

=== FILE CONTENTS ===

File: src/index.js
[file content here]

File: package.json
[file content here]
```

This format is optimized for sharing with AI assistants like ChatGPT and Claude, as they can easily understand your project structure and analyze your code.
## Release Notes

### 1.2.3 - Latest

- **Updated**: Comprehensive README documentation with all new features
- **Added**: Example output format showing project structure
- **Improved**: Clarified benefits for LLM integration and AI coding assistants

### 1.2.2

- **Fixed**: Replaced low-quality icon with high-resolution PNG featuring proper transparency
- Improved marketplace appearance and professional visual identity

### 1.2.1

- **Added**: Custom marketplace icon for better visual identity

### 1.2.0 - Major Feature Update

- **Added**: Project file tree visualization showing directory structure in clipboard output
- **Added**: Automatic `.gitignore` pattern recognition for smart filtering
- **Added**: Intelligent depth limiting (3 levels) to keep output clean
- **Fixed**: Cross-platform path separator handling (Windows `\` and Unix `/`)
- **Fixed**: Robust filename extraction with optional chaining
- **Improved**: Better support for large projects and complex directory structures

### 1.1.0

- **Added**: Filename headers above each file's code block for better organization
- **Improved**: Output formatting for better readability

### 1.0.0

Released on August 7, 2023.

- Release out of Alpha
- Added a clickable status bar item that allows users to execute the copy command directly from the status bar

### 0.1.0

Released on July 25, 2023.

- Improved the extension's clipboard functionality by using Visual Studio Code's built-in clipboard API
- Fixed a bug where some files were being copied multiple times
- Added error handling for more informative error messages

### 0.0.1

Released on July 22, 2023.

- Initial release of the CopyTab extension



## Limitations

Due to the way Visual Studio Code's API works, there are a few limitations to be aware of when using this extension:

1. **Interaction with Tabs**: The extension currently copies the content from all tabs that you've interacted with in the current session. If you have tabs open that you haven't clicked on or interacted with since you've opened VS Code, the content of those tabs won't be copied. Make sure to click on each tab you want included before running the extension.

2. **Non-Text Files**: The extension is designed to work with text-based files (e.g., .js, .ts, .py, .html, etc.). It may not work properly with binary files or other non-text file types. 

3. **Large Files**: If you're working with very large files, copying the entire contents of all open tabs could potentially cause performance issues. Use with caution if you have large files open.

4. **Remote Files**: As of the current version, the extension might not work as expected with files that are open from a remote source. 

Please consider these limitations when using the extension. Future versions of the extension may address these issues.



Please feel free to report any additional bugs you discover by opening an issue on the [GitHub repository](https://github.com/AlexZan/copy-tab/issues).
