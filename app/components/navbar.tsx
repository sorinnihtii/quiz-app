"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SettingsWindow from "./settingsWindow";

const Navbar = () => {
  const [isSettingsVisible, setIsSettingsVisble] = useState(false);

  const pathname = usePathname();

  return (
    <>
      <SettingsWindow
        isSettingsVisible={isSettingsVisible}
        setIsSettingsVisble={setIsSettingsVisble}
      />
      <nav
        className="
          flex items-center justify-center gap-[5%]
          *:text-xs *:md:text-sm *:font-semibold *:tracking-wider
          *:px-4 *:py-0.75 *:hover:scale-120 *:focus:outline-3 *:outline-color4 *:underline *:underline-offset-8"
      >
        <Link
          className={`${pathname === "/" ? "text-color4 decoration-color4" : "text-color5 decoartion-color5"}`}
          href="/"
        >
          Home
        </Link>
        <Link
          className={`${pathname === "/about" ? "text-color4 decoration-color4" : "text-color5 decoartion-color5"}`}
          href="/about"
        >
          About
        </Link>
        <button
          className={`${isSettingsVisible ? "text-color4 decoration-color4" : "text-color5 decoartion-color5"}`}
          onClick={() => setIsSettingsVisble((prev) => !prev)}
        >
          Settings
        </button>
      </nav>
    </>
  );
};

export default Navbar;
