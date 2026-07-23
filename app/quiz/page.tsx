"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { decode } from "he";
import CardSlider from "../components/cardSlider";
import { useSettings } from "../storage/settings";
import { motion } from "motion/react";
import useFetch from "../tools/useFetch";
import useCardSlider from "../tools/useCardSliderStates";
import ErrorDisplay from "../components/errorDispaly";
import getNewToken from "../tools/getNewSessionToken";

function shuffle(array: Answer[]) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function Quiz() {
  const questionCategory = useSettings((s) => s.questionCategory);
  const setQuestionCategory = useSettings((s) => s.setQuestionCategory);
  const questionDifficulty = useSettings((s) => s.questionDifficulty);
  const setQuestionDifficulty = useSettings((s) => s.setQuestionDifficulty);
  const questionType = useSettings((s) => s.questionType);
  const setQuestionType = useSettings((s) => s.setQuestionType);
  const disableSessionToken = useSettings((s) => s.disableSessionToken);
  const questionAmount = useSettings((s) => s.questionAmount);
  const sessionToken = useSettings((s) => s.sessionToken);
  const initSessionToken = useSettings((s) => s.initSessionToken);

  useEffect(() => {
    initSessionToken();
  }, [initSessionToken]);

  const amountParameter = (questionAmount as number)
    ? `?amount=${questionAmount}`
    : "?amount=10";
  const categoryParameter =
    (questionCategory as number) && questionCategory !== 0
      ? `&category=${questionCategory}`
      : "";
  const difficultyParameter =
    (questionDifficulty as QuestionDifficulty) && questionDifficulty !== "any"
      ? `&difficulty=${questionDifficulty}`
      : "";
  const typeParameter =
    (questionType as QuestionType) && questionType !== "any"
      ? `&type=${questionType}`
      : "";
  const tokenParameter =
    (sessionToken as string) && !disableSessionToken
      ? `&token=${sessionToken}`
      : "";

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

      const correct: Answer = {
        value: question.correct_answer,
        correct: true,
      };

      const answers =
        question.type === "multiple"
          ? shuffle([correct, ...incorrect])
          : correct.value === "True"
            ? [correct, ...incorrect]
            : [...incorrect, correct];

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

  const firstAnswerButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isLoading && !error && responseCode === 0 && !slider.isAnimating.state)
      firstAnswerButtonRef.current?.focus();
  }, [
    displayContent,
    isLoading,
    error,
    responseCode,
    slider.isAnimating.state,
  ]);

  useEffect(() => {
    if (responseCode === 3) {
      window.alert(
        "Your session token is invalid or expired. Attempting to fetch a new one...",
      );
      getNewToken();
    }
  }, [responseCode, questionCategory, displayContent]);

  const theme = useSettings((s) => s.theme);

  return (
    <>
      {displayContent && !error && !isLoading && responseCode === 0 ? (
        <div className="grid grid-rows-[60%_40%] md:grid-rows-[70%_30%] lg:grid-rows-[80%_20%] w-dvw h-full overflow-hidden">
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
            className="flex flex-col md:flex-row gap-[5%] mx-[10dvw] w-[80dvw] h-full items-center justify-center"
          >
            {displayContent &&
              displayContent[slider.delayedIndex] &&
              displayContent[slider.delayedIndex]?.answers &&
              displayContent[slider.delayedIndex].answers.map(
                (answer: Answer, index: number) => (
                  <button
                    ref={index === 0 ? firstAnswerButtonRef : undefined}
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
                    common px-4 py-1.5 text-xs md:text-sm lg:text-base rounded-md font-semibold border-2
                    ${
                      slider.isAnimating.state
                        ? answer.correct
                          ? theme === "light"
                            ? "bg-green-400"
                            : "bg-green-800"
                          : theme === "light"
                            ? "bg-red-400"
                            : "bg-red-800"
                        : "bg-color2"
                    }
                    `}
                  >
                    {decode(answer.value)}
                  </button>
                ),
              )}
            {slider.currentIndex === displayContent.length &&
              !slider.isAnimating.state && (
                <button
                  type="button"
                  onClick={(e) => {
                    startNewQuiz();
                  }}
                  className="common px-4 py-1.5 rounded-md text-xs md:text-sm lg:text-base font-semibold border-2 bg-color2"
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
          <div className="flex items-center justify-center h-full font-medium text-color5 text-xl">
            Loading...
          </div>
        )
      )}
    </>
  );
}

export default Quiz;
