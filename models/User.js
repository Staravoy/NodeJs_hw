const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  avatar: {
    type: String,
    required: true
  },
  
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter'
  },
  token: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;