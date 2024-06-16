// import puppeteer from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function scrapeData() {
  // free proxy server URL
  const proxyURL = 'http://221.140.235.237:5002';

  // launch a browser instance with the
  // --proxy-server flag enabled
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/google-chrome-stable',
    args: [`--proxy-server=${proxyURL}`],
  });
  // open a new page in the current browser context
  const page = await browser.newPage();

  // visit the target page
  await page.goto('https://httpbin.org/ip');

  // extract the IP the request comes from
  // and print it
  const body = await page.waitForSelector('body');
  const ip = await body.getProperty('textContent');
  console.log(await ip.jsonValue());

  await browser.close();
}

scrapeData();
