#!/usr/bin/env python3
"""
green_ticks_manager.py

ONE file, ONE tool -- the single source of truth for every controlled
frontmatter field: Companies, Topics, Platform, Difficulty, Other Tags.

Each field has its own hardcoded, self-modifying list of valid values
living in THIS file (between its own *_START / *_END markers below).
Add / rename / remove values for any field through its own tab in the
GUI. No JSON/DB/config file -- this script rewrites itself on disk.

The "Problem Note" tab is a frontmatter builder:
  - Title, Link: free text (Link is optional).
  - Difficulty: single-select, from the Difficulty registry.
  - Topics, Platform, Other Tags, Companies: multi-select, from their
    respective registries. Other Tags may be left empty.
  - Any brand-new value typed for any field is registered into that
    field's registry right there, so it becomes selectable everywhere
    from then on.
  - "Write Frontmatter to File" replaces the ENTIRE frontmatter block
    of the chosen .md file with what's built from the form (or prepends
    one if the file has none yet). The body below the frontmatter is
    never touched.
  - Optional checkbox: also rename the file to the kebab-case of the
    Title you typed (e.g. "Two Sum" -> "two-sum.md"), matching the
    repo's naming rule. Refuses rather than overwrite a collision.

Run:
    python green_ticks_manager.py                      -> opens the GUI
    python green_ticks_manager.py "A, B, C"             -> CLI: add companies
    python green_ticks_manager.py --rename "Old" "New"  -> CLI: rename a company
"""

from __future__ import annotations

import re
import sys
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, font as tkfont, ttk

# ============================== COMPANIES_START ==============================
COMPANIES = [
    "Not Specified",
    "Adobe",
    "Affirm",
    "Alation",
    "Amazon",
    "Apple",
    "Atlassian",
    "BlackRock",
    "Bloomberg",
    "ByteDance",
    "Capital One",
    "Cisco",
    "Citadel",
    "Docusign",
    "eBay",
    "Expedia",
    "Facebook",
    "Goldman Sachs",
    "Google",
    "IBM",
    "Intel",
    "Intuit",
    "JPMorgan",
    "Microsoft",
    "National Instruments",
    "Netflix",
    "Oracle",
    "Paypal",
    "Qualtrics",
    "Rubrik",
    "Salesforce",
    "Sapient",
    "ServiceNow",
    "Snapchat",
    "Spotify",
    "Swiggy",
    "tcs",
    "Tesla",
    "tiktok",
    "Twilio",
    "Uber",
    "Visa",
    "VMware",
    "Walmart Global Tech",
    "Yahoo",
    "Yandex",
    "Zoho",
    "Zoom",
]
# =============================== COMPANIES_END ================================

# ================================ TOPICS_START =================================
TOPICS = [
    "Arrays",
    "Hashing",
    "Heap",
    "Maths",
    "Monotonic Stack",
    "Prefix and Suffix Arrays",
    "Sliding Window",
    "Sorting",
    "Strings",
    "Two Pointers",
]
# ================================= TOPICS_END ==================================

# =============================== PLATFORMS_START ================================
PLATFORMS = [
    "Leetcode",
    "Miscellaneous",

]
# ================================ PLATFORMS_END =================================

# ============================== DIFFICULTIES_START ==============================
DIFFICULTIES = [
    "Easy",
    "Hard",
    "Medium",
    "Not Specified",

]
# =============================== DIFFICULTIES_END ================================

# ============================== OTHER_TAGS_START ==============================
OTHER_TAGS = []
# =============================== OTHER_TAGS_END ================================


def make_block_re(var_name: str) -> re.Pattern:
    return re.compile(
        rf"(# =+ {var_name}_START =+\n{var_name} = \[)(.*?)(\]\n# =+ {var_name}_END =+)",
        re.DOTALL,
    )


# Registry metadata: display label -> (source variable name, live list object)
REGISTRIES: dict[str, tuple[str, list[str]]] = {
    "Companies": ("COMPANIES", COMPANIES),
    "Topics": ("TOPICS", TOPICS),
    "Platform": ("PLATFORMS", PLATFORMS),
    "Difficulty": ("DIFFICULTIES", DIFFICULTIES),
    "Other Tags": ("OTHER_TAGS", OTHER_TAGS),
}


# =============================================================================
# Generic registry logic -- shared by every field, CLI, and GUI
# =============================================================================

def normalize(raw: str) -> str:
    """Strip surrounding whitespace and collapse internal runs of whitespace."""
    return re.sub(r"\s+", " ", raw.strip())


def parse_input(arg: str) -> list[str]:
    values = [normalize(v) for v in arg.split(",")]
    return [v for v in values if v]


