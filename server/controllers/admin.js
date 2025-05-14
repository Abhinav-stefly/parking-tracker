const BookedTimeSlot = require('../models/BookedTimeSlot');
const User = require('../models/User')
const ParkingLot = require('../models/ParkingLot')
const sendEmail = require('../Utils/sendEmail')
const sendEmail2 = require('../Utils/sendEmail2')

exports.createAdmin = async (req, res) =>{
  const newUser = await User.create({
    email : 'smartParking123@gmail.com',
    password : 'admin123',
    firstName : 'Smart',
    lastName :'Parking',
    userName :"smparking",
    mobileNo : '3294210401',
    createdAt : new Date().toISOString(),
    verified : true,
    otp : '123',
    role :'admin',
  })

  return res.status(200).json({
    msg : 'Admin Created'
  })
}

exports.getUserName = async (req, res) =>{
  if(!req.userId) {
    return res.status(400).json({
      msg :"user not found"
    })
  }
  try {
const reqUser = await User.findById(req.userId);

var users = await User.find({role: "user"}, {firstName : 1, lastName : 1})

users = users.map(user =>({
  id : user._id,
  Name: user.firstName+" "+ user.lastName,
}))

res.status(200).json({
  msg :"Users List returned", userName : users
})
  }
  catch(err){
    return res.status(500).json({ msg: "Something went wrong" })
  }
}
