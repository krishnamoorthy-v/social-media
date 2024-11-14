const mongoose = require("mongoose");
const Comments = require("../model/Comments");
const Users = require("../model/Users");
const Posts = require("../model/Posts");


const addComment = async(req, res) => {
    try {
        const {commentText, userId, postId} = req.body;
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid userID");
        }
        if(!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error("Invalid postId");
        }
        if(!Users.findById(userId) ) {
            throw new Error("User not found");
        }
        if(!Posts.findById(postId)) {
            throw new Error("Post not found");
        }
        let data = new Comments({commentText, userId, postId})
        data.save({runValidators: true})
        .then( (result) => {
            return res.status(200).send({"commentId":result._id});
        })
        .catch( (error) => {
            return res.status(400).send(error.message);
        })
    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const getAllCommentOfPost = async(req, res) => {

    try {
        const postId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error("Invalid postId");
        }
        let data = await Comments.find({postId})
        if(!data) {
            throw new Error("No post command found")
        }
        // console.log(data);
        return res.status(200).send(data);
    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const getComment = async(req, res) => {
    try {
        const commentId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new Error("Invalid postId");
        }
        let data = await Comments.find({_id: commentId});
        if(!data) {
            throw new Error("No post command found");
        }
        return res.status(200).send(data);

    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const deleteOneComment = async(req, res) => {
    try {
        const commentId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new Error("Invalid postId");
        }
        let data = await Comments.deleteOne({_id: commentId});
        if(!data) {
            throw new Error("No post command found");
        }
        console.log(data);
        return res.status(200).send({"Deleted Count":data.deletedCount});

    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const deleteManyComment = async(req, res) => {
    try {
        const userId = req.params.id;
        const {postId} = req.body;

        if(!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error("Invalid postId");
        }
        let data = await Comments.deleteMany({postId});
        if(!data) {
            throw new Error("No post command found");
        }
        console.log(data);
        return res.status(200).send({"Deleted Count":data.deletedCount});

    } catch(error) {
        return res.status(400).send(error.message);
    }
}

module.exports = {addComment, getAllCommentOfPost, deleteOneComment, deleteManyComment, getComment}