const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Place = require("../models/place");

let Dummy_Data = [
  {
    id: "p1",
    title: "Dharashive",
    description: "A Maharashtra City",
    location: {
      lat: 18.1928974,
      lng: 76.0032314,
    },
    address: "India,Maharshtra,Dharashiv",
    creator: "u1",
  },
];

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
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Featching Places Faild! try again latter",
      500
    );
    return next(error);
  }
  if (!places || places.length == 0) {
    return next(
      new HttpError("A provided places id is not a valid user id", 404)
    );
  }
  res
    .status(200)
    .json({ places: places.map((place) => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Invalid inputs check Input data ", 422);
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
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Cant created place try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Inputs are not Valid Or Pleas Enter information", 422);
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

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!Dummy_Data.find((p) => p.id === placeId)) {
    throw new HttpError("The provided place id is not found", 404);
  }
  Dummy_Data = Dummy_Data.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted Place successfully" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesUsersById = getPlacesUsersById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
