const express = require("express")

const User = require("../models/User.model")

const { validateRegisterUser } = require("../validations/user.validations")
const { encryptPassword } = require("../utils/passwords")

const router = express.Router()

router.post("/register", async (req, res) => {
  const { body } = req

  const error = validateRegisterUser(body)
  if (error) return res.status(400).send(error)

  const dbUser = await User.findOne({ email: body.email })
  if (dbUser) return res.status(400).send("User already registered.")

  const password = await encryptPassword(body.password)

  const user = new User({ ...body, password })
  const savedUser = await user.save()
  return res.send({ user: savedUser })
})

module.exports = router
