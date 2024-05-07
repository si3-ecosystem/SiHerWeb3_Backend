const express = require("express")

const User = require("../models/User.model")

const { validateLoginUser } = require("../validations/user.validations")
const { encryptPassword, comparePassword } = require("../utils/password.utils")
const { generateAuthToken } = require("../utils/auth.utils")

const router = express.Router()

router.get("/approve", async (req, res) => {
  const { email } = req.query

  const user = await User.findOne({ email: email.toLowerCase() })
  if (user) return res.send("User already created")

  const newUser = new User({ email: email.toLowerCase() })
  await newUser.save()

  return res.send("User successfully Approved")
})

router.post("/", async (req, res) => {
  const { body } = req

  const error = validateLoginUser(body)
  if (error) return res.status(400).send(error)

  const user = await User.findOne({ email: body.email.toLowerCase() })
  if (!user) return res.status(400).send("Invalid email or Password")

  if (!user.password) {
    const updatedUser = await User.findOneAndUpdate(
      {
        email: body.email.toLowerCase(),
      },
      {
        password: await encryptPassword(body.password),
      }
    )
    const token = generateAuthToken({
      ...updatedUser.toJSON(),
      password: undefined,
    })
    return res.send({ token })
  }

  const isPasswordCorrect = await comparePassword(body.password, user.password)
  if (!isPasswordCorrect)
    return res.status(400).send("Invalid email or Password")

  const token = generateAuthToken({ ...user.toJSON(), password: undefined })
  return res.send({ token })
})

module.exports = router
