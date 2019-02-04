const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

router.get('/items/create', async (req, res, next) => {
  res.render('create');
});

router.post('/items/create', async (req, res, next) => {
  const {title, description, imageUrl} = req.body

  const item = new Item({
    title, description, imageUrl
  })

  item.validateSync()

  if ( item.errors ) {
    res.status(400).render('create', {newItem: item})
  } else {
    await item.save()
    res.redirect('/')
  }

});

router.get('/items/:itemId', async (req, res) => {
  try {
    const item = await Item.findOne({_id: req.params.itemId})
    res.status(200).render('single-layout', { item })
  } catch (err) {
    const item = {
      title: "404: Item Not Found",
      description: "I'm sorry, we couldn't find this item, are you sure it exists?"
    }
    res.status(404).render('single-layout', { item })
  }

})

router.post('/items/:itemId/delete', async (req, res) => {
  try {
    await Item.remove({_id: req.params.itemId})
    res.redirect('/')
  } catch (err) {
    res.status(400).send()
  }

})

router.get('/items/:itemId/update', async (req, res) => {
  try {
    const item = await Item.findOne({_id: req.params.itemId})
    res.status(200).render('update', { item })
  } catch (err) {
    const item = {
      title: "404: Item Not Found",
      description: "I'm sorry, we couldn't find this item, are you sure it exists?"
    }
    res.status(404).render('single-layout', { item })
  }
})

router.post('/items/:itemId/update', async (req, res) => {
  const {title, description, imageUrl} = req.body
  const item = await Item.findOne({_id: req.params.itemId})

  item.title = title
  item.description = description
  item.imageUrl = imageUrl

  item.validateSync()

  if ( item.errors ) {
    res.status(400).render('update', { item })
  } else {
    item.save()
    res.redirect('/')
  }

})

module.exports = router;
