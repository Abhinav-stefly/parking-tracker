const express = require('express');
const router = express.Router();

const {sendOTP } = require('../controllers/User')
const{resendOTP} = require('../controllers/User')
const {verifyEmail} = require('../controllers/User')
const {signIn} = require('../controllers/User')
router.post('/sendOTP', sendOTP);
router.post('/resendOTP', resendOTP);
router.post('/verifyEmail', verifyEmail);
router.post('/signIn', signIn);
module.exports = router;