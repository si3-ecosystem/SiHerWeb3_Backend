const mongoose = require("mongoose")

const Webpage = mongoose.model(
  "Webpage",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cid: { type: String, required: true },
    subdomain: { type: String, required: true },
  })
)

module.exports = Webpage
