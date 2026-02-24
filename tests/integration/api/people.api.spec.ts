import { test, expect } from "@fixtures/fixture.init";
import { faker } from "@faker-js/faker";
import { ENV } from "@objects/config/ENV";

test.describe("People API Suite", () => {
	test.use({ storageState: ENV.LOGGED_STATE_PATH });

	// APEOP-01
	test("GET /people returns HTTP 200", async ({ peopleApi }) => {
		const res = await peopleApi.getPeopleRawResponse();
		expect(res.status()).toBe(200);
	});

	// APEOP-02
	test("GET /people response is an array", async ({ peopleApi }) => {
		const people = await peopleApi.getPeople();
		expect(Array.isArray(people)).toBeTruthy();
	});

	// APEOP-03
	test("Each person object contains id and name fields", async ({ peopleApi, loginPage, dashboardPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
		await dashboardPage.addPerson(faker.person.fullName());

		const people = await peopleApi.getPeople();
		expect(people.length).toBeGreaterThan(0);
		for (const person of people) {
			expect(person).toHaveProperty("id");
			expect(person).toHaveProperty("name");
		}
	});

	// APEOP-04
	test("Create person via UI - person present in GET /people response", async ({ peopleApi, loginPage, dashboardPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		const personName = faker.person.fullName();
		await dashboardPage.addPerson(personName);

		const people = await peopleApi.getPeople();
		const found = people.find((p: any) => p.name === personName);
		expect(found).toBeDefined();
	});
});
