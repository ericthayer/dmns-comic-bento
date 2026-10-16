import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('engine fallback: readable pages, floors, Still Panels, filters',async({page,browserName})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toContainText('Denver Museum');
  await page.locator('nav[aria-label="Primary"] a[href="/halls/"]').click();await page.waitForURL('**/halls/');
  await page.getByRole('tab',{name:'Floor 3'}).click();
  await expect(page.locator('#floor-3')).toBeVisible();
  await page.locator('#floor3-prehistoric-journey .panel__link').click();await page.waitForURL('**/halls/prehistoric-journey/');
  await expect(page.locator('h1')).toContainText('Prehistoric Journey');
  await page.getByRole('button',{name:'Still panels'}).click();await expect(page.locator('html')).toHaveAttribute('data-motion','none');
  const axe=await new AxeBuilder({page}).analyze();
  expect(axe.violations.map(v=>v.id),browserName).toEqual([]);
  expect(errors).toEqual([]);
});
