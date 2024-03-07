const express = require("express")
const { v4: uuidv4 } = require("uuid")

const auth = require("../middlewares/auth.middleware")

const { validateCreateWebpage } = require("../validations/webpage.validations")
const Webpage = require("../models/Webpage.model")
const { uploadJsonToFileStorage } = require("../utils/fileStorage.utils")

const router = express.Router()

router.post("/", auth, async (req, res) => {
  const { body, user } = req

  const error = validateCreateWebpage(body)
  if (error) return res.status(400).send(error)

  const dbWebpage = await Webpage.findOne({ user: user._id })
  if (dbWebpage) return res.status(400).send("Webpage already exists")

  const buffer = Buffer.from(JSON.stringify(body))
  const file = new File(buffer, `${uuidv4()}.json`)

  const cid = await uploadJsonToFileStorage(file)

  const webpage = new Webpage({
    user: user._id,
    cid,
  })
  await webpage.save()

  return res.send({ webpage })
})

module.exports = router
