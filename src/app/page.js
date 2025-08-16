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
import Navbar from "@/components/ResizableNavbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MagneticButton from "@/components/MagneticButton";
import { CheckCircle2, Lock, Globe2, Save } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authError, setAuthError] = useState("");
  const [userBots, setUserBots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const bots = await getUserBots(user.uid);
          setUserBots(bots);
        } catch (error) {
          console.error("Error fetching user bots:", error);
        }
      } else {
        setUserBots([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChatNowClick = (botType) => {
    if (user) {
      // User is authenticated, redirect to create-bot page with bot type
      router.push(`/create-bot?type=${botType}`);
    } else {
      // User is not authenticated, show sign-in form
      setShowAuth(true);
      setIsLogin(true);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName });
        await setUserProfile(userCredential.user.uid, {
          displayName,
          email,
          createdAt: new Date().toISOString(),
        });
      }
      setShowAuth(false);
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (isLoading) {
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
              Loading BotNexus...
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

  return (
    <div className="transition-colors">
      <Navbar
        user={user}
        onLogin={() => setShowAuth(true)}
        onLogout={handleSignOut}
      />

      <main className="pt-28">
        <div className="min-h-screen bg-transparent">
          <div className="w-full">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <section className="text-center space-y-8 relative z-10">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl font-bold text-green-600 dark:text-green-400 leading-tight">
                    Chat with Personality
                  </h1>
                  <p className="text-xl text-foreground max-w-3xl mx-auto">
                    Experience conversations that adapt to your needs with AI
                    personalities that understand context and remember what
                    matters.
                  </p>
                </div>

                {user ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard">
                      <MagneticButton className="bg-green-400 text-black font-semibold px-8 py-4 rounded-md hover:bg-opacity-90 transition-all duration-200">
                        Go to Dashboard
                      </MagneticButton>
                    </Link>
                    <Link href="/create-bot">
                      <MagneticButton className="bg-green-400 border border-green-400 text-black font-semibold px-8 py-4 rounded-md hover:bg-green-500 hover:text-black transition-all duration-200">
                        Create Bot
                      </MagneticButton>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <MagneticButton
                      onClick={() => {
                        setIsLogin(false);
                        setShowAuth(true);
                      }}
                      className="bg-green-400 text-black font-semibold px-8 py-4 rounded-md hover:bg-opacity-90 transition-all duration-200"
                    >
                      Get Started Free
                    </MagneticButton>
                    <MagneticButton
                      onClick={() => {
                        setIsLogin(true);
                        setShowAuth(true);
                      }}
                      className="bg-green-400 border border-green-400 text-black font-semibold px-8 py-4 rounded-md hover:bg-green-500 hover:text-black transition-all duration-200"
                    >
                      Sign In
                    </MagneticButton>
                  </div>
                )}
              </section>
            </div>

            {/* Rest of the content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 relative z-10">
              {/* About Site Description */}
              <section className="text-center space-y-6 max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-8 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                    Your Digital Companion Awaits
                  </h2>
                  <p className="text-lg text-foreground leading-relaxed">
                    Our AI Chatbot is designed to make every conversation smart,
                    simple, and meaningful. Whether you need quick answers,
                    creative ideas, or just someone to talk to, our assistant is
                    always ready — 24/7. With secure authentication, saved chat
                    history, and image sharing, you can enjoy a personalized and
                    seamless experience every time you log in. It's more than
                    just a chatbot — it's your digital companion.
                  </p>

                  {/* Decorative elements */}
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              </section>

              {/* Features Grid */}
              <section className="space-y-12">
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 text-center">
                  Why Choose Our AI Chat?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: (
                        <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                      ),
                      title: "Multiple Personalities",
                      desc: "Switch between different AI personalities for varied conversation styles.",
                    },
                    {
                      icon: (
                        <Lock className="h-12 w-12 text-green-600 dark:text-green-400" />
                      ),
                      title: "Privacy Focused",
                      desc: "Your conversations are secure and private by design.",
                    },
                    {
                      icon: (
                        <Globe2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                      ),
                      title: "Always Available",
                      desc: "24/7 access to intelligent conversations whenever you need them.",
                    },
                    {
                      icon: (
                        <Save className="h-12 w-12 text-green-600 dark:text-green-400" />
                      ),
                      title: "Save & Export",
                      desc: "Keep your important conversations and export them when needed.",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="group relative bg-secondary border border-border rounded-xl p-6 text-center space-y-4 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-500 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer transform"
                      style={{
                        animationDelay: `${index * 150}ms`,
                      }}
                    >
                      {/* Decorative corner element */}
                      <div className="absolute top-4 right-4 w-3 h-3 bg-green-500/20 rounded-full group-hover:bg-green-500/40 group-hover:scale-150 transition-all duration-300"></div>

                      <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-green-600 dark:text-green-300 font-bold text-xl group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground transition-colors">
                        {feature.desc}
                      </p>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-3/4 transition-all duration-300 rounded-t-full"></div>
                    </div>
                  ))}
                </div>
              </section>

              {/* How it works */}
              <section className="space-y-12">
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 text-center">
                  How It Works
                </h2>
                <ol className="grid md:grid-cols-3 gap-8">
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
                  ].map((s, index) => (
                    <li
                      key={s.step}
                      className="group relative bg-secondary border border-border rounded-xl p-6 flex flex-col gap-4 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-500 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer transform"
                      style={{
                        animationDelay: `${index * 150}ms`,
                      }}
                    >
                      {/* Step number with enhanced styling */}
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-500 text-black font-bold text-xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-400/30 transition-all duration-300">
                          {s.step}
                          {/* Pulse effect */}
                          <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-500"></div>
                        </div>
                        <h3 className="text-green-600 dark:text-green-300 font-bold text-xl group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
                          {s.title}
                        </h3>
                      </div>

                      <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground transition-colors pl-16">
                        {s.text}
                      </p>

                      {/* Progress indicator */}
                      <div className="absolute top-6 left-6">
                        <div className="w-12 h-12 rounded-full border-2 border-green-200 dark:border-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Decorative arrow for next step */}
                      {s.step < 3 && (
                        <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-green-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Success checkmark */}
                      <div className="absolute top-4 right-4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      {/* Bottom progress bar */}
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-b-xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                        style={{ width: `${(s.step / 3) * 100}%` }}
                      ></div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Explore Bots Section */}
              <section id="bot-types" className="space-y-12">
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 text-center">
                  Explore Different Bot Personalities
                </h2>
                <p className="text-xl text-foreground text-center max-w-3xl mx-auto">
                  Choose from our collection of specialized AI personalities,
                  each designed for different types of conversations and tasks.
                </p>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {[
                    {
                      type: "assistant",
                      name: "AI Assistant",
                      image: "/images/assistant-bot.png",
                      description:
                        "A helpful AI assistant for general tasks and questions",
                      avatar: "🤖",
                      color: "blue",
                    },
                    {
                      type: "friend",
                      name: "AI Friend",
                      image: "/images/friend-bot.png",
                      description:
                        "A friendly AI companion for casual conversations",
                      avatar: "😊",
                      color: "pink",
                    },
                    {
                      type: "teacher",
                      name: "AI Teacher",
                      image: "/images/teacher-bot.png",
                      description: "An educational AI that helps with learning",
                      avatar: "📚",
                      color: "purple",
                    },
                    {
                      type: "expert",
                      name: "AI Expert",
                      image: "/images/expert-bot.png",
                      description:
                        "A specialized AI for technical and detailed discussions",
                      avatar: "🔬",
                      color: "emerald",
                    },
                    {
                      type: "artist",
                      name: "AI Artist",
                      image: "/images/artist-bot.png",
                      description:
                        "An AI focused on creative and artistic conversations",
                      avatar: "🎨",
                      color: "orange",
                    },
                  ].map((bot, index) => (
                    <div
                      key={bot.type}
                      className="group relative bg-secondary border border-border rounded-xl p-6 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-500 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer transform"
                      style={{
                        animationDelay: `${index * 150}ms`,
                      }}
                    >
                      {/* Bot avatar with glow effect */}
                      <div className="relative mb-4">
                        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-400/30 transition-all duration-300 overflow-hidden border-2 border-border group-hover:border-green-400">
                          <Image
                            src={bot.image}
                            alt={`${bot.name} avatar`}
                            width={80}
                            height={80}
                            className="rounded-full object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                          />
                          {/* Pulse ring */}
                          <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500"></div>
                        </div>
                      </div>

                      {/* Bot info */}
                      <div className="text-center space-y-3">
                        <h3 className="text-xl font-bold text-green-600 dark:text-green-400 group-hover:text-green-500 dark:group-hover:text-green-300 transition-colors">
                          {bot.name}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors">
                          {bot.description}
                        </p>
                      </div>

                      {/* Chat now button */}
                      <div className="mt-6">
                        <button
                          onClick={() => handleChatNowClick(bot.type)}
                          className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-green-600"
                        >
                          Chat Now
                        </button>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 w-3 h-3 bg-green-500/20 rounded-full group-hover:bg-green-500/40 group-hover:scale-150 transition-all duration-300"></div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      {/* Bottom accent line */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-3/4 transition-all duration-300 rounded-t-full"></div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Testimonials */}
              <section id="testimonials" className="space-y-8">
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 text-center">
                  What Early Users Say
                </h2>
                <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {[
                    {
                      name: "Alex",
                      text: "Feels like chatting with a real collaborator – boosts my brainstorming.",
                      image: "/alex.jpg",
                      role: "Product Designer",
                      rating: 5,
                    },
                    {
                      name: "Priya",
                      text: "I love switching personas to get different angles on the same problem.",
                      image: "/priya.jpg",
                      role: "Software Engineer",
                      rating: 5,
                    },
                    {
                      name: "Daniel",
                      text: "Fast, clean, and remembers context better than most chat apps I've tried.",
                      image: "/daniel.jpg",
                      role: "Data Scientist",
                      rating: 5,
                    },
                  ].map((t, index) => (
                    <div
                      key={t.name}
                      className="group relative bg-secondary border border-border rounded-xl p-6 hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10 hover:border-green-500 dark:hover:border-green-400 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer transform"
                      style={{
                        animationDelay: `${index * 150}ms`,
                      }}
                    >
                      {/* Quote icon */}
                      <div className="absolute top-4 right-4 text-green-500/20 dark:text-green-400/20 group-hover:text-green-500/40 dark:group-hover:text-green-400/40 transition-colors">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                        </svg>
                      </div>

                      {/* Main content - horizontal layout */}
                      <div className="flex gap-6 items-start">
                        {/* Large profile picture on the left */}
                        <div className="relative flex-shrink-0">
                          <Image
                            src={t.image}
                            alt={`${t.name} profile picture`}
                            width={80}
                            height={80}
                            style={{ width: "80px", height: "80px" }}
                            className="rounded-full object-cover ring-4 ring-green-500/20 group-hover:ring-6 group-hover:ring-green-500/40 dark:group-hover:ring-green-400/40 transition-all duration-300 group-hover:scale-110"
                          />
                          {/* Online indicator */}
                          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-3 border-white dark:border-gray-800 group-hover:scale-125 transition-transform duration-200"></div>
                        </div>

                        {/* Content on the right */}
                        <div className="flex-1 space-y-4">
                          {/* Star rating */}
                          <div className="flex items-center gap-1">
                            {[...Array(t.rating)].map((_, i) => (
                              <svg
                                key={i}
                                className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-200"
                                style={{ animationDelay: `${i * 100}ms` }}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>

                          {/* Name - large and bold */}
                          <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 group-hover:text-green-500 dark:group-hover:text-green-300 transition-colors">
                              {t.name}
                            </h3>
                            <p className="text-muted-foreground text-sm font-medium group-hover:text-foreground transition-colors">
                              {t.role}
                            </p>
                          </div>

                          {/* Testimonial text */}
                          <div className="relative">
                            <p className="text-muted-foreground text-base leading-relaxed italic group-hover:text-foreground transition-colors duration-200">
                              "{t.text}"
                            </p>
                          </div>

                          {/* Verified badge */}
                          <div className="flex items-center gap-2 text-green-500">
                            <svg
                              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm font-medium">
                              Verified User
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </section>

              <Footer />
            </div>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-gray-100 dark:bg-black border border-gray-700 p-8 rounded-lg max-w-md w-full mx-4">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
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

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-400 hover:underline text-sm"
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
