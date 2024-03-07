const express = require("express")

const auth = require("../middlewares/auth.middleware")

const { validateCreateWebpage } = require("../validations/webpage.validations")

const router = express.Router()

router.post("/", auth, (req, res) => {
  const { body, user } = req

  const error = validateCreateWebpage(body)
  if (error) return res.status(400).send(error)

  return res.send({ user })
})

module.exports = router
