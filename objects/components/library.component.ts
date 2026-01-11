import BasePage from "@objects/pages/base.page";
import { Locator } from "@playwright/test";

class LibraryComponent extends BasePage {

    private readonly peopleFilter: Locator = this.page.locator(
        `//button[@role='combobox' and .//span[text()='All People']]`
    );

    private readonly addPersonButton: Locator = this.page.locator(
        `//button[.//span[text()='Add Person']]`
    );

    private readonly managePeopleButton: Locator = this.page.locator(
        `//button[.//span[text()='Manage People']]`
    );

    private readonly addBookButton: Locator = this.page.locator(
        `//button[.//span[text()='Add a Book']]`
    );

    private readonly taskCards: Locator = this.page.locator(`//div[contains(@class,'space-y-2')]/div[contains(@class,'rounded-lg border')]`);

        async openPeopleFilter(): Promise<void> {
            await this.peopleFilter.click();
        }
    
        async clickAddPerson(): Promise<void> {
            await this.addPersonButton.click();
        }
    
        async clickManagePeople(): Promise<void> {
            await this.managePeopleButton.click();
        }
    
        async clickAddBook(): Promise<void> {
            await this.addBookButton.click();
        }
    
}

export default LibraryComponent;