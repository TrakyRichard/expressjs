const { restart } = require("nodemon");
const slotModel = require("./../models/slotSchema");
// { from , to } format "2023-01-28, 22:46:00, owner userID"
//create a slot
const createSlot = async (req, res) => {
  const { owner, from, to } = req.body;
  if (!owner || !from || !to)
    return res.status(400).json({ message: "you must provide all the fields" });
  const slots = await slotModel.find({ owner });

  if (slots.length) {
    const lastSlot = slots[slots.length - 1];
    if (new Date(lastSlot.to) > new Date(from))
      return res.status(401).json({ message: "unauthorized" });
  }

  if (new Date(from) >= new Date(to))
    return res.status(401).json({ message: "unauthorized from must be < to" });

  const slot = new slotModel({
    owner,
    from,
    to,
    taken: false,
    passed: false,
  });

  //save slot
  try {
    const newSlot = await slot.save();
    res.status(201).send(newSlot);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

//get all slots
const getSlots = async (req, res) => {
  try {
    const slots = await slotModel.find();
    res.send(slots);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createSlot,
  getSlots,
};
