const { Schema, Types, model } = require("mongoose");

const chat_schema = new Schema( {
    userId: [{type: Types.ObjectId, ref: "User", required: true}, {type: Types.ObjectId, ref:"User", required:true}],
    message: [],
    createdAt: {type: Date, default: Date.now}
});

const Chats = model("Chats", chat_schema);
module.exports = Chats;