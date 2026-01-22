import Waits from "@objects/helpers/waits";
import { APIRequestContext, Page } from "@playwright/test";

class BasePage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Helper classes
    waits = new Waits();
} export default BasePage;