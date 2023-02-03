const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const existingUserSchema = new Schema({
  mail: { type: String },
  password: { type: String },
  name: { tyep: String },
  profil: { String },
  isChange: { type: Boolean },
});
module.exports = mongoose.model("ExistingUserSchema", existingUserSchema);
