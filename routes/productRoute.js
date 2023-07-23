const {ProductsCreate  , ProductsUpdate , ProductDelete , ProductDetails, ProductsGet, createProductReview, getAllreviews, deleteReviews, allproduct, AdminAllProducts } = require('../controllers/productController')

const express = require('express')
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authCookie')
const router = express.Router()



// -> user
router.get('/allproduct'  , allproduct)

router.get('/product'  , ProductsGet) // , isAuthenticateUser

router.get('/product/:id' , ProductDetails ) // , isAuthenticateUser

router.put('/review/new' , isAuthenticateUser , createProductReview)

router.get('/allreview' , getAllreviews)

router.delete('/review/delete' , isAuthenticateUser  , deleteReviews)


// -> admin 

router.post('/admin/products' , isAuthenticateUser , authorizeRoles('admin') , AdminAllProducts)

router.post('/janaina/product/new/yes', isAuthenticateUser , authorizeRoles('admin') , ProductsCreate )

router.put('/product/:id', isAuthenticateUser , authorizeRoles('admin') , ProductsUpdate )

router.post('/product/:id', isAuthenticateUser , authorizeRoles('admin') , ProductDelete )



module.exports = router