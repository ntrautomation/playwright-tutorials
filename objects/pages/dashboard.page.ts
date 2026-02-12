import { Locator } from "@playwright/test";
import BasePage from "./base.page";

class DashboardPage extends BasePage {
  //LOCATOR PATHS
  private readonly popupSuccessMessageLocator: string = `div#root li div div:nth-child(2)`;
  private bookHeader(bookName: string): string {
    return `//h3[text() = '${bookName}']`;
  }

  // ELEMENT LOCATORS

  private readonly dashboardTitle: Locator = this.page.locator("//h1");
  private readonly loginPageTitle: Locator = this.page.locator(
    `//h3[normalize-space()='Automation Tutorials']`
  );
  private readonly addBookButton: Locator = this.page.locator(
    `//button/span[text() = 'Add a Book']`
  );
  private readonly addPersonButton: Locator = this.page.locator(
    `//button/span[text() = 'Add Person']`
  );
  private readonly enterNameField: Locator = this.page.locator(
    `//input[@placeholder='Enter person name']`
  );
  private readonly addPersonCreateButton: Locator = this.page.locator(
    `//div[@role="dialog"]//button[contains(@class, 'bg-primary')]`
  );
  private readonly managePeople: Locator = this.page.locator(
    `//button/span[text() = 'Manage People']`
  );
  private readonly createButton: Locator = this.page.locator(
    `//button[text() = 'Create']`
  );
  private readonly updateButton: Locator = this.page.locator(
    `//button[text() = 'Update']`
  );
  private readonly errorMessage: Locator = this.page.locator(
    this.popupSuccessMessageLocator
  );
  private readonly popupMessageLocator: Locator = this.page.locator(
    "[data-radix-collection-item] .grid > div:nth-child(2)"
  );
  private readonly authorInput: Locator = this.page.locator(
    `//input[@placeholder = 'Enter author name']`
  );
  private readonly titleInput: Locator = this.page.locator(
    `//input[@placeholder = 'Enter book title']`
  );
  private readonly peopleListItems: Locator = this.page.locator(
    "//div[contains(@class,'space-y-2') and contains(@class,'mt-4')]//div[contains(@class,'p-3')]"
  );
  private readonly signOutButton: Locator = this.page.locator(
    "//button[normalize-space()='Sign Out']"
  );
  private readonly emptyLibraryMessage: Locator = this.page.locator(
    "//div[contains(@class, 'text-muted-foreground')]"
  );
  private readonly taskEditButton = (titleText: string): Locator =>
    this.page.locator(
      `//h3[contains(., '${titleText}')]/ancestor::div[contains(@class,'p-3')] //div[contains(@class,'gap-1')] /button[1]`
    );
  private readonly deleteBookButton = (titleText: string): Locator =>
    this.page.locator(
      `//h3[contains(., '${titleText}')]/ancestor::div[contains(@class,'p-3')] //div[contains(@class,'gap-1')] /button[2]`
    );
  private readonly completeTaskButton = (titleText: string): Locator =>
    this.page.locator(
      `//h3[contains(., '${titleText}')]/ancestor::div[contains(@class,'p-3')]//button[@role='checkbox']`
    );
  private readonly completedText = (titleText: string): Locator =>
    this.page.locator(
      `//h3[contains(., '${titleText}')]/ancestor::div[contains(@class,'p-3')]//span[contains(.,'Completed')]`
    );

  //WAITS
  async waitForBookHeader(bookName: string): Promise<void> {
    await this.waits.waitForLoad(this.page, this.bookHeader(bookName));
  }

  async waitForSuccessPopup(): Promise<void> {
    await this.waits.waitForLoad(this.page, this.popupSuccessMessageLocator);
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

  async clickUpdate(): Promise<void> {
    await this.updateButton.click();
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
    await this.popupMessageLocator.waitFor({ state: "visible", timeout: 5000 });
  }

  async getBookByTitle(title: string): Promise<Locator> {
    return this.page.locator(
      `//h3[contains(text(), '${title.split(" ")[0]}')]`
    );
  }

  async isPersonInList(name: string): Promise<boolean> {
    await this.peopleListItems
      .locator(`text="${name}"`)
      .waitFor({ state: "visible", timeout: 5000 });
    return true;
  }

  async waitForElementToAppear(
    locator: Locator,
    timeout: number = 5000
  ): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }
  async editTask(title: string): Promise<void> {
    await this.taskEditButton(title).click();
  }

  async deleteBook(title: string): Promise<void> {
    await this.deleteBookButton(title).click();
  }

  async markTaskComplete(title: string): Promise<void> {
    await this.completeTaskButton(title).click();
  }

  public getCompletedText(title: string): Locator {
    return this.completedText(title);
  }
  public getNoBooksMessage() {
    return this.emptyLibraryMessage;
  }
}
export default DashboardPage;
