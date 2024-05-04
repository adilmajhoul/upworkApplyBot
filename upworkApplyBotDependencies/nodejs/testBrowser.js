const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const chromium = require('@sparticuz/chromium');

// import puppeteer from 'puppeteer';
// import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

// async function launchBrowser() {
//   const browser = await puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath(),
//     headless: chromium.headless,
//   });

//   return browser;
// }

(async function main() {
  // const browser = await launchBrowser();

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  //

  const page = await browser.newPage();
  await page.goto('https://books.toscrape.com/', {
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
})();
