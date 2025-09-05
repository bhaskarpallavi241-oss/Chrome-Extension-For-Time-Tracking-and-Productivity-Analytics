const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  site: String,
  duration: Number,
  timestamp: Date,
  productive: Boolean
});

module.exports = mongoose.model('Activity', activitySchema);
