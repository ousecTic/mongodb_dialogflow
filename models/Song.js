const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema({
  decade: String,
  artist: String,
  song: String,
  weeksAtOne: Number
});

module.exports = Song = mongoose.model("Song", songSchema);
