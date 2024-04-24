const Joi = require("joi")
const { validate } = require(".")

const loginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
})

function validateLoginUser(data) {
  return validate(data, loginSchema)
}

module.exports = {
  validateLoginUser,
}
