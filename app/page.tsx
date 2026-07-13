"use client";

import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CardSlider from "./components/cardSlider";
import { useSettings } from "./store/settings";

export default function Home() {
  const router = useRouter();
  const { amount, disableToken } = useSettings();

  const [token, setToken] = useState("");

  const [categories, setCategories] = useState<DisplayContent[]>([]);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("any");
  const [questionType, setQuestionType] = useState<QuestionType>("any");

  async function getData(
    url: string,
    propertyName: string,
    setState: SetStateAction<any>,
  ) {
    const stored = localStorage.getItem(propertyName);
    if (stored) {
      setState(JSON.parse(stored));
    } else {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();

      if (!data) return;
      setState(data[propertyName]);
      localStorage.setItem(propertyName, JSON.stringify(data[propertyName]));
    }
  }

  async function startQuiz() {
    const amountParameter = `?amount=${amount}`;
    const tokenParameter = disableToken ? "" : `&token=${token}`;
    const categoryParameter = `&category=${categories[currentIndex].id}`;
    const difficultyParameter =
      difficulty != "any" ? `&difficulty=${difficulty}` : "";
    const typeParameter = questionType != "any" ? `&type=${questionType}` : "";

    router.push(
      `/quiz${amountParameter}${categoryParameter}${difficultyParameter}${typeParameter}${tokenParameter}`,
    );
  }

  useEffect(() => {
    getData(
      "https://opentdb.com/api_category.php",
      "trivia_categories",
      setCategories,
    );
    getData(
      "https://opentdb.com/api_token.php?command=request",
      "token",
      setToken,
    );
  }, []);

  const quizCount = categories.length - 1;

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
    <div className="grid grid-rows-[80%_20%] w-screen h-full overflow-hidden">
      <CardSlider
        content={categories}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        currentIndex={currentIndex}
        delayedIndex={delayedIndex}
        setDelayedIndex={setDelayedIndex}
      />

      <section
        className="
          grid grid-cols-3 items-center justify-center w-[80vw] ml-[10vw] *:font-semibold *:text-black
          [&>div]:flex [&>div]:items-center [&>div]:justify-center
          [&>div>select]:w-30 [&>div>select]:px-3 [&>div>select]:py-1
          [&>div>select]:cursor-pointer [&>div>select]:rounded-md [&>div>select]:text-xs [&>div>select]:bg-white
          [&>div>select]:hover:scale-110 [&>div>select]:focus:scale-110 [&>div>select]:focus:border-0
          "
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

        <div className="gap-12 [&_button]:bg-white [&_button]:duration-100">
          <button
            className="triangle h-6 aspect-square -rotate-90 hover:scale-125 focus:scale-125"
            onClick={() => {
              if (isAnimating.state) return;
              const direction = "left";
              setIsAnimating({
                state: true,
                direction: direction,
              });
              updateCurrentIndex(direction);
            }}
          ></button>
          <button
            className="px-4 py-1.5 rounded-xl hover:scale-110 focus:scale-110"
            onClick={startQuiz}
          >
            START QUIZ
          </button>
          <button
            className="triangle h-6 aspect-square rotate-90 hover:scale-125 focus:scale-125"
            onClick={() => {
              if (isAnimating.state) return;
              const direction = "right";
              setIsAnimating({
                state: true,
                direction: direction,
              });
              updateCurrentIndex(direction);
            }}
          ></button>
        </div>

        <div className="gap-4">
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as QuestionType)}
          >
            <option value="any">Any Type</option>
            <option value="boolean">True / False</option>
            <option value="multiple">Multiple Choise</option>
          </select>
        </div>
      </section>
    </div>
  );
}
