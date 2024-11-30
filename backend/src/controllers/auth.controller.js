import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";

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
        const userData = {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email
        }      
        res.status(201).json(userData); 
    }else {
        return res.status(400).json({ message: "Invalid user data" });
    }

  } catch (err) {
    console.error("Error in signup controller : ", err);
    res.status(500).json({ message: "Server error" }); 
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
