import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js"; 

export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");
        if(!user){
            return res.status(404).json({ message: "User not found in getUserProfile" });
        }
        res.status(200).json(user);

    } catch (error) {
        console.log("Error in getUserProfile: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id: {$ne: userId}
                }
            },
            {
                $sample: { size: 10 }
            }
        ])

        const usersIDontFollow = users.filter(user=>!usersFollowedByMe.following.includes(user._id)); //only want users that i dont already follow 

        const suggestedUsers = usersIDontFollow.slice(0,4);
        suggestedUsers.forEach(user=>user.password=null);

        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message);
        res.status(500).json({ error: error.messsage });
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const currentUserId = req.user._id;

        if( otherUserId === currentUserId.toString()){
            return res.status(400).json({ error: "You can't follow/unfollow yourself" });
        }


        const otherUser = await User.findById(otherUserId);
        const currentUser = await User.findById(currentUserId);

        if (!otherUser || !currentUser){
            return res.status(400).json({ error: "User not found in followUnfollowUser" });
        }
        const isFollowing = currentUser.following.includes(otherUserId);

        if(isFollowing){
            //unfollow the other user
            await User.findByIdAndUpdate(otherUserId, { $pull: { followers: currentUserId }});
            await User.findByIdAndUpdate(currentUserId, { $pull: { following: otherUserId }});

            res.status(200).json({ message: "User unfollowed sucessfully" });
          
        } else {
            //follow the other user
            await User.findByIdAndUpdate(otherUserId, { $push: { followers: currentUserId }});
            await User.findByIdAndUpdate(currentUserId, { $push: { following: otherUserId }});

            //notify the other user
            const newNotification = new Notification({
                type: "follow",
                from: currentUserId,
                to: otherUserId,
            });
            
            await newNotification.save();
             
            res.status(200).json({ message: "User followed sucessfully" });
        }
        
    } catch (error) {
        console.log("Error in followUnfolllowUser: ", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateUser = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link} = req.body;
    let {profileImg, coverImg} = req.body;

    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: "User not found "}); 

        if(!newPassword && currentPassword || !currentPassword && newPassword){
            return res.status(400).json({ error: "Please provide both current and new password to update"})
        }

        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Password is incorrect" });

            if (newPassword.length < 6){
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }
            
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt); 
        }
        
        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }

        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        
        user.password = null;

        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in updateUser: ", error.message);
        res.status(500).json({ error: error.message });
    }
}