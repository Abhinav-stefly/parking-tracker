const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
  parkingLot : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'ParkingLot',
  },
  vehicleType :{
    type : String,
    required : true,
  }
})

const ParkingSlot = mongoose.model('ParkingSlot', ParkingSlotSchema);

module.exports = ParkingSlot