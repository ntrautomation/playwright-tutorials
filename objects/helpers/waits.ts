import { Page } from "@playwright/test";
class Waits {
    async waitForLoad(page: Page, selector: string): Promise<void> {
        await page.waitForSelector(selector, {timeout : 5000});
    }
} export default Waits;