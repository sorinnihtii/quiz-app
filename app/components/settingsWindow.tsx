"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useSettings } from "../storage/settings";
import getToken from "../tools/getToken";

interface Props {
  isSettingsVisible: boolean;
  setIsSettingsVisble: (newValue: boolean) => void;
}

function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => alert("text copied to clipboard succesfully"))
    .catch((err) => console.error("Failed to copy text: ", err));
}

const SettingsWindow = ({ isSettingsVisible, setIsSettingsVisble }: Props) => {
  const questionAmount = useSettings((s) => s.questionAmount);
  const setQuestionAmount = useSettings((s) => s.setQuestionAmount);
  const disableSessionToken = useSettings((s) => s.disableSessionToken);
  const setDisableSessionToken = useSettings((s) => s.setDisableSessionToken);
  const sessionToken = useSettings((s) => s.sessionToken);
  const setSessionToken = useSettings((s) => s.setSessionToken);
  const initSessionToken = useSettings((s) => s.initSessionToken);

  useEffect(() => {
    initSessionToken();
  }, [initSessionToken]);

  const [localSettingsValues, setLocalSettingsValues] = useState({
    questionAmount: questionAmount.toString(),
    disableToken: disableSessionToken,
  });

  const firstInputRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSettingsVisible) firstInputRef.current?.focus();
  }, [isSettingsVisible]);

  async function getNewToken() {
    try {
      localStorage.removeItem("sessionToken");
      const newToken = await getToken();
      if (!newToken) return;
      window.alert("You succesffully received a new token");
      setSessionToken(newToken);
    } catch (err) {
      console.error(err);
    }
  }

  async function resetToken(token: string) {
    try {
      const res = await fetch(
        `https://opentdb.com/api_token.php?command=reset&token=${token}`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (err instanceof Error) {
        window.alert(`Failed to reset token. ${err.name}:${err.message}`);
      }
    } finally {
      window.alert("Token reset succesfully");
    }
  }

  function saveChanges() {
    if (
      Number(localSettingsValues.questionAmount) < 5 ||
      Number(localSettingsValues.questionAmount) > 50
    ) {
      window.alert("Questions per Quiz must be between 5 and 50");
      return;
    }
    setQuestionAmount(Number(localSettingsValues.questionAmount));
    setDisableSessionToken(localSettingsValues.disableToken);

    localStorage.setItem("amount", String(localSettingsValues.questionAmount));
    localStorage.setItem(
      "disableToken",
      String(localSettingsValues.disableToken),
    );
    window.alert("your settings were saved succesfully");
  }

  return (
    <AnimatePresence>
      {isSettingsVisible && (
        <motion.form
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.1 }}
          className="
              fixed grid grid-rows-[auto_auto_auto] text-center w-[95dvw] sm:w-[60dvw] md:w-[55dvw] lg:w-[50dvw] xl:w-[35dvw] 
              left-1/2 -translate-x-1/2 z-100 top-1/2 -translate-y-1/2 border-4 border-color5 text-color5 rounded-xl bg-color3
              text-xs sm:text-sm xl:text-base
              [&>section]:flex [&>section]:items-center [&>section]:py-5 [&>section]:gap-x-3 md:[&>section]:gap-x-4 lg:[&>section]:gap-x-5
              "
        >
          <section className="relative justify-center">
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold">
              SETTINGS
            </h1>
            <button
              ref={firstInputRef}
              onClick={(e) => {
                e.preventDefault();
                setIsSettingsVisble(false);
              }}
              className="absolute right-0 top-8 -translate-y-1/2 -translate-x-1/2 text-3xl hover:scale-125 focus:outline-3 outline-color5"
            >
              <RxCross2 />
            </button>
          </section>

          <section
            className="
              flex-col justify-start gap-5
              [&>div]:flex [&>div]:justify-start [&>div]:items-center [&>div]:w-full [&>div]:gap-3 [&>div]:px-[10%]
              [&>div>label]:before:content-['>'] [&>div>label]:before:mx-4 [&_input]:outline-color5"
          >
            <div>
              <label htmlFor="token">User Token</label>
              <div
                className="
                    flex items-center gap-3
                    [&>button]:underline [&>button]:font-semibold [&>button]:hover:translate-y-[-10%] [&>button]:duration-200
                    "
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    copyToClipboard(sessionToken);
                  }}
                >
                  copy
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    resetToken(sessionToken);
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
                <div tabIndex={0} className="group relative">
                  <FiAlertCircle className="text-amber-500" />
                  <span
                    className="
                      absolute w-60 px-2 py-1 left-1/2 -translate-x-1/2 bottom-[140%] group-hover:bottom-[150%] rounded-md border-2 border-amber-500 text-xs bg-color3 text-color5 font-semibold 
                      transition-all duration-100 opacity-0 invisible
                      group-focus:opacity-100 group-focus:visible
                      group-hover:opacity-100 group-hover:visible
                      group-active:opacity-100 group-active:visible"
                  >
                    Avoid creating new tokens unless necessary. In most cases
                    resetting your current token is enough
                  </span>
                  <span
                    className="
                      absolute triangle rotate-180 left-1/2 -translate-x-1/2 w-3 h-2 bottom-full group-hover:bottom-[110%] bg-amber-500
                      transition-all duration-100 opacity-0 invisible
                      group-focus:opacity-100 group-focus:visible
                      group-hover:opacity-100 group-hover:visible
                      group-active:opacity-100 group-active:visible"
                  ></span>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="disableToken">Disable Token</label>
              <input
                id="disableToken"
                type="checkbox"
                checked={localSettingsValues.disableToken}
                onChange={(e) => {
                  setLocalSettingsValues((prev) => ({
                    ...prev,
                    disableToken: e.target.checked,
                  }));
                }}
                className="h-4 aspect-square focus:outline-3"
              />
            </div>
            <div>
              <label htmlFor="amount">Questions per Quiz</label>
              <input
                id="amount"
                type="number"
                min="5"
                max="50"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveChanges();
                  }
                }}
                value={localSettingsValues.questionAmount}
                onChange={(e) => {
                  e.preventDefault();
                  setLocalSettingsValues((prev) => ({
                    ...prev,
                    questionAmount: e.target.value,
                  }));
                }}
                className="w-12 border-2 text-center rounded-md focus:outline-3"
              />
            </div>
          </section>

          <section
            className="
                 justify-center gap-y-2
                *:tracking-wide *:px-4 *:py-px *:rounded-sm *:bg-color2 *:text-color5 *:font-semibold *:border-2 *:focus:outline-3 *:outline-color5
              "
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                saveChanges();
              }}
            >
              Save
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuestionAmount(10);
                setDisableSessionToken(false);
              }}
            >
              Reset to Default
            </button>
          </section>
        </motion.form>
      )}
    </AnimatePresence>
  );
};

export default SettingsWindow;
