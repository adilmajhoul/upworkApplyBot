// import * as cheerio from 'cheerio';
// import * as fs from 'fs';
// import { promisify } from 'util';
// import readline from 'readline';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';
import url from 'url';

puppeteer.use(StealthPlugin());

// promisify callback functions
// const readFileAsync = promisify(fs.readFile);

async function launchBrowserTest() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/google-chrome-stable',
  });

  return browser;
}

async function launchBrowser() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  return browser;
}
// --------------------------------------------------------------------------------
function getConfig(site) {
  const upwork = {
    email: 'adil33zayn@gmail.com',
    password: 'upworkskhon1-',
    USERNAME_INPUT_SELECTOR: '#login_username',
    PASSWORD_INPUT_SELECTOR: '#login_password',
    CONTUNE_BUTTON_SELECTOR: '#login_password_continue',
    LOGIN_BUTTON_SELECTOR: '#login_control_continue',
    ACCEPT_ALL_COOKIES_BUTTON_SELECTOR: '#onetrust-accept-btn-handler',
    LOGIN_URL: 'https://www.upwork.com/ab/account-security/login',
    SEARCHBAR_INPUT_SELECTOR:
      '#navSearchForm-desktop > div.nav-search-input-container > input.nav-search-autosuggest-input',
    SEARCHBAR_BUTTON_SELECTOR:
      '#navSearchForm-desktop > div.nav-search-input-container > div > button.nav-btn-icon.nav-search-btn > span > svg',
    CLICK_TO_SEARCH_BUTTON: '#nav-right > ul > li.air3-search > div > button > span > svg > path',
    SEARCH_QUERY: 'web scraping',
    COMPLETE_PROFILE_MODAL_SELECTOR:
      'body > div.air3-fullscreen-element > div > div.air3-fullscreen-container.is-scrolled-bottom > div > div.profile-completeness-modal-container.d-flex',
    COMPLETE_PROFILE_MODAL_EXIT_BUTTON_SELECTOR:
      'body > div.air3-fullscreen-element > div > div.air3-fullscreen-container.is-scrolled-bottom > div > div.profile-completeness-modal-container.d-flex > div.air3-modal-content.profile-completeness-right-side > div.air3-modal-body > button > div > svg',
    JOBS_PER_PAGE_DROPDOWN_BUTTON_SELECTOR:
      '#main > div.container > div:nth-child(4) > div > div.air3-grid-container.jobs-grid-container > div.span-12.span-lg-9 > div.air3-card-section.d-lg-flex.justify-space-between > div.d-none.d-lg-block > div > div > div > span',
    JOBS_PER_PAGE_DROPDOWN_50_OPTION_SELECTOR: '#dropdown-menu > li:nth-child(3) > span > span',
    TIMES_TO_RETRY: 1000,
    WAIT_BEFORE_RETRY_AGAIN: 10,
  };

  switch (site) {
    case 'upwork':
      return upwork;
      break;

    default:
      return site ? 'invalid argument' : 'no argument passed';
      break;
  }
}
// --------------------------------------------------------------------------------
class PageProcessor {
  constructor(page, site) {
    this.page = page;
    this.configs = getConfig(site);
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
        await this.page.reload({ waitUntil: 'load', timeout: 60000 }); // Reload the page with a timeout of 60 seconds
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

  // TODO:
  async login() {
    await this.retry(
      async () => {
        await this.page.goto(this.configs.LOGIN_URL, {
          waitUntil: 'load',
        });
      },
      this.configs.TIMES_TO_RETRY,
      this.configs.WAIT_BEFORE_RETRY_AGAIN,
    );

    // let acceptCookiesElement = await this.page.$(ACCEPT_ALL_COOKIES_BUTTON_SELECTOR);
    // if (acceptCookiesElement) {
    //   await pageProcessor.clickSelector(ACCEPT_ALL_COOKIES_BUTTON_SELECTOR);
    // }

    // wait for next button and usename input
    await this.retry(
      async () => {
        await this.page.waitForSelector(this.configs.USERNAME_INPUT_SELECTOR);
        await this.page.waitForSelector(this.configs.CONTUNE_BUTTON_SELECTOR);

        await this.page.type(this.configs.USERNAME_INPUT_SELECTOR, this.configs.email);

        await this.page.click(this.configs.CONTUNE_BUTTON_SELECTOR);
      },
      this.configs.TIMES_TO_RETRY,
      this.configs.WAIT_BEFORE_RETRY_AGAIN,
    );

    // type password and click login
    await this.retry(
      async () => {
        await this.page.waitForSelector(this.configs.PASSWORD_INPUT_SELECTOR);
        await this.page.waitForSelector(this.configs.LOGIN_BUTTON_SELECTOR);

        await this.page.type(this.configs.PASSWORD_INPUT_SELECTOR, this.configs.password);

        await this.page.click(this.configs.LOGIN_BUTTON_SELECTOR);
      },
      this.configs.TIMES_TO_RETRY,
      this.configs.WAIT_BEFORE_RETRY_AGAIN,
    );
  }
}

// -----------------------------------------------------------------------------

/*
enum Site {
  UPWORK = 'upwork',
}
type ExpertiseLevel = '1' | '2' | '3';
type JobDuration = 'hour' | 'day' | 'week' | 'month' | 'more than a month';
type Location = 'United States' | 'Canada' | 'Mexico';
type JobsPerPage = 10 | 20 | 50 | 100;
type SortBy = 'recency' | 'relevance';
*/
class JobFilters {
  // https://www.upwork.com/nx/search/jobs/?contractor_tier=1,2&duration_v3=week&location=United%20States&per_page=50&q=web%20data%20scraping&sort=recency

  constructor(site) {
    if (site === 'upwork') {
      this.BASE_URL = 'https://www.upwork.com/';

      this.RESULT_PAGE_BASE_URL = 'https://www.upwork.com/nx/search/jobs/';

      this.EXPERTISE_LEVEL_QUERYPARAM = 'contractor_tier';
      this.JOB_DURATION_QUERYPARAM = 'duration_v3';
      this.LOCATION = 'location';
      this.JOBS_PER_PAGE = 'per_page';
      this.SEARCH_QUERY = 'q';
      this.SORT_JOBS_BASED_ON = 'sort';
    }
  }

  buildURL(queryParams) {
    const queriesList = {};

    for (let param in queryParams) {
      if (queryParams[param]) {
        queriesList[param] = queryParams[param];
      }
    }

    return url.format({
      pathname: this.RESULT_PAGE_BASE_URL,
      query: queriesList,
    });
  }
}

export { PageProcessor, launchBrowserTest, launchBrowser, JobFilters };
