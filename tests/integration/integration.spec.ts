import { test, expect } from "@fixtures/fixture.init";
import { faker } from "@faker-js/faker";
import { ENV } from "@objects/config/ENV";
import { generateRunId } from "@helpers/testId";

const RUN_ID = generateRunId();

test.describe("Person-Book Integration Suite", () => {
	test.use({ storageState: ENV.LOGGED_STATE_PATH });

	test.beforeEach(async ({ loginPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
	});

	test.afterAll(async ({ booksApi }) => {
		await booksApi.deleteBooksWithPrefix(RUN_ID);
	});

	// INTG-01
	test("Create person - open Add Book dialog - person appears in Person dropdown", async ({ dashboardPage, loginPage }) => {
		const personName = faker.person.fullName();
		await dashboardPage.addPerson(personName);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		await dashboardPage.clickAddBook();
		await dashboardPage.selectPersonInBookDialog(personName);

		// If selectPersonInBookDialog succeeds (clicks the person), integration works
		expect(true).toBeTruthy();
	});

	// INTG-02
	test("Create person - create book assigned to that person - book card is visible", async ({ dashboardPage, loginPage }) => {
		const personName = faker.person.fullName();
		await dashboardPage.addPerson(personName);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const title = `${RUN_ID}-${faker.word.words(3)}`;
		const author = faker.person.fullName();
		await dashboardPage.addBookWithPerson(author, title, personName);

		expect(await dashboardPage.isBookTitleOnCard(title)).toBeTruthy();
	});

	// INTG-03
	test("Create person with no books - filter by that person - no books are shown", async ({ dashboardPage, loginPage }) => {
		const personWithNoBooks = faker.person.fullName();
		await dashboardPage.addPerson(personWithNoBooks);

		// Create a book NOT assigned to this person to verify the filter hides it
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const title = `${RUN_ID}-${faker.word.words(3)}`;
		await dashboardPage.addBook(faker.person.fullName(), title);

		// Filter by the person who has no books
		await dashboardPage.filterByPerson(personWithNoBooks);

		const bookCard = dashboardPage.getBookTitleLocator(title);
		await expect(bookCard).not.toBeVisible();
	});

	// INTG-04
	test("Assign book to person - filter by that person - only that book is displayed", async ({ dashboardPage, loginPage }) => {
		const personName = faker.person.fullName();
		await dashboardPage.addPerson(personName);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const assignedTitle = `${RUN_ID}-${faker.word.words(3)}`;
		const unassignedTitle = `${RUN_ID}-${faker.word.words(3)}`;

		await dashboardPage.addBookWithPerson(faker.person.fullName(), assignedTitle, personName);
		await dashboardPage.addBook(faker.person.fullName(), unassignedTitle);

		await dashboardPage.filterByPerson(personName);

		const assignedCard = dashboardPage.getBookTitleLocator(assignedTitle);
		const unassignedCard = dashboardPage.getBookTitleLocator(unassignedTitle);

		await expect(assignedCard).toBeVisible();
		await expect(unassignedCard).not.toBeVisible();
	});

	// INTG-05
	test("Assign books to two different people - filter each - correct books shown per person", async ({ dashboardPage, loginPage }) => {
		const personA = faker.person.fullName();
		const personB = faker.person.fullName();
		await dashboardPage.addPerson(personA);
		await dashboardPage.addPerson(personB);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const titleA = `${RUN_ID}-${faker.word.words(3)}`;
		const titleB = `${RUN_ID}-${faker.word.words(3)}`;

		await dashboardPage.addBookWithPerson(faker.person.fullName(), titleA, personA);
		await dashboardPage.addBookWithPerson(faker.person.fullName(), titleB, personB);

		// Filter by Person A - only Book A visible
		await dashboardPage.filterByPerson(personA);
		await expect(dashboardPage.getBookTitleLocator(titleA)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(titleB)).not.toBeVisible();

		// Filter by Person B - only Book B visible
		await dashboardPage.filterByPerson(personB);
		await expect(dashboardPage.getBookTitleLocator(titleA)).not.toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(titleB)).toBeVisible();
	});
});
