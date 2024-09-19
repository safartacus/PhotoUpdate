import User from "../models/userModel.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";

const createUser = async (req, res) => {
    console.log(req.body.passWord)
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
        const user = await User.findById(req.body._id);
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
export {createUser,getAllUsers,getUserbyId};