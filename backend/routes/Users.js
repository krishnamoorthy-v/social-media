const express = require("express");
const Users = require("../model/Users");
const {generateToken, authorize} = require("../Service/JWTService");
const {signup, login, updateOne, deleteOne, updateFollower, updatePosts, updateFollowing} = require("../controller/Users")
const { default: mongoose } = require("mongoose");
const router = express.Router();


router.post("/signup", signup);
router.get("/login", login);
router.put("/update/:id",authorize(), updateOne);
router.put("/update/followers/:id", authorize(), updateFollower);
router.put("/update/following/:id", authorize(), updateFollowing);
router.put("/update/posts/:id", authorize(), updatePosts);
router.delete("/delete/one/:id", authorize(), deleteOne);

module.exports = router;