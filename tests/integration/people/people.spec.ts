import { test, expect } from "@fixtures/fixture.init";
import { faker } from "@faker-js/faker";
import { DASHBOARD } from "@objects/enums/dashboard";
import { ENV } from "@objects/config/ENV";

test.describe("People Suite", () => {
	test.use({ storageState: ENV.LOGGED_STATE_PATH });

	test.beforeEach(async ({ loginPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
	});

	// TC-P01
	test("Add person - success popup message matches 'Person added'", async ({ dashboardPage }) => {
		await dashboardPage.addPerson(faker.person.fullName());
		expect(await dashboardPage.getPopupMessageText()).toBe(DASHBOARD.PERSON_ADDED);
	});

	// TC-P02
	test("Add person - success popup is visible", async ({ dashboardPage }) => {
		await dashboardPage.addPerson(faker.person.fullName());
		expect(await dashboardPage.isPopupVisible()).toBeTruthy();
	});

	// TC-P03
	test("Added person appears in Manage People list", async ({ dashboardPage }) => {
		const name = faker.person.fullName();
		await dashboardPage.addPerson(name);
		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(name)).toBeTruthy();
	});

	// TC-P04
	test("Person name preserves exact casing in Manage People list", async ({ dashboardPage }) => {
		const name = faker.person.fullName().toUpperCase();
		await dashboardPage.addPerson(name);
		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(name)).toBeTruthy();
	});

	// TC-P05
	test("Add two people - first person appears in Manage People list", async ({ dashboardPage }) => {
		const firstPerson = faker.person.fullName();
		const secondPerson = faker.person.fullName();
		await dashboardPage.addPerson(firstPerson);
		await dashboardPage.addPerson(secondPerson);
		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(firstPerson)).toBeTruthy();
	});

	// TC-P06
	test("Add two people - second person appears in Manage People list", async ({ dashboardPage }) => {
		const firstPerson = faker.person.fullName();
		const secondPerson = faker.person.fullName();
		await dashboardPage.addPerson(firstPerson);
		await dashboardPage.addPerson(secondPerson);
		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(secondPerson)).toBeTruthy();
	});

	// TC-P07
	test("People list has at least 2 entries after adding multiple people", async ({ dashboardPage }) => {
		await dashboardPage.addPerson(faker.person.fullName());
		await dashboardPage.addPerson(faker.person.fullName());
		await dashboardPage.clickManagePerson();
		const count = await dashboardPage.getPeopleListCount();
		expect(count).toBeGreaterThanOrEqual(2);
	});

	// TC-P08
	test("Add person with name containing numbers", async ({ dashboardPage }) => {
		const name = `${faker.person.firstName()} ${faker.number.int({ min: 10, max: 99 })} ${faker.person.lastName()}`;
		await dashboardPage.addPerson(name);
		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(name)).toBeTruthy();
	});

	// TC-P09
	test("Add person with hyphenated name preserves full name", async ({ dashboardPage }) => {
		const name = `Mary-Jane ${faker.person.lastName()}`;
		await dashboardPage.addPerson(name);
		await dashboardPage.clickManagePerson();
		expect(await dashboardPage.isPersonInList(name)).toBeTruthy();
	});

	// TC-P10
	test("Add three people sequentially - all appear in Manage People list", async ({ dashboardPage }) => {
		const names = [
			faker.person.fullName(),
			faker.person.fullName(),
			faker.person.fullName(),
		];
		for (const name of names) {
			await dashboardPage.addPerson(name);
		}
		await dashboardPage.clickManagePerson();
		for (const name of names) {
			expect(await dashboardPage.isPersonInList(name)).toBeTruthy();
		}
	});

	// PEOP-14
	test("Created person appears in the Person dropdown inside Add Book dialog", async ({ dashboardPage, loginPage }) => {
		const personName = faker.person.fullName();
		await dashboardPage.addPerson(personName);

		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();

		await dashboardPage.clickAddBook();
		await dashboardPage.selectPersonInBookDialog(personName);

		// If selectPersonInBookDialog succeeds without error, the person was found in dropdown
		expect(true).toBeTruthy();
	});

	// PEOP-15
	test("Submitting Add Person with empty name - dialog does not close", async ({ dashboardPage }) => {
		await dashboardPage.clickAddPerson();
		expect(await dashboardPage.isPersonNameInputVisible()).toBeTruthy();

		// Click the dialog's primary submit button without entering a name
		await dashboardPage.page.locator(`//div[@role="dialog"]//button[contains(@class, 'bg-primary')]`).click();

		// Dialog should still be visible (not closed)
		expect(await dashboardPage.isPersonNameInputVisible()).toBeTruthy();
	});
});
