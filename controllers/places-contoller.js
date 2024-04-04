const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  const place = Dummy_Data.find((p) => {
    return p.id == placeId;
  });

  if (!place) {
    throw new HttpError("A provided id is not a valid id for places", 404);
    // const error = new HttpError(
    //   "A provided id is not a valid id for places",
    //   404
    // );
    // throw error;
  }
  res.status(200).json({ place });
};

const getPlacesUsersById = (req, res, next) => {
  const userId = req.params.uid;
  const places = Dummy_Data.filter((p) => {
    return p.creator === userId;
  });
  if (!places || places.length == 0) {
    return next(
      new HttpError("A provided places id is not a valid user id", 404)
    );

    // const error = new Error("A provided id is not a valid user id");
    // error.code = 404;
    // return res
    //   .status(404)
    //   .json({ message: "Provided Id is not valid User id" });
  }
  res.status(200).json({ places });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  Dummy_Data.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatedPlace = { ...Dummy_Data.find((p) => p.id === placeId) };
  const placeIndex = Dummy_Data.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  Dummy_Data[placeIndex] = updatedPlace;
  res.status(200).json(updatedPlace);
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  Dummy_Data = Dummy_Data.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted Place successfully" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesUsersById = getPlacesUsersById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
