import { Locator } from "@playwright/test";
import BasePage from "./base.page";

class LoginPage extends BasePage {

    private readonly email: Locator = this.page.locator(`input#email`);
    private readonly password: Locator = this.page.locator(`input#password`);
    private readonly signInButton: Locator = this.page.locator(`//button[text() = 'Sign In']`);

    //METHODS

    async loginUser(email: string, password: string): Promise<void> {
        await this.page.goto('http://localhost:8080/login');
        await this.email.fill(email);
        await this.password.fill(password);
        await this.signInButton.click();
    }
}
export default LoginPage;