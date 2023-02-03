const router = require("express").Router();
const {
  createEvaluation,
  evaluateSomeone,
  evaluatedFeedback,
  adminEvaluation,
  getEvaluations,
  getAllEvaluations,
  getAnEvaluation,
  getEvaluator,
} = require("../controllers/evaluation");
const { verifyUser } = require("../middleware/verifyUser");
const { verifySession } = require("../middleware/verifySession");
const { verifyAdmin } = require("../middleware/verifyAdmin");

router.route("/create").post(verifyUser, verifySession, createEvaluation);
router.route("/evaluate").post(verifyUser, verifySession, evaluateSomeone);
router
  .route("/evaluate-back")
  .post(verifyUser, verifySession, evaluatedFeedback);
router
  .route("/admin-evaluation")
  .post(verifyAdmin, verifySession, adminEvaluation);
router.route("/:id").get(verifyUser, verifySession, getEvaluations);
router.route("/task/:id").get(verifyUser, verifySession, getEvaluator);
router.route("/one/:id").get(verifyAdmin, verifySession, getAnEvaluation);
router.route("/admin/:id").get(verifyAdmin, verifySession, getEvaluations);
router.route("/").get(verifyAdmin, verifySession, getAllEvaluations);

module.exports = router;
