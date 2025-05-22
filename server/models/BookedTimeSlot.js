const mongoose = require('mongoose');

const BookedTimeSlotSchema = new mongoose.Schema({
  startTime :{
    type : Number,
  },
  endTime :{
    type : Number,
  },

  parkingLot : {
  type : mongoose.Schema.Types.ObjectId,
  },
  parkingSlot : {
    type : mongoose.Schema.Types.ObjectId,
    },
    vehicleType:{
      type:String,
      required:true
  },
    booker :{
      type : mongoose.Schema.Types.ObjectId
    },
    adminCancelled:{
      type:Boolean,
      default:false,
      required:true
  },
  cancelledAt:{
      type:Number
  },
  vehicleNo:{
      type:String,
      required:true
  },
  carImage:{
      type:String,
      required:true
  },
  orderID:{
      type:String
  },
  paymentDetails:{
      type:Object
  },
  paid:{
      type:Boolean,
      required:true,
      default:false
  },
  refunded:{
      type:Boolean,
  },
  refundDetails:{
      type:Object
  },
  cancelled :{
    type : Boolean,
    default : false
  },
  notified:{
      type:Boolean,
      default:false
  }
})

const BookedTimeSlot = mongoose.model('BookedTimeSlot',BookedTimeSlotSchema)
module.exports = BookedTimeSlot