const { chromium } = require('playwright');

module.exports = async function scrapeEmails(links) {
  console.log(links);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  const emails = [];

  for (const link of links) {
    try {
      await page.goto(link);
      const pageContent = await page.content();
      const extractedEmails = pageContent.match(emailRegex);

      if (extractedEmails) {
        extractedEmails.forEach((email) => {
          if (!emails.includes(email)) {
            emails.push(email);
          }
        });
      }
    } catch (error) {
      console.error('Error openning link:', error.message);
    }
  }

  await browser.close();
  return emails;
};
