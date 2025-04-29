# 🚆 Train Seat Booking System

## Introduction

A full-stack seat reservation application for train coaches built with **Node.js**, **Express**, and **MongoDB**. This backend service provides smart ticket booking using a **sliding window algorithm** to prioritize consecutive seat allocation in the same row.

## Project Type

**Full Stack Project**

A complete MERN-based solution that integrates intelligent decision-making with beautiful frontend visuals and responsive user experience.

## Deployed App

👉 Frontend - [https://ticket-booking-application-flax.vercel.app/
](https://ticket-booking-application-flax.vercel.app/)

👉 Backend - [https://ticket-booking-application-6c5e.onrender.com ](https://ticket-booking-application-6c5e.onrender.com)

## Video Walkthrough

🎥 [Watch the Project Demo](https://drive.google.com/file/d/1NwStMAEdRGUaEZ3gJOvnpTVo01aWx2-V/view?usp=sharing)


## Features

- Initialize and reset 80 train seats.
- Book up to **7 seats** in a single request.
- Allocates seats **consecutively** if possible.
- Falls back to non-consecutive seats if needed.
- Stores booking history tied to user IDs.
- Fully RESTful API with clear error handling.

## Technologies Used

### Core Stack:

- **MongoDB, Express.js, React.js, Node.js, JWT, React charts**,TailwindCSS (MERN Stack)

## Directory Structure

```
FleetManagerPro/
├─ Frontend/
│ ├─ public/
│ ├─ src/
│ │ ├─ assets/
│ │ ├─ components/
│ │ │ ├─ Ticket-Booking/
│ │ │ ├─ Login/
│ │ │ └─ Register/
├─ server/
│ ├─ config/
│ ├─ controllers/
│ ├─ middlewares/
│ ├─ models/
│ │ ├─ schemas/
│ ├─ routes/
│ ├─ services/
│ ├─ utils/
```


### Dev Tools & Deployment:

- **Git & GitHub** – Version control
- **Vercel** – Frontend hosting and continuous deployment
- **Render** – Backend hosting and continuous deployment
- **Vite** – Fast development bundler and build tool


## Installation & Getting Started

### Prerequisites

Ensure the following tools are installed:

- Node.js (v14+)
- npm or Yarn
- Git
- MongoDB or MongoDB Atlas

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/ankithmandal09/Ticket-Booking-Application
cd Ticket-Booking-Application
    a. Install Frontend Dependencies
        cd Frontend
        npm install
        npm run dev
    b. Install Backend Dependencies
        cd Backend
        npm install
        npm start
Fire up the local host for both

```
## Show your support

Give a ⭐️ if you like this project!

