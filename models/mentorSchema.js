const mongoose = require("mongoose");

const mentorSchema = mongoose.Schema({
  mentorPhoneNumber: {
    type: String,
  },
  mentorName: {
    type: String,
  },
  tags: {
    type: [String], //tags represent the fields a mentor is involved/interested in
  },
  mentorDescription: {
    type: String,
  },
  mentorEmail: {
    type: String,
  },
  mentorID: {
    type: String,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("mentor", mentorSchema);
