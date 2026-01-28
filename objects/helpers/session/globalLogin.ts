
import { ENV } from "@objects/config/ENV";
import { chromium } from "@playwright/test";
import * as path from "path";

async function globalLogin(){

    await login("Admin", process.env.EMAIL, 
        process.env.PASSWORD, ENV.LOGGED_STATE_PATH);
}

function mustGetEnvVar(varName: string): string {
    const value = process.env[varName];
    if (!value)
        throw new Error(`Environment variable ${varName} is not set`);
    return value;
}

export default globalLogin;

async function login(userType: string, user: string, password: string, statePath: string) {
    console.log(`Starting Login with ${userType}`);
    
    const baseURL = mustGetEnvVar('BASE_URL');

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    console.log(`Starting login @: ${baseURL}`);
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

    await page.locator("#email").fill(user);
    await page.locator("#password").fill(password);

    await page.locator("//button").click();

    // Wait until you’re actually authenticated in the app
    await page.waitForResponse(r =>
        r.url().includes("/rest/v1/books") && r.status() === 200
    );
      const absStatePath = path.isAbsolute(statePath)
        ? statePath
        : path.join(process.cwd(), statePath);

    await context.storageState({ path: absStatePath });

    // const state = await context.storageState();
    // const kc = state.cookies.find(c => c.name === "KEYCLOAK_SESSION");
    // console.log(`KEYCLOAK_SESSION expires: ${kc?.expires ?? "N/A"}`);

    await browser.close();
}