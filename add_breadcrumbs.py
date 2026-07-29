import os

categories = ['tech', 'business', 'market', 'guides']
for cat in categories:
    path = rf'c:\DailyInstruct\dailyinstruct\app\{cat}\page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    title = cat.capitalize()
    
    json_ld = f'''
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{{{
          __html: JSON.stringify({{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.dailyinstruct.com/"
              }},
              {{
                "@type": "ListItem",
                "position": 2,
                "name": "{title}",
                "item": "https://www.dailyinstruct.com/{cat}"
              }}
            ]
          }})
        }}}}
      />'''
      
    new_content = content.replace(f'<div className={{styles.{cat}Page}}>', f'<div className={{styles.{cat}Page}}>\n{json_ld}')
    
    if new_content != content:
        print(f'Fixed {path}')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
print('Done!')
