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

  const handleThemeChange = (checked) => {
    console.log("Theme changing from", theme, "to", checked ? "dark" : "light");
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2">
      <Sun
        className={`h-5 w-5 transition-all duration-300 ${
          !isDark ? "text-yellow-500" : "text-gray-400"
        }`}
      />
      <Switch
        checked={isDark}
        onCheckedChange={handleThemeChange}
        aria-label="Toggle theme"
      />
      <Moon
        className={`h-5 w-5 transition-all duration-300 ${
          isDark ? "text-blue-400" : "text-gray-400"
        }`}
      />
    </div>
  );
}
