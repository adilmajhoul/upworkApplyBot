import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

import * as util from './lib/utils.mjs';

const JOBS_SECTION_SELECTOR = 'section.card-list-container';
const SINGLE_JOB_CARD_SELECTOR = 'article';

puppeteer.use(StealthPlugin());

export async function main() {
  const browser = await util.launchBrowser_local();
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
}
