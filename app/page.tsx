"use client";

import { useRouter } from "next/navigation";
import CardSlider from "./components/cardSlider";
import { useSettings } from "./store/settings";
import { motion } from "motion/react";
import useFetch from "./tools/useFetch";
import useCardSlider from "./tools/useCardSliderStates";
import ErrorDisplay from "./components/errorDispaly";

export default function Home() {
  const router = useRouter();

  const amount = useSettings((s) => s.amount);
  const questionDifficulty = useSettings((s) => s.questionDifficulty);
  const setQuestionDifficulty = useSettings((s) => s.setQuestionDifficulty);
  const questionType = useSettings((s) => s.questionType);
  const setQuestionType = useSettings((s) => s.setQuestionType);

  const { data, isLoading, error, responseCode } = useFetch(
    "https://opentdb.com/api_category.php",
    "trivia_categories",
  );
  const categories = data?.trivia_categories;
  console.log(categories);

  async function startQuiz() {
    const amountParameter = `?amount=${amount}`;
    const categoryParameter = `&category=${categories[slider.currentIndex].id}`;
    const difficultyParameter =
      questionDifficulty != "any" ? `&difficulty=${questionDifficulty}` : "";
    const typeParameter = questionType != "any" ? `&type=${questionType}` : "";

    router.push(
      `/quiz${amountParameter}${categoryParameter}${difficultyParameter}${typeParameter}`,
    );
  }
  const quizCount = categories?.length - 1;

  const slider = useCardSlider();

  function updateCurrentIndex(direction: string) {
    if (direction === "right")
      slider.setCurrentIndex((prev: number) => {
        if (prev === quizCount) return 0;
        else return prev + 1;
      });
    else
      slider.setCurrentIndex((prev: number) => {
        if (prev === 0) return quizCount;
        else return prev - 1;
      });
  }

  return (
    <>
      {!error && !isLoading && categories ? (
        <div className="grid grid-rows-[60%_40%] md:grid-rows-[80%_20%] w-dvw h-full overflow-hidden">
          <CardSlider
            content={categories}
            isAnimating={slider.isAnimating}
            setIsAnimating={slider.setIsAnimating}
            currentIndex={slider.currentIndex}
            delayedIndex={slider.delayedIndex}
            setDelayedIndex={slider.setDelayedIndex}
          />

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 100 }}
            transition={{ delay: 0.2 }}
            className="
              grid grid-rows-3 md:grid-cols-3 sm:grid-rows-1 w-[80dvw] mx-[10dvw] my-auto gap-4
              [&>div]:flex [&>div]:items-center [&>div]:justify-center
              [&>div>select]:w-30 [&>div>select]:px-3 [&>div>select]:py-1 [&>div>select]:border-3 
              [&>div>select]:rounded-md [&>div>select]:text-xs [&>div>select]:bg-color2
              [&>div>select]:focus-within:scale-110 [&>div>select]:hover:scale-110 [&>div>select]:focus:outline-3 
              [&_button]:focus:outline-3 **:outline-color3 **:font-semibold **:text-color5"
          >
            <div className="gap-4">
              <select
                value={questionDifficulty}
                onChange={(e) => {
                  setQuestionDifficulty(e.target.value as QuestionDifficulty);
                  localStorage.setItem("questionDifficulty", e.target.value);
                }}
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
                  if (slider.isAnimating.state) return;
                  const direction = "left";
                  slider.setIsAnimating({
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
                className="text-xs md:text-sm lg:text-base px-4 py-1.5 rounded-xl border-3 bg-color2 hover:scale-110 whitespace-nowrap"
                onClick={startQuiz}
              >
                START QUIZ
              </button>
              <button
                className="group relative triangle h-9 aspect-square rotate-90 bg-transparent hover:scale-125 focus:bg-white"
                onClick={() => {
                  if (slider.isAnimating.state) return;
                  const direction = "right";
                  slider.setIsAnimating({
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
                onChange={(e) => {
                  setQuestionType(e.target.value as QuestionType);
                  localStorage.setItem("questionType", e.target.value);
                }}
              >
                <option value="any">Any Type</option>
                <option value="boolean">True / False</option>
                <option value="multiple">Multiple Choise</option>
              </select>
            </div>
          </motion.section>
        </div>
      ) : error ? (
        <ErrorDisplay responseCode={responseCode} error={error} />
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
