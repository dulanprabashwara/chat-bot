"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Sun className="h-5 w-5 text-yellow-500" />
        <div className="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700" />
        <Moon className="h-5 w-5 text-blue-400" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Sun
        className={`h-5 w-5 transition-all duration-300 transform ${
          !isDark
            ? "text-yellow-500 scale-110 rotate-0"
            : "text-gray-400 scale-90 rotate-90"
        }`}
      />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
        className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      />
      <Moon
        className={`h-5 w-5 transition-all duration-300 transform ${
          isDark
            ? "text-blue-400 scale-110 rotate-0"
            : "text-gray-400 scale-90 -rotate-90"
        }`}
      />
    </div>
  );
}
