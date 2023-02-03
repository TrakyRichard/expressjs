const jwt = require("jsonwebtoken");
const verifyAdmin = async (req, res, next) => {
  if (!req.headers.authorization && !req.headers.Authorization)
    return res.status(401).json({ message: "Not Authorized" });
  const cookies = req.headers.Authorization || req.headers.authorization;
  if (!cookies) {
    return res.status(401).json({ message: "unauthorise" });
  }
  const token = await cookies.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    if (decoded.role === "admin" || decoded.role === "super-admin") {
      req.id = decoded.id;
      next();
    }
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ message: "unauthorise" });
  }
};
exports.verifyAdmin = verifyAdmin;
