const express = require("express");
const connectDatabase = require("../../libs/connectDb");
const router = express.Router();
const Message = require("../../libs/models/messages.js");

connectDatabase();
router.get("/getMessages", async (req, res) => {
  try {
    const messages = await // In your backend:
Message.find().sort({ createdAt: -1 }).limit(50);
    res.json(messages);
  } catch (err) {
    console.log("Error while loading messages..");
    res.status(500).json({ message: "Error while loading messages..", err });
  }
});
router.post("/saveMessage", async (req, res) => {
  try {
    const { sender, content, timestamp } = req.body;
    const message = new Message({ sender, content, timestamp });
    message.save();
    res.status(200).json({ message: "Message saved successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error during message saving." });
  }
});
router.put("/updateMessage", async (req,res)=>{
    try{
        const id = req.params.id;
        const { sender, content, timestamp } = req.body;
        const message = new Message({ sender, content, timestamp });
        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            message,
            {new:true},
        )
        if(!updatedMessage){
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedMessage);
    }catch(err){
        res.status(500).json({ message: "Server error during message saving." });
    }
});
router.delete("/deleteMessage", async (req,res)=>{
    try{
        const id = req.params.id;
        const deletedMessage = await Message.delete(id);
        if(!deletedMessage){
            res.status(400).json({ message:"bad request" });
        }
        res.status(200).json("Message deleted successfully.");
    }catch(err){
        res.status(500).json({ message:"Server erro during message deletion.."});
    }
});

module.exports = router;