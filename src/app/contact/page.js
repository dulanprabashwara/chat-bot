"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { saveContactMessage } from "@/lib/firestore";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text }
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      setLoading(true);
      await saveContactMessage({ name, email, message });
      setStatus({ type: "success", text: "Message sent! We'll be in touch." });
      setShowToast(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Failed to send" });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors">
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

      <div className="container mx-auto px-4 py-16 max-w-3xl space-y-12">
        <header className="space-y-4">
          <h1 className="text-5xl font-bold text-green-600 dark:text-green-400">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Have a question, suggestion, or just want to say hello? Send us a
            message below.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg p-8"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-800 dark:text-white focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-gray-800 dark:text-white focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 text-gray-800 dark:text-white focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors resize-none"
              placeholder="What's on your mind?"
            />
          </div>
          {status && status.type === "error" && (
            <div className="text-sm text-red-500 dark:text-red-400">
              {status.text}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-green-600 dark:bg-green-400 text-white dark:text-black font-semibold px-8 py-3 rounded-md hover:bg-green-500 dark:hover:bg-green-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-green-600 dark:text-green-300">
            Other Ways
          </h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              Email:{" "}
              <a
                href="mailto:hello@example.com"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                hello@example.com
              </a>
            </li>
            <li>Instagram: @yourhandle</li>
            <li>GitHub: github.com/yourrepo</li>
            <li>LinkedIn: linkedin.com/in/yourprofile</li>
          </ul>
        </section>
      </div>
      {showToast && status && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-5 py-3 rounded-md shadow-lg text-sm font-medium flex items-center gap-3 border transition-colors backdrop-blur bg-white/90 dark:bg-gray-800/90 ${
              status.type === "success"
                ? "text-green-700 dark:text-green-300 border-green-300 dark:border-green-500"
                : "text-red-700 dark:text-red-300 border-red-300 dark:border-red-500"
            }`}
          >
            <span>{status.text}</span>
            <button
              onClick={() => setShowToast(false)}
              aria-label="Dismiss notification"
              className="text-current/70 hover:text-current transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
