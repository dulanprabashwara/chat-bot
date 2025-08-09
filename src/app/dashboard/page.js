"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, deleteUser, updateProfile } from "firebase/auth";
import Link from "next/link";
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-green-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center space-y-4">
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
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8 space-y-10">
        <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4">Profile</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-gray-400">Display Name:</span>
              {editingName ? (
                <>
                  <input
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs focus:border-green-400 focus:outline-none"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    maxLength={40}
                    disabled={savingName}
                  />
                  <button
                    onClick={handleSaveDisplayName}
                    disabled={savingName}
                    className="text-green-400 border border-green-500 px-2 py-1 rounded text-xs hover:bg-green-500 hover:text-black disabled:opacity-50"
                  >
                    {savingName ? "Saving" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingName(false);
                      setNewDisplayName(profile?.displayName || "");
                    }}
                    disabled={savingName}
                    className="text-gray-400 border border-gray-600 px-2 py-1 rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{profile?.displayName || "(not set)"}</span>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-xs text-green-400 hover:underline"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
            <div>
              <span className="text-gray-400">Email:</span> {user.email}
            </div>
            <div>
              <span className="text-gray-400">Bots:</span> {bots.length}
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleDeleteAccount}
              disabled={globalBusy}
              className="text-red-400 border border-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-black disabled:opacity-50 text-sm"
            >
              {globalBusy ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </section>

        <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-green-400">Your Bots</h2>
            <Link
              href="/create-bot"
              className="bg-green-400 text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-opacity-90"
            >
              + Create Bot
            </Link>
          </div>
          {bots.length === 0 ? (
            <p className="text-gray-400 text-sm">No bots yet.</p>
          ) : (
            <ul className="divide-y divide-gray-700 text-sm">
              {bots.map((b) => (
                <li
                  key={b.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-green-300">{b.name}</span>
                    <span className="text-gray-400 text-xs">
                      {b.type || "Custom"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/chat/${b.id}`}
                      className="px-3 py-1 border border-green-400 text-green-400 rounded hover:bg-green-400 hover:text-black transition-colors"
                    >
                      Chat
                    </Link>
                    <button
                      onClick={() => handleDeleteBot(b.id, b.name)}
                      disabled={busyIds[b.id]}
                      className="px-3 py-1 border border-red-400 text-red-400 rounded hover:bg-red-400 hover:text-black disabled:opacity-50 transition-colors"
                    >
                      {busyIds[b.id] ? "Deleting" : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {error && <div className="text-red-400 text-sm">{error}</div>}
      </main>
    </div>
  );
}
