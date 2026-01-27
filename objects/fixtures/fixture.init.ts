import BooksApi from '@objects/api/books/booksApi';
import DashboardPage from '@objects/pages/dashboard.page';
import LoginPage from '@objects/pages/login.page';
import { test as base } from '@playwright/test';

interface PageObjects {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    booksApi: BooksApi;
}


export const test = base.extend<PageObjects> ({
    loginPage : async({page}, user) => {
        await user(new LoginPage(page))
    },
    dashboardPage : async({page}, user) => {
        await user(new DashboardPage(page))
    },
    booksApi : async({request}, user) => {
        await user (new BooksApi (request))
    },
});

export { expect } from '@playwright/test';