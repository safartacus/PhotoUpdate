import User from "../models/userModel.js";
import Photo from "../models/photoModel.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";

const createUser = async (req, res) => {
    try {
        req.body.passWord = await bcrypt.hash(req.body.passWord, 10);
        const user = await User.create(req.body);
        res.status(200).json({
            succeded: true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            succeded: true,
            users,
        })
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
const getUserbyId = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                succeded: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            succeded: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};
const getAllPhotoByUser = async (req, res) => {
    try {
        if (!res.locals.user || !res.locals.user._id) {
            return res.status(401).json({
                succeded: false,
                message: "User not authenticated.",
            });
        }
        
        const photos = await Photo.find({ user: res.locals.user._id }).populate('user');
        if (photos.length === 0) {
            return res.status(404).json({
                succeded: false,
                message: "No photos found for this user.",
            });
        }

        res.status(200).json({
            succeded: true,
            photos,
        });
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

export {createUser,getAllUsers,getUserbyId,getAllPhotoByUser};