import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }
    // hash password
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({email});
    if (user) return res.status(400).json({message : "User already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ 
        fullName,
        email,
        password: hashedPassword
    });
    if (newUser) {
        // generate jwt token
        generateToken(newUser._id, res);
        (await newUser).save;        
              
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email
      }); 
    }else {
        return res.status(400).json({ message: "Invalid user data" });
    }

  } catch (err) {
    console.error("Error in signup controller : ", err);
    res.status(500).json({ message: "Server error" }); 
  }
};

export const login = async (req, res) => {
  const {email, password} = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    // console.log("Data : " + email + " " + password )
    const user = await User.findOne({ email: email });
    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      // console.log(isPasswordCorrect, user)
      
      if (!isPasswordCorrect) {
        return res.status(400).json({message : "Invalid username or password"});
      }
      generateToken(user._id, res);
      return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
    }else {
      return res.status(400).json({message : "Invalid username or password"});
    }
  }catch(err) {
    console.error("Error in login controller : ", err);
    res.status(500).json({ message: "Internal Server error" }); 
  }

};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge : 0})
    res.status(200).json({message: "User logged out"});
  }catch(err) {
    console.error("Error in logout controller : ", err);
    res.status(500).json({ message: "Server error" }); 
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;    
    if (!profilePic) {
      return res.status(400).json({message: "Profile picture is required"});
    }    
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      {profilePic: uploadResponse.secure_url}, 
      {new: true}
    );
    res.status(200).json(updatedUser);

  }catch(err) {
    console.error("Error in update controller : ", err);
    res.status(500).json({ message: "Internal Server error" }); 
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  }catch(err) {
    console.error("Error in checkAuth controller : ", err);
    res.status(500).json({ message: "Internal Server error" }); 
  }  
}