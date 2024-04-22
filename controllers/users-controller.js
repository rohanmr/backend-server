const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const Dummy_Users = [
  {
    id: "u1",
    name: "John Doe",
    email: "john@gmail.com",
    password: "jhon@123",
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Featching user failed try again", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Enter valid Data", 422));
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed ! Please try again later.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User alrady exsist", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://unsplash.com/photos/shallow-focus-photography-of-woman-outdoor-during-day-rDEOVtE7vOs",
    places: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed try again later", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed ! Please try again later.", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid Credentials try again ", 401);
    return next(error);
  }

  res.status(200).json({ message: "Login SuccessFully" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
