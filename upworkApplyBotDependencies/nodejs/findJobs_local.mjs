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

const JOBS_SECTION_SELECTOR = 'section.card-list-container';
const SINGLE_JOB_CARD_SELECTOR = 'article';
const JOB_POSTING_TIME_SELECTOR = 'div > small > span:nth-child(2)';

const TIMES_TO_RETRY = 1000;
const WAIT_BEFORE_RETRY_AGAIN = 10;
const BASE_URL = 'https://www.upwork.com';
const JOB_LINK_SELECTOR = 'a.up-n-link';

puppeteer.use(StealthPlugin());

async function main() {
  //TODO:
  function siteConfig() {
    // if (even.site === upwork) {
    // set selectors
    // set urls
    // set everything based on the site
    // set query param based on the even (this function will work based on single at a time query param)
    // {config: {site: 'upwork', queryparams: {country: us, resultePerPgae: 50, etc ...}}}
    // }
  }

  const browser = await util.launchBrowser_local();
  const page = await browser.newPage();

  const pageProcessor = new util.PageProcessor(page, 'upwork');
  const dynamo = new util.Dynamo();

  await pageProcessor.login();

  // ------- check if you are actually logged in using ui clues or browser storage !! -----------

  await new Promise((resolve) => setTimeout(resolve, 2000));

  async function goToJobsListings(pageNumber) {
    // https://www.upwork.com/nx/search/jobs/?nbs=1&per_page=50&q=web%20scraping&sort=recency
    const queyParams = {
      nbs: 1,
      q: 'web scraping',
      duration_v3: 'week',
      per_page: '50',
      sort: 'recency',
    };

    pageNumber ? (queyParams['page'] = pageNumber) : '';

    const jobFilters = new util.JobFilters('upwork');
    const jobsUrl = jobFilters.buildURL(queyParams);

    console.log('🚀 ~ jobsUrl:', jobsUrl);

    await pageProcessor.retry(
      async () => {
        await page.goto(jobsUrl, {
          waitUntil: 'load',
        });
      },
      TIMES_TO_RETRY,
      WAIT_BEFORE_RETRY_AGAIN,
    );
  }

  await goToJobsListings();
  await new Promise((resolve) => setTimeout(resolve, 10000));

  let link;
  let currentPageNumber = 2;
  async function processJobs(element, arrayLength, iteration) {
    link = element.find(JOB_LINK_SELECTOR).attr('href');
    const jobTitle = element.find(JOB_LINK_SELECTOR).text();
    const rawPostingTime = element.find(JOB_POSTING_TIME_SELECTOR).text().trim();

    // const numericPostingTime =
    // pageProcessor.getCurrentTimeInMinutes() - pageProcessor.convertTimeAgoToValideDate(rawPostingTime);

    const numericPostingTime = util.getCurrentTimeInMinutes() - util.convertTimeAgoToValideDate(rawPostingTime);

    const postingTimeFilter = 480;
    // check if offer is about scraping
    // check if offer in db

    // if (fakeDB.includes(link)) {
    //   return;
    // }

    console.log({
      jobTitle,
      rawPostingTime,
      numericPostingTime,
      postingTimeFilter,
      rawPostingTime,
      link: 'upwork.com' + link,
    });
    480;
    // if (numericPostingTime <= postingTimeFilter) {
    //   // console.log({ jobTitle, rawPostingTime, link });

    //   const dynamoStatues = await dynamo.insertItem(link, 'upworkJobsLinks');
    //   console.log('🚀 dynamoStatues:', dynamoStatues);
    // } else {
    //   return 'break';
    // }

    // check amount of proposal limit
    // send hob through sqs queue

    if (iteration === arrayLength && numericPostingTime <= postingTimeFilter) {
      await goToJobsListings(currentPageNumber);

      currentPageNumber++;
    }
  }

  let sectionHtml = await pageProcessor.getElementHtmlBySelector_(JOBS_SECTION_SELECTOR);
  await pageProcessor.processAllMatchingSelector(SINGLE_JOB_CARD_SELECTOR, sectionHtml, processJobs);

  await new Promise((resolve) => setTimeout(resolve, 20000));

  // -----------------------------------------------------------------------------
  const pageTitle = await page.title();
  console.log('🚀 ~ pageTitle:', pageTitle);
  await browser.close();

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
