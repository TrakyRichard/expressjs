const mongoose = require("mongoose");
const tourModel = require("../models/tourSchema");
const createTourTable = async () => {
  const existTourTable = await tourModel.find();
  if (existTourTable.length === 0) {
    const tour = new tourModel({
      nextStaff: 0,
    });
    tour.save();
  }
};
module.exports = createTourTable;
