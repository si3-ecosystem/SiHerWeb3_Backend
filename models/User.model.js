const mongoose = require("mongoose")

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    resetPasswordToken: { type: String },
  })
)

module.exports = User
