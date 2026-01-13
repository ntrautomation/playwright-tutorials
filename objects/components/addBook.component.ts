import BasePage from "@objects/pages/base.page";
import { Locator } from "@playwright/test";

class AddBookComponent extends BasePage {

    private readonly addBookDialog: Locator = this.page.locator ("//div[@role='dialog']")
    private readonly addBookDialogHeader: Locator = this.addBookDialog.locator(`//h2[text()='Add New Book']`);
    private readonly personDropdown: Locator = this.addBookDialog.locator(`//label[text()='Person']/following-sibling::button`);
    private readonly createButton: Locator = this.addBookDialog.locator(`//button[text()='Create']`);
    private readonly closeButton: Locator = this.addBookDialog.locator(`//button[.//span[text()='Close']]`);
    private readonly personOption = (name: string): Locator =>
        this.page.locator(
            `//div[@role='option' and normalize-space()='${name}']`
        );

    private readonly blabla = (type: string): Locator => this.addBookDialog.locator(`//label[normalize-space()='${type}']/following-sibling::input`);

    get dialogHeader(): Locator {
        return this.addBookDialogHeader;
    }

    async enterAuthorName (authorName: string, type: string): Promise<void> {
        await this.blabla(type).fill(authorName);
    }
    async enterBookTitle (bookTitle: string, type: string): Promise<void> {
        await this.blabla(type).fill(bookTitle);
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