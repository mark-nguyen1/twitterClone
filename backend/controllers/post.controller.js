import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

import { v2 as cloudinary} from "cloudinary";

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });

        if (posts.length ===0) return res.status(200).json([]);

        return res.status(200).json(posts);

    } catch (error) {
        console.log("Error in getAllPosts controller: ", error.message);
        res.status(500).json({ error:"Internal server error" });
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({ message:"User not found" });

        const feedPosts = await Post.find({ user: {$in: user.following }})
        .sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });

        res.status(200).json(feedPosts);



    } catch (error) {
        console.log("Error in getFollowingPosts controller: ", error.message);
        res.status(500).json({ error:"Internal server error" });
    }
}

export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message:"User not found" });

        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });

        res.status(200).json(likedPosts);

    } catch (error) {
        console.log("Error in getLikedPosts controller: ", error.message);
        res.status(500).json({ error:"Internal server error" });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const username  = req.params.username;
        const user = await User.findOne({ username: username })

        if (!user) return res.status(404).json({ message: "User does not exist" });

        const userPosts = await Post.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });
        
        res.status(200).json(userPosts);

    } catch (error) {
        console.log("Error in getUserPosts controller: ", error.message);
        res.status(500).json({ error:"Internal server error" });
    }
}

export const createPost = async (req, res) => {

    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();
        const user = User.findById(userId);

        if (!userId) return res.status(404).json({ message:"User not found in createPost" });
        if(!text && !img) return res.status(404).json({ message:"Post must have text or an image" });

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text,
            img
        });

        await newPost.save()
        res.status(201).json(newPost);

    } catch (error) {
        console.log("Error in createPost controller: ", error.message);
        res.status(500).json({ error:"Internal server error" });
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        const userId = req.user._id;

        if (!post) return res.status(404).json({ message:"Post does not exist" });
        if (!userId) return res.status(404).json({ message:"User does not exist" });
   
        const alreadyLiked = post.likes.includes(userId);

        if(alreadyLiked){
            //unlike the post
            await Post.updateOne({_id: req.params.postId}, {$pull: {likes: userId}});
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});
            res.status(200).json({ message:"Post unliked successfully" });

        } else {
            //like the post 
            //await Post.updateOne({_id: req.params.postId}, {$push: {likes: userId}});
            post.likes.push(userId);
            await post.save();

            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            //send notification 
            const newNotification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })

            await newNotification.save();

            res.status(200).json({ message:"Post liked successfully" });
        }


    } catch (error) {
        console.log("Error in likeUnlikePost route: ", error.message);
        res.status(500).json({ message:"Internal server error" })
         
    }
}

export const commentOnPost = async (req, res) => {

    try {
        const { text } = req.body;
        const postId = req.params.postId;
    
        if (!text) return res.status(400).json({ message:"text field is required" });
    
        const post = await Post.findById(postId);
    
        if(!post) return res.status(404).json({ message:"Post does not exist" });
    
        const newComment = {
            user: req.user._id,
            text
        }
    
        post.comments.push(newComment);
        await post.save();

        return res.status(200).json({ message:"Sucessfully commented on post" });
        
    } catch (error) {
        console.log("Error in commentOnPost route: ", error.message);
        res.status(500).json({ message:"Internal server error" })
        
    }
 
}

export const deletePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.postId);

        if(!post) return res.status(404).json({ message:"Post not found" });

        if(post.user.toString() != req.user._id.toString()){
            return res.status(404).json({ message:"Not authorized to delete post" });
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.postId);
        //why not save() here?
        res.status(200).json({ message:"Post deleted sucessfully" });

    } catch (error) {
        console.log("Error in deletePost controlling: ", error.message);
        res.status(500).json({ error:"Internal server error" });
    }
}