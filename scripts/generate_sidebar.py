import os

def format_title(filename):
    name = filename.replace('.md', '')
    # Replace hyphens with spaces and capitalize words
    return ' '.join(word.capitalize() for word in name.split('-'))

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
            
            # Sort files alphabetically
            files = sorted(os.listdir(folder_path))
            for file in files:
                if file.endswith('.md'):
                    title = format_title(file)
                    # Note the leading slash to fix the Docsify 404 relative path issue
                    f.write(f'  - [{title}](/{folder}/{file.replace(" ", "%20")})\n')
            
            f.write('\n')

if __name__ == "__main__":
    generate_sidebar()
    print("Successfully generated _sidebar.md")
