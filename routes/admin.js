var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const { resolve } = require('promise');

/* GET users listing. */
router.get('/', function (req, res, next) {
  let products = [
    {
      name: 'Iphone 15',
      category: 'mobile',
      description: 'IOS,128GB,8gb ram',
      imageUrl: "https://tse4.mm.bing.net/th?id=OIP.RYd8HSOdXOMIRUg_RDmVNgHaHa&pid=Api&P=0&h=220"

    },
    {
      name: 'Samsung S23 Ultra',
      category: 'mobile',
      description: 'android,128GB,8gb ram',
      imageUrl: "https://tse1.mm.bing.net/th?id=OIP.FbyRka_9Vkq44hPT89LdFQHaFj&pid=Api&P=0&h=220"

    },
    {
      name: 'Oppo Reno 10 Pro',
      category: 'mobile',
      description: 'IOS,64GB,4gb ram',
      imageUrl: "https://tse1.mm.bing.net/th?id=OIP.SxggVaxeTcdbsUMyLlFJQQHaHa&pid=Api&P=0&h=220"

    },
    {
      name: 'Pixel 7 Pro',
      category: 'mobile',
      description: 'android,128GB,8gb ram',
      imageUrl: "https://tse3.mm.bing.net/th?id=OIP.ztlvzOUZS3gJ1OxW3XI_vgHaHa&pid=Api&P=0&h=220"

    },
    {
      name: 'Iphone 15',
      category: 'mobile',
      description: 'IOS,128GB,8gb ram',
      imageUrl: "https://tse4.mm.bing.net/th?id=OIP.RYd8HSOdXOMIRUg_RDmVNgHaHa&pid=Api&P=0&h=220"

    },
    {
      name: 'Samsung S23 Ultra',
      category: 'mobile',
      description: 'android,128GB,8gb ram',
      imageUrl: "https://tse1.mm.bing.net/th?id=OIP.FbyRka_9Vkq44hPT89LdFQHaFj&pid=Api&P=0&h=220"

    },
    {
      name: 'Oppo Reno 10 Pro',
      category: 'mobile',
      description: 'IOS,64GB,4gb ram',
      imageUrl: "https://tse1.mm.bing.net/th?id=OIP.SxggVaxeTcdbsUMyLlFJQQHaHa&pid=Api&P=0&h=220"

    },
    {
      name: 'Pixel 7 Pro',
      category: 'mobile',
      description: 'android,128GB,8gb ram',
      imageUrl: "https://tse3.mm.bing.net/th?id=OIP.ztlvzOUZS3gJ1OxW3XI_vgHaHa&pid=Api&P=0&h=220"

    },
    {
      name: 'Iphone 15',
      category: 'mobile',
      description: 'IOS,128GB,8gb ram',
      imageUrl: "https://tse4.mm.bing.net/th?id=OIP.RYd8HSOdXOMIRUg_RDmVNgHaHa&pid=Api&P=0&h=220"

    },
    {
      name: 'Samsung S23 Ultra',
      category: 'mobile',
      description: 'android,128GB,8gb ram',
      imageUrl: "https://tse1.mm.bing.net/th?id=OIP.FbyRka_9Vkq44hPT89LdFQHaFj&pid=Api&P=0&h=220"

    },
    {
      name: 'Oppo Reno 10 Pro',
      category: 'mobile',
      description: 'IOS,64GB,4gb ram',
      imageUrl: "https://tse1.mm.bing.net/th?id=OIP.SxggVaxeTcdbsUMyLlFJQQHaHa&pid=Api&P=0&h=220"

    },
    {
      name: 'Pixel 7 Pro',
      category: 'mobile',
      description: 'android,128GB,8gb ram',
      imageUrl: "https://tse3.mm.bing.net/th?id=OIP.ztlvzOUZS3gJ1OxW3XI_vgHaHa&pid=Api&P=0&h=220"

    },


  ]
  res.render('admin/view-products', { products, admin: true })
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
