const { test, expect } = require('@playwright/test');
for (const [name, width, height] of [['phone',390,844],['tablet',768,1024],['desktop',1440,1000]]) {
  test(`${name}: responsive layout and screenshot`, async ({ page }) => {
    await page.setViewportSize({width,height}); await page.goto('/');
    await expect(page.locator('#project-rows tr')).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    if(width < 960) { await page.locator('#menu-toggle').click(); await expect(page.locator('#sidebar')).toBeVisible(); await page.locator('#menu-toggle').click(); await expect(page.locator('#sidebar')).toBeHidden(); }
    await page.screenshot({path:`screenshots/${name}.png`,fullPage:true});
  });
}
test('filters, empty state, modal validation, creation, persistence, theme and loading', async ({page}) => {
  await page.goto('/'); await page.locator('#search').fill('zzzz'); await expect(page.locator('#empty')).toBeVisible();
  await page.locator('#clear-filters').click(); await page.locator('#status-filter').selectOption('completed'); await expect(page.locator('#project-rows tr')).toHaveCount(2);
  await page.locator('#status-filter').selectOption('all'); await page.locator('#sort').selectOption('budget'); await expect(page.locator('#project-rows tr').first()).toContainText('Mobile app launch');
  await page.locator('#new-project').click(); await page.locator('#submit-project').click(); await expect(page.locator('#form-error')).not.toBeEmpty();
  await page.locator('[name=name]').fill('QA project'); await page.locator('[name=owner]').fill('Test Owner'); await page.locator('[name=budget]').fill('200'); await page.locator('[name=due]').fill('2026-12-01'); await page.locator('[name=confirm]').check(); await page.locator('#submit-project').click();
  await expect(page.locator('#project-modal')).not.toBeVisible(); await expect(page.locator('#project-rows tr')).toHaveCount(7); await page.reload(); await expect(page.locator('#project-rows tr')).toHaveCount(7);
  await page.locator('#theme-toggle').click(); await expect(page.locator('html')).toHaveAttribute('data-theme','dark'); await page.screenshot({path:'screenshots/dark-theme.png',fullPage:true});
  await page.locator('#refresh').click(); await expect(page.locator('#refresh')).toBeDisabled(); await expect(page.locator('#loading')).toBeVisible(); await expect(page.locator('#refresh')).toBeEnabled();
  await page.locator('#new-project').click(); await page.screenshot({path:'screenshots/modal.png',fullPage:true}); await page.keyboard.press('Escape'); await expect(page.locator('#project-modal')).not.toBeVisible();
});
