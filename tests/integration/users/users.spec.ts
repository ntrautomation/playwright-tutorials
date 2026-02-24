import { test, expect } from "@fixtures/fixture.init";
import { da, faker } from "@faker-js/faker";
import { DASHBOARD } from "@objects/enums/dashboard";
import { ENV } from "@objects/config/ENV";
import { generateRunId } from "@helpers/testId";

const RUN_ID = generateRunId();

test.describe("User testing Suite", () => {
	test.use({ storageState: ENV.LOGGED_STATE_PATH });
	test.beforeEach(async ({ loginPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
	});

	test.afterAll(async ({ booksApi }) => {
		await booksApi.deleteBooksWithPrefix(RUN_ID);
	});

	test("User logged in successfully", async ({ dashboardPage }) => {
		expect(await dashboardPage.getDashboardTitle()).toBe(DASHBOARD.DASHBOARD_TITLE);
	});

	test("Validate mandatory fields", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		await dashboardPage.clickCreate();
		await dashboardPage.waitForSuccessPopup();

		expect(await dashboardPage.getErrorMessage()).toBe(DASHBOARD.ERROR_MESSAGE);
	});

	test("Add a book", async ({ dashboardPage }) => {
		const randomAuthor = faker.person.fullName();
		const randomTitle = `${RUN_ID}-${faker.word.words(3)}`;

		await dashboardPage.clickAddBook();
		await dashboardPage.fillAuthor(randomAuthor);
		const bookTitle = await dashboardPage.fillTitle(randomTitle);
		await dashboardPage.clickCreate();

		await dashboardPage.waitForBookHeader(bookTitle);
		expect(await dashboardPage.getBookByTitle(randomTitle)).toBeVisible();
	});

	test("Add a person", async ({ dashboardPage }) => {
		const randomPersonName = faker.person.fullName();
		await dashboardPage.addPerson(randomPersonName);
		await dashboardPage.waitForSuccessPopup();

		expect(await dashboardPage.getPopupMessageText()).toBe(DASHBOARD.PERSON_ADDED);
	});

	test("Manage people", async ({ dashboardPage }) => {
		const randomPersonName = faker.person.fullName();
		await dashboardPage.addPerson(randomPersonName);
		const text = await dashboardPage.getPopupMessageText();
		expect(text).toBe(DASHBOARD.PERSON_ADDED);

		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(randomPersonName)).toBeTruthy();
	});

	test("User logged out successfully", async ({ dashboardPage }) => {
		await dashboardPage.clickSignOut();
		await dashboardPage.page.waitForURL(/\/login/, { timeout: 10000 });
		expect(dashboardPage.page.url()).toContain("/login");
	});
});
