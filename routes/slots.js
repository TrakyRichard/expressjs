const router = require("express").Router();
const { createSlot, getSlots } = require("../controllers/slot");
const { verifyUser } = require("../middleware/verifyUser");
const { verifySession } = require("../middleware/verifySession");

router
  .route("/")
  .post(verifyUser, verifySession, createSlot)
  .get(verifyUser, verifySession, getSlots);

module.exports = router;
