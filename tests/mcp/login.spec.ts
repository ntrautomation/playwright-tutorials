import { test, expect } from "@fixtures/fixture.init";

// Ensure this test runs with a fresh, unauthenticated context
// (overrides any project-level logged-in storage state/fixtures)
test.use({ storageState: { cookies: [], origins: [] } });

const email = "automation@test.com";
const password = "temp123";

test.describe("Login flows", () => {
	test("Successful login", async ({ loginPage, dashboardPage, page }) => {
		await loginPage.loginUser(email, password);
		await dashboardPage.waitForHeader();
		await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
		expect(await dashboardPage.getDashboardTitle()).toBeTruthy();
	});

	test("Invalid credentials keep user on login", async ({ loginPage, dashboardPage, page }) => {
		const wrongPassword = "temp1234";
		await loginPage.loginUser(email, wrongPassword);

		// Expect to remain on login page
		await expect(page).toHaveURL(/\/login/);
		expect(await dashboardPage.getLoginPageTitle()).toBeDefined();
		expect(await dashboardPage.getLoginPageTitle()).toBe("Automation Tutorials");
	});

	test("Logout and access control", async ({ loginPage, dashboardPage, page }) => {
		// Login
		await loginPage.loginUser(email, password);
		await dashboardPage.waitForHeader();

		// Session persists on reload
		await page.reload();
		await dashboardPage.waitForHeader();
		expect(await dashboardPage.getDashboardTitle()).toBeTruthy();

		// Logout
		await dashboardPage.clickSignOut();
		expect(await dashboardPage.getLoginPageTitle()).toBe("Automation Tutorials");

		// Attempt to access protected route (strip '/login' from BASE_URL)
		const base = process.env.BASE_URL || "";
		const protectedUrl = base.replace(/\/login\/?$/, "/");
		if (protectedUrl) {
			await page.goto(protectedUrl);
		}

		// Should end up on login
		await expect(page).toHaveURL(/\/login/);
		expect(await dashboardPage.getLoginPageTitle()).toBe("Automation Tutorials");
	});
});
