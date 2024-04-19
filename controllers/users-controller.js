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

const getUsers = (req, res, next) => {
  res.status(200).json({ user: Dummy_Users });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Enter valid Data", 422));
  }
  const { name, email, password, places } = req.body;

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
    places,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed try again later", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};
const login = (req, res, nest) => {
  const { email, password } = req.body;
  const identifideUser = Dummy_Users.find((u) => u.email === email);
  if (!identifideUser || identifideUser.password !== password) {
    throw new HttpError("Could not identify User Or User Not Found ", 404);
  }
  res.status(200).json({ message: "Login SuccessFully" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
