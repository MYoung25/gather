const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/items/create');

      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'input#imageUrl-input'), '');

    });
  });

  describe('POST', () => {
    it('creates a new item in the database', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      const createdItem = await Item.findOne(itemToCreate)

      assert.isOk(createdItem, 'Item was not created successfully in the database.')
    });

    it('redirects to the index page after object creation', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);

      assert.strictEqual(response.status, 302)
      assert.equal(response.headers.location, '/')
    })

    it('should display an error if no title', async () => {
      let itemToCreate = buildItemObject();
      delete itemToCreate.title
      const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);

      const itemFound = await Item.findOne(itemToCreate);
      assert.isNull(itemFound)
      assert.strictEqual(response.status, 400)
      assert.include(parseTextFromHTML(response.text, 'form'), 'required')

    })

    it('should display an error if no description', async () => {
      let itemToCreate = buildItemObject();
      delete itemToCreate.description
      const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);

      const itemFound = await Item.findOne(itemToCreate);
      assert.isNull(itemFound)
      assert.strictEqual(response.status, 400)
      assert.include(parseTextFromHTML(response.text, 'form'), 'required')

    })

    it('should display an error if no imageUrl', async () => {
      let itemToCreate = buildItemObject();
      delete itemToCreate.imageUrl
      const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);

      const itemFound = await Item.findOne(itemToCreate);
      assert.isNull(itemFound)
      assert.strictEqual(response.status, 400)
      assert.include(parseTextFromHTML(response.text, 'form'), 'required')

    })

  });

});
