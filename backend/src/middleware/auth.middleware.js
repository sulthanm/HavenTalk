import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async(req, res, next) =>{
    try{
        const token = req.cookies.jwt; 
        if (!token) {
            return res.status(401).json({message : "Not authorized, token required"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({message : "Not authorized, token required"});
        }
        const user = await User.findOne(decoded.userID).select('-password');
        if (!user) {
            return res.status(401).json({message : "user not found"});
        }

        req.user = user;
        
        next();
    }catch(err){
        console.log("Error in protectRoute middleware: " + err.message);
        res.status(500).json({ message: "Interval Server error" });
    }
}