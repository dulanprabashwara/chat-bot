import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export async function createBot(userId, botData) {
  try {
    const botsRef = collection(db, `users/${userId}/chatbots`);
    const docRef = await addDoc(botsRef, {
      ...botData,
      createdAt: new Date(),
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
      timestamp: new Date(),
    });
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error("Error adding message:", error);
    throw new Error("Failed to add message");
  }
}
