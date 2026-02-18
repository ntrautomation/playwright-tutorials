import Waits from "@objects/helpers/waits";
import { APIRequestContext, Page } from "@playwright/test";

class BasePage {
	page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	//HELERS
	waits = new Waits();

	async navigate(url?: string): Promise<void> {
		const target = url ?? process.env.BASE_URL;
		if (!target) throw new Error("BASE_URL is not defined");
		await this.page.goto(target);
	}
}
export default BasePage;
