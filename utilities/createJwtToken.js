const jwt = require("jsonwebtoken");

const createToken = async (payload, key, duration) => {
  const token = await jwt.sign(payload, key, {
    expiresIn: duration,
  });
  return token;
};

module.exports = createToken;
