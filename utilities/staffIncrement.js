const tourModel = require("../models/tourSchema");
const adminsModel = require("../models/admins");

const staffIncrement = async () => {
  const tours = await tourModel.find();
  const admins = await adminsModel.find();
  const theOne = tours[0];
  const tailleAdmin = admins.length;
  if (theOne.nextStaff === tailleAdmin - 1) theOne.nextStaff = 0;
  else theOne.nextStaff += 1;
  theOne.save().then((res) => console.log(res.nextStaff));
};
module.exports = staffIncrement;
