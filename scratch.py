import os
import re

components_dir = r'c:\DailyInstruct\dailyinstruct\components'

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'use client' not in content or 'fetch(\'/api/github/articles' not in content:
        return

    print(f'Processing {path}')

    # Find category
    cat_match = re.search(r"fetch\('/api/github/articles\?category=(\w+)'\)", content)
    category = cat_match.group(1) if cat_match else 'tech'
    json_file = f'{category}-articles.json'
    if category == 'market': json_file = 'markets-articles.json'

    # 1. Remove use client
    content = re.sub(r'[\'\"`]use client[\'\"`];\n+', '', content)

    # 2. Fix imports
    content = re.sub(r'import React(?:,\s*\{\s*useEffect,\s*useState\s*\})?\s*from\s*[\'\"`]react[\'\"`];', 
                     r"import React from 'react';", content)
                     
    # Add json-utils import if not present
    if 'readJsonFile' not in content:
        # Find path depth
        depth = path.count(os.sep) - components_dir.count(os.sep)
        prefix = '../' * depth
        content = re.sub(r"(import React from 'react';\n)", 
                         f"\\1import {{ readJsonFile, Article }} from '{prefix}lib/json-utils';\n", 
                         content)

    # 3. Change function signature
    comp_name_match = re.search(r'const\s+(\w+)\s*:\s*React\.FC\s*=\s*\(\)\s*=>\s*\{', content)
    if not comp_name_match:
        comp_name_match = re.search(r'const\s+(\w+)\s*=\s*\(\)\s*=>\s*\{', content)
        
    if comp_name_match:
        comp_name = comp_name_match.group(1)
        content = re.sub(r'const\s+' + comp_name + r'\s*(?::\s*React\.FC)?\s*=\s*\(\)\s*=>\s*\{',
                         f'const {comp_name} = async () => {{', content)

    # 4. Remove state hooks
    content = re.sub(r'\s*const\s+\[articles,\s*setArticles\]\s*=\s*useState<Article\[\]>\(\[\]\);', '', content)
    content = re.sub(r'\s*const\s+\[loading,\s*setLoading\]\s*=\s*useState\(true\);', '', content)

    # 5. Remove useEffect
    content = re.sub(r'\s*useEffect\(\(\)\s*=>\s*\{.*?\},\s*\[\]\);', '', content, flags=re.DOTALL)
    
    fetch_code = f'''
  let articles: Article[] = [];
  try {{
    const data = await readJsonFile<{{ articles: Article[] }}>('{json_file}');
    articles = data.articles || [];
  }} catch (error) {{
    console.error('Error fetching articles:', error);
  }}
'''
    
    if comp_name_match:
        content = re.sub(r'(const ' + comp_name + r' = async \(\) => \{)',
                         r'\1' + fetch_code, content)

    # 6. Remove loading check
    # Try to find if (loading) { return ( ... ) }
    content = re.sub(r'\s*if\s*\(\s*loading\s*\)\s*\{\s*(?:console\.log\(.*?\);\s*)?return\s*\(\s*<section.*?</section>\s*\);\s*\}', '', content, flags=re.DOTALL)

    # write it out
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk(components_dir):
    if 'admin' in root: continue
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
print('Done!')
