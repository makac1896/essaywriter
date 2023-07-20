const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
      msgCode: {
        type: String
      },
      aidFiles:{
        type: [String],
      },
      essayFiles:{
        type: [Object],
      },
      // fileName: {
      //   type: String 
      // },
      description: {
        type: String
      },
      // filePath: {
      //   type: String
      // },
      dateJoined: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model('resource', resourceSchema)