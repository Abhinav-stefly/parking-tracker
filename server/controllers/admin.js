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

exports.getUserHistory = async (req, res)=>{
  if(!req.userId){
    return res.status(400).json({
      msg :"not authorised as admin"
    })
  }
    const reqUser = await User.findById(req.userId);


    if(reqUser.role !="admin"){
      return res.status(400).json({
        msg :"not authorised as admin"
      })
    }
    // /get-user-history?_id=64fghd56fd
  var bookedTimeSlots = await BookedTimeSlot.find({
    booker : req.query._id,
    paid : true,
  })

  if(bookedTimeSlots.length==0){
    return res.status(400).json({
      msg :"Booked slot of user not found"
    })
  }

  const lotsIds = [];
  for(let i=0; i<bookedTimeSlots.length; i++){
    if(!lotsIds.includes(bookedTimeSlots[i].parkingLot)){
      lotsIds.push(bookedTimeSlots[i].parkingLot)
    }
  }

  var parkingLots = await ParkingLot.find({
    _id :{$in : lotsIds},
  },{
    lotImages :0
  })

  var parkingLotMap ={}
  for(let lot of parkingLots){
    parkingLotMap[lot.id] ={
      _id : lot._id,
      name : lot.name,
      address: lot.address,
        location: lot.location.coordinates,
        parkingChargesBike: lot.parkingChargesBike,
        parkingChargesCar: lot.parkingChargesCar,
        type: lot.type
    }
  }

  bookedTimeSlots =bookedTimeSlots.map(timeSlot =>{
if(timeSlot.vehicleType=='Bike'){
  const charges = parkingLotMap[timeSlot.parkingLot].type =='public' ? 0 :
  ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLotMap[timeSlot.parkingLot].parkingChargesBike

  return {
    ...timeSlot._doc,
    parkingLot : parkingLotMap[timeSlot.parkingLot],
    startTime :dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),
    endTime :dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'),
    charges : charges
  }
}
else {
  const charges = parkingLotMap[timeSlot.parkingLot].type === "public"
  ? 0
  : ((timeSlot.endTime - timeSlot.startTime) / (1000 * 60 * 60)) * parkingLotMap[timeSlot.parkingLot].parkingChargesCar

return {
  ...timeSlot._doc,
  parkingLot: parkingLotMap[timeSlot.parkingLot],
  startTime: dayjs(timeSlot.startTime).format('YYYY-MM-DD HH:00'),
  endTime: dayjs(timeSlot.endTime).format('YYYY-MM-DD HH:00'),
  charges: charges
}
}
  } )
}
