const yargs = require('yargs');
const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

const searchGoogleAndExtractLinks = require('./searchGoogleAndExtractLinks');
const scrapeEmails = require('./scrapeEmails');

async function main(query = '', maxPages = 10) {
  if (!query) {
    return console.error('An error occurred: no query specified');
  }

  try {
    const resultLinks = await searchGoogleAndExtractLinks(query, maxPages);
    await writeFileAsync(
      'artifacts/result_link.json',
      JSON.stringify(resultLinks)
    );
    console.log('Results saved to result_link.json');

    const emails = await scrapeEmails(resultLinks);
    await writeFileAsync('artifacts/emails.json', JSON.stringify(emails));
    console.log('Results saved to emails.json');
    const formattedJson = JSON.stringify(emails, null, 2);
    console.log(formattedJson);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

yargs
  .command(
    'search',
    'Print a greeting message',
    (yargs) => {},
    (argv) => {
      main(argv.query, argv.maxPages);
    }
  )
  .option('query', {
    alias: 'q',
    describe: 'Specify search query',
    type: 'string'
  })
  .option('maxPages', {
    alias: 'p',
    describe: 'How many pages do you want to scrape',
    type: 'string'
  })
  .help()
  .alias('help', 'h').argv;
