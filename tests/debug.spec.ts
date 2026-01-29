import { test, expect } from '@playwright/test';

test('debug home page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    console.log('--- Home Page Content ---');
    // Log presence of AI Assistant
    const btn = page.locator('a[href="/chat"]');
    console.log('AI Button count:', await btn.count());
    console.log('AI Button visible:', await btn.isVisible());
    if (await btn.count() > 0) {
        console.log('AI Button HTML:', await btn.innerHTML());
    }
});

test('debug sign-in page', async ({ page }) => {
    await page.goto('http://localhost:3000/sign-in');
    console.log('--- Sign In Page Content ---');
    // Log inputs
    const inputs = page.locator('input');
    console.log('Input count:', await inputs.count());
    for (let i = 0; i < await inputs.count(); i++) {
        console.log(`Input ${i}:`, await inputs.nth(i).getAttribute('name'), await inputs.nth(i).getAttribute('type'), await inputs.nth(i).getAttribute('placeholder'));
    }
});
