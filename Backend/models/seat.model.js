const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: {type: Number, required: true, unique: true},
  rowNumber: {type: Number, required: true},
  isBooked: {type: Boolean, default: false},
  bookedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
});

const SeatModel = mongoose.model("Seat", seatSchema);

module.exports = SeatModel;
