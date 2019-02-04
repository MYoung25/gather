const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:

  describe('renders a single item', () => {
    it('contains the right item\'s information', async () => {
      const seedItem = await seedItemToDatabase()

      const response = await request(app)
          .get(`/items/${seedItem._id}`)

      assert.equal(response.status, 200)
      assert.include(parseTextFromHTML(response.text, '#item-title'), seedItem.title)
      assert.include(parseTextFromHTML(response.text, '#item-description'), seedItem.description)
    })
  })

  describe('shows 404 error if no item', () => {
    it('should display a 404 error', async () => {
      const response = await request(app)
          .get('/items/none')

      assert.equal(response.status, 404)
      assert.include(parseTextFromHTML(response.text, '#item-title'), '404: Item Not Found')
      assert.include(parseTextFromHTML(response.text, '#item-description'), `I'm sorry, we couldn't find this item, are you sure it exists?`)
    })
  })

});
