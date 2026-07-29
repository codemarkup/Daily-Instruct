import os
import re

for root, _, files in os.walk(r'c:\DailyInstruct\dailyinstruct\app'):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'layout.tsx' in path and not 'login' in path:
                continue
                
            new_content = re.sub(r'(title:\s*[\'\"`].*?)\s*(?:-|\|)\s*Daily Instruct([\'\"`])', r'\1\2', content)
            
            if new_content != content:
                print(f'Fixed {path}')
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
print('Done')
