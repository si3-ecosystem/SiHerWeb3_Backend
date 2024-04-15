const mongoose = require("mongoose")

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isApproved: { type: Boolean, default: false },
  })
)

module.exports = User
