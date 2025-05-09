
const User = require('../models/User'); // Import the User model
const crypto = require('crypto'); // For generating OTP

const { loginValidator} = require('../validators/validators');
const jwt = require('jsonwebtoken');
const { generateOTP } = require('../Utils/generateOTP');
const sendEmail2 = require('../Utils/sendEmail2')

exports.sendOTP = async (req, res) =>{
  const {email, password, confirmPassword, firstName, lastName, userName, mobileNo, selectedImg, currTimeStamp} = req.body;

  const otpGenerated = generateOTP();
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

  const subject = "[Smart Parking] Welcome smart parker"
  const html = `
      Welcome to the club
          You are just one step away from becoming a smart parker
              Please enter the sign up OTP to get started
                          ${otpGenerated}
          If you haven't made this request. simply ignore the mail and no changes will be made`
  const receiverMail =email

  await sendEmail2({ html, subject, receiverMail })
  return res.status(200).json({msg : "user created succesfully. OTP sent to mail"})
}

exports.resendOTP = async (req, res) =>{
if(!req.body.email){
  return res.status(400).json({msg :"email is required"})
}

const existingUser = await User.findOne({email : req.body.email})
if(!existingUser){
  return res.status(400).json({msg :"no user exists"})
}

const otpGenerated = generateOTP();
if(!req.body.email){
  return res.status(400).json({msg :"otp not sent "})
}
const subject = "[Smart Parking] Welcome smart parker"
        const html = `
            Welcome to the club
            You are just one step away from becoming a smart parker
                Please enter the sign up OTP to get started
                            ${otpGenerated}
            If you haven't made this request. simply ignore the mail and no changes will be made`
        const receiverMail = req.body.email
        await sendEmail2({html,subject,receiverMail})

        await User.findByIdAndUpdate(existingUser._id,{otp:otpGenerated})
        console.log(`${existingUser.otp}`)
res.status(200).json({msg : "otp sent successfully"})
}

exports.verifyEmail = async (req, res) =>{
  const {email, otp} = req.body;
  if(!email || !otp){
    return res.status(400).json({msg : "email and otp are required"})
  }

  const existingUser = await User.findOne({email : email});
  if(!existingUser){
    res.status(400).json({msg : "user not found"})
  }
  if(otp !== existingUser.otp){
    return res.status(400).json({msg :"otp not matched"});
  }
  const updatedUser = await User.findByIdAndUpdate(existingUser._id,{verified : true,})
  if(!existingUser.verified){
    return res.status(400).json({msg : "user not verified"});
  }

  return res.status(200).json({msg :"user verified successfully"})
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