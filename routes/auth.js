const router = express.Router()
const loginController = require('../controllers/loginController')
const signupController = require('../controllers/signupController')

router.get('/signup', signupController.getSignUp)
router.get('/login', loginController.getLogin)
router.post('/signup', signupController.signup)
router.post('/login', loginController.login)

module.exports = router