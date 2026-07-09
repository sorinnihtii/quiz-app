"use client";

import { useEffect, useState } from "react";
import useFetch from "./tools/useFetch";

export default function Home() {
  type Category = {
    id: number;
    name: string;
  };
  type Difficuly = "easy" | "medium" | "hard";
  type QuestionType = "mutliple-choise" | "true-false";
  const [categories, setCategories] = useState<Category[]>([]);

  async function getCategories() {
    const data = await useFetch("https://opentdb.com/api_category.php");
    console.log("categories:", data);
    setCategories(data.trivia_categories);
  }

  useEffect(() => {
    getCategories();
  }, []);

  const quizCount = categories.length - 1;

  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [previousQuiz, setPreviousQuiz] = useState(0); // for animation purposes

  console.log(currentQuiz);

  const [isAnimating, setIsAnimating] = useState({
    state: false,
    direction: "right" as "right" | "left",
  });

  function updateCurrentQuiz(direction: string) {
    if (direction === "right")
      setCurrentQuiz((prev) => {
        if (prev === quizCount) return 0;
        else return prev + 1;
      });
    else
      setCurrentQuiz((prev) => {
        if (prev === 0) return quizCount;
        else return prev - 1;
      });
  }

  function handleTransitionEnd() {
    {
      setIsAnimating((prev) => ({
        ...prev,
        state: false,
      }));
      setPreviousQuiz(currentQuiz);
      console.log("transition ended");
    }
  }

  return (
    <div className="grid grid-rows-[80%_20%] w-screen h-full overflow-hidden">
      <section
        className="
          flex items-center px-[10vw] gap-[20vw] overflow-x-hidden w-max overflow-hidden translate-x-[-100vw]
          *:flex *:flex-col *:items-center *:justify-center *:gap-4 *:h-full *:w-[80vw] *:rounded-2xl *:bg-[#FFFFFF]
          [&>div>*]:w-180 [&>div>*]:text-center [&>div>h1]:text-7xl [&>div>h1]:uppercase "
      >
        {categories.length && (
          <>
            <div
              className={`card ${isAnimating.state ? (isAnimating.direction === "right" ? "slide-right" : "slide-left") : ""}`}
            >
              <h1>{categories[currentQuiz].name}</h1>
            </div>

            <div
              className={`card ${isAnimating.state ? (isAnimating.direction === "right" ? "slide-right" : "slide-left") : ""}`}
              onTransitionEnd={handleTransitionEnd}
            >
              <h1>{categories[previousQuiz].name}</h1>
            </div>

            <div
              className={`card ${isAnimating.state ? (isAnimating.direction === "right" ? "slide-right" : "slide-left") : ""}`}
            >
              <h1>{categories[currentQuiz].name}</h1>
            </div>
          </>
        )}
      </section>

      <section className="flex items-center justify-center w-screen gap-12 [&_button]:bg-white [&_button]:duration-100">
        <button
          className="triangle h-8 aspect-square -rotate-90 hover:scale-125"
          onClick={() => {
            const direction = "left";
            setIsAnimating({
              state: true,
              direction: direction,
            });
            updateCurrentQuiz(direction);
          }}
          disabled={isAnimating.state}
        ></button>
        <button className="px-4 py-1.5 rounded-xl text-xl text-black font-semibold hover:scale-110">
          START QUIZ
        </button>
        <button
          className="triangle h-8 aspect-square rotate-90 hover:scale-125"
          onClick={() => {
            const direction = "right";
            setIsAnimating({
              state: true,
              direction: direction,
            });
            updateCurrentQuiz(direction);
          }}
          disabled={isAnimating.state}
        ></button>
      </section>
    </div>
  );
}
