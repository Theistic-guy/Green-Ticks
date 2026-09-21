# Contributing to Green-Ticks

Thank you for your interest in contributing!

## Filename Rules

All `.md` filenames in this repository must be compatible with **Windows** and **Obsidian**.

### Banned Characters

The following characters are **not allowed** in any filename:

| Character | Symbol |
|-----------|--------|
| Asterisk | `*` |
| Question mark | `?` |
| Double quote | `"` |
| Less than | `<` |
| Greater than | `>` |
| Pipe | `\|` |
| Colon | `:` |
| Backslash | `\` |
| Forward slash | `/` |

### Additional Rules

- Filenames must **not** start with a `.` (dot)
- Problem files (`Problems/`) must use **lowercase hyphenated** names (e.g. `two-sum.md`)
- Template and Note files can use mixed case and spaces

### Why?

This repository is used as an Obsidian vault and must remain compatible across Windows, macOS, Linux, and Obsidian Sync. These characters cause failures on Windows filesystems and Obsidian's file handling.

A CI check will automatically reject pull requests containing unsafe filenames.

## Problem File Format

Each problem file in `Problems/` must have YAML frontmatter with these **required** fields:

```yaml
---
Title: Problem Title
Topics:
  - Arrays
  - Two Pointers
Platform:
  - Leetcode
Companies: [Amazon, Google]
Difficulty: Easy
---
```

### Optional Fields

- `Link` — URL to the problem
- `Other Tags` — miscellaneous tags (list)
- `Rating` — 1 to 5 (integer or ⭐ emoji)
- `Groups` — problem groupings like "Blind 75", "Top Interview 150" (list)

### Difficulty Values

Must be one of: `Easy`, `Medium`, `Hard`, `Not Specified`

## What Gets Auto-Generated

The following files and folders are **auto-generated** and should **not** be edited manually:

- `README.md`
- `_sidebar.md`
- `Topics/`, `Platforms/`, `Companies/`, `Difficulty/`, `Miscellaneous Tags/`, `Rating/`, `Groups/`

Changes to these will be overwritten on the next build.
