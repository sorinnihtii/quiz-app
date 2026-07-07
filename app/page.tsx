"use client";

import { useState } from "react";
import Card from "./components/card";

export default function Home() {
  const quizList = [
    {
      title: "Wild Life",
      description: "wild life is kinda crazy",
    },
    {
      title: "Nutrition",
      description: "nutrition is kinda crazy",
    },
    {
      title: "Music",
      description: "music is kinda crazy",
    },
  ];
  const quizCount = quizList.length - 1;

  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [previousQuiz, setPreviousQuiz] = useState(0); // for animation purposes

  const [isAnimating, setIsAnimating] = useState({
    state: false,
    direction: "right",
  });

  function updateCurrentQuiz() {
    if (isAnimating.direction === "right")
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
    }
  }

  return (
    <div className="grid grid-rows-[80%_20%] w-screen h-full overflow-hidden">
      <section
        className="
          flex items-center px-[10vw] gap-[20vw] overflow-x-hidden w-max overflow-hidden translate-x-[-100vw]
          *:flex *:flex-col *:items-center *:justify-center *:gap-4 *:h-full *:w-[80vw] *:rounded-2xl *:bg-color5
          [&>div>*]:w-180 [&>div>*]:text-center [&>div>h1]:text-7xl [&>div>h1]:uppercase "
      >
        <div
          className={`card ${isAnimating.state && (isAnimating.direction === "right" ? "slide-right" : "slide-left")}`}
          onTransitionEnd={handleTransitionEnd}
        >
          <Card
            title={quizList[currentQuiz].title}
            description={quizList[currentQuiz].title}
          />
        </div>

        <div
          className={`card ${isAnimating.state && (isAnimating.direction === "right" ? "slide-right" : "slide-left")}`}
          onTransitionEnd={handleTransitionEnd}
        >
          <Card
            title={quizList[previousQuiz].title}
            description={quizList[currentQuiz].description}
          />
        </div>

        <div
          className={`card ${isAnimating.state && (isAnimating.direction === "right" ? "slide-right" : "slide-left")}`}
          onTransitionEnd={handleTransitionEnd}
        >
          <Card
            title={quizList[currentQuiz].title}
            description={quizList[currentQuiz].description}
          />
        </div>
      </section>

      <section className="flex items-center justify-center w-screen gap-20">
        <button
          onClick={() => {
            setIsAnimating({
              state: true,
              direction: "left",
            });
            updateCurrentQuiz();
          }}
          disabled={isAnimating.state ? true : false}
        >
          previous
        </button>
        <button>start quiz</button>
        <button
          onClick={() => {
            setIsAnimating({
              state: true,
              direction: "right",
            });
            updateCurrentQuiz();
          }}
          disabled={isAnimating.state ? true : false}
        >
          next
        </button>
      </section>
    </div>
  );
}
