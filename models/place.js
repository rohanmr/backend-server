const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const plaaceSchema = new Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  image: { type: String, require: true },
  address: { type: String, require: true },
  creator: { type: String, require: true },
});

module.exports = mongoose.model("Place", plaaceSchema);
