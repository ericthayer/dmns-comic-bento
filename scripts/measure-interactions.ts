import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import { startServer } from './server.js';
interface TimedWindow extends Window { __eventTimings?: number[] }
const preview=await startServer(0);
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:412,height:823},colorScheme:'light'});
await context.addInitScript(()=>{
  const timings:number[]=[];
  (window as TimedWindow).__eventTimings=timings;
  const options: PerformanceObserverInit & {durationThreshold:number} = {type:'event',buffered:true,durationThreshold:16};
  new PerformanceObserver(list=>{
    for(const entry of list.getEntries()) if('interactionId' in entry && Number(entry.interactionId)>0) timings.push(entry.duration);
  }).observe(options);
});
const page=await context.newPage();const cdp=await context.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
const values:number[]=[];
const collect=async():Promise<void>=>{await page.waitForTimeout(300);values.push(...await page.evaluate(()=>(window as TimedWindow).__eventTimings??[]));};
try {
 await page.goto(preview.url);await page.getByRole('button',{name:'Look closer'}).click();await page.waitForTimeout(700);await page.keyboard.press('Escape');await page.waitForTimeout(600);
 await page.getByRole('button',{name:'Still panels'}).click();await collect();
 await page.goto(preview.url+'/halls/');
 for(const floor of ['Floor 3','Floor 2','Outdoor','Floor 1']) {await page.getByRole('tab',{name:floor,exact:true}).click();await page.waitForTimeout(400);}
 await collect();
 await page.goto(preview.url+'/special-exhibitions/');
 for(const filter of ['Upcoming','Now open','All']) {await page.getByRole('button',{name:filter,exact:true}).click();await page.waitForTimeout(700);}
 await collect();
 const result={date:'2026-10-16',browser:browser.version(),cpuSlowdown:4,viewport:{width:412,height:823},samples:values.length,maxEventDurationMs:Math.max(0,...values),thresholdMs:200,passed:Math.max(0,...values)<=200,note:'Laboratory Event Timing samples from trusted keyboard/pointer interactions. Not field INP. Events below the 16ms observer threshold are omitted.'};
 await writeFile('docs/audits/interactions.json',JSON.stringify(result,null,2));console.log(result);
 if(!result.passed) process.exitCode=1;
} finally {await browser.close();await preview.close();}
