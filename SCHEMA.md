# Green-Ticks Schema

## Source of truth

- `Problems/` contains the original problem notes.
- `Templates/` contains manually maintained algorithm and data structure reference notes.
- `Topics/`, `Platforms/`, `Companies/`, `Difficulty/`, `Miscellaneous Tags/`, and `README.md` are generated automatically.
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
├── Templates/
├── scripts/
├── .github/
├── README.md
└── SCHEMA.md
```

## Problem file naming

- Problem files live under `Problems/`
- Use lowercase hyphenated filenames.
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

## Validation rules

The build fails if required fields are missing, difficulty is invalid, or two values normalize to the same slug within the same generated folder.

## Generated output

The generator creates:

- Topic indexes
- Platform indexes
- Company indexes
- Difficulty indexes
- Miscellaneous Tag indexes
- A fully generated `README.md`

### Generated index layout

```text
Topics/arrays.md
Platforms/neetcode.md
Companies/amazon.md
Difficulty/easy.md
Miscellaneous Tags/blind-75.md
```

### README generation

`README.md` is regenerated on every build and contains:

- Repository statistics
- Navigation grouped by metadata
- Automatically discovered links to every Markdown file in `Templates/`

Do not manually edit `README.md`; changes will be overwritten.

## Templates

The `Templates/` directory contains reusable algorithm and data structure reference notes.

Every Markdown file inside `Templates/` is automatically linked in the generated README.

No frontmatter is required for template files.

## Maintenance rules

- Keep metadata consistent.
- Prefer structured fields.
- Do not manually edit generated files.
- Update this schema and the generator together whenever new metadata fields or generated outputs are introduced.
