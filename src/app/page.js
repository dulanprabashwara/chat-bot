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
import MagneticButton from "@/components/MagneticButton";
import { CheckCircle2, Lock, Globe2, Save } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userBots, setUserBots] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingBots, setLoadingBots] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-green-600 dark:text-green-400 text-2xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar
        user={user}
        profile={profile || { displayName }}
        onLogout={handleLogout}
        onLogin={() => setShowAuth(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="py-20 space-y-28">
          {/* Hero */}
          <section className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-green-600 dark:text-green-400 mb-6 leading-tight">
              Your Personal AI Assistant, Anytime.
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Chat with our AI for instant answers, ideas, and conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              {!user && (
                <MagneticButton
                  onClick={() => setShowAuth(true)}
                  className="text-lg px-10 py-4"
                >
                  Get Started
                </MagneticButton>
              )}
              <button
                onClick={() => {
                  const el = document.getElementById("bot-types");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center gap-3 text-lg font-semibold px-10 py-4 rounded-xl border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 bg-white dark:bg-gray-900 hover:border-green-500 dark:hover:border-green-300 hover:text-green-500 dark:hover:text-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60 dark:focus-visible:ring-green-400/60 transition-colors"
                aria-label="Explore available bot characters"
              >
                <span>Explore Bots</span>
                <svg
                  className="h-5 w-6 translate-x-0 group-hover:translate-x-2 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12h15" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </section>

          {/* Bot Types Preview */}
          <section id="bot-types" className="space-y-8">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Bot Personalities
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  name: "Assistant",
                  img: "/images/assistant-bot.png",
                  blurb: "General help & productivity.",
                },
                {
                  name: "Teacher",
                  img: "/images/teacher-bot.png",
                  blurb: "Explains concepts clearly.",
                },
                {
                  name: "Friend",
                  img: "/images/friend-bot.png",
                  blurb: "Casual supportive chats.",
                },
                {
                  name: "Expert",
                  img: "/images/expert-bot.png",
                  blurb: "Deep domain knowledge.",
                },
                {
                  name: "Artist",
                  img: "/images/artist-bot.png",
                  blurb: "Creative brainstorming.",
                },
              ].map((b) => (
                <div
                  key={b.name}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center hover:border-green-500 dark:hover:border-green-400 transition-colors"
                >
                  <img
                    src={b.img}
                    alt={b.name}
                    className="w-16 h-16 mb-3 rounded-full object-cover"
                  />
                  <h3 className="text-green-600 dark:text-green-300 font-semibold">
                    {b.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-snug">
                    {b.blurb}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section id="features" className="space-y-8">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Features
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Smart, natural conversations",
                  icon: CheckCircle2,
                  desc: "Understands context for more relevant replies.",
                },
                {
                  title: "Secure & private",
                  icon: Lock,
                  desc: "Chats tied to your account only – not public.",
                },
                {
                  title: "Works on any device",
                  icon: Globe2,
                  desc: "Responsive UI across desktop & mobile.",
                },
                {
                  title: "Saves your chat history",
                  icon: Save,
                  desc: "Pick up right where you left off.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col gap-4 hover:border-green-500 dark:hover:border-green-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <f.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <h3 className="text-green-600 dark:text-green-300 font-semibold text-base leading-tight">
                      {f.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="space-y-8">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              How It Works
            </h2>
            <ol className="grid gap-6 md:grid-cols-3 list-none">
              {[
                {
                  step: 1,
                  title: "Sign up",
                  text: "Create your account in seconds.",
                },
                {
                  step: 2,
                  title: "Start chatting",
                  text: "Pick a bot personality or create your own.",
                },
                {
                  step: 3,
                  title: "Save & share",
                  text: "Your conversations are stored – export coming soon.",
                },
              ].map((s) => (
                <li
                  key={s.step}
                  className="relative bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col gap-3 hover:border-green-500 dark:hover:border-green-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-600 dark:bg-green-400 text-white dark:text-black font-semibold text-lg">
                      {s.step}
                    </div>
                    <h3 className="text-green-600 dark:text-green-300 font-semibold text-lg">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Testimonials (optional) */}
          <section id="testimonials" className="space-y-8">
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              What Early Users Say
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  name: "Alex",
                  text: "Feels like chatting with a real collaborator – boosts my brainstorming.",
                },
                {
                  name: "Priya",
                  text: "I love switching personas to get different angles on the same problem.",
                },
                {
                  name: "Daniel",
                  text: "Fast, clean, and remembers context better than most chat apps I've tried.",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col gap-4 hover:border-green-500 dark:hover:border-green-400 transition-colors"
                >
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    “{t.text}”
                  </p>
                  <div className="text-green-600 dark:text-green-300 text-sm font-medium">
                    — {t.name}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Footer />
        </div>
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-gray-800 border border-gray-700 p-8 rounded-lg max-w-md w-full mx-4">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>

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
          </div>
        </div>
      )}
    </div>
  );
}
