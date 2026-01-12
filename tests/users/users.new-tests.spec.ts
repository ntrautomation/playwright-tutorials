import LoginPage from '@objects/pages/login.page';
import LibraryPage from '@objects/pages/library.page';
import { expect, test } from '@playwright/test';

test.describe('User testing Suite - NEW tests (POM)', () => {
  const errorMsg = `Please fill in both title and author fields`;

  const withRandom4 = (base: string) =>
    `${base}-${Math.floor(1000 + Math.random() * 9000)}`;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('http://localhost:8080/login');
    await loginPage.loginUser(`automation@test.com`, `temp123`);
    await page.waitForSelector('//h1', { timeout: 5000 });
  });

  test('Validate mandatory fields - only author filled', async ({ page }) => {
    const library = new LibraryPage(page);
    const modal = await library.openAddBookModal();

    await modal.fillAuthor(withRandom4('EMA'));
    await modal.clickCreate();

    await expect(modal.getValidationError()).toHaveText(errorMsg);
  });

  test('Validate mandatory fields - only title filled', async ({ page }) => {
    const dashboard = new LibraryPage(page);
    const modal = await dashboard.openAddBookModal();

    await modal.fillTitle(withRandom4('SF QAs the best'));
    await modal.clickCreate();

    await expect(modal.getValidationError()).toHaveText(errorMsg);
  });

  test('Cancel Add Book does not create a book (mandatory fields filled)', async ({ page }) => {
    const title = withRandom4('SF QAs the best');
    const author = withRandom4('EMA');
  
    const library = new LibraryPage(page);
    const modal = await library.openAddBookModal();
  
    await modal.fillAuthor(author);
    await modal.fillTitle(title);
  
    await modal.clickClose();
  
    await expect(library.bookTitle(title)).not.toBeVisible();
  });
});
