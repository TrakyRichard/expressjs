const sessionModel = require("../models/session");
const verifySession = async (req, res, next) => {
  const index = req.id;
  const existSession = await sessionModel.findOne({ owner: index });
  if (!existSession) res.status(401).json({ message: "Unauthorize" });
  next();
};
exports.verifySession = verifySession;
