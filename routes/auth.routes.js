const express = require("express")
const crypto = require("crypto")

const User = require("../models/User.model")

const auth = require("../middlewares/auth.middleware")

const {
  validateLoginUser,
  validateResetPassword,
} = require("../validations/user.validations")
const { encryptPassword, comparePassword } = require("../utils/password.utils")
const { generateAuthToken } = require("../utils/auth.utils")
const { sendEmail } = require("../utils/email.utils")

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

  const token = generateAuthToken({
    ...user.toJSON(),
    password: undefined,
    resetPasswordToken: undefined,
  })
  return res.send({ token })
})

router.post("/forgot-password", auth, async (req, res) => {
  const { user } = req

  const token = crypto.randomBytes(20).toString("hex")

  await User.findByIdAndUpdate(user._id, { resetPasswordToken: token })

  await sendEmail(
    user.email,
    "Password Reset Link",
    `https://kara-backend.vercel.app/reset-password?token=${token}`
  )

  return res.send("Password Reset link was sent")
})

router.post("/reset-password", async (req, res) => {
  const { token } = req.query
  const { body } = req

  const error = validateResetPassword(body)
  if (error) return res.status(400).send(error)

  const password = await encryptPassword(body.password)

  const user = await User.findOneAndUpdate(
    { resetPasswordToken: token },
    { password, resetPasswordToken: null }
  )

  if(!user) return res.status(400).send("Could not update the user password")

  return res.send("Password Reset")
})

module.exports = router
