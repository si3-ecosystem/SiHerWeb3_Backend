const jwt = require("jsonwebtoken")

const jwtSecret = process.env.JWT_SECRET

const generateAuthToken = (user) => {
  const authToken = jwt.sign(user, jwtSecret)
  return authToken
}

const verifyAuthToken = (authToken) => {
  const user = jwt.verify(authToken, jwtSecret)
  return user
}

module.exports = {
  generateAuthToken,
  verifyAuthToken,
}
