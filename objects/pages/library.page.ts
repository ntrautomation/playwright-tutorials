import { Locator, Page } from '@playwright/test';
import AddBookModal from './addBook.modal';

export default class LibraryPage {
  private readonly page: Page;
  private readonly addBookBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addBookBtn = page.locator(`//button/span[text() = 'Add a Book']`);
  }

  async openAddBookModal(): Promise<AddBookModal> {
    await this.addBookBtn.click();
    return new AddBookModal(this.page);
  }

  bookTitle(title: string): Locator {
    return this.page.locator(`//h3[text() = '${title}']`);
  }
}
