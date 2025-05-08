
const User = require('../models/User'); // Import the User model
const crypto = require('crypto'); // For generating OTP

const { loginValidator} = require('../validators/validators');
const jwt = require('jsonwebtoken');

exports.sendOTP = async (req, res) =>{
  const {email, password, confirmPassword, firstName, lastName, userName, mobileNo, selectedImg, currTimeStamp} = req.body;

  const otpGenerated = "12345";
  const newUser = await User.create({
    email : email,
     password : password,
    firstName : firstName,
    lastName : lastName,
    userName : userName,
    mobileNo : mobileNo,
    profilePic : selectedImg,
    createdAt : new Date(currTimeStamp).toISOString(),
    otp : otpGenerated,
  })

  if(!newUser){
return res.status(400).json({msg : "user not created"})
  }
  return res.status(200).json({msg : "user created succesfully"})
}

exports.signIn = async (req, res) =>{
  const {email, password} = req.body;
const {error} = loginValidator.validate({email,password});
console.log(error)
  try{
if(error){
  return res.status(400).json({msg : error.details[0].message})
}

const oldUser = await User.findOne({email : email});

if(!oldUser){
  return res.status(400).json({msg : "user not found"})
}

if(!oldUser.verified){
  return res.status(400).json({
    msg : " Please verify your account first! Check the otp sent on mail during registration"
  })
}

const payload = {
  email : oldUser.email,
  id : oldUser._id,
  role : oldUser.role
}
const token = jwt.sign(payload, process.env.TOKEN_SECRET,{expiresIn : '3h'})

console.log("token signed");

return res.status(200).json(token)
  }
  catch(err){
    return res.status(500).json({msg : "something went wrong"})
  }
}