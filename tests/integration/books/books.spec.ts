import { test, expect } from "@fixtures/fixture.init";
import { faker } from "@faker-js/faker";
import { DASHBOARD } from "@objects/enums/dashboard";
import { ENV } from "@objects/config/ENV";
import { generateRunId } from "@helpers/testId";

const RUN_ID = generateRunId();

test.describe("Books Suite", () => {
	test.use({ storageState: ENV.LOGGED_STATE_PATH });

	test.beforeEach(async ({ loginPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
	});

	test.afterAll(async ({ booksApi }) => {
		await booksApi.deleteBooksWithPrefix(RUN_ID);
	});

	// TC-05
	test("Add book with author only shows validation error", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		await dashboardPage.fillAuthor(faker.person.fullName());
		await dashboardPage.clickCreate();
		await dashboardPage.waitForSuccessPopup();

		expect(await dashboardPage.getErrorMessage()).toBe(DASHBOARD.ERROR_MESSAGE);
	});

	// TC-06
	test("Add book with title only shows validation error", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		await dashboardPage.fillTitle(`${RUN_ID}-${faker.word.words(3)}`);
		await dashboardPage.clickCreate();
		await dashboardPage.waitForSuccessPopup();

		expect(await dashboardPage.getErrorMessage()).toBe(DASHBOARD.ERROR_MESSAGE);
	});

	// TC-07
	test("Dismiss add book dialog does not create a book", async ({ dashboardPage }) => {
		const title = `${RUN_ID}-${faker.word.words(3)}`;

		await dashboardPage.clickAddBook();
		await dashboardPage.fillAuthor(faker.person.fullName());
		await dashboardPage.fillTitle(title);
		await dashboardPage.page.keyboard.press("Escape");

		await expect(await dashboardPage.getBookByTitle(title)).not.toBeVisible();
	});

	// TC-08
	test("Add two books sequentially - both appear on dashboard", async ({ dashboardPage }) => {
		const titleA = `${RUN_ID}-${faker.word.words(3)}`;
		const titleB = `${RUN_ID}-${faker.word.words(3)}`;

		await dashboardPage.clickAddBook();
		await dashboardPage.fillAuthor(faker.person.fullName());
		await dashboardPage.fillTitle(titleA);
		await dashboardPage.clickCreate();
		await dashboardPage.waitForBookHeader(titleA);

		await dashboardPage.clickAddBook();
		await dashboardPage.fillAuthor(faker.person.fullName());
		await dashboardPage.fillTitle(titleB);
		await dashboardPage.clickCreate();
		await dashboardPage.waitForBookHeader(titleB);

		await expect(await dashboardPage.getBookByTitle(titleA)).toBeVisible();
		await expect(await dashboardPage.getBookByTitle(titleB)).toBeVisible();
	});

	// TC-09
	test("Book persists after page reload", async ({ dashboardPage, loginPage }) => {
		const title = `${RUN_ID}-${faker.word.words(3)}`;

		await dashboardPage.clickAddBook();
		await dashboardPage.fillAuthor(faker.person.fullName());
		await dashboardPage.fillTitle(title);
		await dashboardPage.clickCreate();
		await dashboardPage.waitForBookHeader(title);

		await dashboardPage.page.reload();
		await loginPage.waitForHeader();

		await expect(await dashboardPage.getBookByTitle(title)).toBeVisible();
	});

	// BOOK-04
	test("Add Book dialog - Person dropdown is visible", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		expect(await dashboardPage.isPersonDropdownInBookDialogVisible()).toBeTruthy();
	});

	// BOOK-08
	test("Add book with both fields empty shows validation error", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		await dashboardPage.clickCreate();
		await dashboardPage.waitForSuccessPopup();

		expect(await dashboardPage.getErrorMessage()).toBe(DASHBOARD.ERROR_MESSAGE);
	});

	// BOOK-09
	test("Book card shows the exact title that was entered", async ({ dashboardPage }) => {
		const title = `${RUN_ID}-${faker.word.words(3)}`;
		const author = faker.person.fullName();

		await dashboardPage.addBook(author, title);

		expect(await dashboardPage.isBookTitleOnCard(title)).toBeTruthy();
	});

	// BOOK-10
	test("Book card shows the exact author that was entered", async ({ dashboardPage }) => {
		const title = `${RUN_ID}-${faker.word.words(3)}`;
		const author = faker.person.fullName();

		await dashboardPage.addBook(author, title);

		expect(await dashboardPage.isBookAuthorOnCard(author)).toBeTruthy();
	});

	// BOOK-15
	test("Create book with a person assigned - book card is visible", async ({ dashboardPage, loginPage }) => {
		const personName = faker.person.fullName();
		await dashboardPage.addPerson(personName);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const title = `${RUN_ID}-${faker.word.words(3)}`;
		const author = faker.person.fullName();
		await dashboardPage.addBookWithPerson(author, title, personName);

		expect(await dashboardPage.isBookTitleOnCard(title)).toBeTruthy();
	});

	// BOOK-16
	test("Whitespace-only title with valid author shows validation error", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		await dashboardPage.fillAuthor(faker.person.fullName());
		await dashboardPage.fillTitle("   ");
		await dashboardPage.clickCreate();
		await dashboardPage.waitForSuccessPopup();

		expect(await dashboardPage.getErrorMessage()).toBe(DASHBOARD.ERROR_MESSAGE);
	});

	// BOOK-17
	test("Title with special characters is preserved on book card", async ({ dashboardPage }) => {
		const title = `${RUN_ID}-O'Brien's Book & More`;
		const author = faker.person.fullName();

		await dashboardPage.clickAddBook();
		await dashboardPage.fillAuthor(author);
		await dashboardPage.fillTitle(title);
		await dashboardPage.clickCreate();
		await dashboardPage.waitForBookCard(title);

		expect(await dashboardPage.isBookTitleOnCard(title)).toBeTruthy();
	});
});
