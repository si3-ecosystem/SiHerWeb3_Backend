const { verifyAuthToken } = require("../utils/auth.utils");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const authorizationParts = authorization.split(" ");

  if (authorizationParts.length === 2) {
    const authToken = authorizationParts[1];
    console.log(authToken);
    const user = verifyAuthToken(authToken);
    console.log(user);
    req.user = user;
    return next();
  }
  return res.status(401).send("Unauthorized");
};

module.exports = auth;
