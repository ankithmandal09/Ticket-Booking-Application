const SeatModel = require("../models/seat.model");
const TicketBookingModel = require("../models/ticketBooking.model");

const resetBooking = async (req, res) => {
  try {
    await SeatModel.updateMany({}, { isBooked: false, bookedBy: null });

    await TicketBookingModel.deleteMany({});

    res.status(200).json({ success: true, msg: "All seats have been reset successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong, please try again" });
  }
};
    
    
const getSeats = async (req, res) => {
  try {
    const seats = await SeatModel.find();
      res.status(200).json({ msg: "List of seats",seats });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch seats" });
  }
};

module.exports = { resetBooking, getSeats};