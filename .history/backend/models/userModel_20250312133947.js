const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator=require('validator');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'User should have a username'],
   
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
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
  profilePicture: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: [admin', 'student', 'shopkeeper'],
    default: 'user',
    required: true,
  },
  contactNumber: {
    type: String,
   
  },
  // Student-specific fields
  hostelName: {
    type: String,
    required: function () {
      return this.role === 'student';
    },
  },
  roomNumber: {
    type: String,
    required: function () {
      return this.role === 'student';
    },
  },

  // Shopkeeper-specific fields
  shopName: {
    type: String,
    required: function () {
      return this.role === 'shopkeeper';
    },
  },
  shopAddress: {
    type: String,
    required: function () {
      return this.role === 'shopkeeper';
    },
  },

  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  chatMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }],
  requestedRents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RequestedRent' ,
    required:function(){
        return this.role==='student';
    },
}],
  requestedSells: [{ 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'RequestedSell' ,
     required:function(){
        return this.role==='student';
     },
    }],

  passwordChangedAt: { type: Date },
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
  },
});

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  
  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Exclude inactive users from queries
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Method to check if the entered password is correct
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if the user changed the password after a JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to generate a password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

  return resetToken;
};

// Update lastSeen when the user logs in or performs an action
userSchema.methods.updateLastSeen = async function () {
  this.set('lastSeen', Date.now());
  await this.save({ validateBeforeSave: false });
};

// Virtual field to display `lastSeen` in a human-readable format
userSchema.virtual('lastSeenReadable').get(function () {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  }).format(this.lastSeen);
});

const User = mongoose.model('User', userSchema);
module.exports = User;
