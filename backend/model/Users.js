const { Schema, Types, model } = require("mongoose");
const bcrypt = require("bcrypt")

const user_schema =  new Schema( {

    username: {type:String, unique:true, require: [true, "User name is required"], match:[/^\S*$/, 'please enter the valid name (space or not allowed)']},
    email: {type:String, require: [true, "Email is required"], unique:true, match:[/^\S+@\S+\.\S+$/, 'Please use a valid email address.']},
    password: {type: String, require: [true, "Password is required"]},
    followers: [{ type: Types.ObjectId, ref: 'Users' }], 
    following: [{ type: Types.ObjectId, ref: 'Users' }], 
    posts: [{ type: Types.ObjectId, ref: 'Posts'}]
    
})


user_schema.pre( "save", async function(next){

    if(!this.isModified("password")) {
        return next();
    } 
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

user_schema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const Users = model('Users', user_schema )
module.exports = Users;
