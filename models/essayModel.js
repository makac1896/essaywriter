const mongoose = require('mongoose');

const essaySchema = mongoose.Schema({
      phoneNumber: {
        type: String
      },
      essayTitle: {
        type: String //at some point use Geolocation to get user location
      },
      essayBody: {
        type: String
      },
      dateJoined: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model('essay', essaySchema)