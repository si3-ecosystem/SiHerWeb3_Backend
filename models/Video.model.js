const mongoose = require("mongoose")

const Video = mongoose.model(
  "Video",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cid: { type: String, required: true },
  })
)

module.exports = Video
