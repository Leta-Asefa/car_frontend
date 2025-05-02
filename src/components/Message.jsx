import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import Navbar from "./Navbar";
import { FaUserCircle } from "react-icons/fa";
import { IoCheckmarkDoneOutline, IoSend } from "react-icons/io5";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { useParams } from "react-router-dom";


const Message = () => {
  const [conversations, setConversations] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [selected, setSelected] = useState(null);
  const { user } = useAuth()
  const { socket } = useSocketContext()
  const bottomRef = useRef(null);
  const { receiverId } = useParams();

  useEffect(() => {

    if (receiverId) {
      const selectedConversation = conversations.find((conv) =>
        conv.participants.some((p) => p._id === receiverId)
      );
      console.log("selectedConversation", selectedConversation);

      if (selectedConversation) {
        setSelected(selectedConversation);
      }
    }

  }, [conversations])

  useEffect(() => {
    if (selected?.messages.length === 0)
      alert(`Here your seller ! His/Her name is " ` + selected.participants.find((p) => p._id === receiverId).username+' "')

  }, [selected])

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      // Check if message is for the currently selected conversation
      const isInCurrentConversation =
        selected &&
        selected.participants.some(
          (p) => p._id === newMessage.senderId || p._id === newMessage.receiverId
        );

      if (isInCurrentConversation) {
        setSelected((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }));
      }

      // Optionally update the sidebar preview
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === selected?._id
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        )
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selected]);


  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selected?.messages]);



  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/chat/get_conversations/${user._id}`
        );
        setConversations(res.data);

      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };
    fetchConversations();
  }, []);





  return (
    <div className="">
      <Navbar />

      <div className="flex h-screen pt-16 bg-gray-100">
        {/* Sidebar */}

        <aside className="w-1/3 max-w-sm bg-white shadow-md border-r overflow-y-auto">
          <div className="flex items-center gap-2 p-4 border-b bg-gray-50">
            <MdOutlineChatBubbleOutline size={24} className="text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
          </div>
          <ul>
            {conversations.map((conv) => {
              const otherUser = conv.participants.find((p) => p._id !== user._id);
              const lastMessage =
                conv.messages.length > 0
                  ? conv.messages[conv.messages.length - 1].message
                  : "No messages yet";

              return (
                <li
                  key={conv._id}
                  onClick={() => setSelected(conv)}
                  className={`cursor-pointer px-4 py-3 hover:bg-gray-100 border-b transition-all duration-200 flex items-center gap-3 ${selected?._id === conv._id ? "bg-blue-50" : ""
                    }`}
                >
                  <FaUserCircle className="text-3xl text-gray-400" />

                  <div className="flex-1">
                    <p className="font-medium text-gray-800 line-clamp-1">
                      {otherUser?.username || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                      {lastMessage}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Conversation Panel */}
        <main className="flex-1 flex flex-col bg-white shadow-sm">
          {selected ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 border-b px-6 py-4 bg-gray-50">
                <FaUserCircle className="text-3xl text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {selected.participants.find((p) => p._id !== user._id)?.username ?? "Unknown"}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {selected.messages.map((msg) => {
                  const isMe = msg.senderId === user._id;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`relative mt-2 px-4 py-2 max-w-[70%] min-w-[100px] rounded-2xl ${isMe
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                          }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.message}</p>
                        <span className="absolute bottom-[-1.1rem] right-2 text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const receiver = selected.participants.find((p) => p._id !== user._id);
                  if (!receiver || !messageText.trim()) return;

                  try {
                    const res = await axios.post(
                      `http://localhost:4000/api/chat/send/${receiver._id}`,
                      { message: messageText, senderId: user._id }
                    );

                    const newMessage = res.data;
                    setSelected((prev) => ({
                      ...prev,
                      messages: [...prev.messages, newMessage],
                    }));
                    setMessageText("");
                  } catch (err) {
                    console.error("Message send failed:", err);
                  }
                }}
                className="border-t bg-white p-4 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition flex items-center justify-center"
                >
                  <IoSend size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-500 text-lg">
              Select a conversation to start chatting
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

export default Message;
