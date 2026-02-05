import { ENV } from "@objects/config/ENV";
import { chromium } from "@playwright/test";
import * as path from "node:path";

function getEnvironmentVariables(variableName: string): string {
	const value = process.env[variableName];
	if (!value) throw new Error(`Environemnt variable ${variableName} is missing!`);
	return value;
}

async function globalLogin() {
	const email = getEnvironmentVariables("EMAIL");
	const password = getEnvironmentVariables("PASSWORD");
	await login(`Admin`, email, password, ENV.LOGGED_STATE_PATH);
}
export default globalLogin;

async function login(userType: string, user: string, password: string, statePath: string) {
	const BaseURL = getEnvironmentVariables("BASE_URL");
	console.log(`Staring login session with ${userType}`);

	const browser = await chromium.launch({
		headless: true,
		args: ["--no-sandbox", "--disable-dev-shm-usage"],
	});

	const context = await browser.newContext();
	const page = await context.newPage();

	await page.goto(BaseURL, { waitUntil: "domcontentloaded" });

	await page.locator(`#email`).fill(user);
	await page.locator(`#password`).fill(password);

	await page.locator(`//button`).click();

	await page.waitForResponse((r) => r.url().includes(`/rest/v1/books`) && r.status() === 200);

	const absStatePath = path.isAbsolute(statePath) ? statePath : path.join(process.cwd(), statePath);

	await context.storageState({ path: absStatePath });

	await browser.close();
}
