const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  phoneNumber: {
    type: String,
  },
  message: {
    type: [String],
  },
  count: {
    type: Number,
  },
  timeSent: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("message", messageSchema);
