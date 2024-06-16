import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as util from './lib/utils.mjs';

puppeteer.use(StealthPlugin());

let MAIL;
let PASS;

let video = 2;

switch (video) {
  case 1:
    MAIL = 'itsAvaLucas';
    PASS = 'instagramBARED1';
    break;

  case 2:
    MAIL = 'adil4zayn@gmail.com';
    PASS = 'adilassiyalove12345';
    break;

  case 3:
    MAIL = 'adildeals1';
    PASS = 'adilassiyalove12345';
    break;

  case 4:
    MAIL = 'itsCharlotteBenjamin';
    PASS = 'instagrambared3';
    break;

  case 5:
    MAIL = 'itsEmmaHenry';
    PASS = 'instagrambared2';
    break;

  default:
    break;
}

async function pause(minSeconds = 3, maxSeconds = 5) {
  const minMilliseconds = minSeconds * 1000;
  const maxMilliseconds = maxSeconds * 1000;

  const waitTime = Math.random() * (maxMilliseconds - minMilliseconds) + minMilliseconds;

  await new Promise((resolve) => setTimeout(resolve, waitTime));
}

export async function main() {
  const proxyURL = 'http://116.203.28.43:80';

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--window-size=1200,700', `--proxy-server=${proxyURL}`],
  });

  const page = await browser.newPage();

  await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle0' });

  // wait user
  await page.waitForSelector('#loginForm > div > div:nth-child(1) > div > label > input', { timeout: 60000 });
  await page.type('#loginForm > div > div:nth-child(1) > div > label > input', MAIL);

  await pause(1, 2);

  // wait pass
  await page.waitForSelector('#loginForm > div > div:nth-child(2) > div > label > input', { timeout: 60000 });
  await page.type('#loginForm > div > div:nth-child(2) > div > label > input', PASS);

  await pause(1, 2);

  //  login button
  await page.waitForSelector('#loginForm > div > div:nth-child(3)');
  await page.click('#loginForm > div > div:nth-child(3)');

  await new Promise((resolve) => setTimeout(resolve, 5000));
  // await pause(5, 7);

  try {
    await page.waitForSelector('div[aria-label="Dismiss"]', { timeout: 5000, visible: true });
    await page.click('div[aria-label="Dismiss"]');
    //   await page.waitForSelector('div[role="button"]', { timeout: 5000 });
    //   // Handle the warning here, for example by clicking an "OK" button
  } catch (error) {
    console.log('Warning did not appear');
  }

  // const warning = await page.$('div[role="button"]');
  // if (warning) {
  //   await page.click('div[role="button"]');
  // } else {
  //   console.log('Warning is not currently displayed');
  // }

  // page.waitForSelector(
  //   '#mount_0_0_S5 > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > section > main > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x7y0ge5.x1n2onr6.x6ikm8r.x10wlt62.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.xl56j7k > div > div > div > div > div.wbloks_1.wbloks_78 > div > div > div:nth-child(2) > div:nth-child(2) > div > div.wbloks_1 > div > span',
  // );
  // page.click(
  //   '#mount_0_0_S5 > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > section > main > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x7y0ge5.x1n2onr6.x6ikm8r.x10wlt62.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.xl56j7k > div > div > div > div > div.wbloks_1.wbloks_78 > div > div > div:nth-child(2) > div:nth-child(2) > div > div.wbloks_1 > div > span',
  // );

  // await pause(1000, 1500);

  // try {
  //   page.waitForSelector('div.wbloks_1 div.wbloks_1 span');
  //   page.click('div.wbloks_1 div.wbloks_1 span');
  // } catch (error) {
  //   console.log('🚀 ~ main ~ error:', error);
  //   await pause(100, 105);
  // }

  await pause();

  // <span data-bloks-name="bk.components.TextSpan" style="color: rgb(255, 255, 255); font-weight: 700; display: inline; font-size: 14px; white-space: pre-wrap; overflow-wrap: break-word;">Dismiss</span>

  // go to profile
  // await page.waitForSelector('a.x1i10hfl');
  // await page.click('a.x1i10hfl');

  // click add media
  await page.waitForSelector('div.x1iyjqo2.xh8yej3 > div:nth-child(7)');
  await page.click('div.x1iyjqo2.xh8yej3 > div:nth-child(7)');

  await pause(0.5, 1.5);

  // --------------------------------------------------------------

  // Wait for the file input element to be available
  await page.waitForSelector('input[type="file"]');

  await pause(0.5, 1.5);

  // Get the file input handle
  const fileInputHandle = await page.$('input[type="file"]');

  await pause(0.5, 1.5);

  // Upload the video file
  await fileInputHandle.uploadFile(`/videos/${video}.mp4`);

  await pause(0.5, 1.5);

  try {
    await page.waitForSelector('button._acan._acap._acaq._acas._acav._aj1-._ap30', {
      timeout: 5000,
      visible: true,
    });
    await page.click('button._acan._acap._acaq._acas._acav._aj1-._ap30');
  } catch (error) {
    console.log('Video posts are now shared as reels __ did not appear');
  }

  await pause(0.5, 1.5);

  // await page.waitForSelector('button._acan._acap');
  // await page.click('button._acan._acap');

  // next
  // await page.waitForSelector('div[role="button"].x1i10hfl.xjqpnuy.xa49m3k', { visible: true });
  await page.click(
    'div[role="button"].x1i10hfl.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.xjyslct.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x9f619.x1ypdohk.x1f6kntn.xwhw2v2.xl56j7k.x17ydfre.x2b8uid.xlyipyv.x87ps6o.x14atkfc.xcdnw81.x1i0vuye.xjbqb8w.xm3z3ea.x1x8b98j.x131883w.x16mih1h.x972fbf.xcfux6l.x1qhh985.xm0m39n.xt0psk2.xt7dq6l.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x1n5bzlp.x173jzuc.x1yc6y37',
  );

  // button._acan._acap _acaq _acas _acav _aj1- _ap30

  await new Promise((resolve) => setTimeout(resolve, 100000));

  // Wait for the video to be processed by Instagram
  // await page.waitForSelector('body > div.x1n2onr6 button.x1n2onr6');

  // Click the "Next" button to continue with the upload process
  // await page.click('body > div.x1n2onr6 button.x1n2onr6');
  // --------------------------------------------------------------

  await new Promise((resolve) => setTimeout(resolve, 100000));

  await page.waitForSelector('div:nth-of-type(2) > button');
  await page.click('div:nth-of-type(2) > button');

  await page.waitForSelector('div._ac7d > div > div');
  await page.click('div._ac7d > div > div');

  await page.waitForSelector('div._ac7d > div > div');
  await page.click('div._ac7d > div > div');

  await page.waitForSelector('div._ac7d > div > div');
  await page.click('div._ac7d > div > div');

  await page.waitForSelector('body > div.x1n2onr6 svg');
  await page.click('body > div.x1n2onr6 svg');

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await browser.close();
}

