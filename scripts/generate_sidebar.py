import os

def format_title(filename):
    name = filename.replace('.md', '')
    if '-' in name and ' ' not in name:
        # e.g., two-sum.md -> Two Sum
        return ' '.join(word.capitalize() for word in name.split('-'))
    # Preserve original spacing, but ensure first letter is capitalized
    return name[0].upper() + name[1:] if name else name

def write_dir(f, current_path, current_rel, level=1):
    items = sorted(os.listdir(current_path))
    
    dirs = []
    files = []
    for item in items:
        # Skip hidden files/folders
        if item.startswith('.'):
            continue
            
        item_path = os.path.join(current_path, item)
        if os.path.isdir(item_path):
            dirs.append((item, item_path))
        elif item.endswith('.md') and item.lower() != 'readme.md':
            files.append((item, item_path))
            
    indent = "  " * level
    for file, _ in files:
        title = format_title(file)
        rel_path = f"/{current_rel}/{file}".replace(" ", "%20")
        f.write(f"{indent}- [{title}]({rel_path})\n")
        
    for d, d_path in dirs:
        f.write(f"{indent}- **{d}**\n")
        write_dir(f, d_path, f"{current_rel}/{d}", level + 1)

def generate_sidebar():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sidebar_path = os.path.join(root_dir, '_sidebar.md')
    
    # Folders we actually want to include in the sidebar
    include_folders = [
        'Topics',
        'Problems',
        'Notes',
        'Platforms',
        'Companies',
        'Difficulty',
        'Miscellaneous Tags',
        'Rating',
        'Templates'
    ]
    
    with open(sidebar_path, 'w', encoding='utf-8') as f:
        f.write('- [Home](/)\n\n')
        
        for folder in include_folders:
            folder_path = os.path.join(root_dir, folder)
            if not os.path.isdir(folder_path):
                continue
                
            f.write(f'- **{folder}**\n')
            write_dir(f, folder_path, folder, 1)
            
            f.write('\n')

if __name__ == "__main__":
    generate_sidebar()
    print("Successfully generated _sidebar.md")
