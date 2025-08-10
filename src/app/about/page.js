"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors">
      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-12">
        <header className="space-y-4">
          <h1 className="text-5xl font-bold text-green-400">About</h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            We built this AI chat platform to make personalized, context-aware
            conversations simple, fast, and secure.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300">Our Story</h2>
          <p className="leading-relaxed text-gray-400">
            The project started as a lightweight experiment to let users create
            focused AI personas for brainstorming, learning, and support. It
            grew into a flexible platform for managing multiple bot characters
            with persistent memory.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300">Mission</h2>
          <p className="leading-relaxed text-gray-400">
            Our mission is to reduce friction between ideas and execution by
            giving everyone an always-available thinking partner that adapts to
            their needs.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-300">Tech Stack</h2>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3">
              Next.js (App Router)
            </li>
            <li className="bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3">
              Firebase Auth & Firestore
            </li>
            <li className="bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3">
              Serverless API Routes
            </li>
            <li className="bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3">
              Tailwind CSS UI
            </li>
            <li className="bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3">
              OpenRouter AI Models
            </li>
            <li className="bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3">
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
                className="bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col gap-2"
              >
                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                  IMG
                </div>
                <h3 className="text-green-300 font-semibold">{m.name}</h3>
                <p className="text-sm text-gray-400">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
