const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    validate(val) {
      if (val < 10) {
        throw new Error('Age must be greater than 10');
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Invalid Email');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(val) {
      if (val.toLowerCase().includes('password')) {
        throw new Error('fuck you');
      }
    },
  },
});

module.exports = User;
