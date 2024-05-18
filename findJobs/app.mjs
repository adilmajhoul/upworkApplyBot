import * as util from './lib/utils.mjs';

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';

puppeteer.use(StealthPlugin());

const JOBS_SECTION_SELECTOR = 'section.card-list-container';
const SINGLE_JOB_CARD_SELECTOR = 'article';

import AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();

export const findJobsHandler = async (event, context) => {
  console.log(`Your cron function "${context.functionName}" ran at ${new Date()}`);

  const browser = await util.launchBrowser();
  const page = await browser.newPage();
  const pageProcessor = new util.PageProcessor(page, 'upwork');

  await pageProcessor.login();

  // ------- check if you are actually logged in using ui clues or browser storage !! -----------

  await new Promise((resolve) => setTimeout(resolve, 2000));

  let currentPageNumber = 1;
  while (true) {
    console.log('*************************************************************');
    console.log({ currentPageNumber });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await pageProcessor.goToJobsListings(currentPageNumber);

    const sectionHtml = await pageProcessor.getElementHtmlBySelector_(JOBS_SECTION_SELECTOR);
    let extractionStatus = await pageProcessor.processAllMatchingSelector(
      SINGLE_JOB_CARD_SELECTOR,
      sectionHtml,
      pageProcessor.processJobs,
    );

    console.log('🚀 ~ main ~ extractionStatus:', extractionStatus);

    if (extractionStatus === 'go_next_page') {
      currentPageNumber++;

      continue;
    } else if (extractionStatus === 'break') {
      break;
    }
  }

  await browser.close();

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `${event.body} ---- hillow`,
    }),
  };

  return response;
};
