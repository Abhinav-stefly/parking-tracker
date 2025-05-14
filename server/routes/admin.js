const express = require('express');
const router = express.Router();

const {createAdmin} = require('../controllers/admin');
const {getUserName} = require('../controllers/admin');
const auth = require('../middleware/auth')
router.post('/createAdmin', createAdmin);
router.get('/getUserName', auth, getUserName);
module.exports = router;