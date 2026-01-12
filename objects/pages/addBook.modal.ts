import { Locator, Page } from '@playwright/test';

export default class AddBookModal {
  private readonly page: Page;

  private readonly authorInput: Locator;
  private readonly titleInput: Locator;
  private readonly createBtn: Locator;
  private readonly closeBtn: Locator;
  private readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.authorInput = page.locator(`//input[@placeholder='Enter author name']`);
    this.titleInput = page.locator(`//input[@placeholder='Enter book title']`);
    this.createBtn = page.getByRole('button', { name: 'Create' });
    this.closeBtn = page.getByRole('button', { name: 'Close' });

    this.validationError = page
      .locator(`div#root li div div:nth-child(2)`)
      .first();
  }

  async fillAuthor(author: string): Promise<void> {
    await this.authorInput.fill(author);
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async clickCreate(): Promise<void> {
    await this.createBtn.click();
  }

  async clickClose(): Promise<void> {
    await this.closeBtn.click();
  }

  getValidationError(): Locator {
    return this.validationError;
  }
}
