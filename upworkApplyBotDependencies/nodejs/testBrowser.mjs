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
  '#navSearchForm-desktop > div.nav-search-input-container > input.nav-search-autosuggest-input.is-open';

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

  // ------------------------------------------------------------------------------------

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
