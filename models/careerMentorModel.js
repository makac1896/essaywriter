const mongoose = require("mongoose");

const careerMentorSchema = mongoose.Schema({
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
  mentorPhoto: {
    type: String,
  },
  employmentStatus: {
    type: String,
  },
  accessCode: {
    type: String,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("careerMentor", careerMentorSchema);
