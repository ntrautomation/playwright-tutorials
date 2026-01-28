import { de } from "@faker-js/faker";
import { Page } from "@playwright/test";

class Waits {
    async waitForLoad(page: Page, selector: string){
        await page.waitForSelector(selector, { timeout: 10000 });
    }
}export default Waits;