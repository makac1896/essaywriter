const mongoose = require('mongoose');

const essaySchema = mongoose.Schema({
      studentPhoneNumber: {
        type: String
      },
      essayTitle: {
        type: String //at some point use Geolocation to get user location
      },
      googleDocId: {
        type: String // points to message 
      },
      essayBody: {
        type: String
      },
      mentorPhoneNumber: {
        type: String
      },
      mentorEmail: {
        type: String
      },
      dateJoined: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model('essay', essaySchema)