const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Skill = require('./skillsModel');
const catchAsync = require('../utils/catchAsync');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'User should have a username'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  profilePicture: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  
  notifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
    },
  ],
  chatMessages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatMessage',
    },
  ],
  requestedRents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'requestedRents',
    },
  ],
  requestedSells: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'requestedSells',
    },
  ],
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
 
  
  lastSeen: {
    type: Date,
    default: Date.now, 
  },// Set default value to the current timestamp
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

// Update lastSeen when the user logs in or performs an action
userSchema.methods.updateLastSeen = function () {
  this.lastSeen = Date.now();
  return this.save();
};

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};



// Virtual field to display `lastSeen` in a human-readable format
userSchema.virtual('lastSeenReadable').get(function() {
  const options = {
    year: 'numeric',
    month: 'short',  // Jan, Feb, Mar, etc.
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,   // 24-hour time format
    timeZone: 'Asia/Kolkata',  // Time zone for IST
    timeZoneName: 'short',
  };

  return new Intl.DateTimeFormat('en-IN', options).format(this.lastSeen);
});



const User = mongoose.model('User', userSchema);
module.exports = User;