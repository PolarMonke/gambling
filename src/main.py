import os
from pathlib import Path

def try_read_file(file_path):
    encodings = ['utf-8', 'latin-1', 'cp1252']
    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except UnicodeDecodeError:
            continue
    with open(file_path, 'rb') as f:
        return f.read().decode('utf-8', errors='replace')

def pack_specific_directories(src_dir, output_file):
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    if output_path.exists():
        output_path.unlink()
    
    target_dirs = {
        'jsx': ['components', 'pages', 'games'],
        'css': ['styles']
    }
    
    with open(output_path, 'w', encoding='utf-8') as f_out:
        f_out.write("=== Packed Project Files ===\n\n")
        
        # Process JSX files
        f_out.write("\n\n=== JSX COMPONENTS ===\n\n")
        for dir_type in target_dirs['jsx']:
            dir_path = Path(src_dir) / dir_type
            if not dir_path.exists():
                continue
                
            f_out.write(f"\n\n=== {dir_type.upper()} DIRECTORY ===\n\n")
            for root, _, files in os.walk(dir_path):
                for file in files:
                    if file.endswith('.jsx'):
                        file_path = Path(root) / file
                        f_out.write(f"\n\n// File: {file_path.relative_to(src_dir)}\n")
                        f_out.write(try_read_file(file_path))
        
        # Process CSS files
        f_out.write("\n\n=== CSS STYLES ===\n\n")
        for dir_type in target_dirs['css']:
            dir_path = Path(src_dir) / dir_type
            if not dir_path.exists():
                continue
                
            f_out.write(f"\n\n=== {dir_type.upper()} DIRECTORY ===\n\n")
            for root, _, files in os.walk(dir_path):
                for file in files:
                    if file.endswith('.css'):
                        file_path = Path(root) / file
                        f_out.write(f"\n\n/* File: {file_path.relative_to(src_dir)} */\n")
                        f_out.write(try_read_file(file_path))
    
    print(f"Packing complete. Output saved to {output_file}")

if __name__ == "__main__":
    SOURCE_DIR = "."  # Current directory (where src is located)
    OUTPUT_FILE = "packed_output.txt"
    
    pack_specific_directories(SOURCE_DIR, OUTPUT_FILE)