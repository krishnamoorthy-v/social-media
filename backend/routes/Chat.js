const express = require("express");
const {authorize} = require("../Service/JWTService");
const {createChat, findUserChat, findChat, addMessage} = require("../controller/Chat")
const router = express.Router();


router.post("/create/:userId/:secondId", authorize(), createChat);    
router.get("/read/:userId", authorize(), findUserChat);
router.get("/read/:userId/:secondId", authorize(), findChat);
router.put("/message/:userId/:secondId",authorize(), addMessage );


module.exports = router;