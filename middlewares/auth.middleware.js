const { verifyAuthToken } = require("../utils/auth.utils");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const authorizationParts = authorization.split(" ");

  if (authorizationParts.length === 2) {
    const authToken = authorizationParts[1];
    const user = verifyAuthToken(authToken);
    req.user = user;
    return next();
  }
  return res.status(401).send("Unauthorized");
};

module.exports = auth;
