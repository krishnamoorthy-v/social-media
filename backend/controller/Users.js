const express = require("express");
const Users = require("../model/Users");
const {generateToken } = require("../Service/JWTService");
const { default: mongoose } = require("mongoose");



const signup = async(req, res) => {
    try {

        console.log("signup");
        const {username, email, password} = req.body;
        let name_data = await Users.findOne( {username} );
        let email_data = await Users.findOne({email});
        // console.log(name_data);
        // console.log(email_data);
        if(name_data || email_data) {
            throw new Error("Username or email already exits");
        }
        const data = new Users({username, email, password});
        data.save({runValidators: true})
        .then( (result)=> {
            return res.status(200).json(result);
        })
        .catch( (error) => {
            return res.status(400).json(error.message);
        });

    } catch( err) {
        return res.status(400).json(err.message);
    }
    
}

const login =  async(req, res) => {
    try {
        console.log(req.body);
        const {email, password} = req.body;

        const user = await Users.findOne({email});

        if(!user) {
            throw new Error("Invalid login id and password.");
        }
        
        user.isValidPassword(password)
        .then( (result)=> {
            if(result === true) {
                const token = generateToken(user);
                return res.status(200).json({token});
            } else {
                throw new Error("Invalid login id and password.");
            }
            
        })
        .catch( (error) => {
            return res.status(400).send(error.message);
        })


    } catch(err) {
        return res.status(400).send(err.message);
    }
}

const updateOne =  async(req, res)=> {
    try {
     
        let {followers, following, posts} = req.body;

        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new Error("Invalid user id");
        }
        
        let data = await Users.findOne({_id: req.params.id})
        if(!data) {
            throw new Error("User not found");
        }

        for(let i in followers) {
            if(i in data["followers"]) {
                throw new Error("already a follower");
            } 
        }

        for(let i in following) {
            if(i in data["following"]) {
                throw new Error("already following");
            }
        }

        
        followers = [...data["followers"], ...followers];
        following = [...data["following"], ...following];
        posts = [...data["posts"], ...posts];

        let record = await Users.findOneAndUpdate( {_id: req.params.id}, {followers, following, posts}, {new: true} );
        if(!record) {
            throw new Error("User not found");
        }

        return res.status(200).send(record);

    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const updateFollower = async(req, res) => {
    try {
        const {followerId} = req.body;
        const userId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(followerId)) {
            throw new Error("Invalid user id")
        }
        const data = await Users.findOne({_id: userId});
        if(!data) {
            throw new Error("User not found");
        } 

        let followers = data.followers;
        let index = followers.indexOf(followerId)

        if( index == -1) {
            followers.unshift(followerId);
        } else {
            followers.pop(index);
        }

        let Updated_data = await Users.updateOne({_id: userId},{followers}, {new: true} )
        if(!Updated_data.acknowledged) {
            throw new Error("Nothing to upate")
        }
        return res.status(200).send({"status":Updated_data.acknowledged});



    } catch(error) {
        return res.status(400).send(error.message);
    }
}


const updateFollowing = async(req, res) => {
    try {
        const {followingId} = req.body;
        const userId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(followingId)) {
            throw new Error("Invalid user id")
        }
        const data = await Users.findOne({_id: userId});
        if(!data) {
            throw new Error("User not found");
        } 

        let following = data.following;
        let index = following.indexOf(followingId)

        if( index == -1) {
            following.unshift(followingId);
        } else {
            following.pop(index);
        }

        let Updated_data = await Users.updateOne({_id: userId},{following}, {new: true} )
        if(!Updated_data.acknowledged) {
            throw new Error("Nothing to upate")
        }
        return res.status(200).send({"status":Updated_data.acknowledged});



    } catch(error) {
        return res.status(400).send(error.message);
    }
}

const updatePosts = async(req, res) => {
    try {
        const {postId} = req.body;
        const userId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error("Invalid user id")
        }
        const data = await Users.findOne({_id: userId});
        if(!data) {
            throw new Error("User not found");
        } 

        let posts = data.posts;
        let index = posts.indexOf(postId)

        if( index == -1) {
            posts.unshift(postId);
        } else {
            posts.pop(index);
        }

        let Updated_data = await Users.updateOne({_id: userId},{posts}, {new: true} )
        if(!Updated_data.acknowledged) {
            throw new Error("Nothing to upate")
        }
        return res.status(200).send({"status":Updated_data.acknowledged});



    } catch(error) {
        return res.status(400).send(error.message);
    }
}


const deleteOne = async(req, res)=> {
    try {

        if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new Error("Invalid Student id");
        }
        const result = await Users.deleteOne({_id: req.params.id})
        
        if(result.deletedCount == 0) {
            throw new Error("User not found");
        } 
        
        return res.status(200).send( {"status": result.acknowledged});

    } catch(error) {
        return res.status(400).send(error.message);
    }
}


module.exports = {signup, login, updateOne, deleteOne, updateFollower, updateFollowing, updatePosts};
