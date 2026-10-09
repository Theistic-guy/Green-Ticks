---
updated: 09-10-2026
---
# Green-Ticks Schema

## Source of truth

- `Problems/` contains the original problem notes.
- `Templates/` contains manually maintained algorithm and data structure reference notes.
- `Topics/`, `Platforms/`, `Companies/`, `Difficulty/`, `Miscellaneous Tags/`, `Rating/`, `Groups/`, and `README.md` are generated automatically.
- Generated index files and `README.md` must not be edited manually.

## Folder structure

```text
Green-Ticks/
├── Problems/
├── Topics/
├── Platforms/
├── Companies/
├── Difficulty/
├── Miscellaneous Tags/
├── Rating/
├── Groups/
├── Templates/
├── Notes/
├── Write-Ups/
├── scripts/
├── .github/
├── README.md
└── SCHEMA.md
```

## Problem file naming

- Problem files live under `Problems/`
- Use lowercase hyphenated filenames. Supports parenthesis and underscores too (updated) .
- Example: `two-sum.md`
- The filename is the stable identifier.
- The `Title` field is the display name.

## Frontmatter format

Required keys:

- `Title`
- `Topics`
- `Platform`
- `Companies`
- `Difficulty`

Optional keys:

- `Link`
- `Other Tags`
- `Rating` (1-5)
- `Groups` (list of group names, e.g. "Blind 75", "Top Interview 150")
- `updated` (Must be exactly in `DD-MM-YYYY` format, e.g., `31-12-2024`. Also applicable for Notes, Templates, and Write-Ups. Invalid formats will cause build errors.)

## Validation rules

The build fails if required fields are missing, difficulty is invalid, `updated` format is incorrect, or two values normalize to the same slug within the same generated folder.

## Generated output

The generator creates:

- Topic indexes
- Platform indexes
- Company indexes
- Difficulty indexes
- Miscellaneous Tag indexes
- Rating indexes
- Group indexes
- A fully generated `README.md`

### Generated index layout

```text
Topics/arrays.md
Platforms/neetcode.md
Companies/amazon.md
Difficulty/easy.md
Miscellaneous Tags/blind-75.md
Groups/top-interview-150.md
```

### README generation

`README.md` is regenerated on every build and contains:

- Repository statistics
- Navigation grouped by metadata
- Automatically discovered links to every Markdown file in `Templates/`

Do not manually edit `README.md`; changes will be overwritten.

## Templates, Notes, and Write-Ups

- `Templates/` contains reusable algorithm and data structure reference notes.
- `Notes/` contains in-depth concept explanations and guides.
- `Write-Ups/` contains blog-style content, thoughts, and opinions.

Every Markdown file inside `Templates/` is automatically linked in the generated README.

No frontmatter is required for template files.

## Custom Top and Bottom Sections

You can inject custom Markdown content at the top or bottom of index pages (Topics, Companies, etc.) by placing files in the `assets/` directory.

### Slugification Rules (Folder Naming)
To match a metadata value (like a Topic or Company) to its folder in `assets/`, the value is converted to a "slug" using these exact rules:
1. Converted to entirely lowercase.
2. All special characters (like `+`, `#`, `.`, `!`, `()`) are completely removed.
3. Spaces and underscores are replaced with hyphens (`-`).
4. Multiple consecutive hyphens are compressed into a single hyphen.
5. Leading and trailing hyphens are trimmed.

**Examples:**
- `Sliding Window` ➡️ `sliding-window`
- `C++ STL` ➡️ `c-stl`
- `Depth-First Search (DFS)` ➡️ `depth-first-search-dfs`

### Section Injection Structure
There are 7 main category folders in `assets/`:
- `Companies Sections/`
- `Difficulty Sections/`
- `Groups Sections/`
- `Miscellaneous Tags Sections/`
- `Platforms Sections/`
- `Rating Sections/`
- `Topics Sections/`

Inside each of these folders, you must create a subdirectory that matches either:
1. `All/` (applies to every single page in this category)
2. `<slug>/` (applies to a specific page, mapping exactly to its generated filename, e.g., `amazon/`, `morgan-stanley/`, `3-stars/`)

**Crucial Rules:**
- Inside `All/` or `<slug>/`, **the ONLY permitted files are exactly `top.md` and/or `bottom.md`.**
- Subdirectories inside these folders, or differently named files (e.g. `notes.txt`), will **trigger a warning and be ignored** to prevent crashing the production site.

**Ordering & Encapsulation:**
- **Top Content:** The content from `All/top.md` is rendered *first*, immediately followed by `<slug>/top.md`.
- **Bottom Content:** The content from `<slug>/bottom.md` is rendered *first*, immediately followed by `All/bottom.md`.

This content is automatically rendered by both the Astro website build and the Python `build_indexes.py` script.

## Collapsible Modules

You can create reusable, interactively collapsible sections by storing Markdown files inside `assets/Collapsible Modules/`.

A collapsible module requires the following frontmatter:
- `Title`: The display name of the section (rendered next to the +/- toggle).
- `Heading Level` (1-6): Determines the visual size and boldness of the title.

**Usage:**
In any note or problem file, insert the module using standard wiki link syntax:
`[[Module Name]]`

The Astro build intercepts this link, parses the target `.md` file (including inner formatting, code blocks, or nested carousels), and renders it inline as an accessible `<details>` block. The module title automatically appears in the Table of Contents, and its subheadings dynamically hide/show in the TOC based on the toggle state.

## Maintenance rules

- Keep metadata consistent.
- Prefer structured fields.
- Do not manually edit generated files.
- Update this schema and the generator together whenever new metadata fields or generated outputs are introduced.
