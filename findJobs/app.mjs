import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import chromium from "@sparticuz/chromium";

puppeteer.use(StealthPlugin());

async function launchBrowser() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  return browser;
}
export const findJobsHandler = async (event, context) => {
  const browser = await launchBrowser();

  const page = await browser.newPage();
  await page.goto("https://books.toscrape.com", {
    waitUntil: "load",
    timeout: 60000,
  });

  const pageTitle = await page.title();
  console.log("🚀 ~ findJobsHandler ~ pageTitle:", pageTitle);
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

  console.log("🚀  event.body:", event.body);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `${event.body} ---- ${pageTitle}`,
    }),
  };

  return response;
};
