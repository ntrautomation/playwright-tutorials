import { test, expect } from "@fixtures/fixture.init";
import { DASHBOARD } from "@objects/enums/dashboard";
import { ENV } from "@objects/config/ENV";

test.describe("Dashboard Suite", () => {
	test.use({ storageState: ENV.LOGGED_STATE_PATH });

	test.beforeEach(async ({ loginPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.waitForHeader();
	});

	// TC-D01
	test("Dashboard title is 'Dashboard'", async ({ dashboardPage }) => {
		expect(await dashboardPage.getDashboardTitle()).toBe(DASHBOARD.DASHBOARD_TITLE);
	});

	// TC-D02
	test("Add Book button is visible on dashboard", async ({ dashboardPage }) => {
		expect(await dashboardPage.isAddBookButtonVisible()).toBeTruthy();
	});

	// TC-D03
	test("Add Person button is visible on dashboard", async ({ dashboardPage }) => {
		expect(await dashboardPage.isAddPersonButtonVisible()).toBeTruthy();
	});

	// TC-D04
	test("Manage People button is visible on dashboard", async ({ dashboardPage }) => {
		expect(await dashboardPage.isManagePeopleButtonVisible()).toBeTruthy();
	});

	// TC-D05
	test("Sign Out button is visible on dashboard", async ({ dashboardPage }) => {
		expect(await dashboardPage.isSignOutButtonVisible()).toBeTruthy();
	});

	// TC-D06
	test("Add Book dialog opens - author input is visible", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		expect(await dashboardPage.isAuthorInputVisible()).toBeTruthy();
	});

	// TC-D07
	test("Add Book dialog opens - title input is visible", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		expect(await dashboardPage.isTitleInputVisible()).toBeTruthy();
	});

	// TC-D08
	test("Add Book dialog opens - Create button is visible", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		expect(await dashboardPage.isCreateButtonVisible()).toBeTruthy();
	});

	// TC-D09
	test("Add Book dialog closes via Close button - author input no longer visible", async ({ dashboardPage }) => {
		await dashboardPage.clickAddBook();
		expect(await dashboardPage.isAuthorInputVisible()).toBeTruthy();
		await dashboardPage.closeDialog();
		expect(await dashboardPage.isAuthorInputVisible()).toBeFalsy();
	});

	// TC-D10
	test("Add Person dialog opens - name input is visible", async ({ dashboardPage }) => {
		await dashboardPage.clickAddPerson();
		expect(await dashboardPage.isPersonNameInputVisible()).toBeTruthy();
	});

	// TC-D11
	test("Add Person dialog opens - Create button is visible", async ({ dashboardPage }) => {
		await dashboardPage.clickAddPerson();
		expect(await dashboardPage.isPersonCreateButtonVisible()).toBeTruthy();
	});

	// TC-D12
	test("Add Person dialog closes via Close button - name input no longer visible", async ({ dashboardPage }) => {
		await dashboardPage.clickAddPerson();
		expect(await dashboardPage.isPersonNameInputVisible()).toBeTruthy();
		await dashboardPage.closeDialog();
		expect(await dashboardPage.isPersonNameInputVisible()).toBeFalsy();
	});

	// DASH-06
	test("My Library h2 heading is visible on dashboard", async ({ dashboardPage }) => {
		expect(await dashboardPage.isMyLibraryHeadingVisible()).toBeTruthy();
	});

	// DASH-07
	test("Logged-in user email is displayed in the header", async ({ dashboardPage }) => {
		expect(await dashboardPage.isUserEmailDisplayed(process.env.EMAIL!)).toBeTruthy();
	});

	// DASH-08
	test("All People filter combobox is visible on dashboard", async ({ dashboardPage }) => {
		expect(await dashboardPage.isFilterComboboxVisible()).toBeTruthy();
	});
});
