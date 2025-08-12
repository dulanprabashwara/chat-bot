"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, deleteUser, updateProfile } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import {
  getUserProfile,
  getUserBots,
  deleteBot,
  deleteUserProfile,
  setUserProfile,
  ensureUserProfile,
} from "@/lib/firestore";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyIds, setBusyIds] = useState({});
  const [globalBusy, setGlobalBusy] = useState(false);
  const [error, setError] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }
      try {
        // Ensure profile exists (handles fresh accounts if rules require owner doc first)
        const ensured = await ensureUserProfile(u);
        const b = await getUserBots(u.uid);
        setProfile(ensured);
        setNewDisplayName(ensured?.displayName || "");
        setBots(b);
      } catch (e) {
        console.error("Dashboard load error", e);
        if (e.message?.includes("Permission denied")) {
          setError(
            "Permission denied loading profile. Deploy Firestore rules (firebase deploy --only firestore:rules) or re-authenticate."
          );
        } else {
          setError(e.message || "Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const refreshBots = async () => {
    if (!user) return;
    const list = await getUserBots(user.uid);
    setBots(list);
  };

  const handleDeleteBot = async (id, name) => {
    if (!user) return;
    if (!confirm(`Delete bot "${name}"? This cannot be undone.`)) return;
    setBusyIds((s) => ({ ...s, [id]: true }));
    try {
      await deleteBot(user.uid, id);
      await refreshBots();
    } catch (e) {
      console.error(e);
      alert("Failed to delete bot");
    } finally {
      setBusyIds((s) => ({ ...s, [id]: false }));
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (
      !confirm(
        "This will delete your profile and all chatbots/messages. Continue?"
      )
    )
      return;
    setGlobalBusy(true);
    try {
      await deleteUserProfile(user.uid);
      // Also remove auth user (must be recent login for some providers)
      await deleteUser(user);
      alert("Account deleted");
    } catch (e) {
      console.error(e);
      alert(
        e?.code === "auth/requires-recent-login"
          ? "Please re-login then try again."
          : "Failed to delete account"
      );
    } finally {
      setGlobalBusy(false);
    }
  };

  const handleSaveDisplayName = async () => {
    if (!user) return;
    const trimmed = newDisplayName.trim();
    if (trimmed.length < 2) {
      alert("Display name must be at least 2 characters.");
      return;
    }
    setSavingName(true);
    try {
      await updateProfile(user, { displayName: trimmed });
      await setUserProfile(user.uid, { displayName: trimmed });
      setProfile((p) => ({ ...(p || {}), displayName: trimmed }));
      setEditingName(false);
    } catch (e) {
      console.error(e);
      alert("Failed to update display name");
    } finally {
      setSavingName(false);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
        <Navbar />
        <p>You need to login to view your dashboard.</p>
        <Link
          href="/"
          className="text-green-400 underline hover:text-green-300"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8 space-y-10">
        <section className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-8 shadow-2xl transition-colors">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white dark:text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            Profile Information
          </h2>

          <div className="flex flex-col items-center space-y-8">
            {/* Profile Picture Section - Centered */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-700 group-hover:border-green-600 dark:group-hover:border-green-400 transition-all duration-300">
                  <Image
                    src="/profile.png"
                    alt="Profile Picture"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* User Information Form - Below Profile Picture */}
            <div className="w-full max-w-2xl space-y-6">
              <div className="grid gap-6">
                {/* Display Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Name
                  </label>
                  <div className="relative">
                    {editingName ? (
                      <div className="flex gap-2">
                        <input
                          className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:border-green-600 dark:focus:border-green-400 focus:ring-2 focus:ring-green-600/20 dark:focus:ring-green-400/20 focus:outline-none transition-all duration-200"
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          maxLength={40}
                          disabled={savingName}
                          placeholder="Enter your display name"
                        />
                        <button
                          onClick={handleSaveDisplayName}
                          disabled={savingName}
                          className="px-4 py-3 bg-green-600 dark:bg-green-400 text-white dark:text-black rounded-lg font-medium hover:bg-green-500 dark:hover:bg-green-300 disabled:opacity-50 transition-colors"
                        >
                          {savingName ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                              Saving
                            </div>
                          ) : (
                            "Save"
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingName(false);
                            setNewDisplayName(profile?.displayName || "");
                          }}
                          disabled={savingName}
                          className="px-4 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3">
                        <span className="text-gray-900 dark:text-white">
                          {profile?.displayName || "Not set"}
                        </span>
                        <button
                          onClick={() => setEditingName(true)}
                          className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-700 dark:text-gray-300">
                    {user.email}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Email cannot be changed from here
                  </p>
                </div>

                {/* Bot Count */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Bots Created
                  </label>
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white dark:text-black"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {bots.length}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Active Bots
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/create-bot"
                      className="px-4 py-2 bg-green-600 dark:bg-green-400 text-white dark:text-black rounded-lg font-medium hover:bg-green-500 dark:hover:bg-green-300 transition-colors"
                    >
                      Create New
                    </Link>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="pt-6 border-t border-gray-300 dark:border-gray-700 text-center">
                <h3 className="text-lg font-semibold text-red-500 dark:text-red-400 mb-4">
                  Danger Zone
                </h3>
                <button
                  onClick={handleDeleteAccount}
                  disabled={globalBusy}
                  className="px-6 py-3 bg-red-500/10 border border-red-500 text-red-400 rounded-lg font-medium hover:bg-red-500 hover:text-white disabled:opacity-50 transition-all duration-200 inline-flex items-center gap-2"
                >
                  {globalBusy ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      Deleting Account...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete Account
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  This action cannot be undone. All your bots and data will be
                  permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 transition-colors">
          <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-6">
            Your Bots
          </h2>
          {bots.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No bots yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bots.map((b) => {
                // Map bot types to their corresponding images
                const getBotImage = (type) => {
                  const typeMap = {
                    Assistant: "/images/assistant-bot.png",
                    Teacher: "/images/teacher-bot.png",
                    Friend: "/images/friend-bot.png",
                    Expert: "/images/expert-bot.png",
                    Artist: "/images/artist-bot.png",
                  };
                  return typeMap[type] || "/images/assistant-bot.png"; // Default to assistant
                };

                return (
                  <div
                    key={b.id}
                    className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:border-green-600 dark:hover:border-green-400 transition-colors"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-400 dark:border-gray-600">
                        <Image
                          src={getBotImage(b.type)}
                          alt={`${b.name} bot`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-700 dark:text-green-300 text-lg">
                          {b.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {b.type || "Custom"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/chat/${b.id}`}
                        className="flex-1 text-center px-3 py-2 border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 rounded hover:bg-green-600 dark:hover:bg-green-400 hover:text-white dark:hover:text-black transition-colors"
                      >
                        Chat
                      </Link>
                      <button
                        onClick={() => handleDeleteBot(b.id, b.name)}
                        disabled={busyIds[b.id]}
                        className="px-3 py-2 border border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 rounded hover:bg-red-500 dark:hover:bg-red-400 hover:text-white dark:hover:text-black disabled:opacity-50 transition-colors"
                      >
                        {busyIds[b.id] ? "Deleting" : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Create Bot Button Section */}
        <section className="text-center">
          <Link
            href="/create-bot"
            className="inline-flex items-center gap-2 bg-green-600 dark:bg-green-400 text-white dark:text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-500 dark:hover:bg-green-300 transition-colors shadow-lg hover:shadow-xl"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create New Bot
          </Link>
        </section>

        {error && <div className="text-red-400 text-sm">{error}</div>}
      </main>
    </div>
  );
}
