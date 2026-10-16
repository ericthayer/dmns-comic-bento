import { chromium, type Locator, type Page } from '@playwright/test';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { startServer } from './server.js';
const preview=await startServer(0);
const browser=await chromium.launch();
await mkdir('work/recording',{recursive:true});
const context=await browser.newContext({viewport:{width:1440,height:960},colorScheme:'light',recordVideo:{dir:'work/recording',size:{width:1440,height:960}}});
const page=await context.newPage();
const wait=(ms:number):Promise<void>=>new Promise(resolve=>setTimeout(resolve,ms));
async function tabTo(target:Locator,page:Page):Promise<void>{for(let i=0;i<120;i++){if(await target.evaluate(e=>e===document.activeElement))return;await page.keyboard.press('Tab');}throw new Error('Target is unreachable using Tab');}
async function enter(target:Locator,page:Page):Promise<void>{await tabTo(target,page);await page.keyboard.press('Enter');}
const started=Date.now();
try {
 await page.goto(preview.url);await page.waitForLoadState('networkidle');await wait(5000);
 await page.screenshot({path:'../cover-desktop.png'});
 await enter(page.getByRole('button',{name:'Look closer'}).first(),page);await wait(4500);
 await page.keyboard.press('Escape');await wait(3500);
 await enter(page.locator('#way-halls .panel__link'),page);await page.waitForURL('**/halls/');await wait(4500);
 await tabTo(page.getByRole('tab',{name:'Floor 1'}),page);await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await page.keyboard.press('Enter');await wait(4500);
 await page.screenshot({path:'../halls-desktop.png'});
 await enter(page.locator('#floor3-prehistoric-journey .panel__link'),page);await page.waitForURL('**/halls/prehistoric-journey/');await wait(5000);
 await page.screenshot({path:'../prehistoric-journey-desktop.png'});
 await enter(page.locator('.next-pages a[href="/halls/egyptian-mummies/"]'),page);await page.waitForURL('**/halls/egyptian-mummies/');await wait(5000);
 await page.goBack();await page.waitForURL('**/halls/prehistoric-journey/');await wait(3000);
 await enter(page.getByRole('link',{name:'Back to all halls'}),page);await page.waitForURL('**/halls/');await wait(4000);
 await enter(page.locator('nav[aria-label="Primary"] a[href="/theaters/"]'),page);await page.waitForURL('**/theaters/');
 // Leave the completed keyboard route visible until the recording reaches 60 seconds.
 await wait(Math.max(0,60000-(Date.now()-started)));
 const video=page.video();await context.close();
 if(video) await copyFile(await video.path(),'../keyboard-walkthrough.webm');
 await writeFile('../keyboard-walkthrough.txt','60-second keyboard walkthrough, 2026-10-16. Cover → Look closer → Escape → Halls → Floor 3 → Prehistoric Journey → Egyptian Mummies → browser Back → all Halls → Theaters. Navigation and controls are keyboard-activated; screenshots use the same build. No audio.\n');
 console.log('Saved ../keyboard-walkthrough.webm');
} finally {await browser.close();await preview.close();}
