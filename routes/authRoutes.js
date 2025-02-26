const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticate, logout);

router.get('/protected', authenticate, (req, res) => res.json({ message: 'Protected route' }));

module.exports = router;
