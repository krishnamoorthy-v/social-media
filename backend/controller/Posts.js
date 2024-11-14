const mongoose = require("mongoose");
const Posts = require("../model/Posts");
const Users = require("../model/Users");


const addPost = async(req, res) => {
    try {

        const {postContent, likes, comments} = req.body;
        const userId = req.params.id;
        const data = new Posts({postContent, userId, likes, comments});
        data.save({runValidators: true})
        .then( (result) => {
            return res.status(200).send({"postId": data._id});
        })
        .catch( (error)=> {

            console.error(error["name"]);
            if( error["code"] == 11000 ) {
                return res.status(400).send("Email Id already Exists.");
            } else if( error["name"] == "ValidationError" ) {
                const message = Object.values(error.errors).map(val => val.properties.message);
                return res.status(400).send(message[0]);
            }
            return res.status(400).send(error.message[0]);

        })

    } catch( error) {
        return res.status(400).send(error.message);
    }
}

const getAllPostByUserId =  async(req, res)=> {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new Error("Invalid user Id");
        } 
        let data = await Posts.find({userId: req.params.id})
        if(!data) {
            throw new Error("No user found");
        }
        return res.status(200).send(data);
    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const getPostByPostId =  async(req, res)=> {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new Error("Invalid post Id");
        }
        let data = await Posts.findById(req.params.id);
        
        return res.status(200).send(data);

    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const updatePost =  async(req, res)=> {
    try {
        let {postId, postContent, likes, comments} = req.body;
        if(!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error("Invalid post id")
        }
        likes.forEach( async(like) => {
            // console.log(like);
            const like_user = await Users.findById(like);
            // console.log(like_user);
            if(!like_user) {
                throw new Error("Only registerd user allowed to like.");
            }
        });
        comments.forEach( async(comment) => {
            const comment_user = await Users.findById(comment);
            if(!comment_user) {
                throw new Error("Only registerd user allowed to comment.");
            }
        })
        
        let old_data = await Posts.findById(postId);
        if(!old_data) {
            throw new Error("No post found");
        }
        if(postContent == "") {
            postContent = old_data["postContent"];
        } 
        for(let i in likes) {
            if(i in old_data["likes"]) {
                throw new Error("already liked");
            }
        }
        likes = [...likes, ...old_data["likes"]];
        comments = [...comments, ...old_data["comments"]];
        console.log(likes);
        let data = await Posts.updateOne({_id: postId},{postContent, likes, comments}, {new: true} )
        if(!data.acknowledged) {
            throw new Error("Nothing to upate")
        }
        return res.status(200).send({"status":data.acknowledged});

    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const updateLike = async(req, res) => {

    try {
        let {postId} = req.body;
        let like_user = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error("Invalid post id")
        }
        const data = await Posts.findOne({_id: postId});
        if(!data) {
            throw new Error("Post not found");
        } 
        let likes = data.likes;
        let index = likes.indexOf(like_user)

        if( index == -1) {
            likes.unshift(like_user);
        } else {
            likes.pop(index);
        }

        let Updated_data = await Posts.updateOne({_id: postId},{likes}, {new: true} )
        if(!Updated_data.acknowledged) {
            throw new Error("Nothing to upate")
        }
        return res.status(200).send({"status":Updated_data.acknowledged});


    } catch(error) {
        return res.status(400).send(error.message);
    }
}


// const updateComment = async(req, res) => {

//     try {
//         let {postId} = req.body;
//         let like_user = req.params.id;
//         if(!mongoose.Types.ObjectId.isValid(postId)) {
//             throw new Error("Invalid post id")
//         }
//         const data = await Posts.findOne({_id: postId});
//         if(!data) {
//             throw new Error("Post not found");
//         } 
//         let likes = data.likes;
//         let index = likes.indexOf(like_user)

//         if( index == -1) {
//             likes.unshift(like_user);
//         } else {
//             likes.pop(index);
//         }

//         let Updated_data = await Posts.updateOne({_id: postId},{likes}, {new: true} )
//         if(!Updated_data.acknowledged) {
//             throw new Error("Nothing to upate")
//         }
//         return res.status(200).send({"status":Updated_data.acknowledged});


//     } catch(error) {
//         return res.status(400).send(error.message);
//     }
// }



const deletePost = async(req, res) =>{
    try {
        const {postId} = req.body;
        if(!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error("Invalid Post Id");
        }
        let data = await Posts.deleteOne({_id: postId});
        return res.status(200).send({"status": data.acknowledged})
    } catch(error) {
        return res.status(400).send(error.message);
    }
   

}

module.exports = {addPost, getAllPostByUserId, getPostByPostId, updatePost, deletePost, updateLike};