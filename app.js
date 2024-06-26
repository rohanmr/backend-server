const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("The Route is not Found", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.haderSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || "A unkown erroe occures in the server",
  });
});

mongoose
  .connect(
    "mongodb+srv://rohan:Dc8cPMJ6PCaurJEX@cluster0.g7qyvhs.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5000);
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
