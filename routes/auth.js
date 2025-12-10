const express = require('express')
const router = express.Router()
const loginController = require('../controllers/loginController')
const signupController = require('../controllers/signupController')
const { ensureAuthenticated, forwardAuthenticated } = require('../middleware/authMiddleware');
const controllers = require('../controllers/controllers.js')

router.get('/signup', forwardAuthenticated, signupController.getSignUp)
router.get('/login', forwardAuthenticated, loginController.getLogin)
router.post('/signup', signupController.signup)
router.post('/login', loginController.login)
router.get('/dashboard', ensureAuthenticated, controllers.getDashboard)


module.exports = router