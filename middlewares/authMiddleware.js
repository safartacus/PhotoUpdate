import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const checkUser = async (req, res, next) => {
    

    const token = req.cookies.jsonwebtoken;
    
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                return res.status(401).json({
                    message: 'Invalid or Expired Token',
                    isAuth: false
                });
            } else {
                const user = await User.findById(decodedToken.id);
                if (!user) {
                    res.locals.user = null;
                    return res.status(401).json({
                        message: 'User Not Found',
                        isAuth: false
                    });
                }
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        return res.status(401).json({
            message: 'No Token Found',
            isAuth: false
        });
    }
};

const authenticationToken = async (req,res,next) =>{
    try {
        const token = req.cookies.jsonwebtoken;
    if(!token){
        res.status(500).json({ message: 'No Token Found' }); 
        next();
    }
    req.user = await User.findById(jwt.verify(token,process.env.JWT_SECRET).id);
    next()
    } catch (error) {
        res.status(401).json({ message: 'No Token Available' }); 
    }
    
};
export {authenticationToken,checkUser};