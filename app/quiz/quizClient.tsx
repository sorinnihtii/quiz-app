"use client";

import { useEffect, useMemo, useState } from "react";
import { decode } from "he";
import CardSlider from "../components/cardSlider";
import { useSettings } from "../storage/settings";
import { motion } from "motion/react";
import useFetch from "../tools/useFetch";
import useCardSlider from "../tools/useCardSliderStates";
import ErrorDisplay from "../components/errorDispaly";

interface Props {
  searchParams: {
    category?: string;
    difficulty?: string;
    type?: string;
    token?: string;
  };
}

function shuffle(array: Answer[]) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function QuizClient({ searchParams }: Props) {
  const disableSessionToken = useSettings((s) => s.disableSessionToken);
  const questionAmount = useSettings((s) => s.questionAmount);
  const sessionToken = useSettings((s) => s.sessionToken);
  const initSessionToken = useSettings((s) => s.initSessionToken);

  useEffect(() => {
    initSessionToken();
  }, [initSessionToken]);

  const amountParameter = `?amount=${questionAmount}`;
  const categoryParameter = `&category=${searchParams.category}`;
  const difficultyParameter =
    searchParams.difficulty != null
      ? `&difficulty=${searchParams.difficulty}`
      : "";
  const typeParameter =
    searchParams.type != null ? `&type=${searchParams.type}` : "";
  const tokenParameter = disableSessionToken ? "" : `&token=${sessionToken}`;

  const { data, isLoading, error, responseCode, refetch } = useFetch(
    `https://opentdb.com/api.php${amountParameter}${categoryParameter}${difficultyParameter}${typeParameter}${tokenParameter}`,
  );

  const displayContent = useMemo(() => {
    if (!data) return [];

    return data.results.map((question: Question) => {
      const incorrect = question.incorrect_answers.map((answer) => ({
        value: answer,
        correct: false,
      }));

      const correct: Answer[] = [
        {
          value: question.correct_answer,
          correct: true,
        },
      ];

      const answers =
        question.type === "multiple"
          ? shuffle([...correct, ...incorrect])
          : correct[0].value === "True"
            ? [...correct, ...incorrect]
            : [...incorrect, ...correct];

      return {
        name: question.question,
        answers,
      };
    });
  }, [data]);

  const slider = useCardSlider(displayContent?.length - 1);

  const [score, setScore] = useState(0);
  const [startedNewQuiz, setStartedNewQuiz] = useState(false);

  useEffect(() => {
    if (!slider.isAnimating.state && startedNewQuiz) {
      setScore(0);
      setStartedNewQuiz(false);
    }
  }, [slider.isAnimating.state, startedNewQuiz]);

  async function startNewQuiz() {
    await refetch();
    setStartedNewQuiz(true);
    slider.setCurrentIndex(0);
    slider.setDelayedIndex(0);
  }

  return (
    <>
      {!error && !isLoading && responseCode === 0 ? (
        <div className="grid grid-rows-[60%_40%] md:grid-rows-[80%_20%] w-dvw h-full overflow-hidden">
          <CardSlider
            content={displayContent}
            isAnimating={slider.isAnimating}
            setIsAnimating={slider.setIsAnimating}
            currentIndex={slider.currentIndex}
            delayedIndex={slider.delayedIndex}
            setDelayedIndex={slider.setDelayedIndex}
            score={score}
          />
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 100 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-[5%] mx-[10dvw] sm:flex-row w-[80dvw] h-full items-center justify-center"
          >
            {displayContent &&
              displayContent[slider.delayedIndex] &&
              displayContent[slider.delayedIndex]?.answers &&
              displayContent[slider.delayedIndex].answers.map(
                (answer: Answer) => (
                  <button
                    key={answer.value}
                    onClick={() => {
                      if (slider.isAnimating.state) return;
                      slider.setCurrentIndex((prev) => prev + 1);
                      slider.setIsAnimating({
                        state: true,
                        direction: "right",
                      });
                      if (answer.correct) setScore((prev) => prev + 1);
                    }}
                    className={`
                    px-4 py-1.5 text-xs sm:text-base rounded-md font-semibold md:hover:scale-110 border-3 border-color5 focus:outline-3 outline-color4
                    ${!slider.isAnimating.state && (answer.correct ? "bg-green-400" : "bg-red-400")}
                    `}
                  >
                    {decode(answer.value)}
                  </button>
                ),
              )}
            {slider.currentIndex === displayContent.length &&
              !slider.isAnimating.state && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    startNewQuiz();
                  }}
                  className="
                  px-4 py-1.5 rounded-md text-xs md:text-sm lg:text-base font-semibold bg-color2
                  md:hover:scale-110 border-3 border-color5   focus:outline-3 outline-color4"
                >
                  New Quiz
                </button>
              )}
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

export default QuizClient;
