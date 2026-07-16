"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettings } from "../store/settings";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import resetToken from "../tools/resetToken";
import getNewToken from "../tools/getNewToken";

function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => alert("Text copied to clipboard!"))
    .catch((err) => console.error("Failed to copy text: ", err));
}

const Navbar = () => {
  const [isSettingsVisible, setIsSettingsVisble] = useState(false);
  const { amount, setAmount, disableToken, setDisableToken, token } =
    useSettings();

  const pathname = usePathname();

  return (
    <>
      <AnimatePresence>
        {isSettingsVisible && (
          <motion.form
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.1 }}
            className="
              fixed grid grid-rows-[25%_60%_15%] text-center w-[50vw] h-[50vh]
              left-1/2 -translate-x-1/2 z-100 top-1/2 -translate-y-1/2 border-4 border-color5 text-black rounded-xl bg-color3
              "
          >
            <section className="relative flex items-center justify-center">
              <h1 className="text-lg font-bold">Settings</h1>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsSettingsVisble(false);
                }}
                className="absolute right-1 top-5 -translate-y-1/2 -translate-x-1/2 text-4xl font-black hover:scale-125 focus:outline-3 outline-color5"
              >
                ×
              </button>
            </section>

            <section
              className="
              grid grid-cols-2 gap-y-8 mb-auto divide-x divide-black
              [&>div]:flex [&>div]:justify-start [&>div]:items-center [&>div]:w-full [&>div]:gap-3 [&>div]:px-[10%]
              [&>div>label]:before:content-['>'] [&>div>label]:before:mx-4 [&_input]:outline-color5"
            >
              <div className="[&>button]:underline [&>button]:font-semibold">
                <label htmlFor="token">User Token</label>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(token);
                  }}
                >
                  copy
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    resetToken(token);
                  }}
                >
                  reset
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    getNewToken();
                  }}
                >
                  new
                </button>
              </div>
              <div>
                <label htmlFor="disableToken">Disable Token</label>
                <input
                  id="disableToken"
                  type="checkbox"
                  checked={disableToken}
                  onChange={(e) => {
                    setDisableToken(e.target.checked);
                  }}
                  className="h-5 aspect-square focus:outline-3"
                />
              </div>
              <div>
                <label htmlFor="amount">Questions per Quiz</label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  max="50"
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                  }}
                  className="w-12 border-2 text-center rounded-md focus:outline-2"
                />
              </div>
            </section>

            <section
              className="
                flex items-center justify-center gap-8 
                *:tracking-wide *:px-4 *:py-0.5 *:rounded-sm *:bg-color2 *:text-color5 *:font-semibold *:border-3 *:focus:outline-2 *:outline-color5
              "
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.setItem("amount", String(amount));
                  localStorage.setItem("disableToken", String(disableToken));
                  window.alert("your settings were saved succesfully");
                }}
              >
                Save
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setAmount(10);
                  setDisableToken(false);
                }}
              >
                Reset to Default
              </button>
            </section>
          </motion.form>
        )}
      </AnimatePresence>

      <nav
        className="
          flex items-center justify-center gap-16
          text-sm font-medium underline underline-offset-8 tracking-wider text-color3
          *:px-4 *:py-0.75 *:hover:scale-120 *:focus:outline-2 *:outline-color3"
      >
        <Link className={`${pathname === "/" ? "scale-120" : ""}`} href="/">
          Home
        </Link>
        <Link
          className={`${pathname === "/about" ? "scale-120" : ""}`}
          href="/about"
        >
          About
        </Link>
        <button
          className={`${isSettingsVisible ? "scale-120" : ""}`}
          onClick={() => setIsSettingsVisble((prev) => !prev)}
        >
          Settings
        </button>
      </nav>
    </>
  );
};

export default Navbar;
