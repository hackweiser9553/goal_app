const mongoose = require('mongoose');

const Goal = mongoose.model('Goal', {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
    default: new Date().toISOString().slice(0, 10),
  },
  endDate: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = Goal;
