import React, { useEffect, useState } from "react";
import "../styles/bookTicket.css";

const TOTAL_SEATS = 80;

const BookTicket = () => {
  const [bookedSeats, setBookedSeats] = useState(() => {
    const stored = localStorage.getItem("bookedSeats");
    return stored ? JSON.parse(stored) : [];
  });
  const [numToBook, setNumToBook] = useState("");
  const [justBooked, setJustBooked] = useState([]);

  useEffect(() => {
    localStorage.setItem("bookedSeats", JSON.stringify(bookedSeats));
  }, [bookedSeats]);

const handleBook = () => {
  const num = +numToBook;
  if (isNaN(num) || num < 1 || num > 7) return;

  const availableSeats = Array.from(
    { length: TOTAL_SEATS },
    (_, i) => i + 1
  ).filter((seat) => !bookedSeats.includes(seat));

  if (num > availableSeats.length) {
    alert("Not enough available seats");
    return;
  }

  const seatsPerRow = 7;
  let toBook = [];

  for (let row = 0; row < Math.ceil(TOTAL_SEATS / seatsPerRow); row++) {
    const rowStart = row * seatsPerRow + 1;
    const rowEnd = Math.min(rowStart + seatsPerRow - 1, TOTAL_SEATS);
    const rowSeats = [];

    for (let i = rowStart; i <= rowEnd; i++) {
      if (!bookedSeats.includes(i)) {
        rowSeats.push(i);
        if (rowSeats.length === num) {
          toBook = rowSeats;
          break;
        }
      } else {
        rowSeats.length = 0; 
      }
    }

    if (toBook.length > 0) break;
  }

  if (toBook.length === 0) {
    toBook = availableSeats.slice(0, num);
  }

  setBookedSeats((prev) => [...prev, ...toBook]);
  setJustBooked(toBook);
  setNumToBook("");
};


  const handleReset = () => {
    setBookedSeats([]);
    setJustBooked([]);
    setNumToBook("");
    localStorage.removeItem("bookedSeats");
  };

  return (
    <div className="main-container">
      <h1 className="main-header">Train Seat Booking</h1>
      <p className="sub-header">
        Simple and easy train seat reservation system
      </p>

      <div className="content-container">
        <div className="seat-section">
          <h2>Train Coach</h2>
          <div className="seats">
            {Array.from({ length: TOTAL_SEATS }, (_, i) => {
              const seatNumber = i + 1;
              const isBooked = bookedSeats.includes(seatNumber);
              return (
                <div
                  key={seatNumber}
                  className={`seat ${isBooked ? "booked" : "available"}`}
                >
                  {seatNumber}
                </div>
              );
            })}
          </div>
          <div className="legend">
            <span className="available-box"></span> Available
            <span className="booked-box"></span> Booked
          </div>
        </div>

        <div className="booking-info">
          <h2>Booking Information</h2>
          <p>
            <strong>Available Seats:</strong> {TOTAL_SEATS - bookedSeats.length}
          </p>
          <p>
            <strong>Max Selection:</strong> 7
          </p>

          {justBooked.length > 0 && (
            <div className="just-booked">
              <strong>Book Seats:</strong>
              <div className="booked-numbers">
                {justBooked.map((seat) => (
                  <span key={seat} className="booked-number">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          )}

          <input
            type="number"
            min="1"
            max="7"
            placeholder="Enter number of seats"
            value={numToBook}
            onChange={(e) => setNumToBook(e.target.value)}
            className="input-box"
          />
          <button onClick={handleBook}>Book Seats</button>
          <button className="reset" onClick={handleReset}>
            Reset All Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
