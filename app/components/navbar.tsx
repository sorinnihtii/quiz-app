"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "../store/settings";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import resetToken from "../tools/resetToken";
import getToken from "../tools/getToken";
import { FiAlertCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => alert("Text copied to clipboard!"))
    .catch((err) => console.error("Failed to copy text: ", err));
}

const Navbar = () => {
  const [isSettingsVisible, setIsSettingsVisble] = useState(false);

  const amount = useSettings((s) => s.amount);
  const setAmount = useSettings((s) => s.setAmount);
  const disableToken = useSettings((s) => s.disableToken);
  const setDisableToken = useSettings((s) => s.setDisableToken);
  const token = useSettings((s) => s.token);
  const setToken = useSettings((s) => s.setToken);
  const initToken = useSettings((s) => s.initToken);

  useEffect(() => {
    initToken();
  }, [initToken]);

  const pathname = usePathname();

  async function getNewToken() {
    localStorage.removeItem("token");
    const newToken = await getToken();
    if (!newToken) return;
    window.alert("You succesffully received a new token");
    setToken(newToken);
  }

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
              left-1/2 -translate-x-1/2 z-100 top-1/2 -translate-y-1/2 border-4 border-color5 text-color5 rounded-xl bg-color3
              "
          >
            <section className="relative flex items-center justify-center">
              <h1 className="text-xl font-bold">SETTINGS</h1>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsSettingsVisble(false);
                }}
                className="absolute right-0 top-7 -translate-y-1/2 -translate-x-1/2 text-3xl hover:scale-125 focus:outline-3 outline-color5"
              >
                <RxCross2 />
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
                <div className="group relative">
                  <FiAlertCircle className="text-amber-500" />
                  <span
                    className="
                      absolute w-60 px-2 py-1 left-1/2 -translate-x-1/2 bottom-[140%] group-hover:bottom-[150%] rounded-md border-2 border-amber-500 text-xs bg-color3 text-color5 font-semibold 
                      transition-all duration-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                  >
                    Avoid creating new tokens unless necessary. In most cases
                    resetting your current token is enough
                  </span>
                  <span
                    className="
                      absolute triangle rotate-180 left-1/2 -translate-x-1/2 w-3 h-2 bottom-full group-hover:bottom-[110%] bg-amber-500
                      transition-all duration-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                  ></span>
                </div>
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
                  className="h-4 aspect-square focus:outline-3"
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
