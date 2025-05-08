const express = require('express');
const router = express.Router();

const {sendOTP } = require('../controllers/User')

router.post('/sendOTP', sendOTP);

module.exports = router;