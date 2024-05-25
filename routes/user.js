var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
var userhelpers = require('../helpers/user-login-helpers')
/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user)
  productHelper.getAllProducts().then((products) => {
    res.render('user/index', { products, admin: false, user });
  })


});

router.get('/login', (req, res) => {
  res.render('user/login')
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
      res.redirect('/login')
    }
  })

})

router.post('/signup', (req, res) => {

  userhelpers.doSignup(req.body).then((response) => {
    console.log(response)
    res.redirect('/')
  })

})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
module.exports = router;
