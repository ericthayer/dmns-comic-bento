import { test, expect, type Page, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loadContent } from '../../src/lib/content.js';
const content = await loadContent();
async function tabTo(page:Page,target:Locator):Promise<void>{
  for(let i=0;i<120;i++) {
    if(await target.evaluate(element=>element===document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error('Target is unreachable using Tab');
}
test('all 26 routes have complete HTML, working navigation, and no axe violations', async ({browser,baseURL})=>{
  test.setTimeout(180_000);
  const noScript=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:800},colorScheme:'light'});
  const staticPage=await noScript.newPage();
  for(const route of content.positions) {
    expect((await staticPage.goto(baseURL+route.path))?.status()).toBe(200);
    await expect(staticPage.locator('h1')).toHaveCount(1);
    await expect(staticPage.locator('dmns-page')).not.toHaveAttribute('data-enhanced','true');
  }
  await noScript.close();
  for(const javaScriptEnabled of [true,false]) {
    const context=await browser.newContext({javaScriptEnabled:true,viewport:{width:360,height:800},reducedMotion:'reduce',colorScheme:'light'});
    if (!javaScriptEnabled) await context.route('**/assets/js/**',route=>route.fulfill({status:200,contentType:'text/javascript',body:''}));
    const page=await context.newPage();
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    for(const position of content.positions) {
      const response=await page.goto(baseURL+position.path);
      expect(response?.status(),position.path).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('main#main')).toBeVisible();
      const strip=await page.locator('dmns-info-strip').boundingBox();
      expect(strip&&strip.y+strip.height,position.path).toBeLessThan(230);
      await expect(page.locator('header .ticket-button')).toBeVisible();
      await expect(page.locator('.info-notice')).toContainText('Oct. 27–29');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),position.path).toBe(true);
      const results=await new AxeBuilder({page}).analyze();
      if (!javaScriptEnabled) await expect(page.locator('dmns-page')).not.toHaveAttribute('data-enhanced','true');
      expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),`${position.path} JS:${javaScriptEnabled}`).toEqual([]);
    }
    expect(errors).toEqual([]);
    await context.close();
  }
});
test('keyboard walkthrough: lean in, Escape, floors, hall, next hall, Back',async({page})=>{
  await page.goto('/');
  // Tab traverses the actual focus order. Arrow keys navigate the roving floor tabs.
  const closer=page.getByRole('button',{name:'Look closer'}).first();
  const originalWidth=await page.locator('#mythic-strip').evaluate(e=>e.clientWidth);
  await tabTo(page,closer); await page.keyboard.press('Enter');
  await expect(closer).toHaveAttribute('aria-expanded','true');
  await expect.poll(async()=>page.locator('#mythic-strip').evaluate(e=>e.clientWidth)).toBeGreaterThan(originalWidth+40);
  await expect(page.locator('#mythic-strip-title')).toBeFocused();
  const headingTop=await page.locator('#mythic-strip-title').evaluate(e=>e.getBoundingClientRect().top);
  const chromeBottom=await page.locator('dmns-info-strip').evaluate(e=>e.getBoundingClientRect().bottom);
  expect(headingTop).toBeGreaterThanOrEqual(chromeBottom);
  await page.keyboard.press('Escape');
  await expect(closer).toHaveAttribute('aria-expanded','false');
  await expect(closer).toBeFocused();
  await expect.poll(async()=>page.locator('#mythic-strip').evaluate(e=>e.clientWidth)).toBeLessThan(originalWidth+2);
  const halls=page.locator('#way-halls .panel__link');
  await tabTo(page,halls);await page.keyboard.press('Enter');await page.waitForURL('**/halls/');
  await expect(page.locator('html')).toHaveAttribute('data-camera','zoom-in');
  const tab=page.getByRole('tab',{name:'Floor 3'});
  await tabTo(page,page.getByRole('tab',{name:'Floor 1'}));
  await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowRight');await page.keyboard.press('Enter');
  await expect(tab).toHaveAttribute('aria-selected','true');
  await expect(page.locator('#floor-spread-3-heading')).toBeFocused();
  const prehistoric=page.locator('#floor3-prehistoric-journey .panel__link');
  await tabTo(page,prehistoric);await page.keyboard.press('Enter');await page.waitForURL('**/halls/prehistoric-journey/');
  await expect(page.locator('html')).toHaveAttribute('data-camera','zoom-in');
  const next=page.locator('.next-pages a[href="/halls/egyptian-mummies/"]');
  await tabTo(page,next);await page.keyboard.press('Enter');await page.waitForURL('**/halls/egyptian-mummies/');
  await expect(page.locator('html')).toHaveAttribute('data-camera','turn-next');
  await expect(page.locator('dmns-specimen')).toHaveCount(0);
  await expect(page.locator('dmns-balloon,dmns-sfx')).toHaveCount(0);
  await page.goBack();await page.waitForURL('**/halls/prehistoric-journey/');
  const back=page.getByRole('link',{name:'Back to all halls'});await tabTo(page,back);await page.keyboard.press('Enter');await page.waitForURL('**/halls/');
  await expect(page.locator('html')).toHaveAttribute('data-camera','zoom-out');
  await expect(page.locator('dmns-floor-tabs')).toHaveAttribute('data-selected-floor','3');
});
test('native cross-document transition snapshots preserve chrome and share panel/title',async({page})=>{
  await page.goto('/halls/');await page.getByRole('tab',{name:'Floor 3'}).click();
  await page.addInitScript(()=>{
    window.addEventListener('pagereveal',()=>requestAnimationFrame(()=>{
      document.documentElement.dataset.observedHero=String([...document.querySelectorAll<HTMLElement>('[style]')].some(e=>e.style.viewTransitionName==='hero-panel'));
    }));
  });
  await page.locator('#floor3-prehistoric-journey .panel__link').click();
  await page.waitForURL('**/halls/prehistoric-journey/');
  await expect(page.locator('html')).toHaveAttribute('data-observed-hero','true');
  expect(await page.locator('header').evaluate(e=>getComputedStyle(e).viewTransitionName)).toBe('masthead');
  expect(await page.locator('dmns-info-strip').evaluate(e=>getComputedStyle(e).viewTransitionName)).toBe('info-strip');
  await page.waitForFunction(()=>document.documentElement.dataset.transitionActive!=='true');
  expect(await page.locator('#splash').evaluate(e=>getComputedStyle(e).viewTransitionName)).toBe('none');
  const theater=page.locator('nav[aria-label="Primary"] a[href="/theaters/"]');await theater.click();await page.waitForURL('**/theaters/');
  // Depth has precedence when a detail page goes to another issue index.
  await expect(page.locator('html')).toHaveAttribute('data-camera','zoom-out');
  await page.goto('/halls/');await page.locator('nav[aria-label="Primary"] a[href="/theaters/"]').click();await page.waitForURL('**/theaters/');
  await expect(page.locator('html')).toHaveAttribute('data-camera','new-issue');
});
test('Still Panels persists and reduced motion has no moving animation properties',async({page})=>{
  const moving=()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').flatMap(a=>a.effect instanceof KeyframeEffect?a.effect.getKeyframes():[]).filter(k=>'transform'in k||'clipPath'in k||'strokeDashoffset'in k));
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await page.locator('#spread-02').scrollIntoViewIfNeeded();await page.waitForTimeout(150);
  expect(await moving()).toEqual([]);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.getByRole('button',{name:'Still panels'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion','none');
  expect(await moving()).toEqual([]);
  await page.locator('nav[aria-label="Primary"] a[href="/halls/"]').click();await page.waitForURL('**/halls/');
  await expect(page.locator('html')).toHaveAttribute('data-motion','none');
  await expect(page.getByRole('button',{name:'Still panels'})).toHaveAttribute('aria-pressed','true');
  expect(await moving()).toEqual([]);
});
test('filters, beats, closure, traveler uniqueness and concept form',async({page})=>{
  await page.goto('/special-exhibitions/');await page.getByRole('button',{name:'Upcoming',exact:true}).click();
  await expect(page.locator('dmns-panel[data-category="upcoming"]:visible')).toHaveCount(2);
  await expect(page.locator('dmns-panel[data-category="open"]:visible')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Upcoming',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.goto('/');
  const strip=page.locator('dmns-beat-strip');await strip.scrollIntoViewIfNeeded();
  await strip.getByRole('button',{name:'Replay'}).click();await expect(strip).toHaveAttribute('data-playing','true');
  await expect(strip.locator('dmns-beat:visible')).toHaveCount(1);
  await expect(strip).not.toHaveAttribute('data-playing','true',{timeout:5000});
  await expect(strip.locator('dmns-beat:visible')).toHaveCount(1);
  expect(await page.locator('dmns-specimen').evaluateAll(elements=>elements.filter(e=>getComputedStyle(e).viewTransitionName==='specimen').length)).toBeLessThanOrEqual(1);
  expect(await page.locator('dmns-panel[data-live]').count()).toBeLessThanOrEqual(6);
  await page.locator('#newsletter-email').fill('visitor@example.com');await page.getByRole('button',{name:'Try signup'}).click();
  await expect(page.locator('.newsletter-message')).toContainText('Nothing was sent or stored');
  await page.goto('/halls/gems-and-minerals/');await expect(page.locator('.continuation')).toContainText('To be continued');
  await expect(page.locator('h1')).toHaveAccessibleName('Gems and Minerals');
});
test('Back restores the exact originating panel when destinations repeat',async({page})=>{
  await page.addInitScript(()=>{
    window.addEventListener('pagereveal',()=>requestAnimationFrame(()=>{
      const panel=[...document.querySelectorAll<HTMLElement>('dmns-panel')].find(e=>e.style.viewTransitionName==='hero-panel');
      if(panel) document.documentElement.dataset.observedPanel=panel.id;
    }));
  });
  await page.goto('/');
  await page.locator('#way-halls .panel__link').click();await page.waitForURL('**/halls/');
  await expect(page.locator('html')).toHaveAttribute('data-observed-panel','splash');
  await page.waitForFunction(()=>document.documentElement.dataset.transitionActive!=='true');
  await page.goBack();await page.waitForURL(url=>url.pathname==='/');
  await expect(page.locator('html')).toHaveAttribute('data-observed-panel','way-halls');
  await page.goto('/halls/');await page.getByRole('tab',{name:'Floor 3'}).click();
  await page.locator('#floor3-wildlife-halls .panel__link').click();await page.waitForURL('**/halls/wildlife-halls/');
  await expect(page.locator('html')).toHaveAttribute('data-observed-panel','splash');
  await page.waitForFunction(()=>document.documentElement.dataset.transitionActive!=='true');
  await page.goBack();await page.waitForURL('**/halls/');
  await expect(page.locator('html')).toHaveAttribute('data-observed-panel','floor3-wildlife-halls');
  await expect(page.locator('dmns-floor-tabs')).toHaveAttribute('data-selected-floor','3');
});