# A value that should always sort first, ahead of the normal alphabetical
# order, for a given registry. Keyed by BOTH the source variable name
# (used inside replace_registry_block/add_values/etc.) and the display
# label (used by the GUI), since callers pass whichever one they have.
PINNED_TOP: dict[str, str] = {
    "COMPANIES": "Not Specified",
    "Companies": "Not Specified",
}


def sort_with_pinned(values, pinned: str | None) -> list[str]:
    """Alphabetical (case-insensitive) sort, except `pinned` -- if present
    in `values` -- always comes first."""
    values = list(values)
    if pinned and pinned in values:
        rest = sorted((v for v in values if v != pinned), key=str.casefold)
        return [pinned] + rest
    return sorted(values, key=str.casefold)


def replace_registry_block(var_name: str, final_values: list[str]) -> None:
    """Rewrite THIS file's `<var_name> = [...]` block on disk to exactly
    `final_values` (deduped, sorted case-insensitively, with any pinned
    value from PINNED_TOP kept first). Sole place that touches disk for
    any registry. Reconstructs the block deterministically (empty -> `VAR
    = []` on one line, non-empty -> one quoted item per line) rather than
    trying to preserve whatever whitespace was there before."""
    script_path = Path(__file__).resolve()
    source = script_path.read_text(encoding="utf-8")

    block_re = make_block_re(var_name)
    match = block_re.search(source)
    if not match:
        raise RuntimeError(
            f"Could not locate {var_name}_START/{var_name}_END markers in "
            f"{script_path}. Refusing to modify the file."
        )

    merged = sort_with_pinned(set(final_values), PINNED_TOP.get(var_name))
    if merged:
        body = "\n" + "\n".join(f'    "{v}",' for v in merged) + "\n"
    else:
        body = ""

    new_source = source[: match.start()] + match.group(1) + body + match.group(3) + source[match.end():]
    script_path.write_text(new_source, encoding="utf-8")


def add_values(var_name: str, target_list: list[str], incoming: list[str]) -> tuple[list[str], list[tuple[str, str]]]:
    """Add any names in `incoming` not already present in `target_list`
    (case-insensitive). Returns (added, already_present) where
    already_present is a list of (typed_value, stored_value) pairs."""
    existing_by_fold = {c.casefold(): c for c in target_list}

    new_ones: list[str] = []
    already_present: list[tuple[str, str]] = []
    seen_fold_this_run = set()

    for c in incoming:
        fold = c.casefold()
        if fold in existing_by_fold:
            already_present.append((c, existing_by_fold[fold]))
        elif fold in seen_fold_this_run:
            continue
        else:
            new_ones.append(c)
            seen_fold_this_run.add(fold)

    if new_ones:
        final_list = sort_with_pinned(set(target_list) | set(new_ones), PINNED_TOP.get(var_name))
        replace_registry_block(var_name, final_list)
        target_list[:] = final_list

    return new_ones, already_present


def remove_values(var_name: str, target_list: list[str], exact_names: list[str]) -> list[str]:
    to_remove = set(exact_names)
    removed = [c for c in target_list if c in to_remove]
    remaining = [c for c in target_list if c not in to_remove]

    if removed:
        replace_registry_block(var_name, remaining)
        target_list[:] = remaining

    return removed


def rename_value(var_name: str, target_list: list[str], old_exact_name: str, new_name: str) -> tuple[bool, str]:
    new_name = normalize(new_name)

    if old_exact_name not in target_list:
        return False, f'"{old_exact_name}" was not found in the list.'
    if not new_name:
        return False, "New name is empty."
    if new_name == old_exact_name:
        return False, "New name is identical to the current one."

    fold_new = new_name.casefold()
    for c in target_list:
        if c != old_exact_name and c.casefold() == fold_new:
            return False, f'"{new_name}" already exists as "{c}".'

    final_list = [new_name if c == old_exact_name else c for c in target_list]
    final_list = sort_with_pinned(final_list, PINNED_TOP.get(var_name))
    replace_registry_block(var_name, final_list)
    target_list[:] = final_list

    return True, f'Renamed "{old_exact_name}" to "{new_name}".'


# Backward-compatible thin wrappers around the Companies registry, used by
# the CLI flags below.
def add_companies(incoming: list[str]) -> tuple[list[str], list[tuple[str, str]]]:
    return add_values("COMPANIES", COMPANIES, incoming)


def remove_companies(exact_names: list[str]) -> list[str]:
    return remove_values("COMPANIES", COMPANIES, exact_names)


def rename_company(old_exact_name: str, new_name: str) -> tuple[bool, str]:
    return rename_value("COMPANIES", COMPANIES, old_exact_name, new_name)


# =============================================================================
# Frontmatter building + writing for a Problem Note .md file
# =============================================================================

FRONTMATTER_BLOCK_RE = re.compile(r"\A(---\n)(.*?)(\n---\n?)", re.DOTALL)

