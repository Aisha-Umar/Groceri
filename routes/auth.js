const router = express.Router()
const loginController = require('../controllers/loginController')
const signupController = require('../controllers/signupController')

router.get('/signup', controller.getSignUp)
router.get('/login', controller.getLogin)
router.post('/signup', controller.signup)
router.post('/login', controller.login)

module.exports = router