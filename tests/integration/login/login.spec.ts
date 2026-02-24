import { test, expect } from "@fixtures/fixture.init";
import { DASHBOARD } from "@objects/enums/dashboard";

test.describe("Login Page Suite", () => {
	test.use({ storageState: { cookies: [], origins: [] } });

	test.beforeEach(async ({ loginPage }) => {
		await loginPage.page.goto(process.env.BASE_URL);
		await loginPage.page.waitForLoadState("domcontentloaded");
	});

	// TC-L01
	test("Email input is visible on login page", async ({ loginPage }) => {
		expect(await loginPage.isEmailVisible()).toBeTruthy();
	});

	// TC-L02
	test("Password input is visible on login page", async ({ loginPage }) => {
		expect(await loginPage.isPasswordVisible()).toBeTruthy();
	});

	// TC-L03
	test("Sign In button is visible on login page", async ({ loginPage }) => {
		expect(await loginPage.isSignInButtonVisible()).toBeTruthy();
	});

	// TC-L04
	test("Login page title is 'Automation Tutorials'", async ({ dashboardPage }) => {
		expect(await dashboardPage.getLoginPageTitle()).toBe(DASHBOARD.LOGIN_PAGE_TITLE);
	});

	// TC-L05
	test("Login with wrong credentials - URL stays on login", async ({ loginPage }) => {
		await Promise.all([
			loginPage.page.waitForResponse(
				(r) => r.url().includes("/auth/v1/token"),
				{ timeout: 15000 }
			),
			loginPage.loginUser("automation@test.com", "wrongpassword123"),
		]);
		expect(loginPage.page.url()).toContain("/login");
	});

	// TC-L06
	test("Login with wrong credentials - login page remains visible", async ({ loginPage, dashboardPage }) => {
		await Promise.all([
			loginPage.page.waitForResponse(
				(r) => r.url().includes("/auth/v1/token"),
				{ timeout: 15000 }
			),
			loginPage.loginUser("automation@test.com", "wrongpassword123"),
		]);
		expect(await dashboardPage.getLoginPageTitle()).toBe(DASHBOARD.LOGIN_PAGE_TITLE);
	});

	// TC-L07
	test("Valid credentials - navigates away from login page", async ({ loginPage }) => {
		await loginPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
		await expect(loginPage.page).not.toHaveURL(/\/login/, { timeout: 15000 });
	});

	// TC-L08
	test("Valid credentials - dashboard title is 'Dashboard'", async ({ loginPage, dashboardPage }) => {
		await loginPage.loginUser(process.env.EMAIL!, process.env.PASSWORD!);
		await loginPage.waitForHeader();
		expect(await dashboardPage.getDashboardTitle()).toBe(DASHBOARD.DASHBOARD_TITLE);
	});

	// AUTH-11
	test("Empty email and password - Sign In does not navigate to dashboard", async ({ loginPage }) => {
		await loginPage.page.getByRole("button", { name: /^sign\s*in$/i }).click();
		await loginPage.page.waitForLoadState("domcontentloaded");
		expect(loginPage.page.url()).not.toContain("/dashboard");
	});
});
