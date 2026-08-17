from __future__ import annotations

import os
import re
import shutil
import sys
import textwrap
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any
from urllib.parse import quote

import yaml

ROOT = Path(__file__).resolve().parent.parent
PROBLEMS_DIR = ROOT / "Problems"
README_FILE = ROOT / "README.md"
template_dir = ROOT / "Templates"
README_SECTIONS_DIR = ROOT / "assets" / "ReadMe Sections"

template_files = []

if template_dir.exists():
    template_files = sorted(template_dir.glob("*.md"))


GENERATED_DIRS = {
    "Topics": ROOT / "Topics",
    "Platforms": ROOT / "Platforms",
    "Companies": ROOT / "Companies",
    "Difficulty": ROOT / "Difficulty",
    "Miscellaneous Tags": ROOT / "Miscellaneous Tags",
    "Rating": ROOT / "Rating",
}

DIFFICULTY_ORDER = {
    "Easy": 0,
    "Medium": 1,
    "Hard": 2,
    "Not Specified": 3,
}

REQUIRED_KEYS = {"Title", "Topics", "Platform", "Companies", "Difficulty"}
ALL_KEYS = REQUIRED_KEYS | {"Link", "Other Tags", "Rating"}

STAR = "⭐"

# Rating is optional (1-5). Order for display: 5 stars first, unrated last.
RATING_SORT_ORDER = {
    "5 Stars": 0,
    "4 Stars": 1,
    "3 Stars": 2,
    "2 Stars": 3,
    "1 Star": 4,
    "Not Rated": 5,
}

def rating_label(rating: int | None) -> str:
    if rating is None:
        return "Not Rated"
    return f"{rating} Star" if rating == 1 else f"{rating} Stars"

def rating_stars(rating: int | None) -> str:
    return STAR * rating if rating else ""

def parse_rating(raw: Any) -> int:
    """Accepts either an integer (1-5) or a run of star emoji, e.g. '⭐⭐⭐'."""
    text = str(raw).strip()
    if text and set(text) == {STAR}:
        return len(text)
    return int(text)

def sort_rating(value: str) -> tuple[int, str]:
    return (RATING_SORT_ORDER.get(value, 99), value.lower())

# Restored from your original script
FILENAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*\.md$")

# Matches a leading numeric prefix (supports dot notation like 2, 2.3, 10.1)
# followed by a hyphen (spaces around it are optional), e.g.:
#   "2-intro.md", "2.3-details.md", "2.3 - details.md", "10-appendix.md"
README_SECTION_RE = re.compile(r"^(\d+(?:\.\d+)*)\s*-\s*(.+)$")

# The {count} placeholder will be replaced dynamically
README_HEADER_TEMPLATE = """<h1>
  Green-Ticks
  <img src="assets/Accepted.gif" alt="Accepted" width="40" />
</h1>

![Static Badge](https://img.shields.io/badge/Problems-{count}-green?style=for-the-badge)
![Static Badge](https://img.shields.io/badge/python---?style=for-the-badge&logo=python&color=%23FFFF00)

---

## 📁 Navigation
"""

README_FOOTER = ""
# README_FOOTER = """

# ## ⚙️ How It Works

# Every problem lives inside `Problems/` as a Markdown file with YAML metadata.

# Running

# ```bash
# python scripts/build_indexes.py
# ```

# will:
# - Validate metadata
# - Generate all index pages
# - Regenerate this README

# ---

# """

