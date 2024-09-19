import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const checkUser = async (req, res, next) => {
    
    const token = req.cookies.jsonwebtoken;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err,decodedToken) => {
            if(err){
                res.locals.user = null;
                next();
            }
            else{
                const user = await User.findById(decodedToken.id)
                res.locals.user = user;
                console.log(user);
                next();
            }
        });
    }
    else
    {   
        res.status(500).json({ message: 'No Token Found' }); 
        next();
    }
}
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