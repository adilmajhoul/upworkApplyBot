import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';

import * as util from './lib/utils.mjs';

const email = 'adil33zayn@gmail.com';
const password = 'upworkskhon1-';
const USERNAME_INPUT_SELECTOR = '#login_username';
const PASSWORD_INPUT_SELECTOR = '#login_password';
const CONTUNE_BUTTON_SELECTOR = '#login_password_continue';
const LOGIN_BUTTON_SELECTOR = '#login_control_continue';
const ACCEPT_ALL_COOKIES_BUTTON_SELECTOR = '#onetrust-accept-btn-handler';
const LOGIN_URL = 'https://www.upwork.com/ab/account-security/login';
const SEARCHBAR_INPUT_SELECTOR =
  '#navSearchForm-desktop > div.nav-search-input-container > input.nav-search-autosuggest-input';
const SEARCHBAR_BUTTON_SELECTOR =
  '#navSearchForm-desktop > div.nav-search-input-container > div > button.nav-btn-icon.nav-search-btn > span > svg';

const CLICK_TO_SEARCH_BUTTON = '#nav-right > ul > li.air3-search > div > button > span > svg > path';

const SEARCH_QUERY = 'web scraping';

const COMPLETE_PROFILE_MODAL_SELECTOR =
  'body > div.air3-fullscreen-element > div > div.air3-fullscreen-container.is-scrolled-bottom > div > div.profile-completeness-modal-container.d-flex';
const COMPLETE_PROFILE_MODAL_EXIT_BUTTON_SELECTOR =
  'body > div.air3-fullscreen-element > div > div.air3-fullscreen-container.is-scrolled-bottom > div > div.profile-completeness-modal-container.d-flex > div.air3-modal-content.profile-completeness-right-side > div.air3-modal-body > button > div > svg';

const JOBS_PER_PAGE_DROPDOWN_BUTTON_SELECTOR =
  '#main > div.container > div:nth-child(4) > div > div.air3-grid-container.jobs-grid-container > div.span-12.span-lg-9 > div.air3-card-section.d-lg-flex.justify-space-between > div.d-none.d-lg-block > div > div > div > span';
const JOBS_PER_PAGE_DROPDOWN_50_OPTION_SELECTOR = '#dropdown-menu > li:nth-child(3) > span > span';

const TIMES_TO_RETRY = 1000;
const WAIT_BEFORE_RETRY_AGAIN = 10;

puppeteer.use(StealthPlugin());

async function main() {
  const browser = await util.launchBrowserTest();
  const page = await browser.newPage();

  const queyParams = {
    SEARCH_QUERY: '',
    EXPERTISE_LEVEL_QUERYPARAM: '',
    JOB_DURATION_QUERYPARAM: '',
    LOCATION: '',
    JOBS_PER_PAGE: '',
    SORT_JOBS_BASED_ON: '',
  };

  const pageProcessor = new util.PageProcessor(page, 'upwork');

  await pageProcessor.login();

  // remove the 'Complete your profile'
  // await pageProcessor.retry(
  //   async () => {
  //     await page.waitForSelector(COMPLETE_PROFILE_MODAL_SELECTOR);

  //     await page.click(COMPLETE_PROFILE_MODAL_EXIT_BUTTON_SELECTOR);
  //   },
  //   TIMES_TO_RETRY,
  //   WAIT_BEFORE_RETRY_AGAIN,
  // );

  // search some jobs
  await pageProcessor.retry(
    async () => {
      await page.waitForSelector(CLICK_TO_SEARCH_BUTTON);
      await page.click(CLICK_TO_SEARCH_BUTTON);

      await page.waitForSelector(SEARCHBAR_INPUT_SELECTOR);
      await page.type(SEARCHBAR_INPUT_SELECTOR, SEARCH_QUERY);

      // await page.click(SEARCHBAR_BUTTON_SELECTOR);

      await page.keyboard.press('Enter');
    },
    TIMES_TO_RETRY,
    WAIT_BEFORE_RETRY_AGAIN,
  );

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // scroll to bottom
  await pageProcessor.retry(
    async () => {
      await page.keyboard.press('End');
    },
    TIMES_TO_RETRY,
    WAIT_BEFORE_RETRY_AGAIN,
  );

  // await new Promise((resolve) => setTimeout(resolve, 5000));

  // make it 50 jobs per page
  // await pageProcessor.retry(
  // async () => {
  // await page.waitForSelector(JOBS_PER_PAGE_DROPDOWN_BUTTON_SELECTOR);

  // await page.click(JOBS_PER_PAGE_DROPDOWN_BUTTON_SELECTOR);

  // await page.waitForSelector(JOBS_PER_PAGE_DROPDOWN_50_OPTION_SELECTOR);

  // await page.click(JOBS_PER_PAGE_DROPDOWN_50_OPTION_SELECTOR);
  // },
  // TIMES_TO_RETRY,
  // WAIT_BEFORE_RETRY_AGAIN,
  // );

  // await pageProcessor.retry(
  //   async () => {
  //     await page.waitForSelector(JOBS_PER_PAGE_DROPDOWN_50_OPTION_SELECTOR);

  //     await page.click(JOBS_PER_PAGE_DROPDOWN_50_OPTION_SELECTOR);
  //   },
  //   TIMES_TO_RETRY,
  //   WAIT_BEFORE_RETRY_AGAIN,
  // );

  const pageTitle = await page.title();
  console.log('🚀 ~ pageTitle:', pageTitle);

  // await browser.close();

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
}

main().catch(console.error);
