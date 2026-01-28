import Waits from "@objects/helpers/waits";
import { APIRequestContext, Page } from "@playwright/test";

class BasePage {
    page: Page;
    apiRequestContext: APIRequestContext;

    constructor(page: Page, apiRequestContext?: APIRequestContext) {
        this.page = page;
        this.apiRequestContext = apiRequestContext;
    }

    //HELERS
    waits = new Waits();
} export default BasePage;