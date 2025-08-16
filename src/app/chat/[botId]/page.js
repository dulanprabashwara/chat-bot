"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { getBot } from "@/lib/firestore";
import ChatUI from "@/components/ChatUI";
import { use } from "react";

export default function ChatPage({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);
  const botId = resolvedParams.botId;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);
      try {
        const botData = await getBot(user.uid, botId);
        setBot(botData);
      } catch (error) {
        console.error("Error fetching bot:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [botId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen transition-colors">
        <div className="text-center space-y-6">
          {/* Enhanced loading spinner */}
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 dark:border-gray-700 mx-auto"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-t-green-500 border-r-green-400 border-transparent mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            {/* Inner pulse */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* Loading text with animation */}
          <div className="space-y-2">
            <p className="text-green-600 dark:text-green-400 text-2xl font-bold animate-pulse">
              Loading Chat...
            </p>
            <div className="flex justify-center space-x-1">
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!bot || !user) {
    return null;
  }

  return <ChatUI bot={bot} user={user} />;
}
