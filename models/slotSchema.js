const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const slotSchema = new Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  taken: { type: Boolean, required: true },
  taker: { type: mongoose.Schema.Types.ObjectId },
  passed: {
    type: Boolean,
    required: true,
  },
});
module.exports = mongoose.model("slot", slotSchema);
