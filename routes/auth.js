const router = require("express").Router();
const { loginUser, logout, refreshUserToken } = require("../controllers/auth");

router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/refresh").get(refreshUserToken);

module.exports = router;
