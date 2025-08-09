"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import Link from "next/link";

export default function ChatUI({ bot, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isIndexBuilding, setIsIndexBuilding] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !bot) return;

    // Subscribe to messages for this user and bot
    const q = query(
      collection(db, `users/${user.uid}/chatbots/${bot.id}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, {
      next: (snapshot) => {
        const messageList = [];
        snapshot.forEach((doc) => {
          messageList.push({ id: doc.id, ...doc.data() });
        });
        setMessages(messageList);
        setIsIndexBuilding(false);
      },
      error: (error) => {
        if (
          error.code === "failed-precondition" &&
          error.message.includes("index")
        ) {
          setIsIndexBuilding(true);
          console.log("Waiting for index to build...");
        } else {
          console.error("Error fetching messages:", error);
        }
      },
    });

    return () => unsubscribe();
  }, [user, bot]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [error, setError] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    const userMessage = newMessage.trim();
    setNewMessage("");

    let userMessageDoc;

    try {
      // Add user message to Firestore
      userMessageDoc = await addDoc(
        collection(db, `users/${user.uid}/chatbots/${bot.id}/messages`),
        {
          message: userMessage,
          sender: "user",
          timestamp: new Date(),
        }
      );

      console.log("Sending message to AI...");

      // Send to API for AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          characterPrompt: bot.prompt,
          conversationHistory: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.message,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to get AI response"
        );
      }

      if (!data.response) {
        throw new Error("Empty response from AI");
      }

      console.log("Received AI response");

      // Add AI response to Firestore
      await addDoc(
        collection(db, `users/${user.uid}/chatbots/${bot.id}/messages`),
        {
          message: data.response,
          sender: "ai",
          timestamp: new Date(),
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message);
      // Show error message to user
      alert(`Error: ${error.message}. Please try again.`);
      // Add error message to chat
      await addDoc(
        collection(db, `users/${user.uid}/chatbots/${bot.id}/messages`),
        {
          message: "Sorry, I encountered an error. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-green-400 hover:underline">
              ← Back
            </Link>
            <div className="flex items-center space-x-3">
              {bot.imageUrl ? (
                <img
                  src={bot.imageUrl}
                  alt={bot.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
                  {bot.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-green-400">{bot.name}</h1>
                <p className="text-sm text-gray-400">
                  {bot.type || "Custom Bot"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isIndexBuilding ? (
          <div className="text-center text-gray-400 mt-8">
            <p>Setting up the chat system... This may take a minute.</p>
            <div className="mt-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-400"></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>Start a conversation with {bot.name}!</p>
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-green-400 text-black"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-900 border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  isIndexBuilding
                    ? "Setting up chat system..."
                    : `Message ${bot.name}...`
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-green-400 focus:outline-none transition-colors text-sm"
                disabled={isLoading || isIndexBuilding}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className="bg-green-400 text-black font-medium text-sm px-5 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
