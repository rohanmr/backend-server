const express = require("express");

const router = express.Router();
const placeController = require("../controllers/places-contoller");

router.get("/:pid", placeController.getPlaceById);

router.get("/user/:uid", placeController.getPlaceUsersById);

module.exports = router;
