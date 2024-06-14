import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
     getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, 
     createPost, likeUnlikePost, commentOnPost, 
     deletePost 
    } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:userId", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);

router.post("/create", protectRoute, createPost); 
router.post("/like/:postId", protectRoute, likeUnlikePost);
router.post("/comment/:postId", protectRoute, commentOnPost);

router.delete("/:postId", protectRoute, deletePost);

export default router;