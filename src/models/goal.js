const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

goalSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'goalDetail',
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
