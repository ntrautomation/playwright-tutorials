import BasePage from "@objects/pages/base.page";
import { Locator } from "@playwright/test";

class BookRowComponent extends BasePage {


    private taskTitle = (titleText: string): Locator =>
        this.page.locator(`//h3[contains(., '${titleText}')]`);

    private taskCheckbox = (titleText: string): Locator =>
        this.page.locator(`//h3[contains(., '${titleText}')]/ancestor::div[contains(@class,'flex-1')]/preceding-sibling::button[@role='checkbox']`);

    private taskEditButton = (titleText: string): Locator =>
        this.page.locator(`//h3[contains(., '${titleText}')]/ancestor::div[contains(@class,'flex-1')]/following-sibling::div//button[.//svg[contains(@class,'lucide-pencil')]]`);
    private taskDeleteButton = (titleText: string): Locator =>
        this.page.locator(
             `//h3[contains(., '${titleText}')]
             /ancestor::div[contains(@class,'rounded-lg')]
             //button[2]`
          );
    
    private taskCompleted = (author: string, title: string): Locator =>
        this.page.locator(`h3:has-text("${author} - ${title}")`)
            .locator('xpath=following-sibling::div//span[starts-with(normalize-space(text()), "Completed:")]');

            async isTaskCompleted(author: string, title: string): Promise<boolean> {
                const completedLocator = this.taskCompleted(author, title);
                try {
                    await completedLocator.waitFor({ state: 'visible', timeout: 5000 });
                    return true;
                } catch {
                    return false;
                }
            }

    async toggleTaskCheckbox(title: string): Promise<void> {
        const checkbox = this.taskCheckbox(title);
        await checkbox.click();
   }

    async getTaskTitle(title: string): Promise<string> {
        return await this.taskTitle(title).innerText();
    }

    async editTask(title: string): Promise<void> {
        await this.taskEditButton(title).click();
    }

    async deleteTask(title: string): Promise<void> {
        const deleteButton = this.taskDeleteButton(title);
        //await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
        await deleteButton.click();
    }

}

export default BookRowComponent;