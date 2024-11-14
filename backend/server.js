require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRouter = require("./routes/Users");
const postRouter = require("./routes/Posts");
const commentRouter = require("./routes/Comments");
const chatRouter = require("./routes/Chat");
const cors = require("cors");
const {Server} = require("socket.io")
const http = require("http")
const app = express();
const PORT = process.env.PORT || 7000;



app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());




mongoose.connect("mongodb://localhost:27017/social_media", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {console.log("Connected to the db.")})
.catch( (err)=> {console.log(err)})

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/chat", chatRouter);


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket)=> {
    console.log("A user connected: ", socket.id);

    socket.on("privateMessage", ({senderId, receiverId, message}) => {
        const messageData = {senderId, message, timestamp: new Date() };

        io.to(receiverId).emit("receiveMessage", messageData);
        io.to(senderId).emit("receiveMessage", messageData);

        console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
    });

    socket.on("disconnect", ()=> {
        console.log("User disconnected: ", socket.id);
    })
})


app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})

