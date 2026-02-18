import { Locator } from "@playwright/test";
import BasePage from "./base.page";

class LoginPage extends BasePage {
	// LOCATOR PATHS
	private readonly email: Locator = this.page.getByLabel(/email/i);
	private readonly password: Locator = this.page.getByLabel(/password/i);
	private readonly signInButton: Locator = this.page.getByRole("button", { name: /sign in/i });

	//METHODS
	async loginUser(email: string, password: string): Promise<void> {
		await this.navigate();
		await this.email.fill(email);
		await this.password.fill(password);
		await this.signInButton.click();
	}
}
export default LoginPage;
