"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

export default function Navbar({ user, onLogout, onLogin, profile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Explore", link: "/#bot-types" },
    { name: "Contact", link: "/contact" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href === "/dashboard") return pathname.startsWith("/dashboard");
    if (href === "/contact") return pathname === "/contact";
    if (href === "/about") return pathname === "/about";
    if (href.startsWith("/#")) return pathname === "/"; // section anchors
    return pathname === href;
  };

  // Logo component
  const Logo = ({ visible }) => (
    <Link
      href="/"
      className="flex items-center text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-all duration-300 ease-in-out hover:scale-105"
      onClick={closeMenu}
      style={{
        gap: "16px",
      }}
    >
      <div className="relative overflow-hidden rounded-full ring-2 ring-green-500/20 hover:ring-green-500/40 transition-all duration-300">
        <Image
          src="/BotNexus.png"
          alt="BotNexus"
          width={60}
          height={60}
          className="object-cover rounded-full animate-rotate-continuous hover:animate-spin-slow transition-all duration-300"
        />
      </div>
      <span className="font-poppins bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent animate-fade-in font-bold tracking-tight whitespace-nowrap text-3xl leading-12">
        BotNexus
      </span>
    </Link>
  );

  // Auth buttons component
  const AuthButtons = ({ visible }) => (
    <div 
      className="flex items-center"
      style={{
        gap: "24px",
      }}
    >
      <ThemeToggle />
      {user ? (
        <>
          <NavbarButton
            href="/dashboard"
            variant="gradient"
            className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold transition-all whitespace-nowrap px-8 py-3 text-base"
          >
            My Account
          </NavbarButton>
          {onLogout && (
            <NavbarButton
              as="button"
              onClick={() => {
                onLogout();
                closeMenu();
              }}
              variant="secondary"
              className="border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-400 dark:hover:text-black font-medium transition-all whitespace-nowrap px-8 py-3 text-base"
            >
              Logout
            </NavbarButton>
          )}
        </>
      ) : (
        <NavbarButton
          as="button"
          onClick={() => {
            onLogin();
            closeMenu();
          }}
          variant="gradient"
          className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold transition-all whitespace-nowrap px-8 py-3 text-base"
        >
          Sign In
        </NavbarButton>
      )}
    </div>
  );

  return (
    <ResizableNavbar className="z-50">
      {/* Desktop Navigation */}
      <NavBody>
        <Logo />
        <NavItems items={navLinks} onItemClick={closeMenu} />
        <AuthButtons />
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Logo visible={false} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileNavToggle
              isOpen={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={menuOpen} onClose={closeMenu}>
          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-4 w-full">
            {navLinks.map((link) => {
              const active = isActive(link.link);
              return (
                <Link
                  key={link.name}
                  href={link.link}
                  className={`block px-4 py-3 rounded-lg transition-colors text-base font-medium ${
                    active
                      ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 font-semibold"
                      : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                  }`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col space-y-3 w-full pt-4 border-t border-gray-200 dark:border-gray-700">
            {!user && (
              <button
                onClick={() => {
                  onLogin();
                  closeMenu();
                }}
                className="w-full text-center px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold hover:from-green-700 hover:to-green-600 transition-colors"
              >
                Sign In
              </button>
            )}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="w-full text-center block px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold hover:from-green-700 hover:to-green-600 transition-colors"
                  onClick={closeMenu}
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    closeMenu();
                  }}
                  className="w-full text-center px-6 py-3 rounded-lg border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white dark:hover:bg-green-400 dark:hover:text-black transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
