const bcrypt = require("bcrypt")

const comparePassword = (password, encryptedPassword) => {
  return bcrypt.compare(password, encryptedPassword)
}

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt()
  const encryptedPassword = await bcrypt.hash(password, salt)
  return encryptedPassword
}

module.exports = { comparePassword, encryptPassword }
