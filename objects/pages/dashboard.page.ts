import { Locator } from "@playwright/test";
import BasePage from "./base.page";

class DashboardPage extends BasePage {

    //LOCATOR PATHS
    private readonly popupSuccessMessageLocator: string = `div#root li div div:nth-child(2)`;
    private bookHeader(bookName: string): string {
        return `//h3[text() = '${bookName}']`;
    }

    // ELEMENT LOCATORS

    private readonly dashboardTitle: Locator = this.page.locator('//h1');
    private readonly loginPageTitle: Locator = this.page.locator(`//h3[normalize-space()='Automation Tutorials']`);
    private readonly addBookButton: Locator = this.page.locator(`//button/span[text() = 'Add a Book']`);
    private readonly addPersonButton: Locator = this.page.locator(`//button/span[text() = 'Add Person']`);
    private readonly enterNameField: Locator = this.page.locator(`//input[@placeholder='Enter person name']`);
    private readonly addPersonCreateButton: Locator = this.page.locator(`//div[@role="dialog"]//button[contains(@class, 'bg-primary')]`);
    private readonly managePeople: Locator = this.page.locator(`//button/span[text() = 'Manage People']`);
    private readonly createButton: Locator = this.page.locator(`//button[text() = 'Create']`);
    private readonly errorMessage: Locator = this.page.locator(this.popupSuccessMessageLocator);
    private readonly popupMessageLocator: Locator = this.page.locator("[data-radix-collection-item] .grid > div:nth-child(2)");
    private readonly authorInput: Locator = this.page.locator(`//input[@placeholder = 'Enter author name']`);
    private readonly titleInput: Locator = this.page.locator(`//input[@placeholder = 'Enter book title']`);
    private readonly peopleListItems: Locator = this.page.locator("//div[contains(@class,'space-y-2') and contains(@class,'mt-4')]//div[contains(@class,'p-3')]");
    private readonly signOutButton: Locator = this.page.locator("//button[normalize-space()='Sign Out']");
    private readonly dialogCloseButton: Locator = this.page.locator('[role="dialog"]').getByRole('button', { name: 'Close' });
    private readonly myLibraryHeading: Locator = this.page.locator("//h2[normalize-space()='My Library']");
    private readonly filterCombobox: Locator = this.page.getByRole("combobox").first();
    private readonly personSelectInDialog: Locator = this.page.locator('[role="dialog"]').getByRole("combobox");

    //WAITS
    async waitForBookHeader(bookName: string): Promise<void> {
        await this.waits.waitForLoad(this.page, this.bookHeader(bookName));
    }

    async waitForSuccessPopup(): Promise<void> {
        await this.waits.waitForLoad(this.page, this.popupSuccessMessageLocator);
    }

    async waitForBookCard(title: string): Promise<void> {
        await this.page.locator('h3').filter({ hasText: title }).first().waitFor({ state: 'visible', timeout: 10000 });
    }

    //METHODS

    async getDashboardTitle(): Promise<string | null> {
        return await this.dashboardTitle.textContent();
    }

    async getLoginPageTitle(): Promise<string | null> {
        return await this.loginPageTitle.textContent();
    }

    async clickAddBook(): Promise<void> {
        await this.addBookButton.click();
    }

    async clickAddPerson(): Promise<void> {
        await this.addPersonButton.click();
    }

    async clickManagePerson(): Promise<void> {
        await this.managePeople.click();
    }

    async clickCreate(): Promise<void> {
        await this.createButton.click();
    }

    async clickSignOut(): Promise<void> {
        await this.signOutButton.click();
    }

    async getErrorMessage(): Promise<string> {
        return await this.errorMessage.first().innerText();
    }

    async getPopupMessageText(): Promise<string | null> {
        const text = await this.popupMessageLocator.textContent();
        return text ? text.trim() : null;
    }

    async isPopupVisible(): Promise<boolean> {
        return this.popupMessageLocator.isVisible();
    }

    async fillAuthor(author: string): Promise<void> {
        await this.authorInput.fill(author);
    }

