const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const tourSchema = new Schema({
  nextStaff: { type: Number, required: true },
});
module.exports = mongoose.model("tour", tourSchema);
