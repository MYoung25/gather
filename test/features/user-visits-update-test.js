const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits the update page', () => {
    describe('posts an update', () => {
      it('update page is filled with current information', () => {
        const itemToCreate = buildItemObject();
        const updatedItem = {
          title: "grizzly bear",
          description: "this beauty is an absolute unit",
          imageUrl: "http://placebear.com/200/400"
        };
        browser.url('/items/create');
        browser.setValue('#title-input', itemToCreate.title);
        browser.setValue('#description-input', itemToCreate.description);
        browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
        browser.click('#submit-button');

        browser.click('.item-card a')
        browser.click('.update-button')

        browser.setValue('#title-input', updatedItem.title);
        browser.setValue('#description-input', updatedItem.description);
        browser.setValue('#imageUrl-input', updatedItem.imageUrl);
        browser.click('#submit-button');

        browser.click('.item-card a')

        assert.include(browser.getText('body'), updatedItem.title);
        assert.include(browser.getText('body'), updatedItem.description);
      });
    });
});

