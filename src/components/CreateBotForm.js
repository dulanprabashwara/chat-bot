"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBot } from "@/lib/firestore";
import { botTypes } from "@/lib/botTypes";

export default function CreateBotForm({ user, preSelectedBotType }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data with pre-selected bot type if provided
  const getInitialFormData = () => {
    const defaultType =
      preSelectedBotType && botTypes[preSelectedBotType]
        ? preSelectedBotType
        : "assistant";
    return {
      name: "",
      type: defaultType,
      prompt: botTypes[defaultType].description,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);

  // Update form data when preSelectedBotType changes
  useEffect(() => {
    if (preSelectedBotType && botTypes[preSelectedBotType]) {
      setFormData((prev) => ({
        ...prev,
        type: preSelectedBotType,
        prompt: botTypes[preSelectedBotType].description,
      }));
    }
  }, [preSelectedBotType]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      type: newType,
      prompt: botTypes[newType].description,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Create bot with predefined image
      const botData = {
        name: formData.name,
        type: formData.type,
        prompt: formData.prompt,
        imageUrl: botTypes[formData.type].image,
        createdBy: user.uid,
      };

      const bot = await createBot(user.uid, botData);
      router.push(`/chat/${bot.id}`);
    } catch (error) {
      console.error("Error creating bot:", error);
      alert("Failed to create bot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bot Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-green-400 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bot Type
          {preSelectedBotType && (
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Pre-selected
            </span>
          )}
        </label>
        <select
          value={formData.type}
          onChange={handleTypeChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-green-400 focus:outline-none"
        >
          {Object.entries(botTypes).map(([type, data]) => (
            <option key={type} value={type}>
              {data.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-400">
          {botTypes[formData.type].description}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Behavior Prompt
        </label>
        <textarea
          value={formData.prompt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, prompt: e.target.value }))
          }
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-green-400 focus:outline-none min-h-[200px]"
          placeholder="Describe how your bot should behave and interact..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating Bot..." : "Create Bot"}
      </button>
    </form>
  );
}
