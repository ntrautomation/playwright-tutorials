import BasePage from "@objects/pages/base.page";
import { Locator } from "@playwright/test";

class AddBookComponent extends BasePage {

    private readonly addBookDialog: Locator = this.page.locator ("//div[@role='dialog']")
    private readonly addBookDialogHeader: Locator = this.addBookDialog.locator(`//h2[text()='Add New Book']`);
    private readonly personDropdown: Locator = this.addBookDialog.locator(`//label[text()='Person']/following-sibling::button`);
    private readonly authorInput: Locator = this.addBookDialog.locator(`//label[normalize-space()='Author *']/following-sibling::input`);
    private readonly titleInput: Locator = this.addBookDialog.locator(`//label[normalize-space()='Title *']/following-sibling::input`);
    private readonly createButton: Locator = this.addBookDialog.locator(`//button[text()='Create']`);
    private readonly closeButton: Locator = this.addBookDialog.locator(`//button[.//span[text()='Close']]`);
    private readonly personOption = (name: string): Locator =>
        this.page.locator(
            `//div[@role='option' and normalize-space()='${name}']`
        );

    get dialogHeader(): Locator {
        return this.addBookDialogHeader;
    }

    async enterAuthorName (authorName: string): Promise<void> {
        await this.authorInput.fill(authorName);
    }
    async enterBookTitle (bookTitle: string): Promise<void> {
        await this.titleInput.fill(bookTitle);
    }
    async createBookRecord () : Promise<void> {
        await this.createButton.click();
    }
    async closeDialog () : Promise<void> {
        await this.closeButton.click();
    }

    async personOptionDropdwon () : Promise<void> {
        await this.personDropdown.click();
    }

    async selectPerson(name: string): Promise<void> {
        await this.personDropdown.click();
    
        const option = this.personOption(name);
    
        await option.click();
    }
}
export default AddBookComponent;