import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';

import * as util from './lib/utils.mjs';

// TODO: get all the needed selectors
// credential
const email = 'adil33zayn@gmail.com';
const password = 'upworkskhon1-';
// AUTH
const USERNAME_INPUT_SELECTOR = '#login_username';
const PASSWORD_INPUT_SELECTOR = '#login_password';
const CONTUNE_BUTTON_SELECTOR = '#login_password_continue';
const LOGIN_BUTTON_SELECTOR = '#login_control_continue';
const ACCEPT_ALL_COOKIES_BUTTON_SELECTOR = '#onetrust-accept-btn-handler';
const LOGIN_URL = 'https://www.upwork.com/ab/account-security/login';
const SEARCHBAR_INPUT_SELECTOR =
  '#navSearchForm-desktop > div.nav-search-input-container > input.nav-search-autosuggest-input';
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

async function login() {}

(async function main() {
  const browser = await util.launchBrowser();
  const page = await browser.newPage();
  const pageProcessor = new util.PageProcessor(page);

  await pageProcessor.retry(
    async () => {
      await page.goto(LOGIN_URL, {
        waitUntil: 'load',
      });
    },
    TIMES_TO_RETRY,
    WAIT_BEFORE_RETRY_AGAIN,
  );

  // let acceptCookiesElement = await page.$(ACCEPT_ALL_COOKIES_BUTTON_SELECTOR);
  // if (acceptCookiesElement) {
  //   await pageProcessor.clickSelector(ACCEPT_ALL_COOKIES_BUTTON_SELECTOR);
  // }

  // wait for next button and usename input
  await pageProcessor.retry(
    async () => {
      await page.waitForSelector(USERNAME_INPUT_SELECTOR);
      await page.waitForSelector(CONTUNE_BUTTON_SELECTOR);

      await page.type(USERNAME_INPUT_SELECTOR, email);

      await pageProcessor.clickSelector(CONTUNE_BUTTON_SELECTOR);
    },
    TIMES_TO_RETRY,
    WAIT_BEFORE_RETRY_AGAIN,
  );

  // type password and click login
  await pageProcessor.retry(
    async () => {
      await page.waitForSelector(PASSWORD_INPUT_SELECTOR);
      await page.waitForSelector(LOGIN_BUTTON_SELECTOR);

      await page.type(PASSWORD_INPUT_SELECTOR, password);

      await pageProcessor.clickSelector(LOGIN_BUTTON_SELECTOR);
    },
    TIMES_TO_RETRY,
    WAIT_BEFORE_RETRY_AGAIN,
  );

  // remove the 'Complete your profile'
  await pageProcessor.retry(
    async () => {
      await page.waitForSelector(COMPLETE_PROFILE_MODAL_SELECTOR);

      await pageProcessor.clickSelector(COMPLETE_PROFILE_MODAL_EXIT_BUTTON_SELECTOR);
    },
    TIMES_TO_RETRY,
    WAIT_BEFORE_RETRY_AGAIN,
  );

  // search some jobs
  await pageProcessor.retry(
    async () => {
      await page.waitForSelector(SEARCHBAR_INPUT_SELECTOR);

      await page.type(SEARCHBAR_INPUT_SELECTOR, SEARCH_QUERY);
    },
    TIMES_TO_RETRY,
    WAIT_BEFORE_RETRY_AGAIN,
  );

  // // scroll to bottom
  // await pageProcessor.retry(
  //   async () => {
  //     await page.keyboard.press('End');
  //   },
  //   TIMES_TO_RETRY,
  //   WAIT_BEFORE_RETRY_AGAIN,
  // );

  // make it 50 jobs per page
  // await pageProcessor.retry(
  //   async () => {
  //     await page.waitForSelector(JOBS_PER_PAGE_DROPDOWN_BUTTON_SELECTOR);

  //     await page.clickSelector(JOBS_PER_PAGE_DROPDOWN_BUTTON_SELECTOR);

  //     await page.waitForSelector(JOBS_PER_PAGE_DROPDOWN_50_OPTION_SELECTOR);

  //     await page.clickSelector(JOBS_PER_PAGE_DROPDOWN_50_OPTION_SELECTOR);
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

  // console.log('🚀  event.body:', event.body);
})();
