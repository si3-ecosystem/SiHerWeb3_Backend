const Joi = require("joi")
const { validate } = require(".")

const registerSubdomainSchema = Joi.object({
  subdomain: Joi.string().required().label("Subdomain"),
})

function validateRegisterSubdomainSchema(data) {
  return validate(data, registerSubdomainSchema)
}

module.exports = {
  validateRegisterSubdomainSchema,
}
