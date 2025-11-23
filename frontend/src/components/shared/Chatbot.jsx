/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react"; // icon library (optional)

const Chatbot  = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋, I’m Civic-Connect. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  // ensure a persistent session id for conversational context
  const getSessionId = () => {
    let sid = localStorage.getItem("cc_chat_session_id");
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 10);
      localStorage.setItem("cc_chat_session_id", sid);
    }
    return sid;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
        session_id: getSessionId(),
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      // if action present, attach it so we can render buttons
      if (res.data.action) botMsg.action = res.data.action;

      setMessages([...newMessages, botMsg]);
    } catch (err) {
      setMessages([...newMessages, { sender: "bot", text: "⚠️ Sorry, something went wrong." }]);
    }

    setInput("");
  };

  return (
    <div>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-white shadow-2xl rounded-lg flex flex-col">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <span>Civic-Connect Bot 🤖</span>
            <button onClick={() => setOpen(false)} className="text-white font-bold">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 h-64">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`my-2 p-2 rounded-lg max-w-xs ${
                  msg.sender === "bot"
                    ? "bg-gray-200 text-left self-start"
                    : "bg-green-200 text-right self-end"
                }`}
              >
                <div>{msg.text}</div>
                {msg.action && msg.action.type === "navigate" && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        // use client-side navigation if app provides routes, otherwise do full redirect
                        try {
                          window.location.assign(msg.action.route);
                        } catch (e) {
                          window.location.href = msg.action.route;
                        }
                      }}
                      className="mt-1 bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Open {msg.action.route}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex border-t p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-lg p-2 text-sm"
              placeholder="Type your query..."
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
