import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOTAL_SEATS = 80;
const API_URL =
  "https://ticket-booking-application-6c5e.onrender.com/bookTicket";

const BookTicket = () => {
  const navigate = useNavigate();
  const [bookedSeats, setBookedSeats] = useState(() => {
    const savedSeats = localStorage.getItem("bookedSeats");
    return savedSeats ? JSON.parse(savedSeats) : [];
  });
  const [numToBook, setNumToBook] = useState("");
  const [justBooked, setJustBooked] = useState([]);

  useEffect(() => {
    fetchBookedSeats();
  }, []);

  useEffect(() => {
    localStorage.setItem("bookedSeats", JSON.stringify(bookedSeats));
  }, [bookedSeats]);

  const fetchBookedSeats = async () => {
    try {
      const response = await axios.get(`${API_URL}/seats`);
      const booked = response.data
        .filter((seat) => seat.isBooked)
        .map((seat) => seat.seatNumber);
      if (booked.length > 0) {
        setBookedSeats(booked);
      }
    } catch (error) {
      toast.error("Failed to fetch seat status",error);
    }
  };

  const handleBook = async () => {
    const num = +numToBook;
    if (isNaN(num) || num < 1 || num > 7) {
      toast.warn("Please enter a valid number between 1 and 7");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(`${API_URL}/book`, {
        userId,
        numberOfSeats: num,
      });

      if (response.status === 200) {
        const booked = response.data.seats.map((seat) => seat.seatNumber);
        setJustBooked(booked);
        setBookedSeats((prev) => [...prev, ...booked]);
        setNumToBook("");
        toast.success("Seats booked successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(`${API_URL}/reset`);
      setBookedSeats([]);
      setJustBooked([]);
      setNumToBook("");
      localStorage.removeItem("bookedSeats"); 
      toast.success("Booking reset successful");
    } catch (error) {
      toast.error("Failed to reset bookings",error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const allBookedSeats = bookedSeats;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-1">Train Seat Booking</h1>
          <p className="text-gray-600 text-sm">
            Simple and easy train seat reservation system
          </p>

          <div className="mt-4 flex justify-center items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center lg:flex-row lg:justify-center gap-8">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-center">
              Train Coach
            </h2>
            <div className="flex justify-center">
              <div className="space-y-2">
                {Array.from({ length: Math.ceil(TOTAL_SEATS / 7) }).map(
                  (_, row) => {
                    const startSeat = row * 7 + 1;
                    const endSeat = Math.min(startSeat + 6, TOTAL_SEATS);
                    return (
                      <div key={row} className="flex justify-center space-x-2">
                        {Array.from({ length: endSeat - startSeat + 1 }).map(
                          (_, col) => {
                            const seatNumber = startSeat + col;
                            const isBooked =
                              allBookedSeats.includes(seatNumber);
                            return (
                              <div
                                key={seatNumber}
                                className={`w-10 h-10 flex items-center justify-center rounded ${
                                  isBooked ? "bg-orange-500" : "bg-green-500"
                                } text-white font-medium`}
                              >
                                {seatNumber}
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="flex justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow w-full max-w-xs">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-center">
              Booking Information
            </h2>
            <div className="space-y-4 text-center">
              <div>
                <p className="font-medium">
                  Available Seats: {TOTAL_SEATS - bookedSeats.length}
                </p>
                <p className="font-medium">
                  Booked Seats: {bookedSeats.length}
                </p>
              </div>
              <p className="font-medium">Max Seats Selection: 7</p>

              {justBooked.length > 0 && (
                <div className="bg-gray-100 p-3 rounded">
                  <p className="font-medium mb-1">Your Booked Seats:</p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {justBooked.map((seat) => (
                      <span
                        key={seat}
                        className="bg-orange-500 text-white px-2 py-1 rounded text-xs"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-left">
                <label className="block text-sm font-medium mb-1">
                  Enter number of seats
                </label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={numToBook}
                  onChange={(e) => setNumToBook(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleBook}
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                Book Seats
              </button>
              <button
                onClick={handleReset}
                className="w-full py-2 bg-white text-red-500 border border-red-500 rounded hover:bg-red-50 cursor-pointer"
              >
                Reset Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
