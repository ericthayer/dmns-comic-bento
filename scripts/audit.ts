import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { startServer } from './server.js';
const preview=await startServer(0);
const chrome=await launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
const scores=[];
await mkdir('docs/audits',{recursive:true});
try {
 for(const [name,path] of [['cover','/'],['halls','/halls/'],['prehistoric-journey','/halls/prehistoric-journey/']] as const) {
  const result=await lighthouse(preview.url+path,{port:chrome.port,output:'html',onlyCategories:['performance','accessibility','best-practices','seo'],formFactor:'mobile',screenEmulation:{mobile:true,width:412,height:823,deviceScaleFactor:1.75,disabled:false},throttlingMethod:'simulate',throttling:{rttMs:150,throughputKbps:1638.4,cpuSlowdownMultiplier:4,requestLatencyMs:562.5,downloadThroughputKbps:1474.56,uploadThroughputKbps:675},maxWaitForLoad:45000});
  if(!result) throw new Error('Lighthouse returned no result');
  await writeFile(`docs/audits/${name}.html`,String(result.report));
  await writeFile(`work/lighthouse-${name}.json`,JSON.stringify(result.lhr,null,2));
  const score={route:path,performance:Math.round((result.lhr.categories.performance?.score??0)*100),accessibility:Math.round((result.lhr.categories.accessibility?.score??0)*100),bestPractices:Math.round((result.lhr.categories['best-practices']?.score??0)*100),seo:Math.round((result.lhr.categories.seo?.score??0)*100),lcpMs:result.lhr.audits['largest-contentful-paint']?.numericValue??0,cls:result.lhr.audits['cumulative-layout-shift']?.numericValue??0,tbtMs:result.lhr.audits['total-blocking-time']?.numericValue??0};
  scores.push(score);console.log(score);
 }
 await writeFile('docs/audits/scores.json',JSON.stringify(scores,null,2));
 if(scores.some(s=>s.performance<95||s.accessibility<100||s.bestPractices<100||s.seo<100||s.lcpMs>2500||s.cls>.05)) process.exitCode=1;
} finally {await chrome.kill();await preview.close();}
