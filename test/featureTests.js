const puppeteer = require('puppeteer');
const { assert } = require('chai');

let browser, page;
const port = 4000;

const seedNote1 = 'Go to the store';
const seedNote2 = 'Go to the store again';

describe('http://localhost:port/index.html', function() {
    beforeEach(async function() {
        browser = await puppeteer.launch();
        page = await browser.newPage();

        // Listen for browser console events for page debugging
        page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
        await page.goto(`http://localhost:${port}/index.html`);

        // Add initial notes to the page for testing purposes
        await page.type('.new-note-input', seedNote1);
        await page.click('.submit-note');
        await page.type('.new-note-input', seedNote2);
        await page.click('.submit-note');
    });

    afterEach(async function() {
        await browser.close();
    });
    
    describe('UI elements', function() {
        it('has a header section', async function() {
            const header = await page.$('header');

            assert.isNotNull(header);
        });

        it('has a "Notably" title', async function() {
            const expectedTitle = 'Notably';

            const title = await page.$eval('#app-title', element => element.innerText);

            assert.equal(title, expectedTitle);
        });

        it('has a filter input bar', async function() {
            const filterBar = await page.$('.filter');

            assert.isNotNull(filterBar);
        });

        it('filter input bar has placeholder text of "search"', async function() {
            const expectedPlaceholderText = 'search';

            const text = await page.$eval('.filter', element => element.placeholder);
            
            assert.equal(text, expectedPlaceholderText);
        });

        it('has a ul for notes', async function() {
            const ul = await page.$('.note-list');

            assert.isNotNull(ul);
        });

        it('has an li within ul', async function() {
            const li = await page.$('.note-list .note');
            
            assert.isNotNull(li);
        });

        it('li contains a delete button with text of "X"', async function() {
            const expectedText = "X";
            
            const delButton = await page.$('.note input[type=button]');
            const delButtonText = await page.evaluate((buttonInput => buttonInput.value), delButton);

            assert.isNotNull(delButton);
            assert.equal(delButtonText, expectedText);
        });

        it('has a div for adding new notes', async function() {
            const div = await page.$('.container.new-note-container');

            assert.isNotNull(div);
        });

        it('new note div has a title of "Add new note:"', async function() {
            const expectedTitle = 'Add new note:';

            const title = await page.$eval('.new-note-container h2', element => element.innerText);

            assert.equal(title, expectedTitle);
        });

        it('has a text field for inputting a new note', async function() {
            const textarea = await page.$('.new-note-input');

            assert.isNotNull(textarea);
        });

        it('has a submit button for adding new note', async function() {
            const newNoteSubmit = await page.$('.submit-note');

            assert.isNotNull(newNoteSubmit);
        });
    });

    describe('Add note', function() {
        it('adds a note when text is added to "Add new note:" button and "add" button is clicked', async function() {
            const expectedText = 'Walk the dog';

            await page.type('.new-note-input', expectedText);
            await page.click('.submit-note');
            const liTextArray = await page.evaluate(() => {
                return Array.from(document.getElementsByClassName('note'), element => element.innerText);
            });
            const newLiText = liTextArray.filter(text => {
                return text.includes(expectedText);
            })[0];

            assert.include(newLiText, expectedText);
        });

        it('clears text from "Add new note:" textarea when "add" button is clicked', async function() {
            const submittedText = 'Remember to drink your ovaltine'; // Initial text to submit with "Add new note"
            
            await page.type('.new-note-input', submittedText);
            await page.click('.submit-note');
            const textareaValue =  await page.$eval('.new-note-input', element => element.value);

            assert.isEmpty(textareaValue);
        });

        it('does not add a note when "Add new note:" textarea is blank and "add" button is clicked', async function() {
            const submittedText = '';
            const initialNumNotes = await page.evaluate(() => document.getElementsByClassName('note').length);

            await page.type('.new-note-input', submittedText);
            await page.click('.submit-note');
            const finalNumNotes = await page.evaluate(() => document.getElementsByClassName('note').length);

            assert.equal(finalNumNotes, initialNumNotes);
        });
    });

    describe('Delete note', function() {
        it('deletes note when delete button is clicked', async function() {
            const firstNoteText = await page.evaluate(() => {
                return document.querySelector('.note').innerText;
            });
            await page.click('.note input[type=button]');
            const lastNoteText = await page.evaluate(() => {
                return document.querySelector('.note').innerText;
            });

            assert.notEqual(lastNoteText, firstNoteText);
        });
    });

    describe('Filter notes', function() {
        it('displays both default seeded notes when "store" is typed into filter bar', async function() {
            const filterText = 'store';

            await page.type('.filter', filterText);
            // Search through all notes to ensure all have a "hidden" attribute of false
            isHiddenArray = await page.evaluate(() => {
                return Array.from(document.getElementsByClassName('note'), element => element.hidden);
            });

            isHiddenArray.forEach(bool => {
                assert.isFalse(bool);
            });
        });

        it('displays only 1 note when "again" is typed into filter bar', async function() {
            const filterText = 'again';
            const expectedNumVisible = 1;
            let numVisible = 0;

            await page.type('.filter', filterText);
            displayArray = await page.evaluate(() => {
                return Array.from(document.getElementsByClassName('note'), element => element.style.display);
            });
            displayArray.forEach(displayVal => {
                if (displayVal !== 'none') {
                    numVisible++;
                }
            });

            assert.equal(numVisible, expectedNumVisible);
        });

        it('displays no notes when "bird" is typed into filter bar', async function() {
            const filterText = 'bird';
            const expectedNumVisible = 0;
            let numVisible = 0;

            await page.type('.filter', filterText);
            displayArray = await page.evaluate(() => {
                return Array.from(document.getElementsByClassName('note'), element => element.style.display);
            });
            displayArray.forEach(displayVal => {
                if (displayVal !== 'none') {
                    numVisible++;
                }
            });

            assert.equal(numVisible, expectedNumVisible);
        });
    });
});