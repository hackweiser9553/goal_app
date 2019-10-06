const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = Task;
