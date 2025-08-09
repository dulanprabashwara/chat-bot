"use client";

import Link from "next/link";
import Image from "next/image";

export default function BotCard({ bot }) {
  return (
    <Link
      href={`/chat/${bot.id}`}
      className="block bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-green-400 transition-colors"
    >
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          {bot.imageUrl ? (
            <Image
              src={bot.imageUrl}
              alt={bot.name}
              width={64}
              height={64}
              className="object-cover w-16 h-16"
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl">
              {bot.name?.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-green-400">{bot.name}</h2>
          <p className="text-sm text-gray-400">{bot.type || "Custom Bot"}</p>
        </div>
      </div>
    </Link>
  );
}
