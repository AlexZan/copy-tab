# Change Log

All notable changes to the "copy-tab" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.3.0] - 2025-10-17

### Added
- **Comprehensive customization system** with 9 new configuration options
- `copyTab.treeDepth` - Customize directory tree depth (1-10 levels, default: 3)
- `copyTab.filePathFormat` - Choose filename, relative, or absolute path display
- `copyTab.includeProjectStructure` - Toggle project tree visualization on/off
- `copyTab.respectGitignore` - Option to include/exclude .gitignore patterns
- `copyTab.sectionHeaders` - Customize output section headers for different LLMs
- `copyTab.sortOrder` - Sort files by alphabetical, type, or modification date
- `copyTab.includeLineNumbers` - Add line numbers to file contents
- `copyTab.fileSeparator` - Custom separators between files
- `copyTab.fileFilters` - Glob pattern filtering (include/exclude specific file types)

### Improved
- Workspace settings now properly override user settings
- All configuration defaults match previous behavior (fully backwards compatible)
- Enhanced documentation with comprehensive configuration examples

### Technical
- Added helper functions: `getConfig()`, `shouldIncludeFile()`, `formatFilePath()`, `addLineNumbers()`, `sortEntries()`
- Implemented simple glob pattern matcher for file filters
- Refactored `buildFileTree()` to accept configuration parameters

## [1.2.4] - 2025-10-17

### Changed
- Fixed version number in README release notes

## [1.2.3] - 2025-10-17

### Changed
- Updated README with comprehensive documentation of new features
- Added example output format showing project structure
- Clarified benefits for LLM integration

## [1.2.2] - 2025-10-17

### Fixed
- Convert marketplace icon from PNG to SVG for better scalability
- Fix icon transparency (proper alpha channel instead of checkered pattern)
- Improve icon rendering quality across different marketplace contexts

## [1.2.1] - 2025-10-17

### Added
- Custom marketplace icon for better visual identity

## [1.2.0] - 2025-10-17

### Added
- Project file tree visualization in clipboard output
- Reads and respects `.gitignore` patterns for intelligent filtering
- Tree displays with proper box-drawing characters (├──, └──, │)
- 3-level depth limit to prevent excessive clutter

### Fixed
- Cross-platform path separator handling (Windows `\` and Unix `/`)
- Robust filename extraction with optional chaining
- Graceful fallback for missing filenames

### Improved
- Better support for large projects
- More relevant tree structure by using project's own ignore rules
- Addresses Issue #1: file tree visualization for LLMs
- Closes Issue #3: improved filename header robustness

## [1.1.0]

- Added filename headers to each file's code block

## [1.0.0]

- Initial release