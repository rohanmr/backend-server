const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

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

app.listen(5000);
