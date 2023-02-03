const usersModel = require("../models/users");
const adminModel = require("../models/admins");
/*
@get all users
@get one user by id
@get logged user
*/

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await usersModel.find().select("-password");
    return res.send(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
//get logged user
const getLoggedUser = async (req, res) => {
  const id = req.id;
  if (!id) return res.status(400).json({ message: "all fields are required" });

  try {
    const user = await usersModel.findById(id).select("-password");
    if (!user) {
      const admin = await adminModel.findById(id).select("-password");
      if (!admin) return res.status(404).json({ message: "No User found" });
      return res.send(admin);
    }
    return res.send(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: res.message });
  }
};

//get one user by Id
const getUser = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "all fields are required" });

  try {
    const user = await usersModel.findById(id).select("-password -email");
    return res.send(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: res.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  getLoggedUser,
};
