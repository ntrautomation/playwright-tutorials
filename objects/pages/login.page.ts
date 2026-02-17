import { Locator } from "@playwright/test";
import BasePage from "./base.page";

class LoginPage extends BasePage {

    // LOCATOR PATHS
    private readonly headerLocator: string = `//h1`;

    private readonly email: Locator = this.page.locator(`input#email`);
    private readonly password: Locator = this.page.locator(`input#password`);
    private readonly signInButton: Locator = this.page.locator(`//button[text() = 'Sign In']`);

    //WAITS
    async waitForHeader(): Promise<void> {
        await this.waits.waitForLoad(this.page, this.headerLocator);
    }
    //METHODS

    async loginUser(email: string, password: string): Promise<void> {
        await this.page.goto(process.env.BASE_URL);
        await this.email.fill(email);
        await this.password.fill(password);
        await this.signInButton.click();
    }
}
export default LoginPage;