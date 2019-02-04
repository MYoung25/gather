const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const Item = require('../../models/item')

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/update', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:

  describe('GET', () => {
    it('contains the right item\'s information', async () => {
      const seedItem = await seedItemToDatabase()

      const response = await request(app)
          .get(`/items/${seedItem._id}/update`)


      assert.equal(response.status, 200)
      assert.equal(jsdom(response.text).querySelector('input#title-input').value, seedItem.title);
      assert.equal(jsdom(response.text).querySelector('textarea#description-input').value, seedItem.description);
      assert.equal(jsdom(response.text).querySelector('input#imageUrl-input').value, seedItem.imageUrl);

    })

    it('should display a 404 error if no item', async () => {
      const response = await request(app)
          .get('/items/none/update')

      assert.equal(response.status, 404)
      assert.include(parseTextFromHTML(response.text, '#item-title'), '404: Item Not Found')
      assert.include(parseTextFromHTML(response.text, '#item-description'), `I'm sorry, we couldn't find this item, are you sure it exists?`)
    })
  })


  describe('POST', () => {
    it('updates the item', async () => {
      const seedItem = await seedItemToDatabase()
      const toUpdate = {
        title: "grizzly bear",
        description: "this beauty is an absolute unit",
        imageUrl: "http://placebear.com/200/400"
      };

      const response = await request(app)
          .post(`/items/${seedItem._id}/update`)
          .type('form')
          .send({_id: seedItem._id, ...toUpdate})

      const updatedItem = await Item.findOne({_id: seedItem._id})

      assert.equal(response.status, 302)
      assert.equal(updatedItem.title, toUpdate.title)
      assert.equal(updatedItem.imageUrl, toUpdate.imageUrl)
      assert.equal(updatedItem.description, toUpdate.description)
    })

    it('should display an error if no title', async () => {
      const {_id, title, description, imageUrl} = await seedItemToDatabase();
      const itemToUpdate = {
        _id, description, imageUrl
      }
      const response = await request(app)
          .post(`/items/${itemToUpdate._id}/update`)
          .type('form')
          .send(itemToUpdate);

      const itemFound = await Item.findOne({ _id });

      assert.strictEqual(response.status, 400)
      assert.equal(itemFound.title, title)
      assert.include(parseTextFromHTML(response.text, 'form'), 'required')
    })

    it('should display an error if no description', async () => {
      const {_id, title, description, imageUrl} = await seedItemToDatabase();
      const itemToUpdate = {
        _id, title, imageUrl
      }
      const response = await request(app)
          .post(`/items/${itemToUpdate._id}/update`)
          .type('form')
          .send(itemToUpdate);

      const itemFound = await Item.findOne({ _id });

      assert.strictEqual(response.status, 400)
      assert.equal(itemFound.description, description)
      assert.include(parseTextFromHTML(response.text, 'form'), 'required')
    })

    it('should display an error if no title', async () => {
      const {_id, title, description, imageUrl} = await seedItemToDatabase();
      const itemToUpdate = {
        _id, description, title
      }
      const response = await request(app)
          .post(`/items/${itemToUpdate._id}/update`)
          .type('form')
          .send(itemToUpdate);

      const itemFound = await Item.findOne({ _id });

      assert.strictEqual(response.status, 400)
      assert.equal(itemFound.imageUrl, imageUrl)
      assert.include(parseTextFromHTML(response.text, 'form'), 'required')
    })

  })

});
