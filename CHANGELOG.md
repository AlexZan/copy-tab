# Change Log

All notable changes to the "copy-tab" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

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