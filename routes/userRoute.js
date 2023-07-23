
const { userRegister, userLogin, userLogout, ProfileMe, forgetPassword, ChangePassword, profileChange, allUsers, GetUser, deleteUser, userSetRole, updateUserRole} = require('../controllers/userControllers.js')

const express = require('express');
const { isAuthenticateUser, authorizeRoles } = require('../middleware/authCookie.js');
const router = express.Router();


// -> USER ROUTES
router.post('/register' , userRegister)

router.post('/login' , userLogin) 

router.get('/logout' , userLogout) 

router.post('/amerinfo' , isAuthenticateUser , ProfileMe ) 

router.post('/password/reset' , forgetPassword ) 

router.put('/password/change' , isAuthenticateUser , ChangePassword ) 

router.put('/me/change' , isAuthenticateUser , profileChange) 



// -> ADMIN ROUTES
router.post('/admin/users' , isAuthenticateUser , authorizeRoles('admin') , allUsers)

router.post('/admin/:id' , isAuthenticateUser , authorizeRoles('admin') , GetUser)

router.put('/admin/:id' , isAuthenticateUser , authorizeRoles('admin') , updateUserRole)

router.post('/admin/delete/:id' , isAuthenticateUser , authorizeRoles('admin') , deleteUser)





// -> EXPORTS Router
module.exports = router