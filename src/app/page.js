"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getUserBots } from "@/lib/firestore";
import BotCard from "@/components/BotCard";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [userBots, setUserBots] = useState([]);
  const [loadingBots, setLoadingBots] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Fetch user's bots
  const fetchUserBots = async (userId) => {
    try {
      setLoadingBots(true);
      const bots = await getUserBots(userId);
      setUserBots(bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
    } finally {
      setLoadingBots(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        fetchUserBots(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowAuth(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-green-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLogin={() => setShowAuth(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="text-center py-20">
            <h1 className="text-6xl font-bold text-green-400 mb-6">
              AI Character Chat
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with unique AI personalities. Each character has their own
              expertise, personality, and knowledge to share.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="bg-green-400 text-black font-semibold text-lg px-8 py-3 rounded-md hover:bg-opacity-90 transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-green-400">
                  Your AI Companions
                </h1>
                <p className="text-gray-400 mt-2">
                  Create and chat with your personalized AI bots
                </p>
              </div>
              <Link
                href="/create-bot"
                className="bg-green-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200"
              >
                Create New Bot
              </Link>
            </div>

            {loadingBots ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-green-400"></div>
              </div>
            ) : userBots.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-gray-300 mb-4">
                  No Bots Created Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Create your first AI companion to start chatting!
                </p>
                <Link
                  href="/create-bot"
                  className="bg-green-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 inline-block"
                >
                  Create Your First Bot
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userBots.map((bot) => (
                  <BotCard key={bot.id} bot={bot} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
              {isLogin ? "Login" : "Sign Up"}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:border-green-400 focus:outline-none transition-colors w-full"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:border-green-400 focus:outline-none transition-colors w-full"
                  required
                />
              </div>

              {authError && (
                <div className="text-red-400 text-sm">{authError}</div>
              )}

              <button
                type="submit"
                className="bg-green-400 text-black font-semibold px-6 py-2 rounded-md hover:bg-opacity-90 transition-all duration-200 w-full"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-400 hover:underline"
              >
                {isLogin
                  ? "Need an account? Sign up"
                  : "Already have an account? Login"}
              </button>
            </div>

            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
