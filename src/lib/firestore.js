import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function createBot(userId, botData) {
  try {
    const botsRef = collection(db, `users/${userId}/chatbots`);
    const docRef = await addDoc(botsRef, {
      ...botData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...botData };
  } catch (error) {
    console.error("Error creating bot:", error);
    throw new Error("Failed to create bot");
  }
}

export async function getUserBots(userId) {
  try {
    const botsRef = collection(db, `users/${userId}/chatbots`);
    const q = query(botsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching bots:", error);
    throw new Error("Failed to fetch bots");
  }
}

export async function getBot(userId, botId) {
  try {
    const botRef = doc(db, `users/${userId}/chatbots/${botId}`);
    const botDoc = await getDoc(botRef);
    if (!botDoc.exists()) {
      throw new Error("Bot not found");
    }
    return { id: botDoc.id, ...botDoc.data() };
  } catch (error) {
    console.error("Error fetching bot:", error);
    throw new Error("Failed to fetch bot");
  }
}

export async function getBotMessages(userId, botId) {
  try {
    const messagesRef = collection(
      db,
      `users/${userId}/chatbots/${botId}/messages`
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages");
  }
}

export async function addMessage(userId, botId, messageData) {
  try {
    const messagesRef = collection(
      db,
      `users/${userId}/chatbots/${botId}/messages`
    );
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      timestamp: serverTimestamp(),
    });
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error("Error adding message:", error);
    throw new Error("Failed to add message");
  }
}

// ----- User Profile Helpers -----
export async function setUserProfile(userId, profile) {
  try {
    const userDoc = doc(db, `users/${userId}`);
    await setDoc(
      userDoc,
      {
        displayName: profile.displayName || null,
        updatedAt: new Date(),
        updatedAt: serverTimestamp(),
        // Preserve existing createdAt if document exists
        createdAt: profile.createdAt || serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error setting user profile:", error);
    throw new Error("Failed to set user profile");
  }
}

export async function getUserProfile(userId) {
  try {
    const userDoc = await getDoc(doc(db, `users/${userId}`));
    if (!userDoc.exists()) return null;
    return userDoc.data();
  } catch (error) {
    console.error("Error getting user profile:", {
      code: error?.code,
      message: error?.message,
    });
    throw new Error(
      error?.code === "permission-denied"
        ? "Permission denied (check Firestore rules deployment)."
        : "Failed to get user profile"
    );
  }
}

export async function ensureUserProfile(user) {
  if (!user) return null;
  try {
    const existing = await getUserProfile(user.uid);
    if (existing) return existing;
    // Create minimal profile
    await setUserProfile(user.uid, { displayName: user.displayName || null });
    return await getUserProfile(user.uid);
  } catch (e) {
    // Bubble up to caller; they can decide how to react
    throw e;
  }
}

// ----- Deletion Helpers -----
export async function deleteBot(userId, botId) {
  try {
    // Delete messages subcollection first
    const messagesRef = collection(
      db,
      `users/${userId}/chatbots/${botId}/messages`
    );
    const messagesSnap = await getDocs(messagesRef);
    const deletions = messagesSnap.docs.map((d) => deleteDoc(d.ref));
    if (deletions.length) await Promise.allSettled(deletions);

    // Delete bot document
    const botRef = doc(db, `users/${userId}/chatbots/${botId}`);
    await deleteDoc(botRef);
  } catch (error) {
    console.error("Error deleting bot:", error);
    throw new Error("Failed to delete bot");
  }
}

export async function deleteUserProfile(userId) {
  try {
    const errors = [];
    const botsRef = collection(db, `users/${userId}/chatbots`);
    const botsSnap = await getDocs(botsRef);
    for (const botDoc of botsSnap.docs) {
      try {
        await deleteBot(userId, botDoc.id);
      } catch (e) {
        errors.push({ botId: botDoc.id, code: e?.code, message: e?.message });
      }
    }
    try {
      const userDocRef = doc(db, `users/${userId}`);
      await deleteDoc(userDocRef);
    } catch (e) {
      errors.push({ stage: "userDoc", code: e?.code, message: e?.message });
    }
    if (errors.length) {
      console.error("Partial deletion errors", errors);
      throw new Error(
        "Failed to delete some data (" + errors.length + "). Check console."
      );
    }
  } catch (error) {
    console.error("Error deleting user profile:", {
      code: error?.code,
      message: error?.message,
    });
    throw new Error(
      error?.code === "permission-denied"
        ? "Permission denied deleting profile (rules?)."
        : error.message || "Failed to delete user profile"
    );
  }
}

// ----- Public Contact Messages -----
// Stores contact form submissions in a top-level collection 'contactMessages'
// Each doc: { name, email, message, createdAt }
export async function saveContactMessage({ name, email, message }) {
  try {
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      throw new Error("All fields are required");
    }
    const contactRef = collection(db, "contactMessages");
    const docRef = await addDoc(contactRef, {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw new Error("Failed to send message");
  }
}
