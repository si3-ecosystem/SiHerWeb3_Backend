const Joi = require("joi")
const { validate } = require(".")

const loginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
})

const resetPasswordSchema = Joi.object({
  password: Joi.string().required().label("Password"),
})

function validateLoginUser(data) {
  return validate(data, loginSchema)
}

function validateResetPassword(data) {
  return validate(data, resetPasswordSchema)
}

module.exports = {
  validateLoginUser,
  validateResetPassword,
}
