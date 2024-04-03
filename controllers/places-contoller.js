const HttpError = require("../models/http-error");

const Dummy_Data = [
  {
    id: "p1",
    name: "Rohan",
    title: "Dharashive",
    description: "A Maharashtra City",
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

const getPlaceUsersById = (req, res, next) => {
  const userId = req.params.uid;
  const place = Dummy_Data.find((p) => {
    return p.creator === userId;
  });
  if (!place) {
    // const error = new Error("A provided id is not a valid user id");
    // error.code = 404;
    return next(new HttpError("A provided id is not a valid user id", 404));
    // return res
    //   .status(404)
    //   .json({ message: "Provided Id is not valid User id" });
  }
  res.status(200).json({ place });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceUsersById = getPlaceUsersById;
