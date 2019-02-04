const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits a single item', () => {

    describe('can navigate to a created item\'s page', () => {

        it('includes a created item\'s description on the item page', () => {
            const itemToCreate = buildItemObject();
            browser.url('/items/create');
            browser.setValue('#title-input', itemToCreate.title);
            browser.setValue('#description-input', itemToCreate.description);
            browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
            browser.click('#submit-button');

            browser.click('.item-card a')

            assert.include(browser.getText('body'), itemToCreate.description);

        });

    });

});
