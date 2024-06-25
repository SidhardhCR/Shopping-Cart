var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userhelpers = require('../helpers/user-login-helpers');
const { helpers } = require('handlebars');
const { response } = require('../app');

var verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', async function (req, res, next) {
  let user = req.session.user
  let count
  if (user) {
    count = await userhelpers.getCount(req.session.user._id)
    console.log(count)
  }
  console.log(user)
  productHelper.getAllProducts().then((products) => {
    res.render('user/index', { products, admin: false, user, count });

  })


});

router.get('/login', (req, res) => {

  if (req.session.loggedIn) {

    res.redirect('/')
  } else {
    res.render('user/login', { 'error': req.session.err })
    req.session.err = null
  }

})


router.get('/signup', (req, res) => {
  res.render('user/signup')
})

router.post('/login', (req, res) => {
  console.log(req.body)
  userhelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    }
    else {
      req.session.err = 'Invalid email or password'
      res.redirect('/login')

    }
  })

})

router.post('/signup', (req, res) => {

  userhelpers.doSignup(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      console.log('sign up failed')
    }

  })

})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart', verifyLogin, async (req, res) => {

  let user = req.session.user
  console.log(user)
  let totalValue = await userhelpers.getTotalAmount(user._id)
  userhelpers.getCartProducts(req.session.user._id).then((cartProducts) => {
    res.render('user/cart', { user: user, cartProducts, totalValue });
  })

})

router.get('/add-to-cart/:id', verifyLogin, (req, res) => {
  console.log('api call')

  userhelpers.addToCart(req.params.id, req.session.user._id).then((response) => {
    res.json({ status: true })
  })

})

router.get('/remove-product/:id', (req, res) => {
  
  userhelpers.deleteCartProduct(req.params.id, req.session.user._id).then((response) => {
    res.redirect('/cart')
  })
})

router.post('/change-quantity', (req, res) => {
  
  userhelpers.changeQuantity(req.body).then(async (response) => {
    
    let total = await userhelpers.getTotalAmount(req.body.user)
    
    res.json({ status: true, remove: response, total: total })
  })
})

router.get('/place-order', verifyLogin, async (req, res) => {
  let user = req.session.user
  let total = await userhelpers.getTotalAmount(req.session.user._id)
  
  res.render('user/place-order', { total, user })
})
module.exports = router;
