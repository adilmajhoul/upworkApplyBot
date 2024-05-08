import * as util from './lib/utils.mjs';

const JOBS_SECTION_SELECTOR = 'section.card-list-container';
const SINGLE_JOB_CARD_SELECTOR = 'article';
const JOB_POSTING_TIME_SELECTOR = 'div > small > span:nth-child(2)';

const TIMES_TO_RETRY = 1000;
const WAIT_BEFORE_RETRY_AGAIN = 10;
const BASE_URL = 'https://www.upwork.com';
const JOB_LINK_SELECTOR = 'a.up-n-link';

export const submitProposalHandler = async (event, context) => {
  const link = event.link;

  const browser = await util.launchBrowser();
  const page = await browser.newPage();

  const pageProcessor = new util.PageProcessor(page, 'upwork');

  await pageProcessor.retry(
    async () => {
      await page.goto(BASE_URL + link, {
        waitUntil: 'load',
      });
    },
    TIMES_TO_RETRY,
    WAIT_BEFORE_RETRY_AGAIN,
  );

  const pageTitle = await page.title();
  console.log('🚀 ~ pageTitle:', pageTitle);
  await browser.close();

  // create browser
  // navigate to link | or link sumission page
  // copy template
  // send it

  // if failed add link to dead queue

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: event.body,
  //   }),
  // };

  // return response;
};
