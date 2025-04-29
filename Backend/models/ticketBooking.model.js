const mongoose = require("mongoose");

const ticketBooking = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  seatNumbers: [{type: Number, required: true}],
  rowNumber: {type: Number, required: true},
  bookingStatus: {type: String, enum: ["confirmed", "cancelled"], default: "confirmed"},
  bookingDate: {type: Date, default: Date.now},
});

const TicketBookingModel = mongoose.model("TicketBooking", ticketBooking);

module.exports = TicketBookingModel;
