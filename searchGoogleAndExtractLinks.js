const { chromium } = require('playwright');

module.exports = async function searchGoogleAndExtractLinks(
  query,
  maxPages = 10
) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const resultLinks = [];

  for (let pageIdx = 0; pageIdx < maxPages; pageIdx++) {
    console.log('Parsing page:', pageIdx);

    const url = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}&start=${pageIdx}`;
    await page.goto(url);

    const searchResults = await page.$$('a[ping]');

    console.log('Links found:', searchResults.length);

    for (const result of searchResults) {
      const href = await result.getAttribute('href');
      if (href) {
        resultLinks.push(href);
      }
    }
  }

  await browser.close();
  return resultLinks;
};
