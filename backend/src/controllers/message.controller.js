import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async(req, res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);

    }catch(err){
        console.error("Error in getUsersForSidebar controller : ", err);
        res.status(500).json({ message: "Internal Server error" }); 
    }
}

export const getMessages = async (req, res) =>{
    try {
        const myId = req.user._id;
        const {id: userToChatId} = req.params;        
        const messages = await Message.find({
            $or:[
                {senderId: myId, recieverId: userToChatId},
                {senderId: userToChatId, recieverId: myId}
            ]
        });

        res.status(200).json(messages);

    }catch(err) {
        console.error("Error in getMessages controller : ", err);
        res.status(500).json({ message: "Internal Server error" }); 
    }

}

export const sendMessage = async(req,res)=> {
    try {
        const {text, image} = req.body;
        console.log("text message : " + text);
        const {id: recieverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId: senderId,
            recieverId: recieverId,
            text: text,
            image: imageUrl
        });
        // todo: realtime functionality goes here => WebSocket.io
        res.status(201).json(newMessage);

    }catch(err) {
        console.error("Error in sendMessage controller : ", err);
        res.status(500).json({ message: "Internal Server error" });
    }
}