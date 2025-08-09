"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { getUserBots, setUserProfile, getUserProfile } from "@/lib/firestore";
import BotCard from "@/components/BotCard";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userBots, setUserBots] = useState([]);
  const [profile, setProfile] = useState(null);
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

  // (Removed duplicate handleAuth definition)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        // Load profile
        try {
          const profileDoc = await getUserProfile(user.uid);
          setProfile(profileDoc);
          if (profileDoc?.displayName) setDisplayName(profileDoc.displayName);
        } catch (e) {
          console.warn("Profile load failed", e);
        }
        fetchUserBots(user.uid);
      } else {
        setDisplayName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      // Basic client-side checks to avoid unnecessary 400s
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setAuthError("Enter a valid email address.");
        return;
      }
      if (!password || password.length < 6) {
        setAuthError("Password must be at least 6 characters.");
        return;
      }
      if (!isLogin) {
        if (!displayName.trim() || displayName.trim().length < 2) {
          setAuthError("Display Name must be at least 2 characters.");
          return;
        }
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const cleanedName = displayName.trim();
        if (cleanedName) {
          await updateProfile(cred.user, { displayName: cleanedName });
          await setUserProfile(cred.user.uid, { displayName: cleanedName });
        }
      }
      setShowAuth(false);
      setEmail("");
      setPassword("");
      if (!isLogin) setDisplayName("");
    } catch (error) {
      let friendly = "Authentication failed.";
      if (error?.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            // If user tried to sign up with existing email, attempt auto-login
            if (!isLogin) {
              try {
                const loginCred = await signInWithEmailAndPassword(
                  auth,
                  email,
                  password
                );
                // Success: treat as login
                setShowAuth(false);
                setIsLogin(true);
                setEmail("");
                setPassword("");
                friendly = "Account already existed. Logged you in.";
              } catch (loginErr) {
                // Fallback: instruct user to switch to login
                friendly =
                  "Email already in use. Switch to Login and enter your password.";
              }
              // Show message (success or guidance) and exit catch handler
              setAuthError(friendly.includes("Logged you in") ? "" : friendly);
              return;
            } else {
              friendly = "Email already in use.";
            }
            break;
          case "auth/invalid-email":
            friendly = "Invalid email format.";
            break;
          case "auth/weak-password":
            friendly = "Password too weak (min 6 characters).";
            break;
          case "auth/user-not-found":
          case "auth/wrong-password":
            friendly = "Incorrect email or password.";
            break;
          case "auth/too-many-requests":
            friendly = "Too many attempts. Please wait and try again.";
            break;
          case "auth/operation-not-allowed":
            friendly = "Email/password sign-in disabled in Firebase Console.";
            break;
          default:
            friendly = error.code.replace("auth/", "").replace(/-/g, " ");
        }
      } else if (error?.message) {
        friendly = error.message;
      }
      console.error("Auth error", {
        code: error?.code,
        message: error?.message,
      });
      setAuthError(friendly);
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
        profile={profile || { displayName }}
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
                  {displayName
                    ? `Welcome, ${displayName}`
                    : "Your AI Companions"}
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
              {!isLogin && (
                <div>
                  <input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:border-green-400 focus:outline-none transition-colors w-full"
                    required
                  />
                </div>
              )}

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
