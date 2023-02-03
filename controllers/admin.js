const adminModel = require("../models/admins");
const createJwtToken = require("../utilities/createJwtToken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
/*
@create admin
@change role
*/

//create admin
const createAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "all fields are required" });

  //check for existence
  const existingAdminEmail = await adminModel.findOne({ email });
  const existingAdminUserName = await adminModel.findOne({ username });
  if (existingAdminEmail || existingAdminUserName)
    return res.status(409).json({ message: "admin already exist" });

  const newPassword = await bcrypt.hash(password, 10);
  const newAdmin = new adminModel({
    username,
    email,
    password: newPassword,
    role: "admin",
  });
  try {
    const savedAdmin = await newAdmin.save();
    return res.status(201).send(savedAdmin);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

//edit admin role
const editAdminRole = async (req, res) => {
  const { id, role } = req.body;

  if (!id || !role)
    return res.status(400).json({ message: "all fields are required" });
  let admin;
  try {
    admin = await adminModel.findOne({ _id: id });
  } catch (error) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  if (!admin) return res.status(404).json({ message: "Not found" });
  admin.role = role;
  try {
    const updateAdmin = await admin.save();
    return res.send(updateAdmin);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};
module.exports = { createAdmin, editAdminRole };
