const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const feedback1 = new Schema(
  {
    text: { type: String, required: true },
    comprehension: { type: Number, required: true },
    ampathie: { type: Number, required: true },
    assiduite: { type: Number, required: true },
    exercise: {
      type: [Boolean],
      required: true,
    },
  },
  { timestamps: true }
);
const feedback2 = new Schema(
  {
    text: { type: String, required: true },
    ampathie: { type: Number, required: true },
    assiduite: { type: Number, required: true },
  },
  { timestamps: true }
);

const evaluator = new Schema({
  evaluatorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  feedbacks: { type: feedback1 },
  slot: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const evaluated = new Schema({
  evaluatedId: { type: mongoose.Schema.Types.ObjectId },
  feedbacks1: { type: feedback2 },
  feedbacks2: { type: feedback2 },
});

const passage = new Schema({
  staffId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  exercises: [Boolean],
});

const evaluationSchema = new Schema(
  {
    evaluator1: { type: evaluator, required: true },
    evaluator2: { type: evaluator, required: true },
    evaluated: { type: evaluated, required: true },
    level: { type: Number, required: true },
    repos: { type: String, required: true },
    passage: { type: passage },
    isDone: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
