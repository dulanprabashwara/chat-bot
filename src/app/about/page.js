"use client";

import Link from "next/link";

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
        <header className="space-y-4">
          <h1 className="text-5xl font-bold text-green-400">About</h1>
          <p className="text-lg text-foreground leading-relaxed">
            We built this AI chat platform to make personalized, context-aware
            conversations simple, fast, and secure.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300">Our Story</h2>
          <p className="leading-relaxed text-muted-foreground">
            The project started as a lightweight experiment to let users create
            focused AI personas for brainstorming, learning, and support. It
            grew into a flexible platform for managing multiple bot characters
            with persistent memory.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300">Mission</h2>
          <p className="leading-relaxed text-muted-foreground">
            Our mission is to reduce friction between ideas and execution by
            giving everyone an always-available thinking partner that adapts to
            their needs.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300">Tech Stack</h2>
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
          <h2 className="text-2xl font-semibold text-green-300">Team</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[{ name: "Developer", role: "Creator & Engineer" }].map((m) => (
              <div
                key={m.name}
                className="bg-secondary border border-border rounded-lg p-6 flex flex-col gap-2"
              >
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  IMG
                </div>
                <h3 className="text-green-300 font-semibold">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
