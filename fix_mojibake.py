import json
import os
import ftfy

def fix_mojibake(obj):
    if isinstance(obj, str):
        return ftfy.fix_text(obj)
    elif isinstance(obj, list):
        return [fix_mojibake(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: fix_mojibake(v) for k, v in obj.items()}
    return obj

files = [
    r'c:\DailyInstruct\dailyinstruct\data\tech-articles.json',
    r'c:\DailyInstruct\dailyinstruct\data\business-articles.json',
    r'c:\DailyInstruct\dailyinstruct\data\markets-articles.json',
    r'c:\DailyInstruct\dailyinstruct\data\guides-articles.json'
]

for file in files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        fixed_data = fix_mojibake(data)
        
        # Check if anything changed
        if json.dumps(data) != json.dumps(fixed_data):
            print(f'Fixed mojibake in {file}')
            with open(file, 'w', encoding='utf-8') as f:
                json.dump(fixed_data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error processing {file}: {e}")
