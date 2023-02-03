const jwt = require("jsonwebtoken");
const verifyUser = async (req, res, next) => {
  if (!req.headers.authorization && !req.headers.Authorization)
    return res.status(401).json({ message: "Not Authorized" });
  const cookies = req.headers.Authorization || req.headers.authorization;
  if (!cookies) {
    res.status(404).json({ message: "No token found" });
  }
  const token = await cookies.split(" ")[1];
  try {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN);
    if (decoded.id || decoded.email) {
      req.id = decoded.id;
      next();
    }
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({ message: "Invalid token" });
  }
};
exports.verifyUser = verifyUser;
