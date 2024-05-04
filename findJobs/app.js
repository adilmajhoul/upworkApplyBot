const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const chromium = require('@sparticuz/chromium');

// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import chromium from '@sparticuz/chromium';

puppeteer.use(StealthPlugin());

// TODO: get all the needed selectors
const TABLE_SELECTOR = 'body > font > table:nth-child(5)';
const TABLE_BODY_SELECTOR = 'body > font > table:nth-child(5) > tbody';
const NEXT_PAGE_BUTTON_SELECTOR = 'input[type="submit"][value="Next 10 Records"]';
const SEARCH_BUTTON_SELECTOR = 'body > font > center:nth-child(17) > form > input[type=submit]:nth-child(4)';
const TABLE_SELECTOR_CLOSEST_WRAPER = 'body > font > table:nth-child(5)';
const STATE_DROP_DOWN_SELECTOR = '#state';
const WHICH_STATE_TO_SCRAP = 'NJUS';
const TIMES_TO_RETRY = 1000000;

// async function launchBrowser() {
//   const browser = await puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath(),
//     headless: chromium.headless,
//   });

//   return browser;
// }
module.exports.findJobsHandler = async (event, context) => {
  // const browser = await launchBrowser();

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  //

  const page = await browser.newPage();
  await page.goto('https://www.upwork.com', {
    waitUntil: 'load',
    timeout: 60000,
  });

  const pageTitle = await page.title();
  console.log('🚀 ~ pageTitle:', pageTitle);
  await browser.close();

  // got to upwork
  // login
  // got to jobs search

  // search for variable

  /* if (job not in database){

    links.append(jobUrl)

    add link to db;

    or send messages through queue here
    if links.length() % 10 == 0 then add last 10 links to queue
  }
  else 
  {
    send messages through queue
    stop lambda
  }

  */

  // console.log('🚀  event.body:', event.body);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `${event.body} ---- hillow`,
    }),
  };

  return response;
};
