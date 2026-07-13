"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettings } from "../store/settings";

const Navbar = () => {
  const [isSettingsVisible, setIsSettingsVisble] = useState(false);
  const { amount, setAmount, disableToken, setDisableToken } = useSettings();

  function resetToDefault() {
    setAmount(10);
  }
  return (
    <>
      {isSettingsVisible && (
        <form className="fixed grid grid-rows-[25%_60%_15%] text-center w-[50vw] h-[50vh] left-1/2 -translate-x-1/2 z-100 top-1/2 -translate-y-1/2 bg-white border-4 rounded-xl">
          <section className="relative flex items-center justify-center">
            <h1 className="text-lg font-bold">Settings</h1>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsSettingsVisble(false);
              }}
              className="absolute right-1 top-5 -translate-y-1/2 -translate-x-1/2 text-4xl font-black hover:scale-125 focus:scale-125"
            >
              ×
            </button>
          </section>

          <section
            className="
              grid grid-cols-2 divide-x divide-black
              [&>div]:flex [&>div]:justify-start [&>div]:items-center [&>div]:w-full [&>div]:gap-3 [&>div]:px-[10%]
              [&>div]:mb-auto [&>div>label]:before:content-['>'] [&>div>label]:before:mx-4"
          >
            <div>
              <label htmlFor="amount">Questions per Quiz</label>
              <input
                id="amount"
                type="number"
                min="1"
                max="50"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-12 border-2 text-center rounded-md"
              />
            </div>
            <div>
              <label htmlFor="disableToken">Disable token</label>
              <input
                id="disableToken"
                type="checkbox"
                checked={disableToken}
                onChange={(e) => setDisableToken(e.target.checked)}
              />
            </div>
          </section>

          <section className="flex items-center justify-center gap-8 *:tracking-wide *:px-4 *:py-0.5 *:rounded-sm *:bg-black *:text-white">
            <button
              onClick={(e) => {
                e.preventDefault();
                resetToDefault();
              }}
            >
              Reset to Default
            </button>
          </section>
        </form>
      )}

      <nav className="flex items-center justify-center gap-16 text-white text-sm font-medium underline underline-offset-8 tracking-wider">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <button onClick={() => setIsSettingsVisble((prev) => !prev)}>
          Settings
        </button>
      </nav>
    </>
  );
};

export default Navbar;
