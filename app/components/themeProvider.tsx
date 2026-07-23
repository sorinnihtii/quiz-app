"use client";

import { useEffect, useState } from "react";
import { useSettings } from "../storage/settings";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useSettings((s) => s.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-rows-[15%_85%] h-dvh w-dvw overflow-hidden gradient-1">
        {children}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-rows-[15%_85%] h-dvh w-dvw overflow-hidden ${
        theme === "light" ? "gradient-1" : "gradient-2"
      }`}
    >
      {children}
    </div>
  );
}
