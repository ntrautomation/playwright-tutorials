import { test, expect } from "@fixtures/fixture.init";
import { faker } from "@faker-js/faker";
import { ENV } from "@objects/config/ENV";
import { generateRunId } from "@helpers/testId";

const RUN_ID = generateRunId();

test.describe("Filter Suite", () => {
	test.use({ storageState: ENV.LOGGED_STATE_PATH });

	test.beforeEach(async ({ loginPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
	});

	test.afterAll(async ({ booksApi }) => {
		await booksApi.deleteBooksWithPrefix(RUN_ID);
	});

	// FILT-01
	test("All People filter combobox is visible on dashboard", async ({ dashboardPage }) => {
		expect(await dashboardPage.isFilterComboboxVisible()).toBeTruthy();
	});

	// FILT-02
	test("All People selection shows all books with no filter applied", async ({ dashboardPage }) => {
		const titleA = `${RUN_ID}-${faker.word.words(3)}`;
		const titleB = `${RUN_ID}-${faker.word.words(3)}`;

		await dashboardPage.addBook(faker.person.fullName(), titleA);
		await dashboardPage.addBook(faker.person.fullName(), titleB);

		// Default is All People - both books should be visible
		await expect(dashboardPage.getBookTitleLocator(titleA)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(titleB)).toBeVisible();
	});

	// FILT-03
	test("Filter by specific person - only books assigned to that person are visible", async ({ dashboardPage, loginPage }) => {
		const personName = faker.person.fullName();
		await dashboardPage.addPerson(personName);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const assignedTitle = `${RUN_ID}-${faker.word.words(3)}`;
		const unassignedTitle = `${RUN_ID}-${faker.word.words(3)}`;

		await dashboardPage.addBookWithPerson(faker.person.fullName(), assignedTitle, personName);
		await dashboardPage.addBook(faker.person.fullName(), unassignedTitle);

		await dashboardPage.filterByPerson(personName);

		await expect(dashboardPage.getBookTitleLocator(assignedTitle)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(unassignedTitle)).not.toBeVisible();
	});

	// FILT-04
	test("Filter by person with no assigned books - no books are shown", async ({ dashboardPage, loginPage }) => {
		const personWithNoBooks = faker.person.fullName();
		await dashboardPage.addPerson(personWithNoBooks);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const title = `${RUN_ID}-${faker.word.words(3)}`;
		await dashboardPage.addBook(faker.person.fullName(), title);

		await dashboardPage.filterByPerson(personWithNoBooks);

		await expect(dashboardPage.getBookTitleLocator(title)).not.toBeVisible();
	});

	// FILT-05
	test("Select All People after filtering - all books are visible again", async ({ dashboardPage, loginPage }) => {
		const personName = faker.person.fullName();
		await dashboardPage.addPerson(personName);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const titleA = `${RUN_ID}-${faker.word.words(3)}`;
		const titleB = `${RUN_ID}-${faker.word.words(3)}`;

		await dashboardPage.addBookWithPerson(faker.person.fullName(), titleA, personName);
		await dashboardPage.addBook(faker.person.fullName(), titleB);

		// Filter by person - only one book visible
		await dashboardPage.filterByPerson(personName);
		await expect(dashboardPage.getBookTitleLocator(titleB)).not.toBeVisible();

		// Reset to All People - both books visible
		await dashboardPage.resetFilter();
		await expect(dashboardPage.getBookTitleLocator(titleA)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(titleB)).toBeVisible();
	});
});
