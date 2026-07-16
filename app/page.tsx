"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CardSlider from "./components/cardSlider";
import { useSettings } from "./store/settings";
import { motion } from "motion/react";
import Card from "./components/card";
import getErrorMessage from "./tools/getErrorMessage";
import useFetch from "./tools/useFetch";

export default function Home() {
  const router = useRouter();
  const { amount } = useSettings();

  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("any");
  const [questionType, setQuestionType] = useState<QuestionType>("any");

  const { data, isLoading, error, responseCode } = useFetch(
    "https://opentdb.com/api_category.php",
    "trivia_categories",
  );
  const categories = data?.trivia_categories;

  async function startQuiz() {
    const amountParameter = `?amount=${amount}`;
    const categoryParameter = `&category=${categories[currentIndex].id}`;
    const difficultyParameter =
      difficulty != "any" ? `&difficulty=${difficulty}` : "";
    const typeParameter = questionType != "any" ? `&type=${questionType}` : "";

    router.push(
      `/quiz${amountParameter}${categoryParameter}${difficultyParameter}${typeParameter}`,
    );
  }
  const quizCount = categories?.length - 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [delayedIndex, setDelayedIndex] = useState(0); // for animation purposes

  const [isAnimating, setIsAnimating] = useState<Animating>({
    state: false,
    direction: "left",
  });

  function updateCurrentIndex(direction: string) {
    if (direction === "right")
      setCurrentIndex((prev) => {
        if (prev === quizCount) return 0;
        else return prev + 1;
      });
    else
      setCurrentIndex((prev) => {
        if (prev === 0) return quizCount;
        else return prev - 1;
      });
  }

  return (
    <>
      {!error && !isLoading && categories ? (
        <div className="grid grid-rows-[80%_20%] w-screen h-full overflow-hidden">
          <motion.div
            initial={{ translateX: "100vw" }}
            animate={{ translateX: "0" }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="w-screen overflow-hidden"
          >
            <CardSlider
              content={categories}
              isAnimating={isAnimating}
              setIsAnimating={setIsAnimating}
              currentIndex={currentIndex}
              delayedIndex={delayedIndex}
              setDelayedIndex={setDelayedIndex}
            />
          </motion.div>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 100 }}
            transition={{ delay: 0.2 }}
            className="
              grid grid-cols-3 items-center justify-center w-[80vw] mx-auto
              [&>div]:flex [&>div]:items-center [&>div]:justify-center
              [&>div>select]:w-30 [&>div>select]:px-3 [&>div>select]:py-1
              [&>div>select]:border-3 [&>div>select]:cursor-pointer [&>div>select]:rounded-md [&>div>select]:text-xs [&>div>select]:bg-color2
              [&>div>select]:focus-within:scale-110 [&>div>select]:hover:scale-110 [&>div>select]:focus:outline-3 
              [&_button]:focus:outline-3 **:outline-color3 **:font-semibold **:text-color5"
          >
            <div className="gap-4">
              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as QuestionDifficulty)
                }
              >
                <option value="any">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="gap-10 [&_button]:duration-100">
              <button
                className="group relative triangle h-9 aspect-square -rotate-90 bg-transparent hover:scale-125 focus:bg-white"
                onClick={() => {
                  if (isAnimating.state) return;
                  const direction = "left";
                  setIsAnimating({
                    state: true,
                    direction: direction,
                  });
                  updateCurrentIndex(direction);
                }}
              >
                <span
                  className="
                    triangle absolute h-7 aspect-square rotate-0
                    top-10/18 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color5"
                >
                  <span
                    className="
                      triangle absolute h-5 aspect-square rotate-0
                      top-10/18 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color2"
                  ></span>
                </span>
              </button>
              <button
                className="px-4 py-1.5 rounded-xl border-3 bg-color2 hover:scale-110"
                onClick={startQuiz}
              >
                START QUIZ
              </button>
              <button
                className="group relative triangle h-9 aspect-square rotate-90 bg-transparent hover:scale-125 focus:bg-white"
                onClick={() => {
                  if (isAnimating.state) return;
                  const direction = "right";
                  setIsAnimating({
                    state: true,
                    direction: direction,
                  });
                  updateCurrentIndex(direction);
                }}
              >
                <span
                  className="
                    triangle absolute h-7 aspect-square rotate-0
                    top-10/18 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color5"
                >
                  <span
                    className="
                      triangle absolute h-5 aspect-square rotate-0
                      top-10/18 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-color2"
                  ></span>
                </span>
              </button>
            </div>

            <div className="gap-4">
              <select
                value={questionType}
                onChange={(e) =>
                  setQuestionType(e.target.value as QuestionType)
                }
              >
                <option value="any">Any Type</option>
                <option value="boolean">True / False</option>
                <option value="multiple">Multiple Choise</option>
              </select>
            </div>
          </motion.section>
        </div>
      ) : error ? (
        <div className="grid grid-rows-[80%_20%] w-screen h-full overflow-hidden">
          <Card
            title={error.message}
            subtitle={getErrorMessage(responseCode, error?.message)}
            styles="
              flex flex-col items-center justify-center gap-2 bg-white h-[80vh] w-[80vw] rounded-2xl
              *:w-[50%] *:text-center [&>h1]:font-semibold [&>h1]:text-4xl [&>h1]:text-red-500
              [&>h2]:text-black [&>h2]:text-lg
              "
          />
        </div>
      ) : (
        isLoading && (
          <div className="flex items-center justify-center h-full text-white text-xl">
            Loading...
          </div>
        )
      )}
    </>
  );
}
