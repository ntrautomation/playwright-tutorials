import DashboardPage from '@objects/pages/dashboard.page';
import LoginPage from '@objects/pages/login.page';
import { test as base } from '@playwright/test';

interface PageObjects {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
}


export const test = base.extend<PageObjects> ({
    loginPage : async({page}, user) => {
        await user(new LoginPage(page))
    },
    dashboardPage : async({page}, user) => {
        await user(new DashboardPage(page))
    },
});

export { expect } from '@playwright/test';