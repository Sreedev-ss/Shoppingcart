var express = require('express');
const app = require('../app');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  let products = [
    {
      name: "Iphone 14pro",
      category: "Mobile",
      description: "This is a brand new phone from apple.",
      image: "https://d2xamzlzrdbdbn.cloudfront.net/products/9e587711-afbd-4c1f-915a-c11fc9583eb722081222.jpg"
    },
    {
      name: "Samsung s22ultra",
      category: "Mobile",
      description: "This is the latest mobile of samsung.",
      image: "https://m.media-amazon.com/images/I/71PvHfU+pwL._SL1500_.jpg"
    },
    {
      name: "Nothing phone 1",
      category: "Mobile",
      description: "This is a mobile from new phone company.",
      image: "http://cdn.shopify.com/s/files/1/0604/7760/4036/products/nothing-phone-1-smartphone-8gb-128gb-black-32743325073604.jpg?v=1661459038"
    },
    {
      name: "Oneplus 10T",
      category: "Mobile",
      description: "This is a brand new phone from Oneplus.",
      image: "https://m.media-amazon.com/images/I/51oCRQJxIQL._SL1500_.jpg"
    },
    {
      name: "Macbook Pro - M1 max",
      category: "Laptop",
      description: "This is the latest laptop from apple.",
      image: "https://cdn.shopify.com/s/files/1/0568/5942/7015/products/MK1A3HN_A_2.png?v=1634727910"
    },
    {
      name: "Asus Zephyrus",
      category: "Laptop",
      description: "This is the best laptop rich in spec.",
      image: "https://www.notebookcheck.net/fileadmin/_processed_/d/2/csm_Asus_ROG_Zephyrus_G14_header_2_897fcb72a7.png"
    },
    {
      name: "Canon R5",
      category: "Electronics",
      description: "This is a professional camera from canon.",
      image: "https://fotocentreindia.com/wp-content/uploads/2020/07/Canon-EOS-R5-Mirrorless-Digital-Camera-Body-Only_01.jpg"
    },
    {
      name: "Voltas AC",
      category: "Electronics",
      description: "This is the best AC for lower price.",
      image: "https://www.reliancedigital.in/medias/Voltas-185V-JZJT-Air-Conditioners-581109800-i-1-1200Wx1200H-300Wx300H?context=bWFzdGVyfGltYWdlc3wzMTI1M3xpbWFnZS9qcGVnfGltYWdlcy9oODcvaDc3Lzk1NDQ5NDI2NDkzNzQuanBnfDcwMTFhN2I2ZmQxOTgxZDNjOTZlZTgwNTExMTg4NThmYzJmM2E0NzYxYjU5M2M1N2ExNWNiOTFlYjBlNTExMWI"
    }
  ]

  // console.log(user)
  res.render('user/view-products', { user, products, admin: false });

});
/* Login - get */
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/login', { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
})
/* Login - post */
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = true
      res.redirect('/login')
    }
  })
})
/* Logout */
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie()
  res.redirect('/login')
})
module.exports = router;
