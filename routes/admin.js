var express = require('express');
const { response } = require('../app');
const { PRODUCT_COLLECTION } = require('../config/collection');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const adminHelpers = require('../helpers/admin-helpers');
const session = require('express-session');




router.get('/', function (req, res, next) {
  let adminData = req.session.admin
  if (req.session.adminIn) {
    productHelper.getAllproduct().then((products) => {
      res.render('admin/view-products', { admin: true, add: true, products, adminData })
    })
  } else {
    res.redirect('/admin/admin-login')
  }
});
////////////////////////////////////////////////LOGIN////////////////////////////////////////////////////////

router.get('/admin-login', (req, res) => {
  if (req.session.adminIn) {
    res.redirect('/admin')
  } else {
    res.render('admin/admin-login', { admin: true, loginErr: req.session.adminloginErr })
    req.session.adminloginErr = false;
  }
})

router.post("/admin-login", (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {

      req.session.admin = response.admin
      req.session.adminIn = true;
      res.redirect('/admin')
    } else {
      req.session.adminloginErr = true
      res.redirect('/admin/admin-login')
    }
  })
})

router.get('/admin-logout', (req, res) => {

  req.session.admin = null
  req.session.adminIn = false;
  res.clearCookie()
  res.redirect('/admin/admin-login')

})

///////////////////////////////////////////////PRODUCT//////////////////////////////////////////////////////
router.get('/add-products', (req, res) => {
  res.render("admin/add-products", { admin: true, add: false })
})

router.post('/add-products', (req, res) => {
  console.log(req.body);
  console.log(req.files.Image)


  productHelper.addProduct(req.body, (insertedId) => {

    let image = req.files.Image
    let imageName = insertedId
    image.mv('./public/product-images/' + imageName + '.jpg', (err, done) => {
      if (!err) {
        res.redirect('add-products')
      } else {
        console.log(err)
      }
    })

  })
})

router.get('/delete-products/:id', (req, res) => {
  let proId = req.params.id
  productHelper.deleteProduct(proId).then((response) => {
    res.redirect("/admin")
  })
})

router.get('/edit-products/:id', async (req, res) => {
  let products = await productHelper.getProductdetails(req.params.id)
  // console.log(products)
  res.render('admin/edit-products', { products, admin: true })
})

router.post('/edit-products/:id', (req, res, next) => {
  let imageName = req.params.id
  productHelper.updateProduct(req.params.id, req.body).then(() => {

    if (!req?.files?.Image) {
      res.redirect('/admin')
    }
    else if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/product-images/' + imageName + '.jpg')
      res.redirect('/admin')

    }


  })

})


//////////////////////////////////////////////////USER///////////////////////////////////////////////////////
router.get('/view-user', (req, res) => {
  let adminData = req.session.admin
  if (req.session.adminIn) {
    adminHelpers.getAllusers().then((users) => {
      res.render('admin/view-user', { admin: true, users, add: true, split: false, adminData })
    })
  } else {
    res.redirect('/admin/admin-login')
  }

})

router.get('/add-user', (req, res) => {
  res.render('admin/add-user', { admin: true, split: false, show: true })
})

router.post('/add-user', (req, res) => {
  adminHelpers.addUsers(req.body).then((response)=> {
    if(response.status){

    res.send({vv: "Successfully added User"})
    }
    else{
      res.send({vv:"User already exist"})
    }
  })
})

router.get('/delete-user/:id', (req, res) => {
  let userId = req.params.id
  adminHelpers.deleteUser(userId).then((response) => {
    res.redirect("/admin/view-user")
  })
})

router.get('/edit-user/:id', async (req, res) => {
  let user = await adminHelpers.getUserdetails(req.params.id)
  console.log(user)
  res.render('admin/edit-user', { user, admin: true })
})

router.post('/edit-user/:id', (req, res) => {
  adminHelpers.updateUser(req.params.id, req.body).then(() => {
    res.redirect('/admin/view-user')
  })
})

module.exports = router;
