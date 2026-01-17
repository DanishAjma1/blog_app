import axios from "axios";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function RealChat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const url = "http://localhost:5000/realchat";
  const getUsersUrl = "http://localhost:5000/users/getUsers";
  const getMessagesUrl = "http://localhost:5000/realchat/getMessages";
  const getCurrentUserUrl = "http://localhost:5000/isloggedin";
  const socket = useRef();
  const [receiverId, setReceiverId] = useState("");
  const [senderId, setSenderId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      withCredentials: true,
    });

    const handleConnect = async() => {
      const user = await fetchCurrentUser();
      setSenderId(user.id);
      setSender(user.name);
      socket.current.emit("join", user.id);
      console.log("User joined with ID:", user.id);
      // socket.current.emit("checkOnline", receiverId);
      fetchUsers();
    };

    socket.current.on("connect", handleConnect);

    socket.current.on("receiveMessage", (data) => {
      setMessages((prev) => [data, ...prev]);
    });

    socket.current.on("typing", ({ senderId }) => {
      setIsTyping(true);
      setSender(senderId);
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    });

    socket.current.on("onLeave", () => {
      console.log("A user has left the chat.");
      setIsOnline(false);
    });

    socket.current.on("onlineStatus", ({ status }) => {
      if (status === "online") {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    });

    return () => {
      socket.current.off("connect", handleConnect);
      socket.current.off("receiveMessage");
      socket.current.off("typing");
      socket.current.off("onLeave");
      socket.current.off("onlineStatus");
      socket.current.disconnect();
    };
  }, [senderId, receiverId]);

const fetchCurrentUser = async () => {
  try {
    const res = await axios.get(getCurrentUserUrl, {
      withCredentials: true,
    });
    const user = res.data.user; // Try to get user from res.data.user, fallback to res.data
    return user;
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return null;
  }
};
  const fetchUsers = async () =>{
    try{
      const users = await axios.get(getUsersUrl,{
        email:"dbutt9600@gmail.com"
      });
      setUsers(users.data.users);
    }catch(err){
      console.log(err);
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await axios.get(getMessagesUrl);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };
  const getTime = (time) => {
    return (
      <span
        className={`text-xs text-neutral-300  ${
          isOnline ? "text-green-500" : "text-gray-500"
        }`}
      >
        {time ? ` ${time.slice(11, 16)}` : ""}
      </span>
    );
  };
  const getText = (text) => {
    return <span className="font-sans px-2">{text}</span>;
  };
  const headingDiv = (heading) => {
    return (
      <div className="border-b mb-2 border-gray-300 rounded-lg px-2">
        <p className="text-xs mb-1">{heading}</p>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-2 ">
      <div className="flex flex-row mb-4 justify-between items-start gap-4">
        {/* Left Side */}
        <div className="flex flex-col gap-2 mb-4 w-[30%] relative bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-3xl font-semibold text-start font-serif text-gray-800 rounded-lg p-4">
            MERN RealChat
          </h2>
          {users.map((user) =>
            user._id !== null ? (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition cursor-pointer"
                onClick={() => {
                  setIsOnline(false);
                  setIsTyping(false);
                  setReceiverId(user._id);
                  setReceiver(user.name);
                  setMessages([]);
                  
                  socket.current.emit("checkOnline", user._id);
                  fetchMessages();
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {user.email}
                  </span>
                </div>
              </div>
            ) : (
              <p key={user._id || Math.random()}>There are not users..</p>
            )
          )}
        </div>
        {/* Right Side */}
        <div className="w-[70%] h-full text-start rounded-lg scroll-smooth shadow p-2 flex flex-col">
          <div className="bg-white rounded-lg shadow mb-4 p-3 w-full">
            <h2 className="text-xl font-semibold  text-gray-800 px-4">
              {receiver ? receiver : "Select a user to chat"}
            </h2>
            <div className="text-green-500 text-xs italic px-4">
              {isTyping ? (
                `${sender} is typing...`
              ) : (
                <p
                  className={`text-xs ${
                    isOnline ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              )}
            </div>
          </div>
          { messages.length > 0 ? (
            <div>
          <div className="w-full flex flex-col gap-2 overflow-y-auto max-h-[500px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex px-3 py-2 rounded ${
                  msg.sender === senderId ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === senderId ? (
                  <div className="bg-red-950 text-white rounded-lg p-2 shadow-md max-w-[60%] ml-auto">
                    {headingDiv("You")}
                    {getText(msg.content)}
                    {getTime(msg.timestamp)}
                  </div>
                ) : (
                  <div className="bg-gray-800 text-white rounded-lg p-2 shadow-md max-w-[60%] mr-auto">
                    {headingDiv("Them")}
                    {getText(msg.content)}
                    {getTime(msg.timestamp)}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="fixed bottom-14 left-[30%] right-[0] ">
            <form
              className="mt-4 flex items-center justify-center"
              onSubmit={(e) => {
                e.preventDefault();
                if (message.trim() === "") return;
                if (socket.current && socket.current.connected) {
                  socket.current.emit("sendMessage", {
                    senderId: senderId,
                    receiverId: receiverId,
                    content: message,
                    timestamp: new Date().toTimeString().slice(0, 5),
                  });
                } else {
                  console.error("Socket is not connected.");
                }
                setMessages((prev) => [
                  {
                    sender: senderId,
                    receiver: receiverId,
                    content: message,
                    timestamp: new Date().toISOString(),
                  },
                  ...prev,
                ]);
                setMessage("");
              }}
            >
              <textarea
                rows="auto"
                placeholder="Enter your message"
                onChange={(e) => {
                  setMessage(e.target.value);

                  if (socket.current && socket.current.connected) {
                    console.log("Typing:", e.target.value);
                    socket.current.emit("sendTyping", {
                      senderId,
                      receiverId,
                    });
                  }
                }}
                value={message}
                required
                autoFocus
                className="text-wrap text-xl text-start px-4 rounded-xl text-black w-2/5 h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded ml-2 transition"
              >
                Send
              </button>
            </form>
          </div>
          </div>
          ):(
          <div className="w-full flex items-center justify-center h-full">
            <p className="text-black">No messages yet. Start chatting!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
