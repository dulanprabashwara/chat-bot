"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar({ user, onLogout, onLogin, profile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#features" },
    { label: "Chat", href: user ? "/dashboard" : "/#bot-types" },
    { label: "Contact", href: "/#contact" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href === "/dashboard") return pathname.startsWith("/dashboard");
    if (href.startsWith("/#")) return pathname === "/"; // section anchors
    return pathname === href;
  };

  // Only show theme toggle on homepage
  const isHomepage = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 text-3xl lg:text-4xl font-bold tracking-tight text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-all duration-300 ease-in-out hover:scale-105"
            onClick={closeMenu}
          >
            <div className="relative overflow-hidden rounded-full ring-2 ring-green-500/20 hover:ring-green-500/40 transition-all duration-300">
              <Image
                src="/BotNexus.png"
                alt="BotNexus"
                width={48}
                height={48}
                className="object-cover rounded-full animate-rotate-continuous hover:animate-spin-slow transition-all duration-300"
              />
            </div>
            <span className="font-poppins bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent animate-fade-in">
              BotNexus
            </span>
          </Link>
          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6 text-base lg:text-lg font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative transition-colors ${
                      active
                        ? "text-green-600 dark:text-green-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-green-600 dark:bg-green-400 rounded" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Theme Toggle (only on homepage) + Auth / User */}
        <div className="flex items-center gap-4">
          {isHomepage && (
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          )}
          {user ? (
            <>
              <span className="hidden sm:inline text-gray-600 dark:text-gray-300 text-base lg:text-lg font-poppins">
                {profile?.displayName || user.email}
              </span>
              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    closeMenu();
                  }}
                  className="text-base lg:text-lg bg-transparent border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 px-5 py-2.5 rounded-md hover:bg-green-600 hover:text-white dark:hover:bg-green-400 dark:hover:text-black transition-colors font-poppins font-medium"
                >
                  Logout
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                onLogin();
                closeMenu();
              }}
              className="text-base lg:text-lg bg-green-600 dark:bg-green-400 text-white dark:text-black font-semibold px-6 py-2.5 rounded-md hover:bg-green-500 dark:hover:bg-green-300 transition-colors font-poppins"
            >
              Sign In
            </button>
          )}
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden inline-flex flex-col justify-center items-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-600 dark:hover:border-green-400 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`h-0.5 w-5 bg-current transition-transform duration-300 ${
                menuOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-current my-1 transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-current transition-transform duration-300 ${
                menuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>
      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur transition-colors">
          <ul className="flex flex-col px-4 py-4 space-y-2 text-base font-poppins">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`block px-2 py-2 rounded-md transition-colors ${
                      active
                        ? "text-green-600 dark:text-green-400 bg-gray-100 dark:bg-gray-800/80 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800/80"
                    }`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {isHomepage && (
              <li className="px-2 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-base font-poppins">
                    Theme
                  </span>
                  <ThemeToggle />
                </div>
              </li>
            )}
            {!user && (
              <li>
                <button
                  onClick={() => {
                    onLogin();
                    closeMenu();
                  }}
                  className="w-full text-left px-3 py-3 rounded-md bg-green-600 dark:bg-green-400 text-white dark:text-black font-semibold hover:bg-green-500 dark:hover:bg-green-300 transition-colors text-base font-poppins"
                >
                  Sign In
                </button>
              </li>
            )}
            {user && (
              <li>
                <button
                  onClick={() => {
                    onLogout();
                    closeMenu();
                  }}
                  className="w-full text-left px-3 py-3 rounded-md border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-400 dark:hover:text-black transition-colors text-base font-poppins font-medium"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
