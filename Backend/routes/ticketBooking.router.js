const express = require("express");
const SeatModel = require("../models/seat.model");
const TicketBookingModel = require("../models/ticketBooking.model");
const { resetBooking, getSeats } = require("../controllers/ticketController");

const TicketBookingRouter = express.Router();

TicketBookingRouter.post("/initialize", async (req, res) => {
  try {
    await SeatModel.deleteMany({});
    const seats = [];
    let seatNumber = 1;

    for (let row = 1; row <= 11; row++) {
      for (let i = 0; i < 7; i++) {
        seats.push({ seatNumber, rowNumber: row, isBooked: false });
        seatNumber++;
      }
    }

    for (let i = 0; i < 3; i++) {
      seats.push({ seatNumber, rowNumber: 12, isBooked: false });
      seatNumber++;
    }

    await SeatModel.insertMany(seats);
    res.status(200).json({ msg: "Seats initialized successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong, please try again" });
  }
});

TicketBookingRouter.post("/book", async (req, res) => {
  try {
    const { userId, numberOfSeats } = req.body;

    if (numberOfSeats > 7) {
      return res
        .status(400)
        .json({ message: "Cannot book more than 7 seats at once" });
    }

    const allSeats = await SeatModel.find({ isBooked: false }).sort({ seatNumber: 1 });

    const seatsByRow = {};
    for (const seat of allSeats) {
      if (!seatsByRow[seat.rowNumber]) seatsByRow[seat.rowNumber] = [];
      seatsByRow[seat.rowNumber].push(seat);
    }

    let selectedSeats = [];

    for (const row in seatsByRow) {
      const rowSeats = seatsByRow[row];
      for (let i = 0; i <= rowSeats.length - numberOfSeats; i++) {
        const window = rowSeats.slice(i, i + numberOfSeats);
        const isConsecutive = window.every((s, idx, arr) =>
          idx === 0 || s.seatNumber === arr[idx - 1].seatNumber + 1
        );

        if (isConsecutive) {
          selectedSeats = window;
          break;
        }
      }
      if (selectedSeats.length > 0) break;
    }

    if (selectedSeats.length === 0) {
      if (allSeats.length < numberOfSeats) {
        return res
          .status(400)
          .json({ message: "Not enough seats available to fulfill request" });
      }
      selectedSeats = allSeats.slice(0, numberOfSeats);
    }

    const seatNumbers = selectedSeats.map((s) => s.seatNumber);

    await SeatModel.updateMany(
      { seatNumber: { $in: seatNumbers } },
      { isBooked: true, bookedBy: userId }
    );

    const booking = await TicketBookingModel.create({
      userId,
      seatNumbers,
      rowNumber: selectedSeats[0].rowNumber,
    });

    res.status(200).json({
      msg: "Tickets booked successfully",
      booking,
      seats: selectedSeats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Something went wrong, please try again" });
  }
});


TicketBookingRouter.put("/cancel/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await TicketBookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    await SeatModel.updateMany(
      { seatNumber: { $in: booking.seatNumbers } },
      { isBooked: false, bookedBy: null }
    );

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong, While canceling the ticket please try again later",
    });
  }
});

TicketBookingRouter.post("/reset", resetBooking);

TicketBookingRouter.get("/seats", getSeats);

module.exports = TicketBookingRouter;
