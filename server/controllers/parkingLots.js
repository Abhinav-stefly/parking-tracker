const { date } = require('joi')
const BookedTimeSlot = require('../models/BookedTimeSlot')
const ParkingLot = require('../models/ParkingLot')
const ParkingSlot = require('../models/ParkingSlot')
const User = require('../models/User')
const sendEmail = require('../Utils/sendEmail')
const sendEmail2 = require('../Utils/sendEmail2')
const mongoose = require('mongoose');

exports.postParkingLot = async (req , res)=>{
  try{
if(!req.userId) {
  res.status(400).json({
    msg : "user not authorised"
  })
}

const reqUser = await User.findById(req.userId)
if(reqUser.role != 'admin' ){
  return res.status(400).json({
    msg : " unuthorized",
  })
}

var {parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng,openTime,closeTime,imgFiles,currTimeStamp,ownerName,mobileNo,emailID,type} = req.body

console.log(parkName,noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,lat,lng,openTime,closeTime,currTimeStamp,ownerName,mobileNo,emailID,type)

  //convert details to desired format
  noOfBikeSlots = parseInt(noOfBikeSlots)
  noOfCarSlots = parseInt(noOfCarSlots)
  parkingChargesBike = parseInt(parkingChargesBike)
  parkingChargesCar = parseInt(parkingChargesCar)
  openTime = Number(openTime)
  closeTime = Number(closeTime)
 
  const loc= []
  loc.push(parseFloat(lat));
  loc.push(parseFloat(lng));

  const locPoint = {
    type : "Point",
    coordinates : loc,
  }
  var newParkingLot ;
  if(type =='public'){
    parkingChargesBike=0;
    parkingChargesCar=0;

    newParkingLot = await ParkingLot.create({
      name : parkName,
      noOfBikeSlots,
      noOfCarSlots,
      address,
      parkingChargeBike,
      parkingChargeCar,
      location : locPoint,
      openTime : openTime,
      closeTime :closeTime,
    })
  }
  else {
    newParkingLot = await ParkingLot.create({
      name : parkName,
      noOfCarSlots,noOfBikeSlots,address,parkingChargesCar,parkingChargesBike,location:locPoint,openTime:openTime,closeTime:closeTime,ownerName,ownerEmail:emailID,ownermobileNo:mobileNo,type
    })
  }

  const carParkingSlotsIds = [];

  for(let i=0; i<noOfCarSlots;i++){
    let parkingslot = await ParkingSlot.create({
      parkingLot : newParkingLot._id,
      vehicleType :"Car",
    })
    carParkingSlotsIds.push(parkingslot);
  }

  const bikeParkingSlotsIds = [];

  for(let i=0; i<noOfBikeSlots;i++){
    let parkingslot = await ParkingSlot.create({
      parkingLot : newParkingLot._id,
      vehicleType :"Bike",
    })
    bikeParkingSlotsIds.push(parkingslot);
  }

  const update = await ParkingLot.findByIdAndUpdate(newParkingLot._id,{ bikeParkingSlots: bikeParkingSlotsIds, carParkingSlots : carParkingSlotsIds})
  

  if(type==="private"){
    const subject = '[Smart Parker] Your Parking Lot is now live'
const html = `
Dear ${ownerName},
    Congratulations! Our Team has verified the details you submitted regarding your parking lot ${parkName}. Your parking lot is now live on our website. 
    Our customers can book a parking slot in your parking lot . A notification email will be sent to you each time a booking at your parking lot will happen.
From,
Smart Parking Team`
const receiverMail=emailID
await sendEmail2({subject,html,receiverMail})
}

return res.status(200).json({msg:"Parking Lot Added"})
}
  catch(err) {
return res.status(500).json({
  msg :"something went wrong"
})
  }
}

exports.getParkingLots = async(req, res) =>{
  if(!req.userId){
    return res.status(400).json({
      msg :"unauthorised"
    })
  }
    try {
 var {lat, lng, startTime, endTime, vehicleType, currTime} = req.query ;

 const storebookingstart = new Date(startTime).getTime();

 const storebookingend = new date(endTime).getTime();

 const currtimestamp = new Date(currTime).getTime();

 const startTimeDayjs = dayjs(startTime);
 const endTimeDayjs = dayjs(endTime);
 console.log(startTimeDayjs.minute(), endTimeDayjs.minute());

if(storebookingend<=storebookingstart){
  return res.status(400).json({
    msg : "please enter correct frame"
  })
}
else if(storebookingstart<currtimestamp){
  return res.status(400).json({
    msg : "cannot book slot in a past"
  })
}

else if(new Date(startTime).getDate()> new Date(endTime).getDate()){
  return res.status(400).json({
    msg : "cannot book slot for more than one day"
  })
}
else if ((storebookingend - storebookingstart) / (1000 * 60 * 60) > 3) {
  return res.status(400).json({ msg: "Slot cannot be of more than three hours" })
}

console.log("finding booking")

lat = parseFloat(lat)
lng = parseFloat(lng)

let hrs1 = new Date(startTime).getHours()
let hrs2 = new Date(endTime).getHours()

var parkingLots = await ParkingLot.aggregate([{
  $geoNear :{
    "near":{
"types":"Point",
"coordinates" : [lat,lng]
    },
    "distanceField" :"distance",
    "spherical" : true,
    "maxDistance": 2000
  },
},
{
  $match : {
    isActive : true,
  } }
])

parkingLots = parkingLots.filter(lot =>{
    if(lot.openTime<=hrs1 & hrs2<=lot.closeTime){
        return true;
    }else{
        return false;
    }
})

let bookedParkingSlotsIds = await BookedTimeSlot.find({
  startTime :{
    $lt: storebookingend,
  },
  endTime :{
    $gt : storebookingstart
  },
  vehicleType : vehicleType,
  cancelled : false,
  paid: true,
},{
  id: 0,
  parkingSlot : 1
})

bookedParkingSlotsIds = bookedParkingSlotsIds.map(slotID =>slotID.toString())






    }
    catch (err){

    
  }
}