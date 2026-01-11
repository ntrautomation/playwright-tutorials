import BasePage from "@objects/pages/base.page";
import { Locator } from "@playwright/test";

class AddPersonComponent extends BasePage {

    private readonly addPersonDialog: Locator = this.page.locator ("//div[@role='dialog']")
    private readonly addPersonDialogHeader: Locator = this.addPersonDialog.locator(`//h2[text()='Add New Person']]`);
    private readonly personInput: Locator = this.addPersonDialog.getByPlaceholder('Enter person name');
    private readonly addPersonButton: Locator = this.addPersonDialog.locator(`//button[text()='Add Person']`);
    private readonly closeButton: Locator = this.addPersonDialog.locator(`//button[.//span[text()='Close']]`);
  
        
    get dialogHeader(): Locator {
        return this.addPersonDialogHeader;
    }

    async enterPersonName (personName: string): Promise<void> {
        await this.personInput.fill(personName);
    }
    async addPerson () : Promise<void> {
        await this.addPersonButton.click();
    }
    async closeDialog () : Promise<void> {
        await this.closeButton.click();
    }

}
export default AddPersonComponent;