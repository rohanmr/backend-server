const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GET Request is here");
  res.status(200).json({ message: "Its Working Properly" });
});

module.exports = router;
