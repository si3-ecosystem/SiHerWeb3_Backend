const Joi = require("joi")
const { validate } = require(".")

const registerSchema = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
})

function validateRegisterUser(data) {
  return validate(data, registerSchema)
}

function validateLoginUser(data) {
  return validate(data, loginSchema)
}

module.exports = {
  validateRegisterUser,
  validateLoginUser,
}
