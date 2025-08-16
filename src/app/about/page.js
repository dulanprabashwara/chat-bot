"use client";

import Link from "next/link";
import Image from "next/image";

import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="transition-colors">
      {/* Back to Homepage Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors group"
        >
          <svg
            className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Homepage</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
        <header className="space-y-4 text-center">
          <h1 className="text-5xl font-bold text-green-400">
            🤖 Welcome to BotNexus
          </h1>
          <p className="text-lg text-foreground leading-relaxed">
            BotNexus is your gateway to personalized AI companions. Our platform
            lets you chat with advanced AI chatbots, each with unique
            personalities, designed to make conversations more engaging, fun,
            and helpful.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300 text-center">
            ✨ What Makes BotNexus Special
          </h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-green-400">Multiple Personalities</strong>{" "}
              – Choose from different chatbot personalities to match your mood
              and style.
            </p>
            <p>
              <strong className="text-green-400">Seamless Chat History</strong>{" "}
              – Continue where you left off; your conversations are securely
              saved.
            </p>
            <p>
              <strong className="text-green-400">Privacy First</strong> – You
              control your data. Delete chats anytime with one click.
            </p>
            <p>
              <strong className="text-green-400">Safe & Secure Login</strong> –
              Powered by Firebase Authentication, your account is protected at
              all times.
            </p>
            <p>
              <strong className="text-green-400">Smarter Conversations</strong>{" "}
              – Using OpenRouter AI models, BotNexus delivers realistic and
              intelligent interactions.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300 text-center">
            🚀 Our Mission
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            At BotNexus, our mission is to bridge the gap between humans and AI
            by creating a platform that feels personal, supportive, and fun.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300 text-center">
            💡 Our Vision
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            We see a future where AI companions are not just tools but true
            digital partners — ready to inspire, support, and connect with you
            whenever you need.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300 text-center">
            Tech Stack
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-foreground">
            <li className="bg-secondary border border-border rounded-md px-4 py-3 flex items-center gap-3">
              <span className="text-lg">⚛️</span>
              Next.js (App Router)
            </li>
            <li className="bg-secondary border border-border rounded-md px-4 py-3 flex items-center gap-3">
              <span className="text-lg">🔥</span>
              Firebase Auth & Firestore
            </li>
            <li className="bg-secondary border border-border rounded-md px-4 py-3 flex items-center gap-3">
              <span className="text-lg">🚀</span>
              Serverless API Routes
            </li>
            <li className="bg-secondary border border-border rounded-md px-4 py-3 flex items-center gap-3">
              <span className="text-lg">🎨</span>
              Tailwind CSS UI
            </li>
            <li className="bg-secondary border border-border rounded-md px-4 py-3 flex items-center gap-3">
              <span className="text-lg">🤖</span>
              OpenRouter AI Models
            </li>
            <li className="bg-secondary border border-border rounded-md px-4 py-3 flex items-center gap-3">
              <span className="text-lg">⚡</span>
              Edge-friendly Design
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <div className="flex justify-center">
            {[
              {
                name: "Dulan Prabashwara",
                role: "Creator & Engineer",
                university: "Currently studying at University of Moratuwa",
              },
            ].map((m) => (
              <div
                key={m.name}
                className="bg-secondary border border-border rounded-lg p-8 flex flex-col gap-4 max-w-sm"
              >
                <div className="h-28 w-28 rounded-full overflow-hidden mx-auto relative group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-green-400/50">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-400/30 transition-all duration-300 z-10"></div>
                  <Image
                    src="/developer.jpg"
                    alt="Dulan Prabashwara"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover object-center scale-110"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-green-300 font-semibold text-lg">
                    {m.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                  <p className="text-xs text-muted-foreground/80 italic">
                    {m.university}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
