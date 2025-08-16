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
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

export default function ChatUI({ bot, user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isIndexBuilding, setIsIndexBuilding] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper function to group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message) => {
      const messageDate = message.createdAt
        ? new Date(message.createdAt.seconds * 1000).toDateString()
        : new Date().toDateString();

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  // Helper function to format date for display
  const formatDateSeparator = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredMessages([]);
      return;
    }

    const filtered = messages.filter((message) =>
      message.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMessages(filtered);
  };

  // Clear all chat messages
  const clearAllChats = async () => {
    if (!user || !bot) return;

    try {
      const messagesRef = collection(
        db,
        `users/${user.uid}/chatbots/${bot.id}/messages`
      );
      const snapshot = await getDocs(messagesRef);

      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      setMessages([]);
      setShowMenu(false);
      setShowClearConfirm(false);
      setShowSuccessToast(true);

      // Hide success toast after 3 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting messages:", error);
      alert("Failed to delete messages. Please try again.");
    }
  };

  // Show clear confirmation dialog
  const handleClearChatClick = () => {
    setShowClearConfirm(true);
    setShowMenu(false);
  };

  // Emoji picker functionality
  const commonEmojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "😈",
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👋",
    "🤚",
    "🖐",
    "✋",
    "🖖",
    "👏",
    "🙌",
    "🤲",
    "🤝",
    "🙏",
    "✍️",
    "💪",
    "🦾",
    "🦿",
    "🦵",
    "🦶",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
    "⭐",
    "🌟",
    "✨",
    "💫",
    "⚡",
    "☄️",
    "💥",
    "🔥",
    "🌈",
    "☀️",
  ];

  const addEmoji = (emoji) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user || !bot) return;

    // Subscribe to messages for this user and bot
    const q = query(
      collection(db, `users/${user.uid}/chatbots/${bot.id}/messages`),
      orderBy("createdAt", "asc")
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

  // Use custom bot prompt or fallback to predefined character prompt
  const getCharacterPrompt = (bot) => {
    // If the bot has a custom prompt, use it
    if (bot.prompt && bot.prompt.trim()) {
      return `You are ${bot.name}, an AI assistant on the BotNexus platform. ${bot.prompt}. Always introduce yourself as ${bot.name} and follow the behavior described. Be consistent with this personality throughout the conversation.`;
    }

    // Fallback to predefined prompts if no custom prompt
    const prompts = {
      assistant:
        "You are a highly knowledgeable and efficient AI assistant named BotNexus Assistant. You provide clear, accurate, and actionable information. You're professional yet approachable, and you always aim to solve problems efficiently. You ask clarifying questions when needed and provide step-by-step solutions. Stay focused and helpful in every response.",
      friend:
        "You are a warm and caring AI friend named BotNexus Friend. You're empathetic, supportive, and genuinely interested in the user's wellbeing. You use casual, friendly language and often share encouraging words. You remember context from conversations and show genuine concern. You're like a supportive best friend who's always there to listen and offer comfort.",
      teacher:
        "You are an inspiring AI teacher named BotNexus Educator. You're patient, encouraging, and skilled at breaking down complex concepts into digestible pieces. You use examples, analogies, and interactive questions to help students learn. You celebrate progress, provide constructive feedback, and adapt your teaching style to the user's learning pace. You make learning engaging and fun.",
      expert:
        "You are a highly specialized AI expert named BotNexus Expert. You have deep, technical knowledge across multiple domains and provide detailed, research-backed information. You cite sources when possible, explain complex concepts thoroughly, and offer multiple perspectives on topics. You're analytical, precise, and always strive for accuracy in your expertise.",
      artist:
        "You are a creative and imaginative AI artist named BotNexus Creative. You're passionate about all forms of artistic expression, from visual arts to creative writing. You inspire creativity, offer artistic techniques, and help users explore their creative side. You speak with enthusiasm about art, use vivid descriptions, and encourage experimental thinking. You see beauty and creative potential everywhere.",
    };
    return prompts[bot.type] || prompts.assistant;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    const messageText = newMessage;
    setNewMessage("");

    try {
      // Add user message to Firestore
      await addDoc(
        collection(db, `users/${user.uid}/chatbots/${bot.id}/messages`),
        {
          content: messageText,
          role: "user",
          createdAt: new Date(),
        }
      );

      // Send to API with conversation history
      const conversationHistory = messages
        .slice(-10) // Only send last 10 messages to avoid token limits
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          characterPrompt: getCharacterPrompt(bot),
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add AI response to Firestore
      await addDoc(
        collection(db, `users/${user.uid}/chatbots/${bot.id}/messages`),
        {
          content: data.response,
          role: "assistant",
          createdAt: new Date(),
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
          content: "Sorry, I encountered an error. Please try again.",
          role: "assistant",
          createdAt: new Date(),
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black">
      {/* WhatsApp-style Header */}
      <div className="bg-green-600 dark:bg-green-700 text-white p-3 sm:p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <Link
              href="/"
              className="text-white hover:text-green-100 transition-colors flex-shrink-0"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              {bot.imageUrl ? (
                <img
                  src={bot.imageUrl}
                  alt={bot.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white/20 flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-sm sm:text-lg font-semibold flex-shrink-0">
                  {bot.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <h1 className="text-base sm:text-lg font-semibold truncate">
                    {bot.name}
                  </h1>
                  {/* Verified Badge with Scalloped Border */}
                  <svg
                    className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    {/* Scalloped/Star-like border */}
                    <path
                      d="M12 2L13.09 6.26L18 5L16.74 9.26L21 12L16.74 14.74L18 19L13.09 17.74L12 22L10.91 17.74L6 19L7.26 14.74L3 12L7.26 9.26L6 5L10.91 6.26L12 2Z"
                      fill="#10B981"
                      className="drop-shadow-sm"
                    />
                    {/* White checkmark */}
                    <path
                      d="M9.5 13.5L11 15L15 11"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm text-green-100 truncate">
                  {isLoading ? "typing..." : "online"}
                </p>
              </div>
            </div>
          </div>

          {/* Three Dots Menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <button
                  onClick={() => {
                    setIsSearching(!isSearching);
                    setShowMenu(false);
                    setSearchQuery("");
                    setFilteredMessages([]);
                  }}
                  className="w-full px-3 sm:px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 sm:space-x-3"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">Search Messages</span>
                </button>
                <button
                  onClick={handleClearChatClick}
                  className="w-full px-3 sm:px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 sm:space-x-3"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">Clear Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {isSearching && (
          <div className="mt-3 sm:mt-4 flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full px-3 sm:px-4 py-2 pl-8 sm:pl-10 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm sm:text-base"
              />
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchQuery("");
                setFilteredMessages([]);
              }}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* WhatsApp-style Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-black"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23f3f4f6' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='4'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
        }}
      >
        {isIndexBuilding ? (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-sm mx-auto">
              <p className="text-lg font-medium mb-4">
                Setting up the chat system...
              </p>
              <p className="text-sm mb-4">This may take a minute.</p>
              <div className="relative">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 dark:border-gray-700"></div>
                <div className="absolute inset-0 inline-block animate-spin rounded-full h-10 w-10 border-4 border-transparent border-t-green-600 dark:border-t-green-400"></div>
              </div>
              <div className="flex justify-center space-x-1 mt-4">
                <div
                  className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-sm mx-auto">
              <p className="text-lg font-medium mb-2">👋 Welcome!</p>
              <p>Start a conversation with {bot.name}</p>
            </div>
          </div>
        ) : null}

        {/* Search Results */}
        {isSearching && searchQuery ? (
          <div>
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {filteredMessages.length} result
                  {filteredMessages.length !== 1 ? "s" : ""} for "{searchQuery}"
                </span>
              </div>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-sm mx-auto">
                  <p className="text-lg font-medium mb-2">🔍 No Results</p>
                  <p>No messages found for "{searchQuery}"</p>
                </div>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-3 sm:mb-4 px-2 sm:px-4`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm ${
                      message.role === "user"
                        ? "bg-green-500 text-white ml-4 sm:ml-12"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 mr-4 sm:mr-12"
                    }`}
                    style={{
                      borderRadius:
                        message.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                    }}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {message.content
                        .split(new RegExp(`(${searchQuery})`, "gi"))
                        .map((part, index) =>
                          part.toLowerCase() === searchQuery.toLowerCase() ? (
                            <mark
                              key={index}
                              className="bg-yellow-200 dark:bg-yellow-600 text-black dark:text-white rounded px-1"
                            >
                              {part}
                            </mark>
                          ) : (
                            part
                          )
                        )}
                    </p>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-green-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.createdAt
                        ? new Date(
                            message.createdAt.seconds * 1000
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </div>
                    {/* WhatsApp-style tail */}
                    <div
                      className={`absolute top-0 w-0 h-0 ${
                        message.role === "user"
                          ? "right-0 -mr-2 border-l-8 border-l-green-500 border-t-8 border-t-transparent"
                          : "left-0 -ml-2 border-r-8 border-r-white dark:border-r-gray-800 border-t-8 border-t-transparent"
                      }`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Regular Messages Display */
          messages.length > 0 &&
          groupMessagesByDate(messages).map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date Separator */}
              <div className="flex justify-center my-6">
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {formatDateSeparator(group.date)}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              {group.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-3 sm:mb-4 px-2 sm:px-4`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm ${
                      message.role === "user"
                        ? "bg-green-500 text-white ml-4 sm:ml-12"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 mr-4 sm:mr-12"
                    }`}
                    style={{
                      borderRadius:
                        message.role === "user"
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                    }}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {message.content}
                    </p>
                    <div
                      className={`text-xs mt-1 sm:mt-2 ${
                        message.role === "user"
                          ? "text-green-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.createdAt
                        ? new Date(
                            message.createdAt.seconds * 1000
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </div>
                    {/* WhatsApp-style tail */}
                    <div
                      className={`absolute top-0 w-0 h-0 ${
                        message.role === "user"
                          ? "right-0 -mr-2 border-l-8 border-l-green-500 border-t-8 border-t-transparent"
                          : "left-0 -ml-2 border-r-8 border-r-white dark:border-r-gray-800 border-t-8 border-t-transparent"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg shadow-sm mr-12"
              style={{ borderRadius: "18px 18px 18px 4px" }}
            >
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp-style Input Area */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={sendMessage}
            className="flex items-end space-x-2 sm:space-x-3"
          >
            {/* Attachment button (disabled for now) */}
            <button
              type="button"
              className="flex-shrink-0 p-2 sm:p-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>

            {/* Message input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={
                  isIndexBuilding
                    ? "Setting up chat system..."
                    : `Type a message...`
                }
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 pr-10 sm:pr-12 text-gray-900 dark:text-white focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors text-sm sm:text-base shadow-sm"
                disabled={isLoading || isIndexBuilding}
              />
              {/* Emoji button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-base sm:text-lg"
              >
                😊
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 sm:p-3 w-72 sm:w-80 max-h-48 sm:max-h-60 overflow-y-auto z-50"
                >
                  <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                    {commonEmojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addEmoji(emoji)}
                        className="p-1.5 sm:p-2 text-base sm:text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className={`flex-shrink-0 p-2 sm:p-3 rounded-full transition-all duration-200 shadow-lg ${
                newMessage.trim() && !isLoading
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Clear Chat Confirmation Toast */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Clear Chat?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This action will delete all messages in this chat. This cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowClearConfirm(false);
                  clearAllChats();
                }}
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4">
          <div className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm sm:text-base">
              Chat cleared successfully
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
