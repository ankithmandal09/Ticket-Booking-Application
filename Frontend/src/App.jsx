import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BookTicket from "./components/BookTicket";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/book-ticket" element={<ProtectedRoute><BookTicket /></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