# Purely a UI placeholder for the Other Tags multi-select -- never stored in
# the OTHER_TAGS registry itself, never written into a file's frontmatter.
# Picking it (or nothing at all) both just mean "no tags".
EMPTY_OTHER_TAGS_OPTION = "<empty>"

# Companies has no equivalent placeholder: "Not Specified" is a real,
# registry-stored value (seeded below) that IS written into the frontmatter
# when nothing else is selected.
DEFAULT_WHEN_EMPTY: dict[str, list[str]] = {"Companies": ["Not Specified"]}

_YAML_SPECIAL_RE = re.compile(r"[:{}\[\]#&*!|>'\"%@`]")


def yaml_scalar(value: str) -> str:
    """Quote a scalar only if it contains characters that would break
    unquoted YAML; otherwise leave it bare, matching the repo's existing
    file style (e.g. `Title: Two Sum`)."""
    value = value.strip()
    if not value:
        return '""'
    if _YAML_SPECIAL_RE.search(value):
        return '"' + value.replace('"', '\\"') + '"'
    return value


def yaml_list_block(key: str, values: list[str]) -> str:
    if not values:
        return f"{key}:"
    lines = [f"{key}:"] + [f"  - {v}" for v in values]
    return "\n".join(lines)


def kebab_case(text: str) -> str:
    """'Two Sum' -> 'two-sum', '3Sum' -> '3sum', collapsing/stripping hyphens."""
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-{2,}", "-", text)
    return text.strip("-")


def build_frontmatter(
    title: str,
    companies: list[str],
    topics: list[str],
    platforms: list[str],
    difficulty: str,
    other_tags: list[str],
    link: str,
) -> str:
    link_scalar = yaml_scalar(link) if link else '""'
    parts = [
        "---",
        f"Title: {yaml_scalar(title)}",
        yaml_list_block("Companies", companies),
        yaml_list_block("Topics", topics),
        yaml_list_block("Platform", platforms),
        f"Difficulty: {yaml_scalar(difficulty) if difficulty else 'Not Specified'}",
        yaml_list_block("Other Tags", other_tags),
        f"Link: {link_scalar}",
        "---",
        "",
    ]
    return "\n".join(parts)


def write_frontmatter(path: Path, frontmatter: str) -> None:
    """Replace an existing frontmatter block at the top of the file, or
    prepend this one if there isn't one yet. The body is never touched."""
    text = path.read_text(encoding="utf-8") if path.exists() else ""
    match = FRONTMATTER_BLOCK_RE.match(text)
    if match:
        new_text = frontmatter + text[match.end():]
    else:
        new_text = frontmatter + text
    path.write_text(new_text, encoding="utf-8")


def extract_title_from_frontmatter(file_text: str) -> str | None:
    match = FRONTMATTER_BLOCK_RE.match(file_text)
    if not match:
        return None
    title_match = re.search(r"^Title:\s*(.+)$", match.group(2), re.MULTILINE)
    if not title_match:
        return None
    value = title_match.group(1).strip()
    if value.startswith('"') and value.endswith('"'):
        value = value[1:-1].replace('\\"', '"')
    return value


def rename_file_to_kebab(path: Path, title: str) -> tuple[bool, Path | None, str]:
    """Rename `path` to the kebab-case of `title`. Never touches content.
    Refuses rather than overwrite an existing file."""
    new_stem = kebab_case(title)
    if not new_stem:
        return False, None, "Computed kebab-case name is empty; cannot rename."

    new_path = path.with_name(new_stem + path.suffix)
    if new_path == path:
        return False, path, f'File is already named "{path.name}".'
    if new_path.exists():
        return False, None, f'A file named "{new_path.name}" already exists; refusing to overwrite.'

    path.rename(new_path)
    return True, new_path, f'Renamed file to "{new_path.name}".'


# =============================================================================
# CLI (Companies registry only -- the workflow this originally grew from)
# =============================================================================

def run_cli(arg: str) -> None:
    incoming = parse_input(arg)
    if not incoming:
        print("No company names found in input.")
        sys.exit(1)

    new_ones, already_present = add_companies(incoming)

    if already_present:
        already_msg = ", ".join(f'{typed} (stored as "{stored}")' for typed, stored in already_present)
        print(f"[already known] {already_msg}")

    if not new_ones:
        print("Nothing new to add. Script file left untouched.")
        return

    print(f"[added] {', '.join(new_ones)}")
    print(f"Script file updated on disk: {Path(__file__).resolve()}")


def run_cli_rename(old_name: str, new_name: str) -> None:
    ok, message = rename_company(normalize(old_name), new_name)
    print(("[renamed] " if ok else "[error] ") + message)
    if ok:
        print(f"Script file updated on disk: {Path(__file__).resolve()}")
    sys.exit(0 if ok else 1)


