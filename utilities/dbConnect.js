const mongoose = require("mongoose");
const dbConnexion = (url) => {
  mongoose.connect(url);
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });
};

module.exports = dbConnexion;
