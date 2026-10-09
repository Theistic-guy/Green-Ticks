---
updated: 09-10-2026
---
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
- Template, Note, and Write-Up files can use mixed case and spaces

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
- `updated` — Must be exactly in `DD-MM-YYYY` format (e.g., `31-12-2024`). Invalid formats will break the build.

### Difficulty Values

Must be one of: `Easy`, `Medium`, `Hard`, `Not Specified`

## Assets & Special Mechanics

You can utilize special formatting mechanics by linking to specific Markdown files stored inside the `assets/` directory.

### 1. Collapsible Modules
To create a reusable, interactive collapsible section, create a `.md` file inside `assets/Collapsible Modules/`.
- Required frontmatter: `Title` and `Heading Level` (1-6).
- **Usage:** In any note, insert `[[Module Name]]`. The build will automatically embed the content as a collapsible `<details>` section, adding the title to the Table of Contents dynamically.

### 2. Carousels
To render interactive swipeable carousels:
- Create Carousel Containers inside `assets/Carousels/Carousel Containers/` (Requires `Cards` list frontmatter).
- Create Carousel Cards inside `assets/Carousels/Carousel Cards/`.
- **Usage:** In any note, insert `[[Container Name]]`. The build will parse the cards and generate a native `<green-carousel>` Web Component.

### 3. Custom Category Sections
You can inject custom Markdown at the top or bottom of auto-generated index pages (like the "Amazon" companies page) by creating specifically named `top.md` or `bottom.md` files inside `assets/Append Sections/<Category> Sections/<slug>/`. See `SCHEMA.md` for strict directory rules.

## What Gets Auto-Generated

The following files and folders are **auto-generated** and should **not** be edited manually:

- `README.md`
- `_sidebar.md`
- `Topics/`, `Platforms/`, `Companies/`, `Difficulty/`, `Miscellaneous Tags/`, `Rating/`, `Groups/`

Changes to these will be overwritten on the next build.
