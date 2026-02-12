import { test, expect } from "@fixtures/fixture.init";
import { faker } from "@faker-js/faker";
import { ENV } from "@objects/config/ENV";

test.describe("User testing Suite", () => {
  const randomAuthor = faker.person.fullName();
  const randomTitle = faker.word.words(3);

  test.use({ storageState: ENV.LOGGED_STATE_PATH });
  test.beforeEach(async ({ loginPage, booksApi }) => {
    await booksApi.addBook(randomAuthor, randomTitle);
    await loginPage.page.goto(process.env.BASE_URL);
    //await loginPage.waitForHeader();
  });

  test.afterEach(async ({ booksApi }) => {
    await booksApi.deleteBooks();
  });

  test("Edit book information", async ({ dashboardPage }) => {
    const editedTitle = randomTitle + "_v2";

    await dashboardPage.editTask(randomTitle);
    await dashboardPage.fillTitle(randomTitle);
    await dashboardPage.clickUpdate();

    expect(await dashboardPage.getBookByTitle(editedTitle)).toBeVisible();
  });

  test("Mark book as completed", async ({ dashboardPage }) => {
    await dashboardPage.markTaskComplete(randomTitle);

    await expect(dashboardPage.getCompletedText(randomTitle)).toBeVisible();
  });

  test("Delete a book", async ({ dashboardPage }) => {
    await dashboardPage.deleteBook(randomTitle);

    await expect(dashboardPage.getNoBooksMessage()).toBeVisible();
  });
});
