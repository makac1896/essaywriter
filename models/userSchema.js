const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
      studentPhoneNumber: {
        type: String
      },
      requests: {
        type: [String] //store all the questions asked by a user
      },
      mentors: {
        type: [String] // points to individual mentors assigned to this student
      },
      tags: {
        type: [String]
      }, 
      dateJoined: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model('user', userSchema)