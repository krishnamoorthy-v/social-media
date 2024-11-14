const mongoose = require("mongoose");
const Chat = require("../model/Chat");
const {Server} = require("socket.io");



const createChat = async(req, res) => {
    try {
        const {userId, secondId} = req.params;

        const chat = await Chat.findOne({
            userId: {$all: [userId, secondId]}
        })

        if(chat) return res.status(200).json(chat);

        const newChat = new Chat({
            userId: [userId, secondId]
        })

        const response = await newChat.save();
        res.status(200).json(response);


    } catch(error) {
        return res.status(400).json(error.message);
    }
}

const addMessage = async(req, res) => {
    try {
        const {userId, secondId} = req.params;
        const {message} = req.body;
        
        const chat = await Chat.findOne({
            userId: {$all: [userId, secondId]}
        })

        // console.log(message)

        if(!chat) throw new Error("No Chat found");
        // console.log(chat);
        previous_message = chat.message;
      
        if(message) {

            previous_message = [...previous_message, ...message]
          
            const chatMessage = await Chat.updateOne({
                userId: [userId, secondId]

            }, {message: previous_message}, {new: true})

        
            res.status(200).json(chatMessage);
        } 
        else {
            throw new Error("Message required")
        }

    } catch(error) {
        return res.status(400).json(error.message);
    }
}


const findUserChat = async(req, res) => {

    try {
        const {userId} = req.params;
        if(!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid User id");
        }
     
        const chats = await Chat.find({
            userId: {$in: [userId]}
        })

        return res.status(200).json(chats);
    } catch(error) {
        return res.status(400).json(error.message);
    }

}

const findChat = async(req, res) => {

    try {
        const {userId, secondId} = req.params;
        
        const chat = await Chat.find({
            userId: {$all: [userId, secondId] }
        })

        return res.status(200).json(chat);

    } catch(error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {createChat, findUserChat, findChat, addMessage};


















