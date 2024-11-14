const { Schema, Types, model } = require("mongoose");

const comment_schema = new Schema( {
    commentText: {type: String, required: true}, 
    userId: {type: Types.ObjectId, ref:"Users", required:true },
    postId: {type: Types.ObjectId, ref:"Post", required:true},
    createdAt: {type: Date, default: Date.now}
});

const Comments = model("Comments", comment_schema);
module.exports = Comments;