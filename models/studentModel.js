const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  studentPhoneNumber: {
    type: String,
  },
  studentName: {
    type: String,
  },
  schools: {
    type: [String], //tags represent the schools a student is interested in
  },
  currentEducation: {
    type: String, //the current level/grade of a student
  },
  studentEmail: {
    type: String,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("student", studentSchema);