    async fillTitle(title: string): Promise<string> {
        await this.titleInput.fill(title);
        console.log(`My book name is: ${title}`);
        return title;
    }

    async addPerson(name: string): Promise<void> {
        await this.clickAddPerson();
        await this.enterNameField.fill(name);
        await this.addPersonCreateButton.click();
        await this.popupMessageLocator.waitFor({ state: 'visible', timeout: 5000 });
    }

    async addBook(author: string, title: string): Promise<void> {
        await this.clickAddBook();
        await this.fillAuthor(author);
        await this.fillTitle(title);
        await this.clickCreate();
        await this.waitForBookCard(title);
    }

    async addBookWithPerson(author: string, title: string, personName: string): Promise<void> {
        await this.clickAddBook();
        await this.selectPersonInBookDialog(personName);
        await this.fillAuthor(author);
        await this.fillTitle(title);
        await this.clickCreate();
        await this.waitForBookCard(title);
    }

    async getBookByTitle(title: string): Promise<Locator> {
        return this.page.locator(`//h3[contains(text(), '${title.split(' ')[0]}')]`);
    }

    getBookTitleLocator(title: string): Locator {
        return this.page.locator('h3').filter({ hasText: title });
    }

    async isPersonInList(name: string): Promise<boolean> {
        await this.peopleListItems.locator(`text="${name}"`).waitFor({ state: 'visible', timeout: 5000 });
        return true;
    }

    async waitForElementToAppear(locator: Locator, timeout: number = 5000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async closeDialog(): Promise<void> {
        await this.dialogCloseButton.click();
        await this.page.locator('[role="dialog"]').waitFor({ state: 'detached', timeout: 5000 });
    }

    async selectPersonInBookDialog(personName: string): Promise<void> {
        await this.personSelectInDialog.click();
        await this.page.getByRole("option", { name: personName }).click();
    }

    async filterByPerson(personName: string): Promise<void> {
        await this.filterCombobox.click();
        await this.page.getByRole("option", { name: personName }).click();
    }

    async resetFilter(): Promise<void> {
        await this.filterCombobox.click();
        await this.page.getByRole("option", { name: /all people/i }).click();
    }

    // VISIBILITY HELPERS

    async isAddBookButtonVisible(): Promise<boolean> {
        return this.addBookButton.isVisible();
    }

    async isAddPersonButtonVisible(): Promise<boolean> {
        return this.addPersonButton.isVisible();
    }

    async isManagePeopleButtonVisible(): Promise<boolean> {
        return this.managePeople.isVisible();
    }

    async isSignOutButtonVisible(): Promise<boolean> {
        return this.signOutButton.isVisible();
    }

    async isAuthorInputVisible(): Promise<boolean> {
        return this.authorInput.isVisible();
    }

    async isTitleInputVisible(): Promise<boolean> {
        return this.titleInput.isVisible();
    }

    async isCreateButtonVisible(): Promise<boolean> {
        return this.createButton.isVisible();
    }

    async isPersonNameInputVisible(): Promise<boolean> {
        return this.enterNameField.isVisible();
    }

    async isPersonCreateButtonVisible(): Promise<boolean> {
        return this.addPersonCreateButton.isVisible();
    }

    async getPeopleListCount(): Promise<number> {
        return this.peopleListItems.count();
    }

    async isMyLibraryHeadingVisible(): Promise<boolean> {
        return this.myLibraryHeading.isVisible();
    }

    async isUserEmailDisplayed(email: string): Promise<boolean> {
        return this.page.getByText(email, { exact: true }).first().isVisible();
    }

    async isFilterComboboxVisible(): Promise<boolean> {
        return this.filterCombobox.isVisible();
    }

    async isPersonDropdownInBookDialogVisible(): Promise<boolean> {
        return this.personSelectInDialog.isVisible();
    }

    async isBookTitleOnCard(title: string): Promise<boolean> {
        return this.page.locator('h3').filter({ hasText: title }).first().isVisible();
    }

    async isBookAuthorOnCard(author: string): Promise<boolean> {
        return this.page.locator('h3').filter({ hasText: author }).first().isVisible();
    }
}
export default DashboardPage;
