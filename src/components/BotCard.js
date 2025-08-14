"use client";

import Link from "next/link";
import Image from "next/image";

export default function BotCard({ bot }) {
  return (
    <Link
      href={`/chat/${bot.id}`}
      className="block bg-gray-800 border border-gray-700 rounded-lg p-3 sm:p-4 hover:border-green-400 transition-colors"
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
          {bot.imageUrl ? (
            <Image
              src={bot.imageUrl}
              alt={bot.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-lg sm:text-2xl">
              {bot.name?.charAt(0) || "?"}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-green-400 truncate">
            {bot.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {bot.type || "Custom Bot"}
          </p>
        </div>
      </div>
    </Link>
  );
}
