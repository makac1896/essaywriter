const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
      phoneNumber: {
        type: String
      },
      state: {
        type: Object  //Current state stored here
      },
      diagnosticState: {
        type: Object
      },
      dateJoined: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model('state', stateSchema)