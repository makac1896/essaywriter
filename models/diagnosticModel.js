const mongoose = require('mongoose');

const diagnosticSchema = mongoose.Schema({
      studentPhoneNumber: {
        type: String
      },
      academicInterests: {
        type: [String] //stores an object with academic interests
      },
      countryList: {
        type: [String]
      },
      challenges: {
        type: String
      },
      introduction: {
        type: String
      },
      commitments: {
        type: String
      }
})

module.exports = mongoose.model('diagnostic', diagnosticSchema)