const mongoose = require('mongoose');
const PointSchema = require('./Point')
const ParkingLotSchema = new mongoose.Schema({
  name :{
    type : String,
    required : true,
  },
  address :{
    type : String,
    required : true,
  },
  noOfCarSlots :{
    type : Number,
    required : true
  },
  noOfBikeSlots :{
    type : Number,
    required : true
  },
  parkingChargeCar :{
    type : Number,
    required : true
  },
  parkingChargeBike :{
    type : Number,
    required : true
  },

  openTime : {
type : Number,
  },
  closeTime : {
    type : Number,
      },

      carParkingSlots : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ParkingSlot',
      },
      bikeParkingSlots :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ParkingSlot',
      },
      location : {
        type : PointSchema,
        required : true,
      },
      isActive :{
        type : Boolean,
        default : true,
      },
      ownerName : {
        type : String,
      },
      ownerEmail : {
        type : String
      },
      ownerEmail : {
        type : String
      },
      ownerEmail : {
        type : String
      },
      ownerMobileNo: {
        type : String
      },
type :{
  type : String,
  enum:['public', 'private'],
  default : 'public',
  required : true,
}

})

ParkingLotSchema.index({location :"2dsphere"})
const ParkingLot = mongoose.model('ParkingLot',ParkingLotSchema)

module.exports = ParkingLot