const asyncHandler = require("express-async-handler");
const { constants } = require("../constants");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/:id
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(constants.NOT_FOUND);
    throw new Error("All field are mandatory");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(constants.NOT_FOUND);
    throw new Error("User already registered");
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("hashed pass-----", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log("user created---", user);
  if (user) {
    res.status(201).json({ _id: user._id, email: user.email });
  } else {
    res.status(constants.NOT_FOUND);
    throw new Error("user data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc login a user
//@route POST /api/users/:id
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({ email });
  //compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }

  res.json({ message: "Login the user" });
});

//@desc current login  user info
//@route POST /api/users/:id
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
