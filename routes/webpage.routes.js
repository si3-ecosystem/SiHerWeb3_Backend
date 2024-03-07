const express = require("express")
const { validateCreateWebpage } = require("../validations/webpage.validations")

const router = express.Router()

router.post("/", (req, res) => {
  const { body } = req

  const error = validateCreateWebpage(body)
  if (error) return res.status(400).send(error)

  return res.send("Validated")
})

module.exports = router
