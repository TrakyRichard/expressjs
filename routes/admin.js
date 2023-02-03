const router = require("express").Router();
const { editAdminRole, createAdmin } = require("../controllers/admin");
const { verifySession } = require("../middleware/verifySession");
const { verifyAdmin } = require("../middleware/verifyAdmin");
router.route("/create").post(verifyAdmin, verifySession, createAdmin);
router.route("/edit").put(verifyAdmin, verifySession, editAdminRole);

module.exports = router;
