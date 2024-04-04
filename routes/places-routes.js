const express = require("express");

const router = express.Router();
const placeController = require("../controllers/places-contoller");

router.get("/:pid", placeController.getPlaceById);

router.get("/user/:uid", placeController.getPlacesUsersById);
router.post("/", placeController.createPlace);
router.put("/:pid", placeController.updatePlace);
router.delete("/:pid", placeController.deletePlace);

module.exports = router;
