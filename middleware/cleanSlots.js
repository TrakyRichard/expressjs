const slotModel = require("../models/slotSchema");
const cleanSlots = async (req, res, next) => {
  try {
    const slotToDelete = await slotModel.findOne({ taken: true });
    if (slotToDelete) {
      await slotModel.deleteMany({ taken: true });
    }
    next();
  } catch (error) {
    console.log(error.message);
    next();
  }
};
module.exports = cleanSlots;
