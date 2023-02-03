const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const stateSchema = new Schema({
  unlocked: { type: Boolean, required: true },
  currently: { type: String, enum: ["ongoing", "passed", "retry", "not yet"] },
});

const levelShema = new Schema({
  level: {
    type: Number,
    required: true,
  },
  exercises: {
    type: [Boolean],
    required: true,
  },
  state: {
    type: stateSchema,
  },
  retryCount: { type: Number },
  points: { type: Number },
  startDate: [String],
});

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    levels: { type: [levelShema], required: true },
    evaluationPoints: { type: Number, default: 0 },
    role: {
      type: String,
      default: "candidat",
      enum: ["candidat"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
