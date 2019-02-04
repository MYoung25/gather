const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  // Write your tests below:

  describe('title', () => {
    it('should be a string', () => {
      const title = 25;
      const item = new Item({
        title: title
      })

      assert.strictEqual(item.title, title.toString())
    })

    it('is required', () => {
      const noTitleItem = new Item({
        description: "describe",
        imageUrl: "http://placebear.com/200/300"
      })

      noTitleItem.validateSync()

      assert.equal(noTitleItem.errors.title.message, 'Path `title` is required.')
    })
  })

  describe('description', () => {
    it('should be a string', () => {
      const description = 5;
      const item = new Item({
        description: description
      })

      assert.strictEqual(item.description, description.toString())
    })

    it('is required', () => {
      const noDescription = new Item({
        title: "title",
        imageUrl: "http://placebear.com/200/300"
      })

      noDescription.validateSync()

      assert.equal(noDescription.errors.description.message, 'Path `description` is required.')
    })
  })

  describe('imageUrl', () => {
    it('should be a string', () => {
      const imageUrl = 5;
      const item = new Item({
        imageUrl: imageUrl
      })

      assert.strictEqual(item.imageUrl, imageUrl.toString())
    })

    it('is required', () => {
      const noImage = new Item({
        title: "title",
        description: "description"
      })

      noImage.validateSync()

      assert.equal(noImage.errors.imageUrl.message, 'Path `imageUrl` is required.')
    })
  })
});
