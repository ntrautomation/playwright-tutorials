import { test, expect } from "@fixtures/fixture.init";
import { faker } from "@faker-js/faker";
import { DASHBOARD } from "@objects/enums/dashboard";
import { ENV } from "@objects/config/ENV";
import { generateRunId } from "@helpers/testId";

const RUN_ID = generateRunId();

// ─── E2E Scenarios that require a clean (unauthenticated) browser state ───────

test.describe("E2E Clean State Scenarios", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	// E2E-01 — First-Time User Journey
	test("E2E-01: Complete first-time user journey from login to logout", async ({ loginPage, dashboardPage, booksApi }) => {
		// Step 1 & 2: Navigate and verify login page
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.page.waitForLoadState("domcontentloaded");
		expect(await dashboardPage.getLoginPageTitle()).toBe(DASHBOARD.LOGIN_PAGE_TITLE);

		// Step 3 & 4: Login and verify dashboard
		await loginPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
		await loginPage.waitForHeader();
		expect(await dashboardPage.getDashboardTitle()).toBe(DASHBOARD.DASHBOARD_TITLE);
		expect(await dashboardPage.isAddBookButtonVisible()).toBeTruthy();
		expect(await dashboardPage.isAddPersonButtonVisible()).toBeTruthy();
		expect(await dashboardPage.isManagePeopleButtonVisible()).toBeTruthy();
		expect(await dashboardPage.isSignOutButtonVisible()).toBeTruthy();

		// Step 5 & 6: Add Person
		const personName = `E2E01-${faker.person.fullName()}`;
		await dashboardPage.addPerson(personName);
		expect(await dashboardPage.getPopupMessageText()).toBe(DASHBOARD.PERSON_ADDED);

		// Step 7: Verify person in Manage People list
		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(personName)).toBeTruthy();

		// Navigate back to dashboard
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		// Step 8 & 9: Add a Book
		const bookTitle = `${RUN_ID}-${faker.word.words(3)}`;
		const bookAuthor = faker.person.fullName();
		await dashboardPage.addBook(bookAuthor, bookTitle);
		expect(await dashboardPage.isBookTitleOnCard(bookTitle)).toBeTruthy();

		// Clean up books before logout
		await booksApi.deleteBooksWithPrefix(RUN_ID);

		// Step 10 & 11: Sign Out and verify login page
		await dashboardPage.clickSignOut();
		await loginPage.page.waitForURL(/\/login/, { timeout: 10000 });
		expect(loginPage.page.url()).toContain("/login");

		// Step 12: Verify navigating to dashboard URL is blocked (redirected to login)
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.page.waitForLoadState("domcontentloaded");
		expect(loginPage.page.url()).toContain("/login");
	});

	// E2E-04 — Data Persistence Across Login Sessions
	test("E2E-04: Data persists after full logout and re-login", async ({ loginPage, dashboardPage, booksApi }) => {
		// Step 1: Login
		await loginPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
		await loginPage.waitForHeader();

		// Step 2: Create a person with unique name
		const personName = `E2E04-${Date.now()}-${faker.person.firstName()}`;
		await dashboardPage.addPerson(personName);

		// Navigate back to dashboard
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		// Step 3: Create a book
		const bookTitle = `${RUN_ID}-${faker.word.words(3)}`;
		const bookAuthor = faker.person.fullName();
		await dashboardPage.addBook(bookAuthor, bookTitle);

		// Step 4: Sign Out
		await dashboardPage.clickSignOut();
		await loginPage.page.waitForURL(/\/login/, { timeout: 10000 });

		// Step 5: Login again
		await loginPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
		await loginPage.waitForHeader();

		// Step 6 & 7: Verify book is still visible on dashboard (wait for books to load)
		await dashboardPage.waitForBookCard(bookTitle);
		expect(await dashboardPage.isBookTitleOnCard(bookTitle)).toBeTruthy();

		// Step 8: Verify person is still in Manage People list
		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(personName)).toBeTruthy();

		// Navigate back for API check
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		// Step 9: Verify book is returned by API
		const books = await booksApi.getBooks();
		const found = books.find((b: any) => b.title === bookTitle);
		expect(found).toBeDefined();

		// Cleanup
		await booksApi.deleteBooksWithPrefix(RUN_ID);
	});
});

