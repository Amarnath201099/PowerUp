const jwt = require("jsonwebtoken");

require("dotenv").config();

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"]?.trim();
  if (authHeader !== undefined) {
    const jwtToken = authHeader.split(" ")[1];
    if (jwtToken === undefined) {
      return response.status(401).send({ error: "JWT Token not provided" });
    } else {
      jwt.verify(
        jwtToken,
        process.env.JWT_SECRET_CODE,
        async (error, payload) => {
          if (error) {
            return response.status(401).send({ error: "Invalid JWT Token" });
          } else {
            // attach payload to request
            request.user = payload;
            next();
          }
        }
      );
    }
  } else {
    return response.status(401).send({ error: "Authorization header missing" });
  }
};

module.exports = authenticateToken;
