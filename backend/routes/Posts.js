const express = require("express");
const mongoose = require("mongoose");
const Posts = require("../model/Posts");
const {authorize} = require("../Service/JWTService");
const {getAllPostByUserId, getPostByPostId, deletePost, updateLike, updatePost, addPost} = require("../controller/Posts");
const Users = require("../model/Users");
const router = express.Router();


router.post("/create/:id", authorize(), addPost);        //id --> user id

router.get("/read/all/:id", getAllPostByUserId);         //id --> user id

router.get("/read/:id", getPostByPostId);                 //id --> post id

router.put("/update/:id", authorize(), updatePost);       // id --> user id
router.put("/update/likes/:id", authorize(), updateLike); // id --> user id


router.delete("/delete/:id", authorize(), deletePost);    // id--> post id


module.exports = router;