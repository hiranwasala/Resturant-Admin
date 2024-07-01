import express from 'express';
const router = express.Router();
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword, // Add this import
  verifyEmail,
  confirmEmailVerification
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Register a new user and get all users (admin only)
router.route('/')
  .post(registerUser)  // Register new user
  .get(protect, getUsers);  // Get all users (admin)

// User login
router.post('/auth', loginUser); 

// User logout
router.post('/logout', logoutUser);

// Forgot password
router.post('/forgotpassword', forgotPassword); 

// Reset password
router.post('/:id/resetpassword/:token',resetPassword); 

// User profile routes (get and update profile)
router.route('/profile')
  .get(protect, getUserProfile)  // Get user profile
  .put(protect, updateUserProfile);  // Update user profile

// User management by ID (get, update, delete)
router.route('/:id')
  .get(protect, getUserById)  // Get user by ID (admin)
  .put(protect, updateUser)  // Update user by ID (admin)
  .delete(protect, deleteUser);  // Delete user by ID (admin)

// Verify email
router.route('/:id/verify/:token')
   .get(verifyEmail);

// Confirm email verification
router.route('/:id/confirm')
  .post(confirmEmailVerification);

export default router;
