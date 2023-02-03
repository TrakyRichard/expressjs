const evaluationModel = require("../models/evaluationSchema");
const checkEvaluationExistance = async (id, res) => {
  const foundEvaluation = await evaluationModel.findById(id);
  if (!foundEvaluation)
    return res.status(404).json({ message: "Evaluation not found" });
};
module.exports = checkEvaluationExistance;
