const express = require('express')
const router = express.Router()
const loginController = require('../controllers/loginController')
const signupController = require('../controllers/signupController')
const { ensureAuthenticated, forwardAuthenticated } = require('../middleware/authMiddleware');
const controller = require('../controllers/controllers')

router.get('/signup', forwardAuthenticated, signupController.getSignUp)
router.get('/login', forwardAuthenticated, loginController.getLogin)
router.post('/signup', signupController.signup)
router.post('/login', loginController.login)

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
});

module.exports = router