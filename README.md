# CopyTab

## Description

Copy the content of all your open tabs. It's an ideal tool for quickly sharing code, transferring work between files, or pasting your code directly into GPT chat for AI-powered assistance.

## Features

- **Copy All Open Files**: With a simple command, you can copy the text content from all open files in your editor.
- **Cross-Language Support**: CopyTab can work with any file type that VS Code supports, from Python and JavaScript to Markdown and plain text files.
- **Real-time Tracking**: The extension tracks the files you are working on and includes their content when you execute the copy command.
- **Status Bar Indicator**: A handy status bar item shows you when the extension is actively tracking a file. Click the status bar item to instantly copy all tracked files to your clipboard.

## How to use

1. Open all the files you want to copy in VS Code tabs.
2. **Important:** You must click on each open tab to activate it. The extension starts tracking a file once it's activated. If a tab is not clicked, its content will not be included in the copy command.
3. Click the "CopyTab: Tracking" status bar item or run the "Copy All Open Files" command from the Command Palette (F1).
4. All the text from your open files is now copied to your clipboard!
## Release Notes

### 1.0.0

Released on August 7, 2023.

- Release out of Alpha

- Added a clickable status bar item that allows users to execute the copy command directly from the status bar.
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



Please feel free to report any additional bugs you discover by opening an issue on the [GitHub repository](https://github.com/AlexZan/copy-tab/issues).
