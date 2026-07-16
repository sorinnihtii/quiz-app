"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { decode } from "he";
import CardSlider from "../components/cardSlider";
import { useSettings } from "../store/settings";
import { motion } from "motion/react";
import Card from "../components/card";
import getErrorMessage from "../tools/getErrorMessage";
import useFetch from "../tools/useFetch";
import resetToken from "../tools/resetToken";

interface Props {
  searchParams: {
    amount?: string;
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
  const { disableToken, token } = useSettings();
  console.log("quiz client token", token);

  const amountParameter = `?amount=${searchParams.amount}`;
  const categoryParameter = `&category=${searchParams.category}`;
  const difficultyParameter =
    searchParams.difficulty != null
      ? `&difficulty=${searchParams.difficulty}`
      : "";
  const typeParameter =
    searchParams.type != null ? `&type=${searchParams.type}` : "";
  const tokenParameter = disableToken ? "" : `&token=${token}`;

  const { data, isLoading, error, responseCode, refetch } = useFetch(
    `https://opentdb.com/api.php${amountParameter}${categoryParameter}${difficultyParameter}${typeParameter}${tokenParameter}`,
  );

  const displayContent = useMemo(() => {
    if (!data) return [];

    return data.results.map((question: Question, index: number) => {
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
        id: index,
        name: question.question,
        answers,
      };
    });
  }, [data]);

  const [score, setScore] = useState<number>(0);

  const [isAnimating, setIsAnimating] = useState<Animating>({
    state: false,
    direction: "left",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [delayedIndex, setDelayedIndex] = useState(0); // for animation

  console.log("in component", error, responseCode);

  async function fetchNewToken() {}

  const [startedNewQuiz, setStartedNewQuiz] = useState(false);

  useEffect(() => {
    if (!isAnimating.state && startedNewQuiz) {
      setScore(0);
      setStartedNewQuiz(false);
    }
  }, [isAnimating.state, startedNewQuiz]);

  async function startNewQuiz() {
    await refetch();
    setStartedNewQuiz(true);
    setCurrentIndex(0);
    setDelayedIndex(0);
  }

  return (
    <>
      {!error && !isLoading && responseCode === 0 ? (
        <div className="grid grid-rows-[80%_20%] w-screen h-full overflow-x-hidden">
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
              content={displayContent}
              isAnimating={isAnimating}
              setIsAnimating={setIsAnimating}
              currentIndex={currentIndex}
              delayedIndex={delayedIndex}
              setDelayedIndex={setDelayedIndex}
              score={score}
            />
          </motion.div>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 100 }}
            transition={{ delay: 0.2 }}
            className="flex w-[80vw] h-full items-center justify-center ml-[10vw] gap-10"
          >
            {displayContent &&
              displayContent[delayedIndex] &&
              displayContent[delayedIndex]?.answers &&
              displayContent[delayedIndex].answers.map((answer: Answer) => (
                <button
                  key={answer.value}
                  onClick={() => {
                    if (isAnimating.state) return;
                    setCurrentIndex((prev) => prev + 1);
                    setIsAnimating({
                      state: true,
                      direction: "right",
                    });
                    if (answer.correct) setScore((prev) => prev + 1);
                  }}
                  className={`
                    px-4 py-1.5 rounded-md font-semibold hover:scale-110 border-3 border-color5 focus:outline-3 outline-color3
                    ${isAnimating.state ? (answer.correct ? "bg-green-400" : "bg-red-400") : "bg-color2"}
                    `}
                >
                  {decode(answer.value)}
                </button>
              ))}
            {currentIndex === displayContent.length && !isAnimating.state && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  startNewQuiz();
                }}
                className="
                  px-4 py-1.5 rounded-md font-semibold bg-color2
                  hover:scale-110 border-3 border-color5   focus:outline-3 outline-color3"
              >
                New Quiz
              </button>
            )}
          </motion.section>
        </div>
      ) : error ? (
        <div className="grid grid-rows-[80%_20%] w-screen h-full overflow-hidden px-[10vw]">
          <Card
            title={error.message}
            subtitle={getErrorMessage(responseCode, error?.message)}
            styles="
              flex flex-col items-center justify-center gap-2 bg-white h-[80vh] w-[80vw] rounded-2xl
              *:w-[50%] *:text-center [&>h1]:font-semibold [&>h1]:text-4xl [&>h1]:text-red-500
              [&>h2]:text-black [&>h2]:text-lg
              "
          />
          <section
            className="
            flex w-[80vw] h-full items-center justify-center gap-10
            *:bg-color2 *:px-4 *:py-1.5 *:border-3 *:border-color5 *:rounded-lg *:font-semibold
            *:hover:scale-110 *:focus:outline-3 *:outline-color3"
          >
            <button onClick={fetchNewToken}>Create New Token</button>
            <button onClick={() => window.location.reload()}>Try Again</button>
            <button onClick={() => resetToken(token)}>Reset Token</button>
          </section>
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

export default QuizClient;