main();

// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// import * as util from './lib/utils.mjs';

// puppeteer.use(StealthPlugin());

// export async function main() {
//   const browser = await util.launchBrowser_local();
//   const page = await browser.newPage();

// //   go to https://www.instagram.com/
// //   wait till page load

//     // wait for ths: '#loginForm > div > div:nth-of-type(1) input'
//     // type "adilmajhoul" in this: '#loginForm > div > div:nth-of-type(1) input'

//     // wait for this: '#loginForm > div > div:nth-of-type(1) input'
//     // type "instagramskhon1-" in this: '#loginForm > div > div:nth-of-type(1) input'

//     // click this : 'div._ab1y > div:nth-of-type(1) div:nth-of-type(3) div'

//    // wait for this : 'div:nth-of-type(7) span > span'
//    // click for this : 'div:nth-of-type(7) span > span'

//   //  -------------------------------
//     // wait for this : 'body > div.x1n2onr6 button'
//      // click for this : 'body > div.x1n2onr6 button'
//     // this part is for clicking a button to upload a video to ig here is the video name : "I JUST Found Out About This Python Trick! #python #coding #programming.mp4"
//   //  -------------------------------

//    // wait for this : 'div:nth-of-type(2) > button'
//    // click for this : 'div:nth-of-type(2) > button'

//     // wait for this : 'div._ac7d > div > div'
//    // click for this : 'div._ac7d > div > div'

//     // wait for this : 'div._ac7d > div > div'
//    // click for this : 'div._ac7d > div > div'

//     // wait for this : 'div._ac7d > div > div'
//    // click for this : 'div._ac7d > div > div'

//       // wait for this : 'body > div.x1n2onr6 svg'
//    // click for this : 'body > div.x1n2onr6 svg'

//   await new Promise((resolve) => setTimeout(resolve, 2000));

//   await browser.close();
// }
