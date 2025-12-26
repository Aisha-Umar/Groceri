const express = require('express')
const router = express.Router()
const controller = require('../controllers/controllers')
const { ensureAuthenticated } = require('../middleware/authMiddleware')
const { ensureApiAuth } = require('../middleware/authMiddleware')

// Page route
router.get('/', controller.getLanding)                                                                         
router.delete('/deleteItem', ensureAuthenticated, controller.deleteItem)
router.put('/editItem', ensureAuthenticated, controller.editItem)
// router.put('/saveOrder', ensureAuthenticated, controller.saveOrder)
// router.get('/getAllItems', ensureAuthenticated, controller.getAllItems)
router.post('/moveToPantry', ensureAuthenticated, controller.moveToPantry)
router.get('/dashboard', ensureAuthenticated, controller.getDashboard)
router.post('/saveItem', ensureApiAuth, controller.saveItem)


module.exports = router