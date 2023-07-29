# CopyTab

## Description

CopyTab is a VS Code extension designed to enhance your coding workflow. It provides an easy and efficient way to copy the content of all open tabs into your clipboard with a single command. This can be an essential tool for quickly sharing code, transferring work between files, or pasting your code directly into a GPT chat for AI-powered assistance.

## Features

- **Copy All Open Files**: With a simple command, you can copy the text content from all open files in your editor.
- **Cross-Language Support**: CopyTab can work with any file type that VS Code supports, from Python and JavaScript to Markdown and plain text files.
- **Real-time Tracking**: The extension tracks the files you are working on and includes their content when you execute the copy command.
- **Status Bar Indicator**: A handy status bar item shows you when the extension is actively tracking a file.

## How to use

1. Open all the files you want to copy in VS Code tabs.
2. **Important:** You must click on each open tab to activate it. The extension starts tracking a file once it's activated. If a tab is not clicked, its content will not be included in the copy command.
3. Run the "Copy All Open Files" command from the Command Palette (F1).
4. All the text from your open files is now copied to your clipboard!

## Release Notes

### 0.1.0

Released on July 25, 2023.

- Improved the extension's clipboard functionality by using Visual Studio Code's built-in clipboard API. This eliminates the need for external dependencies, making the extension more stable and reliable.

- Fixed a bug where some files were being copied multiple times.

- Added error handling to provide more informative messages when something goes wrong.

- Added a "Limitations" section to the README to inform users of potential issues they might encounter when using the extension.

### 0.0.1

Released on July 22, 2023.

- Initial release of the CopyTab extension.



## Limitations

Due to the way Visual Studio Code's API works, there are a few limitations to be aware of when using this extension:

1. **Interaction with Tabs**: The extension currently copies the content from all tabs that you've interacted with in the current session. If you have tabs open that you haven't clicked on or interacted with since you've opened VS Code, the content of those tabs won't be copied. Make sure to click on each tab you want included before running the extension.

2. **Non-Text Files**: The extension is designed to work with text-based files (e.g., .js, .ts, .py, .html, etc.). It may not work properly with binary files or other non-text file types. 

3. **Large Files**: If you're working with very large files, copying the entire contents of all open tabs could potentially cause performance issues. Use with caution if you have large files open.

4. **Remote Files**: As of the current version, the extension might not work as expected with files that are open from a remote source. 

Please consider these limitations when using the extension. Future versions of the extension may address these issues.
## Known Bugs

As of version 0.0.2:

- When copying the contents of files, a placeholder string "accessible-buffer-accessible-buffer-" may sometimes be included in the copied text. We are aware of this issue and are actively working to fix it.

Please feel free to report any additional bugs you discover by opening an issue on the [GitHub repository](https://github.com/AlexZan/copy-tab/issues).