// ─── E2E Scenarios that use a pre-authenticated session ───────────────────────

test.describe("E2E Logged-In Scenarios", () => {
	test.use({ storageState: ENV.LOGGED_STATE_PATH });

	test.beforeEach(async ({ loginPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
	});

	// E2E-02 — Full Books CRUD with API Verification
	test("E2E-02: Books created via UI are readable via API; deleting via API removes them from UI", async ({ dashboardPage, booksApi }) => {
		// Step 3 & 4: Create Book A and Book B via UI
		const titleA = `${RUN_ID}-${faker.word.words(3)}`;
		const authorA = faker.person.fullName();
		const titleB = `${RUN_ID}-${faker.word.words(3)}`;
		const authorB = faker.person.fullName();

		await dashboardPage.addBook(authorA, titleA);
		await dashboardPage.addBook(authorB, titleB);

		// Step 5: Verify both books in API response
		const booksAfterCreate = await booksApi.getBooks();
		const bookAInApi = booksAfterCreate.find((b: any) => b.title === titleA && b.author === authorA);
		const bookBInApi = booksAfterCreate.find((b: any) => b.title === titleB && b.author === authorB);
		expect(bookAInApi).toBeDefined();
		expect(bookBInApi).toBeDefined();

		// Step 6: Delete our books via API
		await booksApi.deleteBooksWithPrefix(RUN_ID);

		// Step 7: Reload the page
		await dashboardPage.page.reload();
		await dashboardPage.page.waitForLoadState("domcontentloaded");

		// Step 8: Verify neither book card is visible
		await expect(dashboardPage.getBookTitleLocator(titleA)).not.toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(titleB)).not.toBeVisible();

		// Step 9: API no longer contains our books
		const booksAfterDelete = await booksApi.getBooks();
		const ourBooks = booksAfterDelete.filter((b: any) => b.title === titleA || b.title === titleB);
		expect(ourBooks).toHaveLength(0);
	});

	// E2E-03 — Person–Book Assignment and Filter
	test("E2E-03: Person-book assignment and filter shows correct books per person", async ({ dashboardPage, loginPage, booksApi }) => {
		// Steps 1 & 2: Create Person A and Person B
		const personA = `E2E03-A-${faker.person.fullName()}`;
		const personB = `E2E03-B-${faker.person.fullName()}`;
		await dashboardPage.addPerson(personA);
		await dashboardPage.addPerson(personB);

		// Navigate back to dashboard for book creation
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		// Step 3: Verify both appear in person dropdown
		await dashboardPage.clickAddBook();
		expect(await dashboardPage.isPersonDropdownInBookDialogVisible()).toBeTruthy();
		await dashboardPage.closeDialog();

		// Step 4 & 5: Create Book A assigned to Person A
		const bookATitle = `${RUN_ID}-${faker.word.words(3)}`;
		await dashboardPage.addBookWithPerson(faker.person.fullName(), bookATitle, personA);
		expect(await dashboardPage.isBookTitleOnCard(bookATitle)).toBeTruthy();

		// Step 6 & 7: Filter by Person A - only Book A shown
		await dashboardPage.filterByPerson(personA);
		await expect(dashboardPage.getBookTitleLocator(bookATitle)).toBeVisible();

		// Step 8: Switch filter back to All People
		await dashboardPage.resetFilter();
		await expect(dashboardPage.getBookTitleLocator(bookATitle)).toBeVisible();

		// Step 9: Create Book B without assigning a person
		const bookBTitle = `${RUN_ID}-${faker.word.words(3)}`;
		await dashboardPage.addBook(faker.person.fullName(), bookBTitle);

		// Step 10: Filter by Person B - no books shown (Person B has no books)
		await dashboardPage.filterByPerson(personB);
		await expect(dashboardPage.getBookTitleLocator(bookATitle)).not.toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(bookBTitle)).not.toBeVisible();

		// Step 11: Switch back to All People - both books visible
		await dashboardPage.resetFilter();
		await expect(dashboardPage.getBookTitleLocator(bookATitle)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(bookBTitle)).toBeVisible();

		await booksApi.deleteBooksWithPrefix(RUN_ID);
	});

	// E2E-05 — Bulk Book Creation and API Cleanup
	test("E2E-05: Bulk creation and API cleanup stay in sync", async ({ dashboardPage, booksApi }) => {
		// Step 1 & 2: Create 5 books via UI
		const books = Array.from({ length: 5 }, () => ({
			author: faker.person.fullName(),
			title: `${RUN_ID}-${faker.word.words(3)}`,
		}));

		for (const book of books) {
			await dashboardPage.addBook(book.author, book.title);
		}

		// Verify all 5 cards visible
		for (const book of books) {
			await expect(dashboardPage.getBookTitleLocator(book.title)).toBeVisible();
		}

		// Step 3 & 4: Verify API contains all 5 books
		const apiBooks = await booksApi.getBooks();
		for (const book of books) {
			const found = apiBooks.find((b: any) => b.title === book.title);
			expect(found).toBeDefined();
		}

		// Step 5 & 6: Delete our books via API and verify they are gone
		await booksApi.deleteBooksWithPrefix(RUN_ID);
		const booksAfterDelete = await booksApi.getBooks();
		const ourBooksAfterDelete = booksAfterDelete.filter((b: any) => b.title && b.title.startsWith(RUN_ID));
		expect(ourBooksAfterDelete).toHaveLength(0);

		// Step 7 & 8: Reload and verify dashboard shows no book cards for our titles
		await dashboardPage.page.reload();
		await dashboardPage.page.waitForLoadState("domcontentloaded");

		for (const book of books) {
			await expect(dashboardPage.getBookTitleLocator(book.title)).not.toBeVisible();
		}
	});

	// E2E-06 — Validation and Error Recovery
	test("E2E-06: Validation errors shown without creating data, and recovery succeeds", async ({ dashboardPage, booksApi }) => {
		// Book validation — both fields empty
		await dashboardPage.clickAddBook();
		await dashboardPage.clickCreate();
		await dashboardPage.waitForSuccessPopup();
		expect(await dashboardPage.getErrorMessage()).toBe(DASHBOARD.ERROR_MESSAGE);

		// Author only
		await dashboardPage.fillAuthor(faker.person.fullName());
		await dashboardPage.clickCreate();
		expect(await dashboardPage.getErrorMessage()).toBe(DASHBOARD.ERROR_MESSAGE);

		// Title only (clear author first)
		await dashboardPage.fillAuthor("");
		await dashboardPage.fillTitle(`${RUN_ID}-${faker.word.words(3)}`);
		await dashboardPage.clickCreate();
		expect(await dashboardPage.getErrorMessage()).toBe(DASHBOARD.ERROR_MESSAGE);

		// Recovery: fill both and create
		const validTitle = `${RUN_ID}-${faker.word.words(3)}`;
		const validAuthor = faker.person.fullName();
		await dashboardPage.fillAuthor(validAuthor);
		await dashboardPage.fillTitle(validTitle);
		await dashboardPage.clickCreate();
		await dashboardPage.waitForBookCard(validTitle);
		expect(await dashboardPage.isBookTitleOnCard(validTitle)).toBeTruthy();

		// Dialog dismiss — book not created
		const dismissedTitle = `${RUN_ID}-${faker.word.words(3)}`;
		await dashboardPage.clickAddBook();
		await dashboardPage.fillAuthor(faker.person.fullName());
		await dashboardPage.fillTitle(dismissedTitle);
		await dashboardPage.closeDialog();
		await expect(dashboardPage.getBookTitleLocator(dismissedTitle)).not.toBeVisible();

		// Person dialog dismiss — person not created
		await dashboardPage.clickAddPerson();
		expect(await dashboardPage.isPersonNameInputVisible()).toBeTruthy();
		await dashboardPage.page.locator('[role="dialog"] input[placeholder]').fill(faker.person.fullName());
		await dashboardPage.closeDialog();
		// Popup should NOT be visible since we dismissed
		expect(await dashboardPage.isPersonNameInputVisible()).toBeFalsy();

		await booksApi.deleteBooksWithPrefix(RUN_ID);
	});

	// E2E-07 — Complete Library Management Workflow
	test("E2E-07: Full library management - add people, assign books, verify filters and API", async ({ dashboardPage, loginPage, booksApi }) => {
		// Steps 1 & 2: Add Author Alice and Reader Bob (prefixed to avoid cross-run duplicates)
		const alice = `${RUN_ID}-Author Alice`;
		const bob = `${RUN_ID}-Reader Bob`;
		await dashboardPage.addPerson(alice);
		await dashboardPage.addPerson(bob);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		// Step 3: Create Book 1 assigned to Alice
		const book1Title = `${RUN_ID}-Adventures of Alice`;
		const book1Author = "Alice A.";
		await dashboardPage.addBookWithPerson(book1Author, book1Title, alice);

		// Step 4: Create Book 2 assigned to Bob
		const book2Title = `${RUN_ID}-Bob's Guide`;
		const book2Author = "Bob B.";
		await dashboardPage.addBookWithPerson(book2Author, book2Title, bob);

		// Step 5: Create Book 3 with no person assigned
		const book3Title = `${RUN_ID}-Shared Classics`;
		const book3Author = "Classic Author";
		await dashboardPage.addBook(book3Author, book3Title);

		// Step 6: Verify all 3 books under All People filter
		await expect(dashboardPage.getBookTitleLocator(book1Title)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(book2Title)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(book3Title)).toBeVisible();

		// Step 7: Filter by Alice - only Book 1 shown
		await dashboardPage.filterByPerson(alice);
		await expect(dashboardPage.getBookTitleLocator(book1Title)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(book2Title)).not.toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(book3Title)).not.toBeVisible();

		// Step 8: Filter by Bob - only Book 2 shown
		await dashboardPage.filterByPerson(bob);
		await expect(dashboardPage.getBookTitleLocator(book1Title)).not.toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(book2Title)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(book3Title)).not.toBeVisible();

		// Step 9: Reset to All People - all 3 books shown
		await dashboardPage.resetFilter();
		await expect(dashboardPage.getBookTitleLocator(book1Title)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(book2Title)).toBeVisible();
		await expect(dashboardPage.getBookTitleLocator(book3Title)).toBeVisible();

		// Step 10: Manage People - verify Alice and Bob in list
		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(alice)).toBeTruthy();
		expect(await dashboardPage.isPersonInList(bob)).toBeTruthy();

		// Navigate back for API check
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		// Step 11: API reflects all 3 books with correct title and author
		const apiBooks = await booksApi.getBooks();
		const apiBook1 = apiBooks.find((b: any) => b.title === book1Title && b.author === book1Author);
		const apiBook2 = apiBooks.find((b: any) => b.title === book2Title && b.author === book2Author);
		const apiBook3 = apiBooks.find((b: any) => b.title === book3Title && b.author === book3Author);
		expect(apiBook1).toBeDefined();
		expect(apiBook2).toBeDefined();
		expect(apiBook3).toBeDefined();

		await booksApi.deleteBooksWithPrefix(RUN_ID);
	});
});
