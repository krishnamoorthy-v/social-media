const express = require("express");
const {authorize} = require("../Service/JWTService");
const {addComment, getAllCommentOfPost, getComment, deleteOneComment, deleteManyComment} = require("../controller/Comments")
const router = express.Router();


router.post("/create/:id", authorize(), addComment);    
router.get("/read/all/:id", getAllCommentOfPost );
router.get("/read/:id", getComment);
router.delete("/delete/one/:id",authorize(), deleteOneComment);
router.delete("/delete/many/:id", authorize(), deleteManyComment);


module.exports = router;