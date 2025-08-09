"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { getBot } from "@/lib/firestore";
import ChatUI from "@/components/ChatUI";

export default function ChatPage({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const { botId } = use(params);

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-400"></div>
      </div>
    );
  }

  if (!bot || !user) {
    return null;
  }

  return <ChatUI bot={bot} user={user} />;
}
