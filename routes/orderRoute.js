const express = require('express');
const { createOrder, getSingleOrder, myOrders, allOrder, UpdateOrderStatus, deleteOrder, GETallOrder, OrderDelete } = require('../controllers/orderController');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authCookie')
const router = express.Router()



// -> user or admin login
router.post('/order/new' , isAuthenticateUser , createOrder )

router.post('/order/me' , isAuthenticateUser , myOrders )

router.post('/order/:id' , isAuthenticateUser , getSingleOrder )


// -> admin login

router.post('/admin/order/all' , isAuthenticateUser , authorizeRoles('admin') , allOrder)

router.post('/admin/order/delete/:id' , isAuthenticateUser , authorizeRoles('admin') , deleteOrder)

router.put('/admin/order/update/:id' , isAuthenticateUser , authorizeRoles('admin') , UpdateOrderStatus)


module.exports = router ;