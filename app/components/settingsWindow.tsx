"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useSettings } from "../storage/settings";
import getNewToken from "../tools/getNewSessionToken";

interface Props {
  isSettingsVisible: boolean;
  setIsSettingsVisble: (newValue: boolean) => void;
}

function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => alert("text copied to clipboard succesfully"))
    .catch((err) => {
      if (err instanceof Error)
        window.alert(`Failed to copy text: ${err.message}`);
      console.error(err);
    });
}

const SettingsWindow = ({ isSettingsVisible, setIsSettingsVisble }: Props) => {
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  const questionAmount = useSettings((s) => s.questionAmount);
  const setQuestionAmount = useSettings((s) => s.setQuestionAmount);
  const disableSessionToken = useSettings((s) => s.disableSessionToken);
  const setDisableSessionToken = useSettings((s) => s.setDisableSessionToken);
  const sessionToken = useSettings((s) => s.sessionToken);

  const initSessionToken = useSettings((s) => s.initSessionToken);

  useEffect(() => {
    initSessionToken();
  }, [initSessionToken]);

  const [questionAmountController, setQuestionAmountController] = useState(
    questionAmount.toString(),
  );

  const firstInputRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isSettingsVisible) firstInputRef.current?.focus();
  }, [isSettingsVisible]);

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
      console.error(err);
    } finally {
      window.alert("Token reset succesfully");
    }
  }

  function saveChanges() {
    if (
      Number(questionAmountController) < 5 ||
      Number(questionAmountController) > 50
    ) {
      window.alert("Questions per Quiz must be between 5 and 50");
      return;
    }
    setQuestionAmount(Number(questionAmountController));
    try {
      localStorage.setItem("theme", theme);
      localStorage.setItem("questionAmount", questionAmount.toString());
      localStorage.setItem(
        "disableSessionToken",
        disableSessionToken.toString(),
      );
    } catch (err) {
      if (err instanceof Error)
        window.alert(`Failed to save settings: ${err.message}`);
      console.error(err);
    } finally {
      window.alert("your settings were saved succesfully");
      firstInputRef.current?.focus();
    }
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
            left-1/2 -translate-x-1/2 z-100 top-1/2 -translate-y-1/2
            text-xs sm:text-sm xl:text-base
            ring-2 ring-color5/5 border-3 border-color5 text-color5 rounded-xl bg-color3
            [&>section]:flex [&>section]:items-center [&>section]:py-5
            [&>section]:gap-x-3 md:[&>section]:gap-x-4 lg:[&>section]:gap-x-5"
        >
          <section className="relative justify-center">
            <h1 className="font-semibold text-base sm:text-lg lg:text-xl">
              SETTINGS
            </h1>
            <button
              type="button"
              ref={firstInputRef}
              onClick={() => {
                setIsSettingsVisble(false);
              }}
              className="absolute right-0 top-8 -translate-y-1/2 -translate-x-1/2 text-3xl md:hover:scale-125 focus-visible:outline-3 outline-color5"
            >
              <RxCross2 />
            </button>
          </section>

          <section
            className="
              flex-col justify-start gap-y-5
              [&>div]:flex [&>div]:justify-start [&>div]:items-center [&>div]:w-full [&>div]:gap-3 [&>div]:px-[10%] [&_input]:outline-color5
              [&>div>h3]:before:content-['>'] [&>div>h3]:before:mx-4 [&>div>label]:before:content-['>'] [&>div>label]:before:mx-4"
          >
            <div role="group" aria-labelledby="session-token-heading">
              <h3 id="session-token-heading">Session Token</h3>
              <div
                className="
                  flex items-center gap-3
                  [&>button]:underline [&>button]:font-semibold md:[&>button]:hover:translate-y-[-10%] [&>button]:duration-200"
              >
                <button
                  type="button"
                  aria-label="Copy session token to clipboard"
                  onClick={() => {
                    copyToClipboard(sessionToken);
                  }}
                >
                  copy
                </button>
                <button
                  type="button"
                  aria-label="Reset your session token"
                  onClick={() => {
                    resetToken(sessionToken);
                  }}
                >
                  reset
                </button>
                <button
                  type="button"
                  aria-label="Create a new session token"
                  onClick={() => {
                    getNewToken();
                  }}
                >
                  new
                </button>
                <button className="group relative">
                  <FiAlertCircle
                    aria-hidden="true"
                    className="text-amber-400"
                  />
                  <span
                    id="token-help"
                    role="tooltip"
                    className="
                      absolute w-60 px-2 py-1 left-1/2 -translate-x-1/2 bottom-[150%]
                      rounded-md border-2 border-amber-400 text-xs bg-color3 text-color5 font-semibold 
                      transition-all duration-100 opacity-0 invisible
                      group-focus-visible:visible group-focus-visible:opacity-100 group-focus-visible:bottom-[160%]
                      group-active:visible group-active:opacity-100 group-active:bottom-[160%]
                      md:group-hover:visible md:group-hover:opacity-100 md:group-hover:bottom-[160%]"
                  >
                    Avoid creating new tokens unless necessary. In most cases
                    resetting your current token is enough
                  </span>
                  <span
                    className="
                      absolute triangle rotate-180 left-1/2 -translate-x-1/2 w-3 h-2 bottom-full bg-amber-400
                      transition-all duration-100 opacity-0 invisible
                      group-focus-visible:visible group-focus-visible:opacity-100 group-focus-visible:bottom-[110%]
                      group-active:visible group-active:opacity-100 group-active:bottom-[110%]
                      md:group-hover:visible md:group-hover:opacity-100 md:group-hover:bottom-[110%]"
                  ></span>
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="disableSessionToken">Disable Session Token</label>
              <input
                id="disableSessionToken"
                type="checkbox"
                checked={disableSessionToken}
                onChange={(e) => {
                  setDisableSessionToken(e.target.checked);
                }}
                className="h-4 aspect-square focus-visible:outline-3"
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
                    setIsSettingsVisble(false);
                  }
                }}
                value={questionAmountController}
                onChange={(e) => {
                  setQuestionAmountController(e.target.value);
                }}
                className="w-12 border-2 text-center rounded-md focus-visible:outline-3"
              />
            </div>
            <div>
              <h3>Theme</h3>
              <div className="*:px-3 *:py-px *:border-y-2 divide-x-2">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`rounded-l-md border-l-2 ${theme === "light" ? "bg-color2" : "bg-transparent"}`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`rounded-r-md border-r-2 ${theme === "dark" ? "bg-color2" : "bg-transparent"}`}
                >
                  Dark
                </button>
              </div>
            </div>
          </section>

          <section className="justify-center *:px-3 *:py-0.5 *:rounded-md *:bg-color2 *:border-2">
            <button
              type="button"
              aria-label="Save settings"
              onClick={saveChanges}
              className="common"
            >
              Save
            </button>
            <button
              aria-label="Reset settings to default"
              type="button"
              onClick={() => {
                setQuestionAmount(10);
                setQuestionAmountController("10");
                setDisableSessionToken(false);
                saveChanges();
                firstInputRef.current?.focus();
              }}
              className="common"
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