def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower().strip()
    value = re.sub(r"[^\w\s-]", "", value)
    value = re.sub(r"[\s_]+", "-", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-") or "untitled"

def unique_preserve_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for item in items:
        if item not in seen:
            seen.add(item)
            out.append(item)
    return out

def as_list(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        raw_items = value
    elif isinstance(value, str):
        s = value.strip()
        if not s:
            return []
        if "," in s:
            raw_items = [part.strip() for part in s.split(",")]
        else:
            raw_items = [s]
    else:
        raw_items = [value]

    cleaned: list[str] = []
    for item in raw_items:
        s = str(item).strip()
        if s:
            cleaned.append(s)
    return unique_preserve_order(cleaned)

def as_single(value: Any) -> str:
    items = as_list(value)
    if not items:
        return ""
    if len(items) != 1:
        raise ValueError(f"expected exactly one value, got {items!r}")
    return items[0]

def read_frontmatter(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8").lstrip("\ufeff")
    if not text.startswith("---"):
        raise ValueError("missing YAML frontmatter")

    parts = text.split("---", 2)
    if len(parts) < 3:
        raise ValueError("frontmatter block is not closed properly")

    raw_frontmatter = parts[1]
    data = yaml.safe_load(raw_frontmatter) or {}
    if not isinstance(data, dict):
        raise ValueError("frontmatter must be a YAML mapping")

    return data

# Restored from your original script
def fail(errors: list[str]) -> None:
    print("\n================ VALIDATION FAILED ================\n", flush=True)
    for err in errors:
        print(f"[ERROR] {err}", flush=True)
    print("\n===================================================\n", flush=True)
    sys.stdout.flush()
    sys.stderr.flush()
    raise RuntimeError("Validation failed. See errors above.")

# Restored from your original script
def validate_filename(path: Path) -> None:
    if not FILENAME_RE.fullmatch(path.name):
        raise ValueError(
            "filename must be lowercase hyphenated only, like 'two-sum.md' or "
            "'best-time-to-buy-and-sell-stock.md'"
        )

def validate_note(path: Path) -> dict[str, Any]:
    validate_filename(path)

    meta = read_frontmatter(path)

    unknown = sorted(set(meta.keys()) - ALL_KEYS)
    if unknown:
        print(
            f"[WARN] {path.as_posix()}: unknown keys ignored -> {', '.join(unknown)}",
            flush=True,
        )

    title = as_single(meta.get("Title"))
    topics = as_list(meta.get("Topics"))
    platforms = as_list(meta.get("Platform"))
    companies = as_list(meta.get("Companies"))
    difficulty = as_single(meta.get("Difficulty"))
    link = as_single(meta.get("Link")) if meta.get("Link") not in (None, "") else ""
    other_tags = as_list(meta.get("Other Tags"))

    rating_raw = meta.get("Rating")
    rating: int | None = None

    errors: list[str] = []

    if not title.strip():
        errors.append("Title is required and cannot be blank")
    if not topics:
        errors.append("Topics is required and cannot be empty")
    if not platforms:
        errors.append("Platform is required and cannot be empty")
    if not companies:
        errors.append("Companies is required and cannot be empty")
    if not difficulty.strip():
        errors.append("Difficulty is required and cannot be blank")
    if difficulty and difficulty not in DIFFICULTY_ORDER:
        errors.append(f"Difficulty must be one of: {', '.join(DIFFICULTY_ORDER.keys())}")

    if rating_raw not in (None, ""):
        try:
            rating = parse_rating(rating_raw)
        except (TypeError, ValueError):
            errors.append("Rating must be an integer from 1 to 5, or 1-5 ⭐ characters")
        else:
            if not 1 <= rating <= 5:
                errors.append("Rating must be between 1 and 5")

    if errors:
        raise ValueError("; ".join(errors))

    return {
        "source_path": path,
        "title": title,
        "topics": topics,
        "platforms": platforms,
        "companies": companies,
        "difficulty": difficulty,
        "link": link,
        "other_tags": other_tags,
        "rating": rating,
    }

def clean_generated_dirs() -> None:
    for out_dir in GENERATED_DIRS.values():
        if out_dir.exists():
            shutil.rmtree(out_dir)
        out_dir.mkdir(parents=True, exist_ok=True)

def ensure_no_slug_collisions(category: str, values: list[str]) -> dict[str, str]:
    value_to_slug: dict[str, str] = {}
    slug_to_value: dict[str, str] = {}

    for value in values:
        slug = slugify(value)
        if slug in slug_to_value and slug_to_value[slug] != value:
            raise ValueError(
                f"{category} names '{slug_to_value[slug]}' and '{value}' both normalize to '{slug}'. "
                f"Rename one of them or make them canonical."
            )
        slug_to_value[slug] = value
        value_to_slug[value] = slug

    return value_to_slug

def rel_link(from_file: Path, to_file: Path) -> str:
    return os.path.relpath(to_file, start=from_file.parent).replace(os.sep, "/")

def sort_by_title_then_path(problem: dict[str, Any]) -> tuple[str, str]:
    return (
        problem["title"].lower(),
        problem["source_path"].as_posix().lower(),
    )

def sort_difficulty(value: str) -> tuple[int, str]:
    return (DIFFICULTY_ORDER.get(value, 99), value.lower())

def render_grouped_by_difficulty(
    index_file: Path,
    heading: str,
    problems: list[dict[str, Any]],
) -> None:
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for problem in problems:
        groups[problem["difficulty"]].append(problem)

    lines: list[str] = [f"# {heading}", ""]
    for difficulty in sorted(groups.keys(), key=sort_difficulty):
        lines.append(f"## {difficulty}")
        for problem in sorted(groups[difficulty], key=sort_by_title_then_path):
            link_target = rel_link(index_file, problem["source_path"])
            stars = rating_stars(problem.get("rating"))
            suffix = f" {stars}" if stars else ""
            lines.append(f"- [{problem['title']}]({link_target}){suffix}")
        lines.append("")

    index_file.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")

def render_flat_index(index_file: Path, heading: str, problems: list[dict[str, Any]]) -> None:
    lines: list[str] = [f"# {heading}", ""]
    for problem in sorted(problems, key=sort_by_title_then_path):
        link_target = rel_link(index_file, problem["source_path"])
        stars = rating_stars(problem.get("rating"))
        suffix = f" {stars}" if stars else ""
        lines.append(f"- [{problem['title']}]({link_target}){suffix}")

    index_file.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")

def readme_section_sort_key(path: Path) -> tuple[int, tuple[int, ...], str]:
    """
    Sort key for files in the 'ReadMe Sections' folder.

    Files named with a leading numeric prefix (e.g. '2-intro.md',
    '2.3 - details.md', '10-appendix.md') are ordered numerically by that
    prefix, so '2' < '2.3' < '2.10' < '10' (unlike plain string sorting).

    Files with no recognizable numeric prefix sort after all numbered
    files, alphabetically among themselves.
    """
    match = README_SECTION_RE.match(path.stem)
    if match:
        num_parts = tuple(int(p) for p in match.group(1).split("."))
        return (0, num_parts, path.stem.lower())
    return (1, (), path.stem.lower())

def build_readme_sections_appendix(sections_dir: Path) -> str:
    """
    Read every .md file in the 'ReadMe Sections' folder (if it exists),
    order them via readme_section_sort_key, and join their contents with
    a '---' divider between each file.
    """
    if not sections_dir.exists():
        return ""

    section_files = sorted(sections_dir.glob("*.md"), key=readme_section_sort_key)
    if not section_files:
        return ""

    chunks: list[str] = []
    for file in section_files:
        content = file.read_text(encoding="utf-8").strip()
        if content:
            chunks.append(content)

    if not chunks:
        return ""

    return "\n\n---\n\n".join(chunks)

def build_templates_section(template_files: list[Path]) -> str:
    """Generate the Templates section of the README."""

    if not template_files:
        return ""

    lines = [
        "### 📄 Templates",
        "<details>",
        "  <summary>Expand</summary>",
        "",
    ]

    for file in template_files:
        lines.append(f"  - [{file.stem}](Templates/{file.name})")

    lines.extend([
        "",
        "</details>",
        "",
        "---",
        "",
    ])

    return "\n".join(lines)

def build_readme_section(
    title: str,
    emoji: str,
    folder: str,
    values: list[str],
    slug_map: dict[str, str],
    counts: dict[str, int],
) -> str:
    lines = [
        f"### {emoji} By {title}",
        "<details>",
        "  <summary>Expand</summary>",
        "",
    ]
    if not values:
        return ""

    for value in values:
        slug = slug_map[value]
        encoded_folder = folder.replace(" ", "%20")
        count = counts[value]

        lines.append(
            f"  - [{value} ({count})]({encoded_folder}/{slug}.md)"
        )

    lines.extend([
        "</details>",
        "",
        "---",
        "",
    ])
    return "\n".join(lines)

def generate_readme(
    problem_count: int,
    topic_values: list[str],
    platform_values: list[str],
    company_values: list[str],
    difficulty_values: list[str],
    other_tag_values: list[str],
    rating_values: list[str],
    topic_slugs: dict[str, str],
    platform_slugs: dict[str, str],
    company_slugs: dict[str, str],
    difficulty_slugs: dict[str, str],
    other_tag_slugs: dict[str, str],
    rating_slugs: dict[str, str],
    by_topic,
    by_platform,
    by_company,
    by_other_tag,
    by_difficulty,
    by_rating,
    template_files,
    readme_sections_appendix: str = ""
) -> None:

    stats = textwrap.dedent(f"""\
    ## 📊 Repository Statistics

    | Metric | Count |
    |--------|------:|
    | Problems | {problem_count} |
    | Topics | {len(topic_values)} |
    | Platforms | {len(platform_values)} |
    | Companies | {len(company_values)} |
    | Difficulty Levels | {len(difficulty_values)} |
    | Miscellaneous Tags | {len(other_tag_values)} |
    | Templates | {len(template_files)} |

    ---
    """)
    sections = []

    section = build_readme_section(
        "Topics", "🧠", "Topics", topic_values, topic_slugs,
        counts={k: len(v) for k, v in by_topic.items()}
    )

    if section:
        sections.append(section)


    section = build_readme_section(
        "Platforms", "📚", "Platforms", platform_values, platform_slugs,
        counts={k: len(v) for k, v in by_platform.items()}
    )

    if section:
        sections.append(section)
    section = build_readme_section(
        "Companies", "🏢", "Companies", company_values, company_slugs,
        counts={k: len(v) for k, v in by_company.items()}
    )

    if section:
        sections.append(section)
    section = build_readme_section(
        "Difficulty", "🧪", "Difficulty", difficulty_values, difficulty_slugs,
        counts={k: len(v) for k, v in by_difficulty.items()}
    )

    if section:
        sections.append(section)
    section = build_readme_section(
        "Rating", "⭐", "Rating", rating_values, rating_slugs,
        counts={k: len(v) for k, v in by_rating.items()}
    )

    if section:
        sections.append(section)
    section = build_readme_section(
        "Miscellaneous Tags", "🏷️", "Miscellaneous Tags", other_tag_values, other_tag_slugs,
        counts={k: len(v) for k, v in by_other_tag.items()}
    )

    if section:
        sections.append(section)

    template_section = build_templates_section(template_files)

    if template_section:
        sections.append(template_section)
  

    # Dynamically inject the problem count
    dynamic_header = README_HEADER_TEMPLATE.format(count=problem_count)
    
    readme_content = (
        dynamic_header
        + stats
        + "\n".join(sections)
        + README_FOOTER
    )

    if readme_sections_appendix:
        readme_content = readme_content.rstrip() + "\n\n" + readme_sections_appendix + "\n"

    README_FILE.write_text(readme_content, encoding="utf-8")

def main() -> None:
    print("Starting index generation...", flush=True)

    if not PROBLEMS_DIR.exists():
        fail([f"Problems/ folder does not exist at: {PROBLEMS_DIR}"])

    notes: list[dict[str, Any]] = []
    validation_errors: list[str] = []

    for path in sorted(PROBLEMS_DIR.rglob("*.md")):
        try:
            note = validate_note(path)
            notes.append(note)
        except Exception as exc:
            validation_errors.append(f"{path.as_posix()}: {exc}")

    if validation_errors:
        fail(validation_errors)

    print("Validation passed.", flush=True)
    print("Creating generated directories...", flush=True)

    clean_generated_dirs()

    topic_values = sorted({t for note in notes for t in note["topics"]}, key=str.lower)
    platform_values = sorted({p for note in notes for p in note["platforms"]}, key=str.lower)
    company_values = sorted({c for note in notes for c in note["companies"]}, key=str.lower)
    other_tag_values = sorted({t for note in notes for t in note["other_tags"]}, key=str.lower)
    difficulty_values = sorted({note["difficulty"] for note in notes}, key=sort_difficulty)
    rating_values = sorted({rating_label(note["rating"]) for note in notes}, key=sort_rating)

    topic_slugs = ensure_no_slug_collisions("Topic", topic_values)
    platform_slugs = ensure_no_slug_collisions("Platform", platform_values)
    company_slugs = ensure_no_slug_collisions("Company", company_values)
    other_tag_slugs = ensure_no_slug_collisions("Miscellaneous Tag", other_tag_values)
    difficulty_slugs = ensure_no_slug_collisions("Difficulty", difficulty_values)
    rating_slugs = ensure_no_slug_collisions("Rating", rating_values)

    by_topic: dict[str, list[dict[str, Any]]] = defaultdict(list)
    by_platform: dict[str, list[dict[str, Any]]] = defaultdict(list)
    by_company: dict[str, list[dict[str, Any]]] = defaultdict(list)
    by_other_tag: dict[str, list[dict[str, Any]]] = defaultdict(list)
    by_difficulty: dict[str, list[dict[str, Any]]] = defaultdict(list)
    by_rating: dict[str, list[dict[str, Any]]] = defaultdict(list)

    for note in notes:
        for topic in note["topics"]:
            by_topic[topic].append(note)
        for platform in note["platforms"]:
            by_platform[platform].append(note)
        for company in note["companies"]:
            by_company[company].append(note)
        for tag in note["other_tags"]:
            by_other_tag[tag].append(note)
        by_difficulty[note["difficulty"]].append(note)
        by_rating[rating_label(note["rating"])].append(note)

    print("Generating index files...", flush=True)

    topics_dir = GENERATED_DIRS["Topics"]
    for topic, items in by_topic.items():
        index_file = topics_dir / f"{topic_slugs[topic]}.md"
        render_grouped_by_difficulty(index_file, topic, items)

    platforms_dir = GENERATED_DIRS["Platforms"]
    for platform, items in by_platform.items():
        index_file = platforms_dir / f"{platform_slugs[platform]}.md"
        render_grouped_by_difficulty(index_file, platform, items)

    companies_dir = GENERATED_DIRS["Companies"]
    for company, items in by_company.items():
        index_file = companies_dir / f"{company_slugs[company]}.md"
        render_grouped_by_difficulty(index_file, company, items)

    misc_dir = GENERATED_DIRS["Miscellaneous Tags"]
    for tag, items in by_other_tag.items():
        index_file = misc_dir / f"{other_tag_slugs[tag]}.md"
        render_grouped_by_difficulty(index_file, tag, items)

    difficulty_dir = GENERATED_DIRS["Difficulty"]
    for difficulty, items in by_difficulty.items():
        index_file = difficulty_dir / f"{difficulty_slugs[difficulty]}.md"
        render_flat_index(index_file, difficulty, items)

    rating_dir = GENERATED_DIRS["Rating"]
    for rating, items in by_rating.items():
        index_file = rating_dir / f"{rating_slugs[rating]}.md"
        render_grouped_by_difficulty(index_file, rating, items)

    print("Appending ReadMe Sections...", flush=True)
    readme_sections_appendix = build_readme_sections_appendix(README_SECTIONS_DIR)

    # Call README generation with the calculated number of problem files
    generate_readme(
        problem_count=len(notes),
        topic_values=topic_values,
        platform_values=platform_values,
        company_values=company_values,
        difficulty_values=difficulty_values,
        other_tag_values=other_tag_values,
        rating_values=rating_values,
        topic_slugs=topic_slugs,
        platform_slugs=platform_slugs,
        company_slugs=company_slugs,
        difficulty_slugs=difficulty_slugs,
        other_tag_slugs=other_tag_slugs,
        rating_slugs=rating_slugs,
        by_topic=by_topic,
        by_platform=by_platform,
        by_company=by_company,
        by_other_tag=by_other_tag,
        by_difficulty=by_difficulty,
        by_rating=by_rating,
        template_files=template_files,
        readme_sections_appendix=readme_sections_appendix
    )

    print("Indexes and README generated successfully.", flush=True)

if __name__ == "__main__":
    main()