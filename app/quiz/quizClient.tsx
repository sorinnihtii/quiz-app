"use client";

import { useEffect, useMemo, useState } from "react";
import { decode } from "he";
import CardSlider from "../components/cardSlider";
import { useSettings } from "../store/settings";
import { motion } from "motion/react";
import Card from "../components/card";

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
  const [isLoading, setIsLoading] = useState(true);
  const { disableToken } = useSettings();

  const [responseCode, setResponseCode] = useState(0);
  const [error, setError] = useState<any>(undefined);

  const [displayContent, setDisplayContent] = useState<DisplayContent[]>([]);
  const [score, setScore] = useState<number>(0);

  const [isAnimating, setIsAnimating] = useState<Animating>({
    state: false,
    direction: "left",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [delayedIndex, setDelayedIndex] = useState(0); // for animation

  async function getQuestions() {
    const amountParameter = `?amount=${searchParams.amount}`;
    const categoryParameter = `&category=${searchParams.category}`;
    const difficultyParameter =
      searchParams.difficulty != null
        ? `&difficulty=${searchParams.difficulty}`
        : "";
    const typeParameter =
      searchParams.type != null ? `&type=${searchParams.type}` : "";
    const tokenParameter = disableToken ? "" : `&token=${searchParams.token}`;

    try {
      const response = await fetch(
        `https://opentdb.com/api.php${amountParameter}${categoryParameter}${difficultyParameter}${typeParameter}${tokenParameter}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}${response.statusText}`);
      }
      const data = await response.json();
      if (!data) return;

      setResponseCode(data.response_code);
      if (data.response_code !== 0) return;

      let questionsList: DisplayContent[] = [];

      data.results.map((question: Question, index: number) => {
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

        questionsList.push({
          id: index,
          name: question.question,
          answers: answers,
        });
      });
      setDisplayContent(questionsList);
    } catch (err) {
      if (err instanceof Error) {
        console.log("err:", err);
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getQuestions();
  }, []);

  async function resetToken() {
    await fetch(
      `https://opentdb.com/api_token.php?command=reset&token=${searchParams.token}`,
    );
  }

  function getErrorMessage() {
    if (responseCode === 1)
      return "No Results Could not return results. The API doesn't have enough questions for your query.";
    if (responseCode === 2)
      return "Arguements passed in aren't valid. (Ex. Amount = Five)";
    if (responseCode === 3)
      return "Your Session Token does not exist. Try resetting or disabling it. Note: this might result in duplicate questions";
    if (responseCode === 4)
      return "Your Session Token has returned all possible questions for the specified query. Reset your token or try changing the quiz category, difficulty or questions type.";
    if (responseCode === 5 || error?.message === "HTTP 429")
      return "Too many requests. Try again in a few seconds";
    return "Unknown error";
  }

  const [startedNewQuiz, setStartedNewQuiz] = useState(false);

  useEffect(() => {
    if (!isAnimating.state && startedNewQuiz) {
      setScore(0);
      setStartedNewQuiz(false);
    }
  }, [isAnimating.state, startedNewQuiz]);

  async function startNewQuiz() {
    setIsLoading(true);
    await getQuestions();
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
              displayContent[delayedIndex]?.answers &&
              displayContent[delayedIndex].answers.map((answer) => (
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
                    ${isAnimating.state ? (answer.correct ? "bg-green-500" : "bg-red-500") : "bg-color2"}
                    `}
                >
                  {decode(answer.value)}
                </button>
              ))}
            {currentIndex === displayContent.length && !isAnimating.state && (
              <button
                className="px-4 py-1.5 rounded-md font-semibold border-3 hover:scale-110 bg-white focus:outline-3 outline-color3"
                onClick={(e) => {
                  e.preventDefault();
                  startNewQuiz();
                }}
              >
                New Quiz
              </button>
            )}
          </motion.section>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full p-20 pt-10">
          <Card
            title={error.message}
            subtitle={getErrorMessage()}
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

export default QuizClient;
