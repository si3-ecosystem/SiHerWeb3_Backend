const express = require("express")

const User = require("../models/User.model")

const {
  validateRegisterUser,
  validateLoginUser,
} = require("../validations/user.validations")
const { encryptPassword, comparePassword } = require("../utils/password.utils")
const { generateAuthToken } = require("../utils/auth.utils")

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

router.get("/approve", async (req, res) => {
  const { email } = req.query

  const user = await User.findOne({ email })
  if (!user) return res.send("Invalid User")

  if (user.isApproved) return res.send("User already Approved")

  await User.findOneAndUpdate({ email }, { isApproved: true })

  return res.send("User successfully Approved")
})

router.post("/", async (req, res) => {
  const { body } = req

  const error = validateLoginUser(body)
  if (error) return res.status(400).send(error)

  const user = await User.findOne({ email: body.email })
  if (!user) return res.status(400).send("Invalid email or Password")

  if (!user.isApproved)
    return res.status(400).send("You are not an approved user")

  const isPasswordCorrect = await comparePassword(body.password, user.password)
  if (!isPasswordCorrect)
    return res.status(400).send("Invalid email or Password")

  const token = generateAuthToken({ ...user.toJSON(), password: undefined })
  return res.send({ token })
})

module.exports = router
