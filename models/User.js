const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
  recipes: [],
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
