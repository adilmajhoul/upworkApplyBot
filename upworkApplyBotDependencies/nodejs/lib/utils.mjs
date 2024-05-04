// import * as cheerio from 'cheerio';
// import * as fs from 'fs';
// import { promisify } from 'util';
// import readline from 'readline';

import puppeteer from 'puppeteer-extra';
import chromium from '@sparticuz/chromium';

// promisify callback functions
// const readFileAsync = promisify(fs.readFile);

async function launchBrowser() {
  // const browser = await puppeteer.launch({
  //   args: chromium.args,
  //   defaultViewport: chromium.defaultViewport,
  //   executablePath: await chromium.executablePath(),
  //   headless: chromium.headless,
  // });
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1300, // set this to a value slightly less than 1366
      height: 700, // set this to a value slightly less than 768
      deviceScaleFactor: 1,
    },
    headless: false,
    executablePath: '/usr/bin/google-chrome-stable',
  });

  return browser;
}

class PageProcessor {
  constructor(page) {
    this.page = page;
  }

  async waitForSelector(selector) {
    await this.page.waitForSelector(selector);
  }

  async clickSelector(selector) {
    await this.page.click(selector);
  }

  createCheerioObject(html) {
    return cheerio.load(html);
  }

  async getCurrentPageHtml() {
    const html = await this.page.content();
    return html;
  }
  async getCurrentPageBody() {
    const bodyHtml = await this.page.evaluate(() => document.querySelector('body').innerHTML);
    return bodyHtml;
  }

  async getElementHtmlBySelector2(selector) {
    const element = await this.page.$(selector);
    return element;
  }

  async getElementHtmlBySelector(selector) {
    const element = await this.page.evaluate((selector) => document.querySelector(selector).innerHTML, selector);
    return element;
  }
  async clickNext() {
    await this.waitForSelector(NEXT_PAGE_BUTTON_SELECTOR);
    await this.clickSelector(NEXT_PAGE_BUTTON_SELECTOR);
  }

  async clickSearch() {
    await this.page.waitForSelector(SEARCH_BUTTON_SELECTOR);
    await this.page.click(SEARCH_BUTTON_SELECTOR);
  }

  async processAllMatchingSelector(selector, html, processEachElementCallback) {
    const $ = createCheerioObject(html);
    const elementsArray = $(selector).toArray();

    elementsArray.forEach((element) => {
      processEachElementCallback(element);
    });
  }

  async getAllMatchingSelector(selector, html) {
    const $ = this.createCheerioObject(html);

    const elementsArray = $(selector).toArray();

    return elementsArray;
  }

  getTableRow(row) {
    const usdot_number = row.eq(0).text().trim();
    const prefix = row.eq(1).text().trim();
    const docket_number = row.eq(2).text().trim();
    const legal_name = row.eq(3).text().trim();
    const dba_name = row.eq(4).text().trim();
    const city = row.eq(5).text().trim();
    const state = row.eq(6).text().trim();

    const company = {
      usdot_number,
      prefix,
      docket_number,
      legal_name,
      dba_name,
      city,
      state,
    };

    return company;
  }

  async getPageTableData(html) {
    const $ = this.createCheerioObject(html);

    const pageTableData = [];

    $('tbody tr').each((i, element) => {
      if (i === 0) return; // skip the header row

      const row = $(element).find('td');

      const company = this.getTableRow(row);

      // Check if USDOT_Number is valid before adding to pageTableData
      if (company.usdot_number.match(/^\d+$/) || company.docket_number.match(/^\d+$/)) {
        pageTableData.push(company);
      }
    });

    return pageTableData;
  }

  async countLinesOfFile(filePath) {
    try {
      const data = await readFileAsync(filePath, 'utf8');

      const lines = data.split('\n');

      return lines.length;
    } catch (err) {
      console.error(`Error reading file ${filePath} | Error: ${err.message}`);
    }
  }

  async getLastLine(file) {
    let lastLine;

    const stream = fs.createReadStream(file);
    const rl = readline.createInterface({ input: stream });

    for await (const line of rl) {
      lastLine = line;
    }

    return parseInt(lastLine);
  }

  async writeScrapedPagesToFile(page, file) {
    const appendFileAsync = promisify(fs.appendFile);

    // check if lines length >= 6 remove first 3 lines
    if ((await this.countLinesOfFile(file)) >= 6) {
      // remove first 3 lines
      await this.removeFirstThreeLines(file);
    }

    try {
      await appendFileAsync(file, page + '\n', 'utf8');
    } catch (err) {
      console.error(`The page ${page} failed to be appended to ${file}: ${err.message}`);
    }
  }

  async removeFirstThreeLines(file) {
    const writeFileAsync = promisify(fs.writeFile);

    try {
      const data = await readFileAsync(file, 'utf8');

      const lines = data.split('\n');

      lines.splice(0, 3); // Remove the first 3 lines

      const updatedContent = lines.join('\n');

      await writeFileAsync(file, updatedContent, 'utf8');
    } catch (err) {
      console.error(`Error processing ${file} | Error: ${err.message}`);
    }
  }

  // crazy thing now im building a retryReload for the retry
  async retryReload(page, howManyRetry, waitBeforeRetryAgain) {
    for (let i = 0; i < howManyRetry; i++) {
      try {
        await page.reload({ waitUntil: 'load', timeout: 60000 }); // Reload the page with a timeout of 60 seconds
        return;
      } catch (error) {
        console.error(
          `Error: ${error.message}. Reloading page and retrying in ${waitBeforeRetryAgain} seconds...`,
        );
        await new Promise((resolve) => setTimeout(resolve, waitBeforeRetryAgain));
      }
    }
    throw new Error(`Failed to reload page after ${howManyRetry} attempts`);
  }

  async retry(asyncFunc, howManyRetry, waitBeforeRetryAgain) {
    for (let i = 0; i < howManyRetry; i++) {
      try {
        return await asyncFunc();
      } catch (error) {
        console.error(
          `Error: ${error.message}. Reloading page and retrying in ${waitBeforeRetryAgain} seconds...`,
        );
        // await this.page.reload({ waitUntil: 'load' }); // Reload the page
        await this.retryReload(this.page, 200, 10);

        await new Promise((resolve) => setTimeout(resolve, waitBeforeRetryAgain));
      }
    }
    throw new Error(`Failed after ${howManyRetry} attempts`);
  }
}

export { PageProcessor, launchBrowser };
