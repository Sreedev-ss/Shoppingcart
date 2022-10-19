var express = require('express');
const app = require('../app');
const userHelpers = require('../helpers/user-helpers');
var productHelper = require('../helpers/product-helpers');
const { response } = require('../app');
const session = require('express-session');
var router = express.Router();




var validation = {}
/* GET home page. */
router.get('/', function (req, res, next) {
  
  user =req.session.user

  
  productHelper.getAllproduct().then((products) => {
    res.render('user/view-products', { admin: false, products, user })
  })
});
/* Login - get */
router.get('/login', (req, res) => {
  if (req.session.userLoggedIn || req.session.userloggedInSign) {
    res.redirect('/')
    
  } else {
    res.render('user/login', { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
})

router.get('/signup', (req, res) => {
  if(req.session.userloggedInSign){
  res.redirect('/')
  }
  else{
    res.render('user/signup')
  }


})

router.post('/signup', (req, res) => {
 
  userHelpers.doSignup(req.body).then((response) => {
    if(response.status){
      req.session.userloggedInSign = true;
      req.session.user = response.userValue
      res.send({ll:"Login Successful"})
    }
    else{
      res.send({ll:"Email already exist"})
      
    }
    
})


})

/* Login - post */
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {

    if (response.status) {

      
      req.session.user = response.user
      req.session.userLoggedIn = true;
      res.redirect('/')
    } else {
      req.session.loginErr = true
      res.redirect('/login')
    }

  })
})
/* Logout */
router.get('/logout', (req, res) => {

  req.session.user = null
  req.session.userLoggedIn = false
  req.session.userloggedInSign = false
  res.clearCookie()
  res.redirect('/login')


})
module.exports = router;
