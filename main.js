const express = require("express")
const mongoose = require("mongoose")

require("dotenv").config()

const authRoutes = require("./routes/auth.routes")
const imageRoutes = require("./routes/image.routes")
const webpageRoutes = require("./routes/webpage.routes")

const app = express()
app.use(express.json())

mongoose
  .connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/siher")
  .then(() => console.log("MongoDB connected"))

app.use("/api/auth", authRoutes)
app.use("/api/image", imageRoutes)
app.use("/api/webpage", webpageRoutes)

app.get("/", (_, res) => {
  return res.send("App")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
