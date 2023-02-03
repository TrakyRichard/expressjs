const router = require("express").Router();
const { getAllUsers, getUser, getLoggedUser } = require("../controllers/users");
const { verifyUser } = require("../middleware/verifyUser");
const { verifyAdmin } = require("../middleware/verifyAdmin");
const { verifySession } = require("../middleware/verifySession");

router.route("/all").get(verifyAdmin, verifySession, getAllUsers);
router.route("/:id").get(getUser);
router.route("/").post(verifyUser, getLoggedUser);

module.exports = router;
