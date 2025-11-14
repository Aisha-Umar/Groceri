const express = require('express')
const router = express.Router()
const controller = require('../controllers/controllers')

// Page route
router.get('/', controller.getLanding)
router.get('/', controller.getSignUp)
router.get('/', controller.getLogin)
router.get('/getList', controller.getList)
router.post('/addItem', controller.addItem)
router.delete('/deleteItem', controller.deleteItem)
router.put('/editItem', controller.editItem)
router.put('/saveOrder', controller.saveOrder)

module.exports = router