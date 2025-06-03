const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = (db) => {
  const router = express.Router();

  // register new user

  router.post("/register", async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password || password.length < 6) {
      return response.status(400).send({ error: "Invalid input" });
    }

    try {
      const hashed_password = await bcrypt.hash(password, 10);

      const registerNewUserQuery = `
      INSERT INTO users (email, password) VALUES (?,?);`;

      await db.run(registerNewUserQuery, [email, hashed_password]);
      response.send({ message: "User Registered" });
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT") {
        return response.status(400).send({ error: "Email already exists" });
      }
      return response.status(400).send({ error: error.message });
    }
  });

  // authenticate user login details

  router.post("/login", async (request, response) => {
    const { email, password } = request.body;

    const getUserDataQuery = `
    SELECT * FROM users WHERE email = ? ;`;

    const dbUser = await db.get(getUserDataQuery, [email]);

    if (dbUser !== undefined) {
      const isValid = await bcrypt.compare(password, dbUser.password);
      if (isValid) {
        const payload = {
          id: dbUser.id,
        };

        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_CODE, {
          expiresIn: "1d",
        });
        return response.status(200).send({ jwt_token: jwtToken });
      }
      return response.status(401).send({ error: "Invalid Credentials" });
    }
    return response.status(401).send({ error: "User not found" });
  });

  return router;
};
