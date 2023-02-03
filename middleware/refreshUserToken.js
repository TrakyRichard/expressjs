const jwt = require("jsonwebtoken");
const User = require("../models/users");
const createJwtToken = require("../utilities/createJwtToken");
const accessTokenKey = process.env.ACCESS_TOKEN;
const refreshTokenKey = process.env.REFRESH_TOKEN;
const refreshUserToken = async (req, res) => {
  const token = req.body.accessToken;
  let accessToken, refreshToken;
  if (!token) return res.sendStatus(401).json({ message: "Filed required" });
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
  if (!decoded)
    return res.Status(403).json({ message: "User validation failed" });

  const user = await User.findById(decoded.id);
  payload = {
    id: user._id,
    email: user.email,
    role: "candidat",
  };
  accessToken = await createJwtToken(payload, accessTokenKey, "1h");
  refreshToken = await createJwtToken(payload, refreshTokenKey, "7d");
  res.cookie("refreshToken", refreshToken, {
    maxAge: 900000,
    httpOnly: true,
  });
  return res.status(201).json({ accessToken });
};
module.exports = refreshUserToken;
