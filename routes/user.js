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


  userhelpers.getCartProducts(req.session.user._id).then((cartProducts) => {
    res.render('user/cart', { user, cartProducts });
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
  console.log(req.body)
  userhelpers.changeQuantity(req.body).then((response) => {
    console.log(response)
    res.json({ status: true, product: response })
  })
})
module.exports = router;
