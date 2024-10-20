import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs/dist/bcrypt.js";

const authentication = async (req, res) => {
    try {
        const user = await User.findOne({userName: req.body.userName});
        if (user && await bcrypt.compare(req.body.passWord, user.passWord)) {
            const token = jwt.sign({ userName: user.userName, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie("jsonwebtoken", token ,{
                httpOnly: true,
                maxAge: 1000* 60* 60 *24,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
            });
            return res.status(200).json({
                user,
                token
            });
          } 
          else {
            return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
          }
    } catch (error) {
        return res.status(500).json({
            succeded: false, 
            error: error.message
        });
    }
};
export {authentication};