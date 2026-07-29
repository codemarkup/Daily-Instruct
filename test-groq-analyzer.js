const fs = require('fs');

async function run() {
  const content = `HEADING: The Silent Revolution: Why Gen Z Is Ditching Instagram for Anonymous Campus Apps
PARAGRAPH: Something remarkable is happening on college campuses across the United States in 2026. While Instagram and TikTok continue to dominate global download charts, a quieter revolution is taking place in dorm rooms from Stanford to Harvard, and increasingly across universities in the United Kingdom and beyond. Students are abandoning the polished, performance-driven social media that defined the 2010s and early 2020s in favour of something radically different: anonymity. At the center of this seismic shift stands Fizz, an anonymous social app that has quietly become what its CEO calls the biggest college social platform since Facebook itself.
HEADING: From Pandemic Frustration to Campus Domination
PARAGRAPH: The story of Fizz begins not with a Silicon Valley brainstorming session, but with two Stanford students trapped in their dorm rooms during the pandemic. Teddy Solomon and Ashton Cofer, frustrated by the limitations of existing group chats and the performative nature of mainstream social media, wanted to create something fundamentally different. What started as a solution to connect isolated college students during remote learning has exploded into a cultural phenomenon operating on 240 college campuses and 60 high schools across the United States. The app has raised an impressive 41.5 million dollars in funding, signaling that investors believe this is not just another flash-in-the-pan social experiment, but a genuine paradigm shift in how young people want to connect online.
`;

  try {
    const res = await fetch('http://localhost:3000/api/admin/analyze-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content,
        keyword: 'Gen Z social media trends'
      })
    });
    
    if (!res.ok) {
      console.error("Error from API:", res.status, await res.text());
      return;
    }
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

run();
