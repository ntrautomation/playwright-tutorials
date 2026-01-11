import AddBookComponent from '@objects/components/addBook.component';
import AddPersonComponent from '@objects/components/addPerson.component';
import BookRowComponent from '@objects/components/bookRow.component';
import LibraryComponent from '@objects/components/library.component';
import ManagePeopleComponent from '@objects/components/managePeople.component';
import LoginPage from '@objects/pages/login.page';
import { expect, test } from '@playwright/test';

test.describe('User testing Suite', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto('http://localhost:8080/login');
        await loginPage.loginUser(`automation@test.com`, `temp123`);
        await page.waitForSelector('//h1', {timeout: 5000});
    })
    
    
    test('User logged in successfully', async ({ page }) => {
        expect(await page.locator('//h1').textContent()).toBe('Dashboard');
    });

    test('Validate mandatory fields', async ({ page }) => {
        await page.locator(`//button/span[text() = 'Add a Book']`).click();
        await page.locator(`//button[text() = 'Create']`).click();
        await page.waitForSelector(`div#root li div div:nth-child(2)`, {timeout: 5000});

        expect(await page.locator(`div#root li div div:nth-child(2)`).first().innerText()).toBe(`Please fill in both title and author fields`);
    });

    test('Add a book', async ({ page }) => {
        const bookTitle = "QA";
        const authorName = "Automation";
        const libraryComponent = new LibraryComponent (page);
        const addBookComponent = new AddBookComponent (page);
        const bookRowComponent = new BookRowComponent (page);
        await libraryComponent.clickAddBook();
        expect(addBookComponent.dialogHeader).toBeVisible();
        await addBookComponent.enterAuthorName(authorName);
        await addBookComponent.enterBookTitle(bookTitle);
        await addBookComponent.createBookRecord();
        expect(await bookRowComponent.getTaskTitle(bookTitle)).toEqual(authorName + " - " + bookTitle);
    });
    
    test('Add a new person', async ({ page }) => {
        const newPerson = "Tst-2406-1";
        const addNewPersonComponent = new AddPersonComponent (page);
        const libraryComponent = new LibraryComponent (page);
        const managePeopleComponent = new ManagePeopleComponent (page);
        await libraryComponent.clickAddPerson();
        await addNewPersonComponent.enterPersonName(newPerson);
        await addNewPersonComponent.addPerson();

        //Assert
        await libraryComponent.clickManagePeople();
        expect(await managePeopleComponent.isPersonPresent(newPerson)).toBe(true);

        //Delete the new created person - this should be with API call
        await managePeopleComponent.deletePerson(newPerson);
    });

    test('Delete a person successfully', async ({page})=>{
        const newPerson = "Tst-2406-2";
        const addNewPersonComponent = new AddPersonComponent (page);
        const libraryComponent = new LibraryComponent (page);
        const managePeopleComponent = new ManagePeopleComponent (page);
        await libraryComponent.clickAddPerson();
        await addNewPersonComponent.enterPersonName(newPerson);
        await addNewPersonComponent.addPerson();

        await libraryComponent.clickManagePeople();
        await managePeopleComponent.deletePerson(newPerson);
        expect (await managePeopleComponent.isPersonPresent(newPerson)).toBe(false)

    })

    test('Mark the book as completed', async ({page}) => {
        const bookTitle = "Luna";
        const authorName = "Vinka Sazdova";
        const libraryComponent = new LibraryComponent (page);
        const addBookComponent = new AddBookComponent (page);
        const bookRowComponent = new BookRowComponent (page);
        await libraryComponent.clickAddBook();
        expect(addBookComponent.dialogHeader).toBeVisible();
        await addBookComponent.enterAuthorName(authorName);
        await addBookComponent.enterBookTitle(bookTitle);
        await addBookComponent.createBookRecord();
        expect(await bookRowComponent.getTaskTitle(bookTitle)).toEqual(authorName + " - " + bookTitle);
        await bookRowComponent.toggleTaskCheckbox(bookTitle);

        //assert
        expect(await bookRowComponent.isTaskCompleted(authorName, bookTitle)).toBe(true);
        // await bookRowComponent.deleteTask(bookTitle);
    })


});
