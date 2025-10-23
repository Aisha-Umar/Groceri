const express = require('express')
const router = express.Router()
const controller = require('../controllers/controllers')

router.get('/getList', controller.getList)
router.post('/addItem', controller.addItem)
router.delete('/deleteItem', controller.deleteItem)
router.put('/editItem', controller.deleteItem)

module.exports = router