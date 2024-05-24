var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');


/* GET users listing. */
router.get('/', function (req, res, next) {
  productHelper.getAllProducts().then((products) => {
    console.log(products)
    res.render('admin/view-products', { products, admin: true })
  })

});

router.get('/add-product', (req, res) => {
  res.render('admin/add-product')
})

router.post('/add-product', (req, res) => {
  console.log(req.body)
  console.log(req.files.image)
  productHelper.addProduct(req.body).then((id) => {

    let image = req.files.image
    image.mv('./public/product-images/' + id + '.jpg')
    console.log('product added successfully')
  })

  res.render('admin/add-product')
})

module.exports = router;
