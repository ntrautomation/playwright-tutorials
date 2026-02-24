import { Locator } from "@playwright/test";
import BasePage from "./base.page";

class LoginPage extends BasePage {
  // Locators (Playwright best practices: getByRole/getByLabel)
  private readonly header: Locator = this.page.getByRole("heading", { level: 1 });
  private readonly email: Locator = this.page.getByLabel(/email/i);
  private readonly password: Locator = this.page.getByLabel(/password/i);
  private readonly signInButton: Locator = this.page.getByRole("button", { name: /^sign\s*in$/i });

  // Waits
  async waitForHeader(): Promise<void> {
    await this.header.waitFor({ state: "visible", timeout: 10000 });
  }

  // Methods
  async loginUser(email: string, password: string): Promise<void> {
    await this.page.goto(process.env.BASE_URL);
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInButton.click();
  }

  async isEmailVisible(): Promise<boolean> {
    return this.email.isVisible();
  }

  async isPasswordVisible(): Promise<boolean> {
    return this.password.isVisible();
  }

  async isSignInButtonVisible(): Promise<boolean> {
    return this.signInButton.isVisible();
  }
}
export default LoginPage;
