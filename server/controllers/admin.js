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
    LastName :'Parking',
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
  
}
