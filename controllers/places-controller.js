const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Provided Id is not found try again", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "A provided id is not a valid id for places",
      404
    );
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const getPlacesUsersById = async (req, res, next) => {
  const userId = req.params.uid;
  //let places;
  userWhithPlaces;
  try {
    userWhithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Featching Places Faild! try again latter",
      500
    );
    return next(error);
  }
  if (!userWhithPlaces || userWhithPlaces.places.length == 0) {
    return next(
      new HttpError("A provided places id is not a valid user id", 404)
    );
  }
  res
    .status(200)
    .json({
      places: userWhithPlaces.map((place) => place.toObject({ getters: true })),
    });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid inputs check Input data ", 422));
  }
  const { title, description, address, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    creator,
    address,
    image:
      "https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8",
  });

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating Place failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Colud not find user for provided id ", 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await createdPlace.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Can't created place try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(
      new HttpError("Inputs are not Valid Or Pleas Enter information", 422)
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Could not find provided Place Id", 500);
    return next(error);
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Could Not Updat place", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError("Somthing Wents Wrong try agian", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not Find the Place by this id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Somthing Wents Wrong try again", 500);
    return next(error);
  }
  res.status(200).json({ message: "Deleted Place successfully" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesUsersById = getPlacesUsersById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
