const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

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

const signup = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Enter valid Data", 422);
  }
  const { name, email, password } = req.body;

  const hasUser = Dummy_Users.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user, Email alredy exists", 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };
  Dummy_Users.push(createdUser);
  res.status(201).json({ user: createdUser });
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
