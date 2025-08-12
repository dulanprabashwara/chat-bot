"use client";

import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="pt-16 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
      <div className="grid gap-10 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-green-600 dark:text-green-400 text-xl font-semibold">
            BotNexus
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-500 leading-relaxed">
            Context-aware AI conversations. Build, chat, iterate.
          </p>
        </div>
        <div className="space-y-4 text-sm">
          <h4 className="text-green-600 dark:text-green-300 font-medium">
            Company
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4 text-sm">
          <h4 className="text-green-600 dark:text-green-300 font-medium">
            Legal
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/privacy"
                className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4 text-sm">
          <h4 className="text-green-600 dark:text-green-300 font-medium">
            Follow
          </h4>
          <div className="flex gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 pb-0 mb-0 text-xs text-center text-gray-500 dark:text-gray-600">
        © {new Date().getFullYear()} BotNexus. All rights reserved.
      </div>
    </footer>
  );
}
