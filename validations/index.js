function validate(data, schema) {
  const { error } = schema.validate(data)
  return error ? error.details[0].message : error
}

module.exports = {
  validate,
}
