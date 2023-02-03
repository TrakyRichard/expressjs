const { Schema, model } = require("mongoose");

const sessionSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  owner: {
    type: String,
    required: true,
  },
});

module.exports = model("session", sessionSchema);
