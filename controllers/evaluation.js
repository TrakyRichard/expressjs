const evaluationModel = require("../models/evaluationSchema");
const slotModel = require("../models/slotSchema");
const admins = require("../models/admins");
const tourModel = require("../models/tourSchema");
const staffIncrement = require("../utilities/staffIncrement");
const createTourTable = require("../utilities/createTourTable");
const users = require("../models/users");
/*
@create evaluation
@evaluate someone
@evaluated feedback
@admin evaluation
@get user evaluations
@get all evaluations
*/

// { [exercise] , pass } format Boolean (exercise array of 5Bool),
//feedbackText format text, {ampathie ,assiduite,comprehension} range 1-5
//evaluationID,evaluatedID,evaluatorID

//get user evaluations
const getEvaluations = async (req, res) => {
  console.log("ah");
  const { id } = req.params;
  //input validation
  if (!id) return res.status(400).json({ message: "all fields are required" });
  try {
    const evaluations = await evaluationModel.find({
      "evaluated.evaluatedId": id,
    });
    if (!evaluations) return res.send([]);
    return res.send(evaluations);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
//get evaluator
const getEvaluator = async (req, res) => {
  console.log("yo");
  const { id } = req.params;
  //input validation
  if (!id) return res.status(400).json({ message: "all fields are required" });
  try {
    let evaluations1 = await evaluationModel.find({
      "evaluator1.evaluatorId": id,
    });
    let evaluations2 = await evaluationModel.find({
      "evaluator2.evaluatorId": id,
    });
    if (!evaluations1) evaluations1 = [];
    if (!evaluations2) evaluations2 = [];
    return res.send(...evaluations1, evaluations2);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
const getAnEvaluation = async (req, res) => {
  const { id } = req.params;
  //input validation
  if (!id) return res.status(400).json({ message: "all fields are required" });
  try {
    const evaluations = await evaluationModel.findById(id);
    return res.send(evaluations);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await evaluationModel.find();
    return res.send(evaluations);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

//admin evaluation
const adminEvaluation = async (req, res) => {
  const { evaluatedId, evaluationId, exercises, pass } = req.body;

  //input validation
  if (!evaluationId || !exercises.length || !evaluatedId)
    return res.status(400).json({ message: "all fields are required" });

  //check for evaluation existence
  const foundEvaluation = await evaluationModel.findById(evaluationId);
  if (!foundEvaluation)
    return res.status(404).json({ message: "Evaluation not found" });

  //assign admin evaluation
  foundEvaluation.passage.exercises = exercises;
  //check user existence
  const evaluated = await users.findById(evaluatedId);
  if (!evaluated) return res.status(404).json({ message: "no user found" });

  //change the level state
  const points = exercises.filter((exercise) => exercise === true).length;
  if (pass) {
    evaluated.levels[foundEvaluation.level - 1].state.currently = "passed";
    if (evaluated.levels[foundEvaluation.level - 1].points < points) {
      evaluated.levels[foundEvaluation.level - 1].points = points;
      evaluated.levels[foundEvaluation.level - 1].exercises = exercises;
    }
  } else {
    evaluated.levels[foundEvaluation.level - 1].state.currently = "retry";
    evaluated.levels[foundEvaluation.level - 1].retryCount += 1;
    evaluated.levels[foundEvaluation.level - 1].startDate.push(new Date());
  }
  evaluated.evaluationPoints -= 1;
  foundEvaluation.isDone = true;

  //go to the next level
  const nextLevel = foundEvaluation.level < 10;
  if (nextLevel) {
    evaluated.levels[foundEvaluation.level].state.currently = "ongoing";
    evaluated.levels[foundEvaluation.level].state.unlocked = true;
    evaluated.levels[foundEvaluation.level].startDate.push(new Date());
  }

  //save exercise
  try {
    await evaluated.save();
    const savedEvaluation = await foundEvaluation.save();
    return res.send(savedEvaluation);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

//evaluated feedback
const evaluatedFeedback = async (req, res) => {
  const {
    evaluationId,
    evaluatedId,
    feedbackText,
    ampathie,
    assiduite,
    evaluatorId,
  } = req.body;

  //inputs validation
  if (
    !evaluationId ||
    !feedbackText ||
    !ampathie ||
    !assiduite ||
    !evaluatedId ||
    !evaluatorId
  )
    return res.status(400).json({ message: "all fields are required" });

  //check for evaluation existance
  const foundEvaluation = await evaluationModel.findById(evaluationId);
  if (!foundEvaluation)
    return res.status(404).json({ message: "Evaluation not found" });

  //check evaluator position
  let evaluatorPosition = ""; //check the evaluator position
  if (foundEvaluation.evaluator1.evaluatorId._id == evaluatorId)
    evaluatorPosition = "evaluator1";
  else evaluatorPosition = "evaluator2";

  //save feedback
  const feedback = {
    text: feedbackText,
    ampathie,
    assiduite,
  };
  if (evaluatorPosition === "evaluator1") {
    foundEvaluation.evaluated.feedbacks1 = feedback;
  } else {
    foundEvaluation.evaluated.feedbacks2 = feedback;
  }
  //save and send back evaluation
  try {
    const savedEvaluation = await foundEvaluation.save();
    return res.send(savedEvaluation);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

//evaluate someone
const evaluateSomeone = async (req, res) => {
  const {
    evaluationId,
    feedbackText,
    comprehension,
    ampathie,
    assiduite,
    exercises,
    evaluatorId,
  } = req.body;

  //validate inputs
  if (
    !evaluationId ||
    !feedbackText ||
    !comprehension ||
    !ampathie ||
    !assiduite ||
    !exercises.length ||
    !evaluatorId
  )
    return res.status(400).json({ message: "all fields are required" });

  //check for evaluation existence
  const foundEvaluation = await evaluationModel.findById(evaluationId);
  if (!foundEvaluation)
    return res.status(404).json({ message: "Evaluation not found" });

  let evaluatorPosition = ""; //check the evaluator position
  if (foundEvaluation.evaluator1.evaluatorId._id == evaluatorId)
    evaluatorPosition = "evaluator1";
  else evaluatorPosition = "evaluator2";

  //save feedback in the evaluation
  if (evaluatorPosition === "evaluator1") {
    const feedback = {
      text: feedbackText,
      comprehension,
      ampathie,
      assiduite,
      exercise: exercises,
    };
    foundEvaluation.evaluator1.feedbacks = feedback;
  } else if (evaluatorPosition === "evaluator2") {
    const feedback = {
      text: feedbackText,
      comprehension,
      ampathie,
      assiduite,
      exercise: exercises,
    };
    foundEvaluation.evaluator2.feedbacks = feedback;
  }

  //evaluation points incrementation for evaluator
  const evaluator = await users.findById(evaluatorId);
  evaluator.evaluationPoints += 1;

  // check if it's the last evaluation
  // if (
  //   foundEvaluation.evaluator1.feedbacks.text &&
  //   foundEvaluation.evaluator2.feedbacks.text &&
  // )
  //   foundEvaluation.isDone = true;

  //save and return the back  the evaluation
  try {
    await evaluator.save();
    const savedEvaluation = await foundEvaluation.save();
    return res.send(savedEvaluation);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "server error" });
  }
};

//create evaluation
const createEvaluation = async (req, res) => {
  await createTourTable();
  const { evaluator1, repos, evaluator2, slot1, slot2, level, evaluated } =
    req.body;

  //check all fields requirement
  if (
    !evaluator1 ||
    !repos ||
    !evaluator2 ||
    !slot1 ||
    !slot2 ||
    !level ||
    !evaluated
  )
    return res.status(400).json({ message: "all fields are required" });
  if (evaluator1 === evaluator2)
    return res
      .status(400)
      .json({ message: "can't be evaluated by the same person" });

  //check slot existence
  const slot1Existence = await slotModel.findById(slot1);
  const slot2Existence = await slotModel.findById(slot2);
  if (!slot1Existence || !slot2Existence)
    return res.status(404).json({ message: "one of the slots doesn't exist" });

  //asign admin to task:passage
  const allAdmins = await admins.find();
  const tour = await tourModel.find();
  const index = tour[0].nextStaff;
  const staffId = allAdmins[index]._id;

  //check slot taken status
  if (slot1Existence.taken)
    return res.status(400).json({ message: "slot 1 already taken" });
  if (slot2Existence.taken)
    return res.status(400).json({ message: "slot 2 already taken" });
  //change slots taken state
  slot1Existence.taken = true;
  slot2Existence.taken = true;
  //create the evaluation
  const evaluation = new evaluationModel({
    evaluator1: {
      evaluatorId: evaluator1,
      slot: slot1,
    },
    evaluator2: {
      evaluatorId: evaluator2,
      slot: slot2,
    },
    evaluated: {
      evaluatedId: evaluated,
    },
    repos: repos,
    passage: {
      staffId: staffId,
    },
    level: level,
  });

  //save evalution
  try {
    const savedEvaluation = await evaluation.save();
    await slot1Existence.save();
    await slot2Existence.save();
    staffIncrement();
    return res.status(201).send(savedEvaluation);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/*
@get all evaluation
@create evaluation
@evaluate someone
@evaluated feedback
@admin evaluation
*/
module.exports = {
  createEvaluation,
  evaluateSomeone,
  evaluatedFeedback,
  adminEvaluation,
  getEvaluations,
  getAllEvaluations,
  getAnEvaluation,
  getEvaluator,
};
