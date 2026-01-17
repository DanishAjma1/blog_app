const express = require("express");
const cors = require("cors");
const tasksRouter = require("./routes/tasks/index.js");
const authRouter = require("./routes/authentication/auth.js");
const realChatRouter = require("./routes/realChat/index.js");
const usersRouter = require("./routes/users/index.js");
const cookieParser = require("cookie-parser");
const isLoggedIn = require("./libs/isLoggedIn.js");
const sessionMiddleware = require("./libs/sessionMiddleware.js");
const AppError = require("./libs/appError.js");
const errorHandler = require("./libs/errorHandler.js");
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const Message = require("./libs/models/messages.js");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
app.use(express.json());
app.use(cookieParser());
const server = http.createServer(app);

const io = socketIO(server,{
  cors:({
    origin: "http://localhost:3000",
    credentials: true,
  })
});
const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

(async()=>{
  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient,subClient));
})();

let users = {};

io.on("connection", (socket) => {
  console.log("New client connected: "+ socket.id);

  socket.on("join",async(userId) => {
    await pubClient.set(`user:${userId}`,socket.id);
    console.log(`User ${userId} is connected with id ${socket.id} to the chat`);
  });

  socket.on("sendMessage", async ({ senderId,receiverId,content }) => {
    const message = await Message.create({ sender: senderId, receiver: receiverId, content });
    const socketReceiverId = users[receiverId];
    io.to(socketReceiverId).emit("receiveMessage", message );
  });

  socket.on("checkOnline", ( receiverId ) => {
    const socketReceiverId = users[receiverId];
    if (socketReceiverId) {
      console.log(`User ${receiverId} is online with socket ID: ${socketReceiverId}`);
      io.to(socketReceiverId).emit("onlineStatus", { status: "online" });
    } else {
      console.log(`User ${receiverId} is offline`);
      io.emit("onlineStatus", {status: "offline" });
    }
  });

  socket.on("sendTyping", ({ senderId, receiverId }) => {
    console.log(`User ${senderId} is typing to ${receiverId}`);
    const socketReceiverId = users[receiverId];
    if (socketReceiverId) {
        io.to(socketReceiverId).emit("typing",{ senderId });
    } else {
      console.log(`Receiver ${receiverId} is not connected. Typing event not sent.`);
    }
  });
  
  socket.on("disconnect", async () => {
    io.emit("onLeave");
    const keys = await pubClient.keys("user:*");
    for (const key of keys) {
      const userId= pubClient.get(key);
      if(userId == socket.id){
        await pubClient.del(key);
        console.log("Client disconnected");
      }
    }
  });
});


app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(sessionMiddleware);

app.use("/users",usersRouter);
app.use("/authentication", authRouter);
app.use("/todolist", tasksRouter);
app.use('/realChat',realChatRouter);
app.get("/isloggedin", isLoggedIn, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "User is authenticated",
    user: req.session.user,
  });
});
app.use((req, res, next) => {
  next(new AppError("Not Found", 404));
});
app.use(errorHandler);
server.listen(5000, () => console.log("Server running on http://localhost:5000"));
