const Router = require('express').Router;
const userController = require('../controllers/user-controller');

const router = new Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('logout', userController.lougout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', userController.getusers);

module.exports = router;
