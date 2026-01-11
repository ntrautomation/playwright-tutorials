import BasePage from "@objects/pages/base.page";
import { Locator } from "@playwright/test";

class ManagePeopleComponent extends BasePage {
     
    private readonly dialogHeader: Locator = this.page.locator(
        `//h2[normalize-space()='Manage People']`
    );

    // All person name elements
    private readonly personNames: Locator = this.page.locator(
        `//div[@role='dialog']//span[contains(@class,'font-medium')]`
    );

    // Dynamic locator for a specific person name
    private readonly personByName = (name: string): Locator =>
        this.page.locator(
            `//div[@role='dialog']//span[contains(@class,'font-medium') and normalize-space()='${name}']`
        );

    // Delete button for a specific person
    private readonly deletePersonButton = (name: string): Locator =>
        this.page.locator(
            `//span[normalize-space()='${name}']/ancestor::div[contains(@class,'flex')]//button`
        );

        // Method returning if a specific person is in the list
        async isPersonPresent(name: string): Promise<boolean> {
            return await this.personByName(name).isVisible();
        }

        // Method to delete a specific person from the list
        async deletePerson (name: string): Promise<void>{
            await this.deletePersonButton(name).click();
            await this.personByName(name).waitFor({ state: 'detached' });

        }
}
export default ManagePeopleComponent;