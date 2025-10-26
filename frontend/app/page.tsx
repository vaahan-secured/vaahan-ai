"use client";

import { useState, useEffect, useRef } from "react";
import { chatWithAI } from "@/lib/api";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setChatHistory(JSON.parse(saved));
  }, []);

  // Save chat history whenever it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    // Scroll to bottom whenever chat updates
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setChatHistory([...chatHistory, { user: message, bot: null }]);
    const userMessage = message;
    setMessage("");

    try {
      const res = await chatWithAI(userMessage);
      setChatHistory((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, bot: res.response } : msg
        )
      );
    } catch (err) {
      console.error("API error:", err);
      setChatHistory((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, bot: "Error contacting backend" } : msg
        )
      );
    }
  };

  const handleClear = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8 dark:bg-black">
      <h1 className="text-3xl font-semibold mb-6 text-black dark:text-white">Vaahan AI Chatbot MVP</h1>

      <div className="w-full max-w-xl flex flex-col gap-4 mb-4 border rounded p-4 bg-white dark:bg-gray-900">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="text-right text-blue-600">You: {msg.user}</div>
            {msg.bot && <div className="text-left text-green-700">AI: {msg.bot}</div>}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex w-full max-w-xl gap-2 mb-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded px-4 py-2"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      <button
        onClick={handleClear}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Clear Chat
      </button>
    </div>
  );
}
