const urls = ['http://localhost:3000', 'http://localhost:3000/articles/geopolitics', 'http://localhost:3000/trackers/us-economy'];
Promise.all(urls.map(url => 
  fetch(url).then(r => r.text()).then(t => { 
    const matches = [...t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]; 
    return { url, jsonld: matches.map(m => {
      try {
        return JSON.parse(m[1]);
      } catch (e) {
        return m[1]; // unparsable JSON
      }
    }) }; 
  })
)).then(r => console.log(JSON.stringify(r, null, 2))).catch(console.error);
