const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const placeController = require("../controllers/places-controller");

router.get("/:pid", placeController.getPlaceById);

router.get("/user/:uid", placeController.getPlacesUsersById);
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeController.createPlace
);
router.put(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeController.updatePlace
);
router.delete("/:pid", placeController.deletePlace);

module.exports = router;
