const express = require('express')
const router = express.Router()
const controller = require('../controllers/controllers')

// Page route
router.get('/', controller.getLanding)
router.get('/signup', controller.getSignUp)
router.get('/login', controller.getLogin)
router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.get('/dashboard', controller.getDashboard)
router.post('/addItem', controller.addItem)
router.delete('/deleteItem', controller.deleteItem)
router.put('/editItem', controller.editItem)
router.put('/saveOrder', controller.saveOrder)

module.exports = router