const content = `The iPhone 18 Pro release date is expected to fall in early September 2026, with Wednesday, September 9 emerging as the leading date reported for Apple's next major iPhone event. Apple has not officially confirmed the date, so September 9 should be treated as an expectation rather than a confirmed launch. This timing fits a pattern that has existed for a long time: the company has repeatedly used September to introduce its flagship iPhones, followed by pre-orders and retail availability later in the month.`;
const keywords = ["iPhone 18 Pro release date", "iPhone 18 Pro September 2026", "iPhone 18 Pro launch date", "Apple September event 2026", "iPhone 18 Pro supply chain", "Apple iPhone launch schedule"];

fetch('http://localhost:3000/api/admin/analyze-keywords', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ content, keywords })
}).then(r => r.json()).then(data => {
  console.log(JSON.stringify(data, null, 2));
}).catch(console.error);
