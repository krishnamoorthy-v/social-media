const { Schema, Types, model } = require("mongoose");

const post_schema = new Schema( {
    postContent: {type: String, required: true},
    userId: {type: Types.ObjectId, ref:'Users', required: [true, "User id is required"]},
    likes: [{ type: Types.ObjectId, ref: 'Users' }],
    comments: [{ type: Types.ObjectId, ref: 'Comments' }],
    createdAt: {type: Date, default: Date.now }

})


const Posts  = model('Posts', post_schema);
module.exports = Posts;