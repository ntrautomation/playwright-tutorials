import { Locator } from "@playwright/test";
import BasePage from "../pages/base.page";

class Header extends BasePage {

    private readonly pageHeader: Locator = this.page.locator('//h1');
    private readonly signOutButton: Locator = this.page.locator(`//button[text() = 'Sign Out']`);

    get header(): Locator {
        return this.pageHeader;
    }

    async logoutUser(): Promise<void> {
        await this.signOutButton.click();
    }
    
}

export default Header;