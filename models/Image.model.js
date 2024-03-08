const mongoose = require("mongoose")

const Image = mongoose.model(
  "Image",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cid: { type: String, required: true },
  })
)

module.exports = Image
