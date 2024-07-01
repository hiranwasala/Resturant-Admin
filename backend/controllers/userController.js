import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModel.js';
import generateToken from "../utilis/generateToken.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import Token from '../models/tokenModel.js'
import crypto from 'crypto'

const sendVerificationEmail = asyncHandler(async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent successfully");
    } catch (error) {
        console.log("email not sent!");
        console.log(error);
        throw new Error('Email not sent: ' + error.message);  // Rethrow the error to handle it properly
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        phone,
    });

    if (user) {
        generateToken(res, user._id);

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `http://localhost:3000/users/${user._id}/verify/${token.token}`;
        await sendVerificationEmail(user.email, "Verify Email", url);

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            message: "An Email sent to your account, please verify",
            verified: user.verified
        });
        
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const verifyEmail = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: 'Invalid link' });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {
            return res.status(400).send({ message: 'Invalid link' });
        }

        await User.updateOne({ _id: user._id }, { $set: { verified: true } });

        await token.deleteOne();  

        res.status(200).send({ 
            message: 'Email verified successfully',
            verified: user.verified,
         });
    } catch (error) {
        console.error('Error verifying email:', error.message);
        res.status(400).json({ message: error.message });
    }
});


const confirmEmailVerification = asyncHandler(async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        return res.status(400).send({ message: 'Invalid user' });
      }
  
      const token = await Token.findOne({
        userId: user._id,
        token: req.body.token,
      });
      if (!token) {
        return res.status(400).send({ message: 'Invalid or expired token' });
      }
  
      user.verified = true;
      await user.save();
  
      await token.deleteOne();
  
      res.status(200).send({ message: 'Email successfully verified' });
    } catch (error) {
      console.error('Error confirming email verification:', error.message);
      res.status(400).json({ message: error.message });
    }
  });

  const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const existingToken = await Token.findOne({ userId: user._id });
    if (existingToken) {
        await existingToken.deleteOne();
    }

    const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `http://localhost:3000/users/${user._id}/resetpassword/${token.token}`;
    await sendVerificationEmail(user.email, "Reset Password", url);

    res.status(200).json({ message: "A password reset email has been sent to your account" });
});

// Reset Password Handler
const resetPassword = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'Invalid link' });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) {
            return res.status(404).json({ message: 'Invalid link' });
        }

        const { newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await User.findByIdAndUpdate({_id: user.id},{password: hashedPassword});
    

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




//login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log('Request Body:', req.body);

    try {
        const user = await User.findOne({ email });
        console.log('User Found:', user); 

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                verified: user.verified
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});






// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(0),
        httpOnly: true,
    });
    res.status(204).json({ message: 'User logged out' });
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profilePicture: user.profilePicture,
            isAdmin: user.isAdmin,
            verified: user.verified
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        if (req.body.newPassword) {
            if (await user.matchPassword(req.body.oldPassword)) { 
                user.password = req.body.newPassword;
            } else {
                res.status(400);
                throw new Error('Old password is incorrect');
            }
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            profilePicture: updatedUser.profilePicture,
            isAdmin: updatedUser.isAdmin,
          
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error('Admins can not be deleted');
        }
        await User.deleteOne({_id: user._id},);
        res.status(200).json({ message: 'User deleted' });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        // user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            verified: updatedUser.verified
         
            // isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


export {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getUsers,
    getUserById,
    updateUser,
    forgotPassword,
    verifyEmail,
    confirmEmailVerification,
    resetPassword,
   
};