# =============================================================================
# GUI
# =============================================================================

BG = "#1e1e1e"
FG = "#e8e8e8"
MUTED = "#8a8a8a"
ACCENT = "#4fd1c5"
ENTRY_BG = "#2a2a2a"
SELECT_BG = "#3a3a3a"
DANGER = "#e07a7a"
EDIT_ACCENT = "#3a5a5a"


class GreenTicksManager(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Green-Ticks Manager")
        self.geometry("480x720")
        self.minsize(400, 560)
        self.configure(bg=BG)

        mono = tkfont.Font(family="Menlo", size=11)
        if mono.actual("family") != "Menlo":
            mono = tkfont.Font(family="Consolas", size=11)
        self.mono = mono
        self.mono_bold = tkfont.Font(family=mono.actual("family"), size=12, weight="bold")
        self.small_font = ("Menlo", 9) if "Menlo" in tkfont.families() else ("Consolas", 9)

        self._registry_tabs: dict[str, dict] = {}
        self._note_fields: dict[str, dict] = {}
        self._placeholders: dict[tk.Entry, str] = {}

        self._configure_style()
        self._build_widgets()
        self._refresh_all()

    def _configure_style(self) -> None:
        style = ttk.Style(self)
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass
        style.configure("TNotebook", background=BG, borderwidth=0)
        style.configure("TNotebook.Tab", background=BG, foreground=MUTED, padding=(10, 8), font=self.small_font)
        style.map("TNotebook.Tab", background=[("selected", "#2a2a2a")], foreground=[("selected", FG)])
        style.configure("TCheckbutton", background=BG, foreground=FG, font=self.small_font)
        style.map("TCheckbutton", background=[("active", BG)])
        style.configure("TCombobox", fieldbackground=ENTRY_BG, background=ENTRY_BG, foreground=FG)

    # ------------------------------------------------------------- layout --

    def _build_widgets(self) -> None:
        notebook = ttk.Notebook(self)
        notebook.pack(fill="both", expand=True)

        for label in REGISTRIES:
            tab = tk.Frame(notebook, bg=BG)
            notebook.add(tab, text=label)
            self._build_registry_tab(tab, label)

        note_tab = tk.Frame(notebook, bg=BG)
        notebook.add(note_tab, text="Problem Note")
        self._build_note_tab(note_tab)

    def _set_placeholder(self, entry: tk.Entry, var: tk.StringVar, text: str) -> None:
        entry.insert(0, text)
        entry.config(fg=MUTED)

        def on_focus_in(_e):
            if var.get() == text:
                entry.delete(0, "end")
                entry.config(fg=FG)

        def on_focus_out(_e):
            if not var.get():
                entry.insert(0, text)
                entry.config(fg=MUTED)

        entry.bind("<FocusIn>", on_focus_in)
        entry.bind("<FocusOut>", on_focus_out)
        self._placeholders[entry] = text

    def _real_value(self, var: tk.StringVar, placeholder: str) -> str:
        val = var.get()
        return "" if val.strip().casefold() == placeholder.casefold() else val

    # --------------------------------------------------- generic registry tab --

    def _build_registry_tab(self, parent: tk.Frame, label: str) -> None:
        var_name, target_list = REGISTRIES[label]
        pad = 14
        state: dict = {"var_name": var_name, "target_list": target_list, "rename_target": None}

        header = tk.Frame(parent, bg=BG)
        header.pack(fill="x", padx=pad, pady=(pad, 6))
        count_label = tk.Label(header, text=label, font=self.mono_bold, bg=BG, fg=FG, anchor="w")
        count_label.pack(side="left")
        state["count_label"] = count_label

        search_frame = tk.Frame(parent, bg=BG)
        search_frame.pack(fill="x", padx=pad, pady=(0, 8))
        search_var = tk.StringVar()
        search_entry = tk.Entry(
            search_frame, textvariable=search_var, font=self.mono,
            bg=ENTRY_BG, fg=FG, insertbackground=FG, relief="flat",
        )
        search_entry.pack(fill="x", ipady=6)
        self._set_placeholder(search_entry, search_var, "Search...")
        search_var.trace_add("write", lambda *_: self._refresh_registry_list(label))
        state["search_var"] = search_var

        list_frame = tk.Frame(parent, bg=BG)
        list_frame.pack(fill="both", expand=True, padx=pad, pady=(0, 8))
        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side="right", fill="y")
        listbox = tk.Listbox(
            list_frame, font=self.mono, bg=BG, fg=FG,
            selectbackground=SELECT_BG, selectforeground=ACCENT,
            activestyle="none", relief="flat", highlightthickness=1,
            highlightbackground="#333333", highlightcolor="#333333",
            selectmode="extended", yscrollcommand=scrollbar.set,
        )
        listbox.pack(fill="both", expand=True)
        scrollbar.config(command=listbox.yview)
        listbox.bind("<Delete>", lambda _e: self._remove_selected(label))
        listbox.bind("<BackSpace>", lambda _e: self._remove_selected(label))
        listbox.bind("<<ListboxSelect>>", lambda _e: self._on_registry_select(label))
        state["listbox"] = listbox

        rename_frame = tk.Frame(parent, bg=BG)
        rename_frame.pack(fill="x", padx=pad, pady=(0, 6))
        rename_var = tk.StringVar()
        rename_entry = tk.Entry(
            rename_frame, textvariable=rename_var, font=self.mono,
            bg=ENTRY_BG, fg=FG, insertbackground=FG, relief="flat", state="disabled",
        )
        rename_entry.pack(side="left", fill="x", expand=True, ipady=6, padx=(0, 8))
        rename_entry.bind("<Return>", lambda _e: self._save_rename(label))
        state["rename_var"] = rename_var
        state["rename_entry"] = rename_entry

        rename_btn = tk.Button(
            rename_frame, text="Save edit", font=self.mono, bg=EDIT_ACCENT, fg=FG,
            activebackground=EDIT_ACCENT, activeforeground=FG, relief="flat",
            padx=10, state="disabled", command=lambda: self._save_rename(label),
        )
        rename_btn.pack(side="left")
        state["rename_btn"] = rename_btn

        add_frame = tk.Frame(parent, bg=BG)
        add_frame.pack(fill="x", padx=pad, pady=(0, 6))
        add_var = tk.StringVar()
        add_entry = tk.Entry(
            add_frame, textvariable=add_var, font=self.mono,
            bg=ENTRY_BG, fg=FG, insertbackground=FG, relief="flat",
        )
        add_entry.pack(side="left", fill="x", expand=True, ipady=6, padx=(0, 8))
        add_entry.bind("<Return>", lambda _e: self._add_from_entry(label))
        self._set_placeholder(add_entry, add_var, f"New {label.lower()}, comma-separated")
        state["add_var"] = add_var
        state["add_entry"] = add_entry

        add_btn = tk.Button(
            add_frame, text="Add", font=self.mono, bg=ACCENT, fg="#0d0d0d",
            activebackground=ACCENT, activeforeground="#0d0d0d", relief="flat",
            padx=14, command=lambda: self._add_from_entry(label),
        )
        add_btn.pack(side="left")

        remove_btn = tk.Button(
            parent, text="Remove selected", font=self.mono, bg=BG, fg=DANGER,
            activebackground=BG, activeforeground=DANGER, relief="flat", bd=1,
            highlightthickness=1, highlightbackground="#3a2a2a",
            command=lambda: self._remove_selected(label),
        )
        remove_btn.pack(fill="x", padx=pad, pady=(0, 8), ipady=4)

        status_var = tk.StringVar(value="Ready.")
        tk.Label(
            parent, textvariable=status_var, font=self.small_font,
            bg=BG, fg=MUTED, anchor="w", justify="left", wraplength=440,
        ).pack(fill="x", padx=pad, pady=(0, pad))
        state["status_var"] = status_var

        self._registry_tabs[label] = state

    def _refresh_all(self) -> None:
        for label in REGISTRIES:
            self._refresh_registry_list(label)
        self._refresh_note_fields()

    def _refresh_registry_list(self, label: str) -> None:
        state = self._registry_tabs.get(label)
        if not state or not self.winfo_exists():
            return
        _var_name, target_list = REGISTRIES[label]
        all_values = sort_with_pinned(target_list, PINNED_TOP.get(label))
        state["count_label"].config(text=f"{label} ({len(all_values)})")

        query = self._real_value(state["search_var"], "Search...").strip().casefold()
        filtered = [v for v in all_values if query in v.casefold()] if query else all_values

        listbox = state["listbox"]
        listbox.delete(0, "end")
        for v in filtered:
            listbox.insert("end", v)

    def _on_registry_select(self, label: str) -> None:
        state = self._registry_tabs[label]
        selection = state["listbox"].curselection()
        if len(selection) == 1:
            name = state["listbox"].get(selection[0])
            state["rename_target"] = name
            state["rename_var"].set(name)
            state["rename_entry"].config(state="normal", fg=FG)
            state["rename_btn"].config(state="normal")
        else:
            state["rename_target"] = None
            state["rename_var"].set("")
            state["rename_entry"].config(state="disabled")
            state["rename_btn"].config(state="disabled")

    def _save_rename(self, label: str) -> None:
        state = self._registry_tabs[label]
        if not state["rename_target"]:
            state["status_var"].set("Select exactly one value to edit first.")
            return
        var_name, target_list = REGISTRIES[label]
        ok, message = rename_value(var_name, target_list, state["rename_target"], state["rename_var"].get())
        state["status_var"].set(message)
        if ok:
            state["rename_target"] = None
            state["rename_entry"].config(state="disabled")
            state["rename_btn"].config(state="disabled")
            state["rename_var"].set("")
            self._refresh_all()

    def _add_from_entry(self, label: str) -> None:
        state = self._registry_tabs[label]
        raw = self._real_value(state["add_var"], self._placeholders.get(state["add_entry"], ""))
        if not raw.strip():
            state["status_var"].set("Type one or more comma-separated values first.")
            return
        incoming = parse_input(raw)
        if not incoming:
            state["status_var"].set("Nothing to add.")
            return
        var_name, target_list = REGISTRIES[label]
        added, already_present = add_values(var_name, target_list, incoming)
        state["add_var"].set("")
        parts = []
        if added:
            parts.append(f"Added: {', '.join(added)}")
        if already_present:
            dupes = ", ".join(typed for typed, _stored in already_present)
            parts.append(f"Already known: {dupes}")
        state["status_var"].set(" | ".join(parts) if parts else "No changes.")
        self._refresh_all()

    def _remove_selected(self, label: str) -> None:
        state = self._registry_tabs[label]
        selection = [state["listbox"].get(i) for i in state["listbox"].curselection()]
        if not selection:
            state["status_var"].set("Select one or more values to remove first.")
            return
        var_name, target_list = REGISTRIES[label]
        removed = remove_values(var_name, target_list, selection)
        state["status_var"].set(f"Removed: {', '.join(removed)}" if removed else "Nothing removed.")
        self._refresh_all()

    # -------------------------------------------------------- problem note --

    def _build_note_tab(self, parent: tk.Frame) -> None:
        pad = 14

        file_frame = tk.Frame(parent, bg=BG)
        file_frame.pack(fill="x", padx=pad, pady=(pad, 8))

        self.note_path_var = tk.StringVar(value="No file selected.")
        tk.Label(
            file_frame, textvariable=self.note_path_var, font=self.small_font,
            bg=BG, fg=MUTED, anchor="w", wraplength=320, justify="left",
        ).pack(side="left", fill="x", expand=True)

        tk.Button(
            file_frame, text="Browse...", font=self.mono, bg=ACCENT, fg="#0d0d0d",
            activebackground=ACCENT, activeforeground="#0d0d0d", relief="flat",
            padx=10, command=self._browse_note_file,
        ).pack(side="right")

        self._current_note_path: Path | None = None

        canvas = tk.Canvas(parent, bg=BG, highlightthickness=0)
        scrollbar = tk.Scrollbar(parent, orient="vertical", command=canvas.yview)
        form = tk.Frame(canvas, bg=BG)
        form.bind("<Configure>", lambda _e: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=form, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        canvas.pack(side="left", fill="both", expand=True, padx=(pad, 0))
        scrollbar.pack(side="right", fill="y")

        def field_label(text: str) -> None:
            tk.Label(form, text=text, font=self.small_font, bg=BG, fg=MUTED, anchor="w").pack(
                fill="x", pady=(10, 2), padx=(0, pad)
            )

        # Title
        field_label("Title (required)")
        self.note_title_var = tk.StringVar()
        tk.Entry(
            form, textvariable=self.note_title_var, font=self.mono, bg=ENTRY_BG, fg=FG,
            insertbackground=FG, relief="flat",
        ).pack(fill="x", ipady=6, padx=(0, pad))

        # Link
        field_label("Link (optional)")
        self.note_link_var = tk.StringVar()
        tk.Entry(
            form, textvariable=self.note_link_var, font=self.mono, bg=ENTRY_BG, fg=FG,
            insertbackground=FG, relief="flat",
        ).pack(fill="x", ipady=6, padx=(0, pad))

        # Difficulty (single-select)
        field_label("Difficulty (single-select)")
        self.note_difficulty_var = tk.StringVar(value="Not Specified")
        self.note_difficulty_combo = ttk.Combobox(
            form, textvariable=self.note_difficulty_var, font=self.mono,
            values=sorted(DIFFICULTIES, key=str.casefold), state="normal",
        )
        self.note_difficulty_combo.pack(fill="x", ipady=4, padx=(0, pad))

        # Multi-select fields: Topics, Platform, Other Tags, Companies
        self._note_fields["Topics"] = self._build_note_multiselect(form, "Topics", pad)
        self._note_fields["Platform"] = self._build_note_multiselect(form, "Platform", pad)
        self._note_fields["Other Tags"] = self._build_note_multiselect(
            form, "Other Tags", pad, optional=True, pseudo_options=[EMPTY_OTHER_TAGS_OPTION]
        )
        self._note_fields["Companies"] = self._build_note_multiselect(form, "Companies", pad)

        # Rename-file checkbox
        self.rename_file_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(
            form,
            text="Also rename file to kebab-case Title (e.g. two-sum.md)",
            variable=self.rename_file_var,
        ).pack(fill="x", pady=(14, 6), padx=(0, pad))

        tk.Button(
            form, text="Write Frontmatter to File", font=self.mono, bg=ACCENT, fg="#0d0d0d",
            activebackground=ACCENT, activeforeground="#0d0d0d", relief="flat",
            command=self._write_frontmatter, padx=10,
        ).pack(fill="x", ipady=6, padx=(0, pad))

        self.note_status_var = tk.StringVar(value="Pick a .md file, fill in the fields, then write.")
        tk.Label(
            form, textvariable=self.note_status_var, font=self.small_font, bg=BG, fg=MUTED,
            anchor="w", justify="left", wraplength=400,
        ).pack(fill="x", pady=(10, 20), padx=(0, pad))

    def _build_note_multiselect(
        self, form: tk.Frame, label: str, pad: int, optional: bool = False, pseudo_options: list[str] | None = None
    ) -> dict:
        suffix = " (optional, multi-select)" if optional else " (multi-select)"
        tk.Label(form, text=label + suffix, font=self.small_font, bg=BG, fg=MUTED, anchor="w").pack(
            fill="x", pady=(10, 2), padx=(0, pad)
        )

        search_var = tk.StringVar()
        search_entry = tk.Entry(
            form, textvariable=search_var, font=self.mono, bg=ENTRY_BG, fg=FG,
            insertbackground=FG, relief="flat",
        )
        search_entry.pack(fill="x", ipady=5, padx=(0, pad))
        self._set_placeholder(search_entry, search_var, f"Filter {label.lower()}...")

        list_frame = tk.Frame(form, bg=BG)
        list_frame.pack(fill="x", pady=(4, 4), padx=(0, pad))
        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side="right", fill="y")
        listbox = tk.Listbox(
            list_frame, font=self.mono, bg=BG, fg=FG,
            selectbackground=SELECT_BG, selectforeground=ACCENT,
            activestyle="none", relief="flat", highlightthickness=1,
            highlightbackground="#333333", highlightcolor="#333333",
            selectmode="extended", height=5, exportselection=False,
            yscrollcommand=scrollbar.set,
        )
        listbox.pack(fill="both", expand=True)
        scrollbar.config(command=listbox.yview)

        new_var = tk.StringVar()
        new_entry = tk.Entry(
            form, textvariable=new_var, font=self.mono, bg=ENTRY_BG, fg=FG,
            insertbackground=FG, relief="flat",
        )
        new_entry.pack(fill="x", ipady=5, padx=(0, pad))
        self._set_placeholder(new_entry, new_var, f"New {label.lower()}, comma-separated")

        field_state = {
            "label": label, "search_var": search_var, "search_entry": search_entry,
            "listbox": listbox, "new_var": new_var, "new_entry": new_entry,
            "selected_names": set(), "pseudo_options": pseudo_options or [],
        }

        search_var.trace_add("write", lambda *_: self._refresh_note_multiselect(field_state))
        listbox.bind("<<ListboxSelect>>", lambda _e: self._remember_note_selection(field_state))

        return field_state

    def _remember_note_selection(self, field_state: dict) -> None:
        listbox = field_state["listbox"]
        currently_shown = listbox.get(0, "end")
        selected_now = {currently_shown[i] for i in listbox.curselection()}
        # Anything shown but not selected right now was just deselected.
        field_state["selected_names"] -= (set(currently_shown) - selected_now)
        field_state["selected_names"] |= selected_now

    def _refresh_note_multiselect(self, field_state: dict) -> None:
        if not self.winfo_exists():
            return
        _var_name, target_list = REGISTRIES[field_state["label"]]
        all_values = sort_with_pinned(target_list, PINNED_TOP.get(field_state["label"]))

        query = self._real_value(field_state["search_var"], self._placeholders.get(field_state["search_entry"], "")).strip().casefold()
        filtered = [v for v in all_values if query in v.casefold()] if query else all_values

        listbox = field_state["listbox"]
        listbox.delete(0, "end")
        for name in field_state["pseudo_options"]:
            listbox.insert("end", name)
            if name in field_state["selected_names"]:
                listbox.selection_set(listbox.size() - 1)
        for name in filtered:
            listbox.insert("end", name)
            if name in field_state["selected_names"]:
                listbox.selection_set(listbox.size() - 1)

    def _refresh_note_fields(self) -> None:
        for field_state in self._note_fields.values():
            self._refresh_note_multiselect(field_state)
        if hasattr(self, "note_difficulty_combo"):
            self.note_difficulty_combo.configure(values=sorted(DIFFICULTIES, key=str.casefold))

    def _collect_note_field(self, label: str) -> list[str]:
        """Selected values + any brand-new ones typed in the inline box for
        this field. Registers brand-new ones into that field's registry."""
        field_state = self._note_fields[label]
        var_name, target_list = REGISTRIES[label]

        raw_new = self._real_value(field_state["new_var"], self._placeholders.get(field_state["new_entry"], ""))
        new_incoming = parse_input(raw_new)
        pseudo_fold_early = {p.casefold() for p in field_state["pseudo_options"]}
        new_incoming = [n for n in new_incoming if n.casefold() not in pseudo_fold_early]

        added = []
        if new_incoming:
            added, _already = add_values(var_name, target_list, new_incoming)
            field_state["new_var"].set("")

        existing_fold = {c.casefold(): c for c in target_list}
        final: list[str] = []
        seen = set()
        pseudo_fold = {p.casefold() for p in field_state["pseudo_options"]}
        for name in list(field_state["selected_names"]) + new_incoming:
            if name.casefold() in pseudo_fold:
                continue  # e.g. "<empty>" for Other Tags -- never actually stored
            stored = existing_fold.get(name.casefold(), name)
            if stored.casefold() not in seen:
                final.append(stored)
                seen.add(stored.casefold())

        # newly-added-here names should show as selected next refresh
        field_state["selected_names"] |= set(added)

        if not final and label in DEFAULT_WHEN_EMPTY:
            defaults = DEFAULT_WHEN_EMPTY[label]
            # make sure the default value actually exists in the registry
            add_values(var_name, target_list, defaults)
            existing_fold = {c.casefold(): c for c in target_list}
            final = [existing_fold.get(d.casefold(), d) for d in defaults]

        return sort_with_pinned(final, PINNED_TOP.get(label))

    def _browse_note_file(self) -> None:
        path_str = filedialog.askopenfilename(
            title="Select a problem note",
            filetypes=[("Markdown files", "*.md"), ("All files", "*.*")],
        )
        if not path_str:
            return
        self._current_note_path = Path(path_str)
        self.note_path_var.set(str(self._current_note_path))
        self.note_status_var.set(f"Selected {self._current_note_path.name}. Fill in fields and write.")

    def _write_frontmatter(self) -> None:
        if self._current_note_path is None:
            self.note_status_var.set("Pick a .md file first.")
            return

        title = self.note_title_var.get().strip()
        if not title:
            self.note_status_var.set("Title is required.")
            return

        link = self.note_link_var.get().strip()
        difficulty = self.note_difficulty_var.get().strip() or "Not Specified"

        # Register a brand-new Difficulty value typed directly into the combobox.
        if difficulty not in DIFFICULTIES:
            add_values("DIFFICULTIES", DIFFICULTIES, [difficulty])
            existing_fold = {c.casefold(): c for c in DIFFICULTIES}
            difficulty = existing_fold.get(difficulty.casefold(), difficulty)

        topics = self._collect_note_field("Topics")
        platforms = self._collect_note_field("Platform")
        other_tags = self._collect_note_field("Other Tags")
        companies = self._collect_note_field("Companies")

        frontmatter = build_frontmatter(
            title=title,
            companies=companies,
            topics=topics,
            platforms=platforms,
            difficulty=difficulty,
            other_tags=other_tags,
            link=link,
        )

        try:
            write_frontmatter(self._current_note_path, frontmatter)
        except OSError as e:
            self.note_status_var.set(f"Failed to write file: {e}")
            return

        rename_msg = ""
        if self.rename_file_var.get():
            ok, new_path, message = rename_file_to_kebab(self._current_note_path, title)
            rename_msg = message
            if ok and new_path is not None:
                self._current_note_path = new_path
                self.note_path_var.set(str(new_path))

        msg = f"Frontmatter written to {self._current_note_path.name}."
        if rename_msg:
            msg += " " + rename_msg
        self.note_status_var.set(msg)

        self._refresh_all()


def run_gui() -> None:
    GreenTicksManager().mainloop()


# =============================================================================
# main
# =============================================================================

def main() -> None:
    if len(sys.argv) == 1:
        run_gui()
    elif len(sys.argv) == 2:
        run_cli(sys.argv[1])
    elif len(sys.argv) == 4 and sys.argv[1] == "--rename":
        run_cli_rename(sys.argv[2], sys.argv[3])
    else:
        print(
            "Usage:\n"
            "  python green_ticks_manager.py                          (opens GUI)\n"
            '  python green_ticks_manager.py "Amazon, Google, New Co"  (add company, CLI mode)\n'
            '  python green_ticks_manager.py --rename "Old Name" "New Name"  (rename company, CLI mode)'
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
