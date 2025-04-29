const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const saltRounds = 10;
var jwt = require("jsonwebtoken");

const UserRouter = express.Router();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

UserRouter.post("/register", async (req, res) => {
  try {
    const { password } = req.body;
    // console.log(password);
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        res.status(500).json({ msg: "Something went wrong" });
      } else {
        await UserModel.create({ ...req.body, password: hash });
        res.status(201).json({ msg: "Signup Successful" });
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await UserModel.findOne({ email });
  //console.log(user);
  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      res.status(500).json({ msg: "Something went wrong" });
    } else {
      if (result) {
        var token = jwt.sign({ userId: user._id},JWT_SECRET_KEY);
        res.status(200).json({ msg: "Login Successful", token });
      } else {
        res.status(403).json({ msg: "Wrong Password" });
      }
    }
  });
});

module.exports = UserRouter;
