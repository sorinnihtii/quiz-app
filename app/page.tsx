"use client";

import { useRouter } from "next/navigation";
import CardSlider from "./components/cardSlider";
import { useSettings } from "./storage/settings";
import { motion } from "motion/react";
import useFetch from "./tools/useFetch";
import useCardSlider from "./tools/useCardSliderStates";
import ErrorDisplay from "./components/errorDispaly";
import { useEffect, useMemo, useState } from "react";
import CardSliderArrowButton from "./components/cardSliderArrowButton";

export default function Home() {
  const router = useRouter();

  const questionCategory = useSettings((s) => s.questionCategory);
  const setQuestionCategory = useSettings((s) => s.setQuestionCategory);
  const questionDifficulty = useSettings((s) => s.questionDifficulty);
  const setQuestionDifficulty = useSettings((s) => s.setQuestionDifficulty);
  const questionType = useSettings((s) => s.questionType);
  const setQuestionType = useSettings((s) => s.setQuestionType);

  const [found, setFound] = useState(false);

  const { data, isLoading, error, responseCode } = useFetch(
    "https://opentdb.com/api_category.php",
    "trivia_categories",
  );
  const categories = data?.trivia_categories
    ? [{ id: 0, name: "Any Category" }, ...data.trivia_categories]
    : [];

  const slider = useCardSlider(categories?.length - 1);

  useEffect(() => {
    if (questionCategory && categories?.length && found === false) {
      let localFound: boolean = false;
      categories.map((category: DisplayContent, index: number) => {
        if (category.id === questionCategory) {
          localFound = true;
          slider.setCurrentIndex(index);
          slider.setDelayedIndex(index);
          return;
        }
      });
      setFound(localFound);
      if (localFound === false) {
        localStorage.removeItem("questionCategory");
      }
    }
  }, [categories.length, questionCategory, slider]);

  function startQuiz() {
    setQuestionCategory(categories[slider.currentIndex].id);
    localStorage.setItem(
      "questionCategory",
      categories[slider.currentIndex].id,
    );

    router.push("/quiz");
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
              [&>div>select]:w-35 [&>div>select]:px-3 [&>div>select]:py-1 [&>div>select]:border-2 [&>div>select]:font-medium [&>div>select]:rounded-md
              [&>div>select]:text-xs [&>div>select]:text-color5 [&>div>select]:bg-color2 [&>div>select]:focus-within:scale-105
              [&>div>select]:transition-all [&>div>select]:duration-50 md:[&>div>select]:hover:scale-105
              [&>div>select]:focus-visible:outline-2 lg:[&>div>select]:focus-visible:outline-3 [&>div>select]:focus-visible:outline-color4"
          >
            <div className="gap-4">
              <select
                aria-label="Question Difficulty"
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

            <div className="gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 [&_button]:duration-100">
              <CardSliderArrowButton slider={slider} direction="left" />
              <button
                className="common px-4 py-1.5 font-semibold rounded-xl border-2 text-xs md:text-sm lg:text-base bg-color2 whitespace-nowrap"
                onClick={startQuiz}
              >
                START QUIZ
              </button>
              <CardSliderArrowButton slider={slider} direction="right" />
            </div>

            <div className="gap-4">
              <select
                aria-label="Question Type"
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
          <div className="flex items-center justify-center h-full font-semibold text-color5 text-xl">
            Loading...
          </div>
        )
      )}
    </>
  );
}
