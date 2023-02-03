const User = require("../models/users");
const bcrypt = require("bcrypt");
const existingUser = require("../models/existingUser");
const startingLevel = require("../utilities/startingLevel");
const createJwtToken = require("../utilities/createJwtToken");
const fetchUser = require("../utilities/fetchUser");
const adminModel = require("../models/admins");
const sessionModel = require("../models/session");
const jwt = require("jsonwebtoken");
const accessTokenKey = process.env.ACCESS_TOKEN;
const refreshTokenKey = process.env.REFRESH_TOKEN;

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //inputs validation
  if (!email || !password)
    return res.status(400).json({ message: "all fields are required" });

  let accessToken;
  let refreshToken;
  let payload;

  //check if admin
  const admin = await adminModel.findOne({ email: email });
  if (admin) {
    const passwordCompare = await bcrypt.compare(password, admin.password);

    if (!passwordCompare)
      return res.status(401).json({ message: "not authorized" });

    payload = { id: admin._id, email: admin.email, role: admin.role };
    accessToken = await createJwtToken(payload, accessTokenKey, "1h");
    refreshToken = await createJwtToken(payload, refreshTokenKey, "7d");
    //create a session
    const existeSession = await sessionModel.findOne({ owner: admin._id });
    if (!existeSession) {
      const session = new sessionModel({
        email: admin.email,
        owner: admin._id,
        role: admin.role,
      });
      await session.save();
    }

    //create cookie
    res.cookie("refreshToken", refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });
    return res.status(201).json({ accessToken });
  }

  const piscinePresence = await User.findOne({ email });
  //check for existance in the piscine
  if (!piscinePresence) {
    //check for existance in admission database
    const user = await fetchUser(email);
    if (!user) return res.status(404).json({ message: "no user found" });

    //password comparaison
    //bcrypt Update
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare)
      return res.status(401).json({ message: "not authorized" });
    //user not in piscine create user
    const newUser = new User({
      name: user.name,
      email: user.mail,
      password: user.password,
      levels: startingLevel,
    });

    try {
      //save user in piscine DB
      const data = await newUser.save();
      payload = {
        id: data._id,
        email: data.email,
        role: "candidat",
      };
      accessToken = await createJwtToken(payload, accessTokenKey, "1h");
      refreshToken = await createJwtToken(payload, refreshTokenKey, "7d");
      //create a session
      const existeSession = await sessionModel.findOne({
        owner: data._id,
      });
      if (!existeSession) {
        const session = new sessionModel({
          email: data.email,
          owner: data._id,
          role: "candidat",
        });
        await session.save();
      }

      res.cookie("refreshToken", refreshToken, {
        maxAge: 900000,
        httpOnly: true,
      });
      return res.status(201).json({ accessToken });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "server error" });
    }
  } else {
    //user in piscine check password
    //password comparaison
    //bcrypt Update
    const passwordCompare = await bcrypt.compare(
      password,
      piscinePresence.password
    );
    if (!passwordCompare)
      return res.status(401).json({ message: "not authorized" });
    const payload = {
      id: piscinePresence._id,
      email: piscinePresence.email,
      role: "candidat",
    };
    //create a session
    const existeSession = await sessionModel.findOne({
      owner: piscinePresence._id,
    });
    if (!existeSession) {
      const session = new sessionModel({
        email: piscinePresence.email,
        owner: piscinePresence._id,
      });
      await session.save();
    }

    accessToken = await createJwtToken(payload, accessTokenKey, "1h");
    refreshToken = await createJwtToken(payload, refreshTokenKey, "7d");
    res.cookie("refreshToken", refreshToken, {
      maxAge: 900000,
      httpOnly: true,
    });
    return res.status(201).json({ accessToken });
  }
};

//logout
const logout = async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: "all fields are required" });

  const session = await sessionModel.findOne({ owner: id });
  if (!session) return res.status(200).json({ message: "logout successfully" });
  try {
    await session.delete();
    return res.json({ message: "logout successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }

  // console.log(refreshToken);
  // res.end();
};

//refresh token
const refreshUserToken = async (req, res) => {
  const cookies = req.cookies;
  const token = cookies.refreshToken;
  let accessToken, refreshToken;
  if (!token) return res.sendStatus(401).json({ message: "Filed required" });
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
  if (!decoded)
    return res.Status(403).json({ message: "User validation failed" });

  const user = await User.findById(decoded.id);
  payload = {
    id: user._id,
    email: user.email,
    role: "candidat",
  };
  accessToken = await createJwtToken(payload, accessTokenKey, "1h");
  refreshToken = await createJwtToken(payload, refreshTokenKey, "7d");
  res.cookie("refreshToken", refreshToken, {
    maxAge: 900000,
    httpOnly: true,
  });
  return res.status(201).json({ accessToken });
};

module.exports = {
  loginUser,
  logout,
  refreshUserToken,
};
