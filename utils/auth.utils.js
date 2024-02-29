const jwt = require("jsonwebtoken")

const jwtSecret = process.env.JWT_SECRET

const generateAuthToken = (user) => {
  const authToken = jwt.sign(user, jwtSecret)
  return authToken
}

module.exports = { generateAuthToken }
