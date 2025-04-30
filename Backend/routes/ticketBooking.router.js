const express = require("express");
const SeatModel = require("../models/seat.model");
const TicketBookingModel = require("../models/ticketBooking.model");
const { resetBooking, getSeats } = require("../controllers/ticketController");

const TicketBookingRouter = express.Router();

TicketBookingRouter.post("/book", async (req, res) => {
  try {
    const { userId, numberOfSeats } = req.body;

    if (numberOfSeats > 7) {
      return res.status(400).json({ msg: "Cannot book more than 7 seats at once" });
    }

    const existingSeats = await SeatModel.countDocuments();
    if (existingSeats < 80) {
      const seats = [];
      let seatNumber = 1;

      for (let row = 0; row < 11; row++) {
        for (let i = 0; i < 7; i++) {
          seats.push({seatNumber,rowNumber: row,isBooked: false,bookedBy: null});
          seatNumber++;
        }
      }

      for (let i = 0; i < 3; i++) {
        seats.push({seatNumber,rowNumber: 11,isBooked: false,bookedBy: null,});
        seatNumber++;
      }

      await SeatModel.insertMany(seats);
    }

    const allSeats = await SeatModel.find({ isBooked: false }).sort({seatNumber: 1});

    if (allSeats.length < numberOfSeats) {
      return res.status(400).json({ msg: `Booking Failed Only ${allSeats.length} seats available to book` });
    }

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
        const isConsecutive = window.every(
          (seat, idx, arr) =>
            idx === 0 || seat.seatNumber === arr[idx - 1].seatNumber + 1
        );
        if (isConsecutive) {
          selectedSeats = window;
          break;
        }
      }
      if (selectedSeats.length > 0) break;
    }

    if (selectedSeats.length === 0) {
      let minRange = Infinity;
      let bestGroup = [];

      for (let i = 0; i <= allSeats.length - numberOfSeats; i++) {
        const group = allSeats.slice(i, i + numberOfSeats);
        const range = group[numberOfSeats - 1].seatNumber - group[0].seatNumber;

        if (range < minRange) {
          minRange = range;
          bestGroup = group;
        }
      }

      selectedSeats = bestGroup;
    }

    const seatNumbers = selectedSeats.map((s) => s.seatNumber);

    await SeatModel.updateMany(
      { seatNumber: { $in: seatNumbers } },
      { isBooked: true, bookedBy: userId }
    );

    const booking = await TicketBookingModel.create({userId,seatNumbers,rowNumber: selectedSeats[0].rowNumber});

    res.status(200).json({msg: "Tickets booked successfully",booking,seats: selectedSeats});
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

    await SeatModel.updateMany({ seatNumber: { $in: booking.seatNumbers } },{ isBooked: false, bookedBy: null });

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Ticket cancelled successfully" });
  } catch (error) {
    res.status(500).json({msg: "Something went wrong, While canceling the ticket please try again later"});
  }
});

TicketBookingRouter.post("/reset", resetBooking);

TicketBookingRouter.get("/seats", getSeats);

module.exports = TicketBookingRouter;
