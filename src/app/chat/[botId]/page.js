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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-600 dark:border-t-green-400"></div>
          <p className="text-green-600 dark:text-green-400 text-lg font-medium">
            Loading Chat...
          </p>
        </div>
      </div>
    );
  }

  if (!bot || !user) {
    return null;
  }

  return <ChatUI bot={bot} user={user} />;
}
