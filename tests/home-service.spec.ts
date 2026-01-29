import { setupClerkTestingToken } from '@clerk/testing/playwright';
import { test, expect, Page } from '@playwright/test'; // أضف Page هنا

test.describe('Home Service App Integration Tests', () => {

    test.use({ viewport: { width: 1280, height: 720 } });
    test.setTimeout(120000);

    /**
     * تحديد النوع (page: Page) يحل مشكلة الخطأ ts(7006)
     */
    const loginToClerk = async (page: Page) => {
        await setupClerkTestingToken({ page });

        // استخدام domcontentloaded لتجنب تعليق المتصفح كما حدث معك سابقاً
        await page.goto('http://localhost:3000/sign-in', { waitUntil: 'domcontentloaded' });

        const emailInput = page.locator('input[name="identifier"]');
        await emailInput.waitFor({ state: 'visible', timeout: 30000 });
        await emailInput.fill('xxxxx');

        await page.getByRole('button', { name: /continue/i }).first().click();

        const passwordInput = page.locator('input[name="password"]');
        await passwordInput.waitFor({ state: 'visible', timeout: 15000 });
        await passwordInput.fill('xxxx');

        await page.getByRole('button', { name: /continue/i }).first().click();

        await page.waitForURL('http://localhost:3000/', { timeout: 40000 });
    };

    test('should allow user to sign in via Clerk', async ({ page }) => {
        await loginToClerk(page);
        await expect(page).toHaveURL('http://localhost:3000/');
    });

    test('should navigate to Chat page after login', async ({ page }) => {
        await loginToClerk(page);
        const aiLink = page.locator('a[href="/chat"]');
        await expect(aiLink).toBeVisible({ timeout: 10000 });
        await aiLink.click();
        await expect(page).toHaveURL(/\/chat/);
    });

    test('should receive a response from the AI agent', async ({ page }) => {
        await loginToClerk(page);
        await page.goto('http://localhost:3000/chat', { waitUntil: 'domcontentloaded' });

        const inputField = page.getByPlaceholder('Type a message...');
        await expect(inputField).toBeVisible({ timeout: 20000 });

        // Count initial messages (should have welcome message)
        const initialMessageCount = await page.locator('.flex.items-center.gap-4.mb-8').count();

        // 1. كتابة رسالة الاختبار
        await inputField.fill('cleaning');

        // 2. النقر على زر الإرسال باستخدام الاسم الموجود في sr-only
        await page.getByRole('button', { name: /send/i }).click();

        // 3. التحقق من إرسال الرسالة (يجب أن يظهر نص "cleaning" في رسالة المستخدم)
        await expect(page.locator('text=/cleaning/i').first()).toBeVisible({ timeout: 5000 });

        // 4. انتظار ظهور رد الـ AI (عدد الرسائل يجب أن يزيد بمقدار 2: رسالة المستخدم + رد الـ AI)
        await expect(page.locator('.flex.items-center.gap-4.mb-8')).toHaveCount(initialMessageCount + 2, { timeout: 30000 });

        // 5. التحقق من أن آخر رسالة هي من الـ AI وتحتوي على محتوى
        const lastMessage = page.locator('.flex.items-center.gap-4.mb-8').last();
        const aiIcon = lastMessage.locator('svg').first();
        await expect(aiIcon).toBeVisible();

        // 6. التحقق من وجود نص في رد الـ AI
        const aiMessageContent = lastMessage.locator('p.leading-relaxed');
        await expect(aiMessageContent).not.toBeEmpty();
    });
});