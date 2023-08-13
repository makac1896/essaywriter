const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    phoneNumber: {
        type: String
    },
    msgCode: {
        type: String
    },
    creationDate: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model('request', requestSchema)