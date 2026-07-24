#!/usr/bin/env python3
"""
green_ticks_manager.py

ONE file, ONE tool, two jobs:

1. Company registry -- a hardcoded, self-modifying list of company names
   (between COMPANIES_START / COMPANIES_END below). Add / rename / remove
   through the GUI (Companies tab) or the CLI flags. No JSON/DB file --
   this script rewrites its own COMPANIES list on disk.

2. Companies-frontmatter editing -- pick a problem .md file (Problem Note
   tab), paste a comma-separated string of company names (same format as
   the CLI), and the tool inserts ONLY the genuinely-new ones into that
   file's existing `Companies:` frontmatter block. Nothing else in the
   file is read, parsed, or rewritten -- Title, Topics, Platform,
   Difficulty, Link, and the entire body are left byte-for-byte alone.
   Any name that's brand-new to the registry is also added to the SAME
   hardcoded COMPANIES list above, so casing stays consistent everywhere.

   Optional extra: a checkbox to also rename the .md file itself to the
   kebab-case of its frontmatter Title (e.g. "Two Sum" -> "two-sum.md"),
   matching the repo's file-naming rule. Off by default; only touches the
   filename, never the content, and refuses rather than overwrite if a
   file with that target name already exists.

Run:
    python green_ticks_manager.py                 -> opens the GUI
    python green_ticks_manager.py "A, B, C"        -> CLI: add companies
    python green_ticks_manager.py --rename "Old" "New"  -> CLI: rename
"""

    

import re
import sys
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, font as tkfont, ttk


