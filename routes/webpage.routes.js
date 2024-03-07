const express = require("express")
const { v4: uuidv4 } = require("uuid")

const auth = require("../middlewares/auth.middleware")

const { validateCreateWebpage } = require("../validations/webpage.validations")
const Webpage = require("../models/Webpage.model")
const {
  uploadJsonToFileStorage,
  getJsonFromFileStorage,
} = require("../utils/fileStorage.utils")

const router = express.Router()

router.post("/", auth, async (req, res) => {
  const { body, user } = req

  const error = validateCreateWebpage(body)
  if (error) return res.status(400).send(error)

  const dbWebpage = await Webpage.findOne({ user: user._id })
  if (dbWebpage) return res.status(400).send("Webpage already exists")

  const jsonData = JSON.stringify(body)
  const fileBlob = new Blob([jsonData], { type: "application/json" })
  const file = new File([fileBlob], `${uuidv4()}.json`, {
    type: "application/json",
  })

  const cid = await uploadJsonToFileStorage(file)

  const webpage = new Webpage({
    user: user._id,
    cid,
  })
  await webpage.save()

  return res.send({ webpage })
})

router.get("/", auth, async (req, res) => {
  const { user } = req

  const webpage = await Webpage.findOne({ user: user._id })
  if (!webpage) return res.status(404).send("Webpage not found")

  const { cid } = webpage
  const webpageJson = await getJsonFromFileStorage(cid)

  return res.send({ webpage: webpageJson })
})

module.exports = router
