const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const Skill = require('../models/skillsModel');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const fs = require('fs');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.isLoggedIn = async (req, res, next) => {
  const isLoggedIn = !(req.user === undefined);
  res.status(200).json({
    data: {
      isLoggedIn,
    },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  // console.log("hi",req.body);
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use updateMyPassword.',
        400
      )
    );
  }

  // 2) Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'email', 'bio', 'skills', 'profilePicture', 'profile');
  console.log(filteredBody);

  // 3) Update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // await updatedUser.save();

  console.log(updatedUser);

  // 4) Update the Skill model with the new skills, if skills are provided in the request
  if (req.body.skills && Array.isArray(req.body.skills)) {
    await Promise.all(
      req.body.skills.map(async (skill) => {
        await Skill.findOneAndUpdate(
          { name: skill }, // Adjust this to the correct field for your skill
          { $addToSet: { users: updatedUser._id } }, // Use $addToSet to avoid duplicates
          { new: true } // Return the updated document
        );
      })
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});


exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = factory.getOne(User, {
  
  path: 'requestsReceived requestsSent',
});
// Do NOT update passwords with this!

const upload = multer({ dest: 'uploads/' });  // Temporary storage

exports.uploadProfilePhoto = catchAsync(async (req, res, next) => {
  // Use Multer middleware to handle file upload
  upload.single('profileImage')(req, res, async (err) => {
    if (err) return next(new AppError('Error uploading file', 400));

    if (!req.file) {
      return next(new AppError('No file uploaded', 400));
    }

    try {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // Delete the file from temporary storage after uploading to Cloudinary
      fs.unlinkSync(req.file.path);

      // Update the user's profile with the Cloudinary URL
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { 'profilePicture': result.secure_url },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return next(new AppError('User not found', 404));
      }

      // Respond with success
      res.status(200).json({
        status: 'success',
        message: 'Profile photo uploaded successfully',
        data: {
          profilePicture: updatedUser.profilePicture
        }
      });
    } catch (error) {
      console.log(error);
      return next(new AppError('Error uploading profile picture', 500));
    }
  });
});
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
