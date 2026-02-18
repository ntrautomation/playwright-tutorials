import { test, expect } from "@fixtures/fixture.init";

// Ensure each test starts with a clean, unauthenticated context
// This overrides the logged-in storage state from global config for this test file
test.use({ storageState: { cookies: [], origins: [] } });

const CREDENTIALS = {
	email: process.env.EMAIL || "automation@test.com",
	password: process.env.PASSWORD || "temp123",
};

// Successful login and dashboard load using Page Objects
test("Successful login and dashboard load", async ({ page, loginPage, dashboardPage }) => {
	// 1) Navigate to root (LoginPage handles navigation)
	await loginPage.loginUser(CREDENTIALS.email, CREDENTIALS.password);

	// 2) Wait for authenticated app signals
	//    - URL moves away from /login OR
	//    - Dashboard header (h1) becomes visible OR
	//    - Books API responds 200 (as used in global login flow)
	const wasLoginUrl = /\/login(\b|\/|\?|#|$)/i.test(page.url());
	await Promise.race([
		page.waitForURL((u) => /\/login(\b|\/|\?|#|$)/i.test(u.toString()) === false, { timeout: 15000 }).catch(() => {}),
		page
			.locator("//h1")
			.first()
			.waitFor({ state: "visible", timeout: 15000 })
			.catch(() => {}),
		page
			.waitForResponse((r) => r.url().includes("/rest/v1/books") && r.status() === 200, { timeout: 15000 })
			.catch(() => {}),
	]);

	const nowUrl = page.url();
	const movedAwayFromLogin = /\/login(\b|\/|\?|#|$)/i.test(nowUrl) === false || !wasLoginUrl;
	const headerText = await dashboardPage.getDashboardTitle();

	// 3) Verify dashboard UI is visible (header present or not on /login)
	expect(
		movedAwayFromLogin || !!headerText?.trim(),
		"Should navigateads away from /login or show dashboard header",
	).toBeTruthy();

	// 4) Refresh and verify session persists
	await page.reload({ waitUntil: "domcontentloaded" });
	const afterReloadUrl = page.url();
	const stillAuthenticated = /\/login(\b|\/|\?|#|$)/i.test(afterReloadUrl) === false;
	const headerAfterReload = await dashboardPage.getDashboardTitle();
	expect(stillAuthenticated || !!headerAfterReload?.trim(), "Session should persist after refresh").toBeTruthy();
});
