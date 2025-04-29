const express = require("express");
const connectToDB = require("./config/db.mongo");
const UserRouter = require("./routes/user.router");
require("dotenv").config();
var cors = require("cors");
const TicketBookingRouter = require("./routes/ticketBooking");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080

app.use("/users", UserRouter);
app.use("/bookTicket", TicketBookingRouter)

app.use((req, res) => {
    res.status(404).json({msg:"Request Not Found"})
})

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server Started at ${PORT}`);
})