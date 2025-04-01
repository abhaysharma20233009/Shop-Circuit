const User = require('../models/userModel');
const factory = require('./handlerFactory');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  //payload(data),jwt secret,jwt expire time
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  //Remove the password from the password
  user.password = undefined;
  console.log('Generated Token:', token);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body); //User.save(Wrong code because by this anyone make himself admin without any security flow)
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    profilePicture: req.body.profilePicture,
    skills: req.body.skills, // should be an array of { skillName, rating, ratingQuantity }
    reviews: req.body.reviews, // should be an array of review IDs
    profile: {
      name: req.body.profile?.name,
      title: req.body.profile?.title,
      location: req.body.profile?.location,
      about: req.body.profile?.about,
      experience: req.body.profile?.experience, // array of experience objects
      education: req.body.profile?.education, // array of education objects
    },
    notifications: req.body.notifications, // array of notification IDs
    chatMessages: req.body.chatMessages, // array of chat message IDs
    requestsSent: req.body.requestsSent, // array of request IDs
    requestsReceived: req.body.requestsReceived, // array of request IDs
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1)Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password !', 400));
  }
  //2)Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //3)If everything ok,send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    // console.log(token);
    return next(
      new AppError('You are not logged in! Please log in to get access'),
      401
    );
  }
  //2)Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3)Check if user still exits
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exit', 401)
    );
  }
  //4)Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password ! please login again',
        401
      )
    );
  }
  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on POSTED email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  //2)Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  //save the document
  await user.save({ validateBeforeSave: false });
  //3)send it to user's email
  const resetURL = `http://localhost:5173/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 min)',
      message,
    });
    createSendToken(user, 200, res);
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There is error sending the email.Try again later!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1)get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2)If token has not expired and there is user,set the new password
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3)Update changedPasswordAt property for the user
  //4)Log the user in,send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //2)Check if POSTED current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Password is wrong.please try again', 401));
  }
  //3)If so,update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //
  /*
    Q:why we can not use User.findByIdAndUpdate
    ans:1.this.property is not work bacause at this time moongoose not have currnet object
    2.middleware which we use to password hashed before the save in database is not work because it updated by findByIdAndUpdate not saved
  */

  //4)Log user in,send JWT
  createSendToken(user, 200, res);
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000 * 60),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.getAllUsers = factory.getAll(User);
