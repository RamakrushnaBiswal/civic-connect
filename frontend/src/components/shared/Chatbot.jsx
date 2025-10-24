import React, { useState } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react"; // icon library (optional)

const Chatbot  = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋, I’m Civic-Connect. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
      });
      setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
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
                {msg.text}
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
