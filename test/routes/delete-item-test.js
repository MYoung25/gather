const {assert} = require('chai');
const request = require('supertest');
const Item = require('../../models/item')

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/delete', () => {
    beforeEach(connectDatabaseAndDropData);

    afterEach(diconnectDatabase);

    // Write your test blocks below:

    describe('GET', () => {
        it('request with id deletes the item', async () => {
            const seedItem = await seedItemToDatabase()

            const response = await request(app)
                .post(`/items/${seedItem._id}/delete`)
                .send()

            const itemFound = await Item.findOne({_id: seedItem._id})

            assert.equal(response.status, 302)
            assert.isNull(itemFound)
        })

        it('should display a 400 error if no item to delete', async () => {
            const response = await request(app)
                .post('/items/none/delete')
                .send()

            assert.equal(response.status, 400)
        })
    })

});
