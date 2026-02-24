import { test, expect } from "@fixtures/fixture.init";
import { faker } from "@faker-js/faker";
import { ENV } from "@objects/config/ENV";
import { generateRunId } from "@helpers/testId";

const RUN_ID = generateRunId();

test.describe("Books API Suite", () => {
	test.use({ storageState: ENV.LOGGED_STATE_PATH });

	test.afterAll(async ({ booksApi }) => {
		await booksApi.deleteBooksWithPrefix(RUN_ID);
	});

	// AUTH-12
	test("generateToken with valid credentials returns a non-empty access_token", async ({ booksApi }) => {
		const tokenResponse = await booksApi.generateToken();
		expect(tokenResponse.access_token).toBeTruthy();
		expect(tokenResponse.access_token.length).toBeGreaterThan(0);
	});

	// AUTH-13
	test("generateToken with wrong password throws or returns no access_token", async ({ booksApi }) => {
		const res = await booksApi.generateTokenRaw(process.env.EMAIL!, "wrongpassword_xyz");
		const body = await res.json();
		expect(body.access_token).toBeFalsy();
	});

	// ABOOK-01
	test("getBooks returns HTTP 200", async ({ booksApi }) => {
		const res = await booksApi.getBooksRawResponse();
		expect(res.status()).toBe(200);
	});

	// ABOOK-02
	test("getBooks response is an array", async ({ booksApi }) => {
		const books = await booksApi.getBooks();
		expect(Array.isArray(books)).toBeTruthy();
	});

	// ABOOK-03
	test("Each book object contains an id field", async ({ booksApi, loginPage, dashboardPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
		const title = `${RUN_ID}-${faker.word.words(3)}`;
		await dashboardPage.addBook(faker.person.fullName(), title);

		const books = await booksApi.getBooks();
		expect(books.length).toBeGreaterThan(0);
		for (const book of books) {
			expect(book).toHaveProperty("id");
		}
	});

	// ABOOK-04
	test("Each book object contains a title field", async ({ booksApi, loginPage, dashboardPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
		await dashboardPage.addBook(faker.person.fullName(), `${RUN_ID}-${faker.word.words(3)}`);

		const books = await booksApi.getBooks();
		expect(books.length).toBeGreaterThan(0);
		for (const book of books) {
			expect(book).toHaveProperty("title");
		}
	});

	// ABOOK-05
	test("Each book object contains an author field", async ({ booksApi, loginPage, dashboardPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
		await dashboardPage.addBook(faker.person.fullName(), `${RUN_ID}-${faker.word.words(3)}`);

		const books = await booksApi.getBooks();
		expect(books.length).toBeGreaterThan(0);
		for (const book of books) {
			expect(book).toHaveProperty("author");
		}
	});

	// ABOOK-06
	test("Create book via UI - book is present in getBooks response", async ({ booksApi, loginPage, dashboardPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const title = `${RUN_ID}-${faker.word.words(3)}`;
		const author = faker.person.fullName();
		await dashboardPage.addBook(author, title);

		const books = await booksApi.getBooks();
		const found = books.find((b: any) => b.title === title && b.author === author);
		expect(found).toBeDefined();
	});

	// ABOOK-07
	test("deleteBooksWithPrefix - prefixed books absent from getBooks", async ({ booksApi, loginPage, dashboardPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
		const title = `${RUN_ID}-${faker.word.words(3)}`;
		await dashboardPage.addBook(faker.person.fullName(), title);

		await booksApi.deleteBooksWithPrefix(RUN_ID);
		const books = await booksApi.getBooks();
		const ourBooks = books.filter((b: any) => b.title && b.title.startsWith(RUN_ID));
		expect(ourBooks).toHaveLength(0);
	});

	// ABOOK-08
	test("GET /books without Authorization header returns non-200 status", async ({ booksApi }) => {
		const res = await booksApi.getBooksWithoutAuth();
		expect(res.status()).not.toBe(200);
	});

	// ABOOK-09
	test("DELETE specific book by id - that book is absent from getBooks", async ({ booksApi, loginPage, dashboardPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const title = `${RUN_ID}-${faker.word.words(3)}`;
		await dashboardPage.addBook(faker.person.fullName(), title);

		const booksBefore = await booksApi.getBooks();
		const target = booksBefore.find((b: any) => b.title === title);
		expect(target).toBeDefined();

		await booksApi.deleteBookById(target.id);

		const booksAfter = await booksApi.getBooks();
		const stillExists = booksAfter.find((b: any) => b.id === target.id);
		expect(stillExists).toBeUndefined();
	});
});
