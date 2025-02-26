const express = require('express');
const { getUser, updateUser } = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Protected route to get user details
router.get('/', authenticate, getUser);

// Protected route to update user details
router.put('/', authenticate, updateUser);

module.exports = router;