# ============================== COMPANIES_START ==============================
COMPANIES = [
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

BLOCK_RE = re.compile(
    r"(# =+ COMPANIES_START =+\nCOMPANIES = \[\n)(.*?)(\n\]\n# =+ COMPANIES_END =+)",
    re.DOTALL,
)


# =============================================================================
# Company registry -- core logic (shared by CLI and GUI)
# =============================================================================

def normalize(raw: str) -> str:
    """Strip surrounding whitespace and collapse internal runs of whitespace."""
    return re.sub(r"\s+", " ", raw.strip())


def parse_input(arg: str) -> list[str]:
    values = [normalize(v) for v in arg.split(",")]
    return [v for v in values if v]


def replace_companies_block(final_companies: list[str]) -> None:
    """Rewrite THIS file's COMPANIES list on disk to exactly `final_companies`
    (deduped, sorted case-insensitively). Sole place that touches the disk
    for the registry itself."""
    script_path = Path(__file__).resolve()
    source = script_path.read_text(encoding="utf-8")

    match = BLOCK_RE.search(source)
    if not match:
        raise RuntimeError(
            "Could not locate COMPANIES_START/COMPANIES_END markers in "
            f"{script_path}. Refusing to modify the file."
        )

    merged = sorted(set(final_companies), key=str.casefold)
    entries_text = "\n".join(f'    "{name}",' for name in merged)

    new_source = source[: match.start()] + match.group(1) + entries_text + match.group(3) + source[match.end():]
    script_path.write_text(new_source, encoding="utf-8")


def add_companies(incoming: list[str]) -> tuple[list[str], list[tuple[str, str]]]:
    """Add any names in `incoming` not already present (case-insensitive).
    Returns (added, already_present) where already_present is a list of
    (typed_value, stored_value) pairs. Writes to disk AND updates the
    in-memory COMPANIES list only if something new was actually added."""
    existing_by_fold = {c.casefold(): c for c in COMPANIES}

    new_ones: list[str] = []
    already_present: list[tuple[str, str]] = []
    seen_fold_this_run = set()

    for c in incoming:
        fold = c.casefold()
        if fold in existing_by_fold:
            already_present.append((c, existing_by_fold[fold]))
        elif fold in seen_fold_this_run:
            continue  # duplicate within the same input, e.g. "Meta, meta"
        else:
            new_ones.append(c)
            seen_fold_this_run.add(fold)

    if new_ones:
        final_list = sorted(set(COMPANIES) | set(new_ones), key=str.casefold)
        replace_companies_block(final_list)
        COMPANIES[:] = final_list

    return new_ones, already_present


def remove_companies(exact_names: list[str]) -> list[str]:
    """Remove the given EXACT (as-stored) names from the list."""
    to_remove = set(exact_names)
    removed = [c for c in COMPANIES if c in to_remove]
    remaining = [c for c in COMPANIES if c not in to_remove]

    if removed:
        replace_companies_block(remaining)
        COMPANIES[:] = remaining

    return removed


def rename_company(old_exact_name: str, new_name: str) -> tuple[bool, str]:
    """Correct/rename an existing EXACT (as-stored) entry to `new_name`."""
    new_name = normalize(new_name)

    if old_exact_name not in COMPANIES:
        return False, f'"{old_exact_name}" was not found in the list.'
    if not new_name:
        return False, "New name is empty."
    if new_name == old_exact_name:
        return False, "New name is identical to the current one."

    fold_new = new_name.casefold()
    for c in COMPANIES:
        if c != old_exact_name and c.casefold() == fold_new:
            return False, f'"{new_name}" already exists as "{c}".'

    final_list = [new_name if c == old_exact_name else c for c in COMPANIES]
    final_list = sorted(final_list, key=str.casefold)
    replace_companies_block(final_list)
    COMPANIES[:] = final_list

    return True, f'Renamed "{old_exact_name}" to "{new_name}".'


# =============================================================================
# Companies-only frontmatter editing for a Problem Note .md file
#
# This ONLY ever touches the "Companies:" key inside an EXISTING frontmatter
# block. It never reads/writes Title, Topics, Platform, Difficulty, Link,
# or the file's body. If there's no frontmatter, or no Companies: key yet,
# it says so and makes no changes (except the Companies: key can be freshly
# added if the frontmatter exists but simply doesn't have that key yet).
# =============================================================================

# Matches the whole frontmatter block at the very top of the file:
#   group(1) = "---\n"
#   group(2) = everything between the two "---" lines
#   group(3) = "\n---\n" (or "\n---" at EOF)
FRONTMATTER_BLOCK_RE = re.compile(r"\A(---\n)(.*?)(\n---\n?)", re.DOTALL)

# Matches an existing "Companies:" key and its "  - value" list lines, if any.
COMPANIES_KEY_RE = re.compile(r"^Companies:\n((?:  - .*\n?)*)", re.MULTILINE)

# Matches the Title: key's value, for the optional file-rename feature.
TITLE_KEY_RE = re.compile(r"^Title:\s*(.+)$", re.MULTILINE)


class NoFrontmatterError(Exception):
    pass


def merge_companies_into_frontmatter(
    file_text: str, incoming_companies: list[str]
) -> tuple[str, list[str], list[str]]:
    """Insert only the genuinely-new (case-insensitive) names from
    `incoming_companies` into the file's existing Companies: frontmatter
    list. Returns (new_file_text, inserted, already_present).

    Raises NoFrontmatterError if the file has no frontmatter block at all.
    Everything outside the Companies: key/value lines is left untouched,
    character for character.
    """
    match = FRONTMATTER_BLOCK_RE.match(file_text)
    if not match:
        raise NoFrontmatterError("This file has no frontmatter block at the top.")

    inner = match.group(2)

    key_match = COMPANIES_KEY_RE.search(inner)
    if key_match:
        existing_items = re.findall(r"^  - (.+)$", key_match.group(1), re.MULTILINE)
    else:
        existing_items = []

    existing_fold = {c.casefold() for c in existing_items}

    inserted: list[str] = []
    already_present: list[str] = []
    seen_this_run = set()

    for c in incoming_companies:
        fold = c.casefold()
        if fold in existing_fold:
            already_present.append(c)
        elif fold in seen_this_run:
            continue  # duplicate within the pasted input itself
        else:
            inserted.append(c)
            seen_this_run.add(fold)

    if not inserted:
        return file_text, inserted, already_present

    new_items = existing_items + inserted
    new_block = "Companies:\n" + "".join(f"  - {name}\n" for name in new_items)

    if key_match:
        new_inner = inner[: key_match.start()] + new_block + inner[key_match.end():]
    else:
        # No Companies: key existed yet -- append it at the end of the
        # frontmatter content, nothing else in the frontmatter is touched.
        new_inner = inner.rstrip("\n") + "\n" + new_block.rstrip("\n")

    new_text = file_text[: match.start(2)] + new_inner + file_text[match.end(2):]
    return new_text, inserted, already_present


def kebab_case(text: str) -> str:
    """'Two Sum' -> 'two-sum', '3Sum' -> '3sum', collapsing/stripping hyphens."""
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-{2,}", "-", text)
    return text.strip("-")


def extract_title_from_frontmatter(file_text: str) -> str | None:
    match = FRONTMATTER_BLOCK_RE.match(file_text)
    if not match:
        return None
    title_match = TITLE_KEY_RE.search(match.group(2))
    return title_match.group(1).strip() if title_match else None


def rename_file_to_kebab_title(path: Path) -> tuple[bool, Path | None, str]:
    """Optional utility: read Title: from the file's frontmatter, convert to
    kebab-case, and rename the file to match (repo convention, e.g.
    two-sum.md). Returns (success, new_path_or_None, message). Refuses to
    overwrite an existing file, and never touches file content."""
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as e:
        return False, None, f"Could not read file: {e}"

    title = extract_title_from_frontmatter(text)
    if not title:
        return False, None, "No Title found in frontmatter; cannot rename."

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
# CLI
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
        self.geometry("440x640")
        self.minsize(380, 540)
        self.configure(bg=BG)

        mono = tkfont.Font(family="Menlo", size=11)
        if mono.actual("family") != "Menlo":
            mono = tkfont.Font(family="Consolas", size=11)
        self.mono = mono
        self.mono_bold = tkfont.Font(family=mono.actual("family"), size=12, weight="bold")
        self.small_font = ("Menlo", 9) if "Menlo" in tkfont.families() else ("Consolas", 9)

        self._configure_style()
        self._build_widgets()
        self._refresh_companies_state()

    def _configure_style(self) -> None:
        style = ttk.Style(self)
        try:
            style.theme_use("clam")
        except tk.TclError:
            pass
        style.configure("TNotebook", background=BG, borderwidth=0)
        style.configure(
            "TNotebook.Tab", background=BG, foreground=MUTED, padding=(14, 8), font=self.mono,
        )
        style.map(
            "TNotebook.Tab",
            background=[("selected", "#2a2a2a")],
            foreground=[("selected", FG)],
        )
        style.configure("TCheckbutton", background=BG, foreground=FG, font=self.small_font)
        style.map("TCheckbutton", background=[("active", BG)])

    # ------------------------------------------------------------- layout --

    def _build_widgets(self) -> None:
        notebook = ttk.Notebook(self)
        notebook.pack(fill="both", expand=True)

        companies_tab = tk.Frame(notebook, bg=BG)
        note_tab = tk.Frame(notebook, bg=BG)

        notebook.add(companies_tab, text="Companies")
        notebook.add(note_tab, text="Problem Note")

        self._build_companies_tab(companies_tab)
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
        self._placeholders = getattr(self, "_placeholders", {})
        self._placeholders[entry] = text

    # --------------------------------------------------------- companies --

    def _build_companies_tab(self, parent: tk.Frame) -> None:
        pad = 14

        header = tk.Frame(parent, bg=BG)
        header.pack(fill="x", padx=pad, pady=(pad, 6))

        self.count_label = tk.Label(
            header, text="Companies", font=self.mono_bold, bg=BG, fg=FG, anchor="w"
        )
        self.count_label.pack(side="left")

        search_frame = tk.Frame(parent, bg=BG)
        search_frame.pack(fill="x", padx=pad, pady=(0, 8))

        self.search_var = tk.StringVar()
        self.search_var.trace_add("write", lambda *_: self._refresh_company_list())
        search_entry = tk.Entry(
            search_frame, textvariable=self.search_var, font=self.mono,
            bg=ENTRY_BG, fg=FG, insertbackground=FG, relief="flat",
        )
        search_entry.pack(fill="x", ipady=6)
        self._set_placeholder(search_entry, self.search_var, "Search...")

        list_frame = tk.Frame(parent, bg=BG)
        list_frame.pack(fill="both", expand=True, padx=pad, pady=(0, 8))

        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side="right", fill="y")

        self.company_listbox = tk.Listbox(
            list_frame, font=self.mono, bg=BG, fg=FG,
            selectbackground=SELECT_BG, selectforeground=ACCENT,
            activestyle="none", relief="flat", highlightthickness=1,
            highlightbackground="#333333", highlightcolor="#333333",
            selectmode="extended", yscrollcommand=scrollbar.set,
        )
        self.company_listbox.pack(fill="both", expand=True)
        scrollbar.config(command=self.company_listbox.yview)
        self.company_listbox.bind("<Delete>", lambda _e: self._remove_selected_companies())
        self.company_listbox.bind("<BackSpace>", lambda _e: self._remove_selected_companies())
        self.company_listbox.bind("<<ListboxSelect>>", self._on_company_select)

        rename_frame = tk.Frame(parent, bg=BG)
        rename_frame.pack(fill="x", padx=pad, pady=(0, 6))

        self._rename_target: str | None = None
        self.rename_var = tk.StringVar()
        self.rename_entry = tk.Entry(
            rename_frame, textvariable=self.rename_var, font=self.mono,
            bg=ENTRY_BG, fg=FG, insertbackground=FG, relief="flat", state="disabled",
        )
        self.rename_entry.pack(side="left", fill="x", expand=True, ipady=6, padx=(0, 8))
        self.rename_entry.bind("<Return>", lambda _e: self._save_rename())

        self.rename_btn = tk.Button(
            rename_frame, text="Save edit", font=self.mono, bg=EDIT_ACCENT, fg=FG,
            activebackground=EDIT_ACCENT, activeforeground=FG, relief="flat",
            padx=10, state="disabled", command=self._save_rename,
        )
        self.rename_btn.pack(side="left")

        add_frame = tk.Frame(parent, bg=BG)
        add_frame.pack(fill="x", padx=pad, pady=(0, 6))

        self.add_var = tk.StringVar()
        add_entry = tk.Entry(
            add_frame, textvariable=self.add_var, font=self.mono,
            bg=ENTRY_BG, fg=FG, insertbackground=FG, relief="flat",
        )
        add_entry.pack(side="left", fill="x", expand=True, ipady=6, padx=(0, 8))
        add_entry.bind("<Return>", lambda _e: self._add_companies_from_entry())
        self._set_placeholder(add_entry, self.add_var, "Amazon, Google, New Co")

        add_btn = tk.Button(
            add_frame, text="Add", font=self.mono, bg=ACCENT, fg="#0d0d0d",
            activebackground=ACCENT, activeforeground="#0d0d0d", relief="flat",
            padx=14, command=self._add_companies_from_entry,
        )
        add_btn.pack(side="left")

        remove_btn = tk.Button(
            parent, text="Remove selected", font=self.mono, bg=BG, fg=DANGER,
            activebackground=BG, activeforeground=DANGER, relief="flat", bd=1,
            highlightthickness=1, highlightbackground="#3a2a2a",
            command=self._remove_selected_companies,
        )
        remove_btn.pack(fill="x", padx=pad, pady=(0, 8), ipady=4)

        self.companies_status_var = tk.StringVar(value="Ready.")
        tk.Label(
            parent, textvariable=self.companies_status_var, font=self.small_font,
            bg=BG, fg=MUTED, anchor="w", justify="left", wraplength=400,
        ).pack(fill="x", padx=pad, pady=(0, pad))

    def _refresh_companies_state(self) -> None:
        self._all_companies = sorted(COMPANIES, key=str.casefold)
        self.count_label.config(text=f"Companies ({len(self._all_companies)})")
        self._refresh_company_list()

    def _refresh_company_list(self) -> None:
        all_companies = getattr(self, "_all_companies", None)
        if all_companies is None or not self.winfo_exists():
            return
        query = self.search_var.get().strip().casefold()
        if query and query != "search...":
            filtered = [c for c in all_companies if query in c.casefold()]
        else:
            filtered = all_companies
        self.company_listbox.delete(0, "end")
        for name in filtered:
            self.company_listbox.insert("end", name)

    def _on_company_select(self, _event=None) -> None:
        selection = self.company_listbox.curselection()
        if len(selection) == 1:
            name = self.company_listbox.get(selection[0])
            self._rename_target = name
            self.rename_var.set(name)
            self.rename_entry.config(state="normal", fg=FG)
            self.rename_btn.config(state="normal")
        else:
            self._rename_target = None
            self.rename_var.set("")
            self.rename_entry.config(state="disabled")
            self.rename_btn.config(state="disabled")

    def _save_rename(self) -> None:
        if not self._rename_target:
            self.companies_status_var.set("Select exactly one company to edit first.")
            return
        ok, message = rename_company(self._rename_target, self.rename_var.get())
        self.companies_status_var.set(message)
        if ok:
            self._rename_target = None
            self.rename_entry.config(state="disabled")
            self.rename_btn.config(state="disabled")
            self.rename_var.set("")
            self._refresh_companies_state()

    def _add_companies_from_entry(self) -> None:
        raw = self.add_var.get()
        if raw.strip().casefold() == "amazon, google, new co":
            raw = ""
        if not raw.strip():
            self.companies_status_var.set("Type one or more comma-separated company names first.")
            return

        incoming = parse_input(raw)
        if not incoming:
            self.companies_status_var.set("Nothing to add.")
            return

        added, already_present = add_companies(incoming)
        self.add_var.set("")

        parts = []
        if added:
            parts.append(f"Added: {', '.join(added)}")
        if already_present:
            dupes = ", ".join(typed for typed, _stored in already_present)
            parts.append(f"Already known: {dupes}")
        self.companies_status_var.set(" | ".join(parts) if parts else "No changes.")
        self._refresh_companies_state()

    def _remove_selected_companies(self) -> None:
        selection = [self.company_listbox.get(i) for i in self.company_listbox.curselection()]
        if not selection:
            self.companies_status_var.set("Select one or more companies to remove first.")
            return
        removed = remove_companies(selection)
        self.companies_status_var.set(f"Removed: {', '.join(removed)}" if removed else "Nothing removed.")
        self._refresh_companies_state()

    # -------------------------------------------------------- problem note --

    def _build_note_tab(self, parent: tk.Frame) -> None:
        pad = 14

        file_frame = tk.Frame(parent, bg=BG)
        file_frame.pack(fill="x", padx=pad, pady=(pad, 10))

        self.note_path_var = tk.StringVar(value="No file selected.")
        tk.Label(
            file_frame, textvariable=self.note_path_var, font=self.small_font,
            bg=BG, fg=MUTED, anchor="w", wraplength=300, justify="left",
        ).pack(side="left", fill="x", expand=True)

        tk.Button(
            file_frame, text="Browse...", font=self.mono, bg=ACCENT, fg="#0d0d0d",
            activebackground=ACCENT, activeforeground="#0d0d0d", relief="flat",
            padx=10, command=self._browse_note_file,
        ).pack(side="right")

        tk.Label(
            parent, text="Paste companies to add (comma-separated):",
            font=self.small_font, bg=BG, fg=MUTED, anchor="w",
        ).pack(fill="x", padx=pad, pady=(0, 4))

        self.note_companies_var = tk.StringVar()
        note_entry = tk.Entry(
            parent, textvariable=self.note_companies_var, font=self.mono,
            bg=ENTRY_BG, fg=FG, insertbackground=FG, relief="flat",
        )
        note_entry.pack(fill="x", padx=pad, ipady=6, pady=(0, 8))
        note_entry.bind("<Return>", lambda _e: self._insert_companies_into_note())

        self.rename_file_var = tk.BooleanVar(value=False)
        ttk.Checkbutton(
            parent,
            text="Also rename file to kebab-case Title (e.g. two-sum.md)",
            variable=self.rename_file_var,
        ).pack(fill="x", padx=pad, pady=(0, 8))

        tk.Button(
            parent, text="Insert into Companies frontmatter", font=self.mono,
            bg=ACCENT, fg="#0d0d0d", activebackground=ACCENT, activeforeground="#0d0d0d",
            relief="flat", command=self._insert_companies_into_note, padx=10,
        ).pack(fill="x", padx=pad, ipady=6)

        self.note_status_var = tk.StringVar(value="Pick a .md file, then paste companies to insert.")
        tk.Label(
            parent, textvariable=self.note_status_var, font=self.small_font, bg=BG, fg=MUTED,
            anchor="w", justify="left", wraplength=400,
        ).pack(fill="x", padx=pad, pady=(10, pad))

        self._current_note_path: Path | None = None

    def _browse_note_file(self) -> None:
        path_str = filedialog.askopenfilename(
            title="Select a problem note",
            filetypes=[("Markdown files", "*.md"), ("All files", "*.*")],
        )
        if not path_str:
            return
        self._current_note_path = Path(path_str)
        self.note_path_var.set(str(self._current_note_path))
        self.note_status_var.set(f"Selected {self._current_note_path.name}. Paste companies and insert.")

    def _insert_companies_into_note(self) -> None:
        if self._current_note_path is None:
            self.note_status_var.set("Pick a .md file first.")
            return

        raw = self.note_companies_var.get()
        incoming = parse_input(raw)
        insert_requested = bool(incoming)

        added_to_registry: list[str] = []
        inserted: list[str] = []
        already_in_file: list[str] = []

        if insert_requested:
            # 1. Register any brand-new names in the SAME hardcoded registry,
            #    so casing is consistent across every file from here on.
            added_to_registry, _already_in_registry = add_companies(incoming)

            # Resolve every typed name to whatever casing is now canonical in
            # the registry (works whether it was already known or just added).
            existing_fold = {c.casefold(): c for c in COMPANIES}
            canonical_names = [existing_fold.get(c.casefold(), c) for c in incoming]

            # 2. Surgically insert into THIS file's Companies: frontmatter list only.
            try:
                file_text = self._current_note_path.read_text(encoding="utf-8")
            except OSError as e:
                self.note_status_var.set(f"Could not read file: {e}")
                return

            try:
                new_text, inserted, already_in_file = merge_companies_into_frontmatter(
                    file_text, canonical_names
                )
            except NoFrontmatterError as e:
                self.note_status_var.set(str(e) + " Nothing was changed.")
                return

            if inserted:
                try:
                    self._current_note_path.write_text(new_text, encoding="utf-8")
                except OSError as e:
                    self.note_status_var.set(f"Failed to write file: {e}")
                    return

            self.note_companies_var.set("")

        rename_msg = ""
        if self.rename_file_var.get():
            ok, new_path, message = rename_file_to_kebab_title(self._current_note_path)
            rename_msg = message
            if ok and new_path is not None:
                self._current_note_path = new_path
                self.note_path_var.set(str(new_path))

        parts = []
        if inserted:
            parts.append(f"Inserted into file: {', '.join(inserted)}")
        if already_in_file:
            parts.append(f"Already in file: {', '.join(already_in_file)}")
        if added_to_registry:
            parts.append(f"New to registry: {', '.join(added_to_registry)}")
        if rename_msg:
            parts.append(rename_msg)

        if not parts:
            parts.append("Paste one or more comma-separated company names, or check the rename box.")

        self.note_status_var.set(" | ".join(parts))
        self._refresh_companies_state()


def run_gui() -> None:
    GreenTicksManager().mainloop()


# =============================================================================
# main
# =============================================================================

def main() -> None:
    try:
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
                '  python green_ticks_manager.py "Amazon, Google, New Co"  (add, CLI mode)\n'
                '  python green_ticks_manager.py --rename "Old Name" "New Name"  (rename, CLI mode)'
            )
            sys.exit(1)
    except Exception as e:
        
        import traceback
        traceback.print_exc()
        


if __name__ == "__main__":
    main()
    