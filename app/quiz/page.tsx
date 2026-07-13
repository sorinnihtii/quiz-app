"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { decode } from "he";
import CardSlider from "../components/cardSlider";
import { useSettings } from "../store/settings";

function shuffle(array: Answer[]) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

const Quiz = () => {
  const searchParams = useSearchParams();

  const { disableToken } = useSettings();

  const params = {
    amount: searchParams.get("amount"),
    token: searchParams.get("token"),
    category: searchParams.get("category"),
    difficulty: searchParams.get("difficulty"),
    type: searchParams.get("type"),
  };

  const [responseCode, setResponseCode] = useState(0);
  const [error, setError] = useState<Error>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [displayContent, setDisplayContent] = useState<DisplayContent[]>([]);
  const [score, setScore] = useState<number>(0);

  async function getQuestions() {
    const amountParameter = `?amount=${params.amount}`;
    const tokenParameter = `&token=${params.token}`;
    const categoryParameter = `&category=${params.category}`;
    const difficultyParameter =
      params.difficulty != null ? `&difficulty=${params.difficulty}` : "";
    const typeParameter = params.type != null ? `&type=${params.type}` : "";

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

      setQuestions(data.results);

      let questionsList: DisplayContent[] = [];

      data.results.map((question: Question, index: number) => {
        const entry: DisplayContent[] = [
          {
            id: index,
            name: question.question,
          },
        ];
        questionsList = [...questionsList, ...entry];
      });

      setDisplayContent(questionsList);
    } catch (err) {
      if (err instanceof Error) {
        console.log("err:", err);
        setError(err);
      }
    }
  }

  console.log("error:", error?.message);

  useEffect(() => {
    getQuestions();
  }, []);

  const [isAnimating, setIsAnimating] = useState<Animating>({
    state: false,
    direction: "left",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [delayedIndex, setDelayedIndex] = useState(currentIndex); // for animation
  const delayedQuestion: undefined | Question = questions[delayedIndex];

  const currentAnswers = useMemo(() => {
    if (!delayedQuestion) return [];

    const incorrectAnswers: Answer[] = delayedQuestion.incorrect_answers.map(
      (answer) => ({
        value: answer,
        correct: false,
      }),
    );
    const correctAnswer = [
      {
        value: delayedQuestion.correct_answer,
        correct: true,
      },
    ];

    if (delayedQuestion.type === "boolean") {
      return delayedQuestion.correct_answer === "True"
        ? [...correctAnswer, ...incorrectAnswers]
        : [...incorrectAnswers, ...correctAnswer];
    }
    return shuffle([...incorrectAnswers, ...correctAnswer]);
  }, [delayedQuestion]);

  async function resetToken() {
    await fetch(
      `https://opentdb.com/api_token.php?command=reset&token=${params.token}`,
    );
    getQuestions();
  }

  return (
    <>
      {responseCode === 0 && !error ? (
        <div className="grid grid-rows-[80%_20%] w-screen h-full overflow-x-hidden">
          <CardSlider
            content={displayContent}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            currentIndex={currentIndex}
            delayedIndex={delayedIndex}
            setDelayedIndex={setDelayedIndex}
            score={score}
          />
          <section className="flex w-[80vw] h-full items-center justify-center ml-[10vw] gap-10">
            {currentAnswers &&
              currentAnswers.map((answer) => (
                <button
                  key={answer.value}
                  className={`px-4 py-1.5 rounded-md font-semibold hover:scale-110
                ${isAnimating.state ? (answer.correct ? "bg-green-500" : "bg-red-500") : "bg-white"}`}
                  onClick={() => {
                    if (isAnimating.state) return;
                    setCurrentIndex((prev) => prev + 1);
                    setIsAnimating({
                      state: true,
                      direction: "right",
                    });
                    if (answer.correct) setScore((prev) => prev + 1);
                  }}
                >
                  {decode(answer.value)}
                </button>
              ))}
            {currentIndex === displayContent.length && (
              <button className="px-4 py-1.5 rounded-md font-semibold hover:scale-110 bg-white">
                New Quiz
              </button>
            )}
          </section>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-20 pt-10">
          <div className="flex flex-col items-center justify-center gap-2 bg-white h-[80vh] w-[80vw] rounded-2xl *:w-[50%] *:text-center">
            {error && (
              <>
                <h1 className="font-semibold text-3xl text-red-500">
                  {error.name}
                  {": "}
                  {error.message}
                </h1>
                <h2 className="text-black">
                  {error.message == "HTTP 429"
                    ? "Too many requests. Try again in a few seconds"
                    : ""}
                </h2>
              </>
            )}
            {responseCode === 4 && (
              <>
                <h1 className="font-semibold text-3xl text-red-500">
                  Out of Questions!
                </h1>
                <h2 className="text-lg">
                  Try a different quiz type or{" "}
                  <button
                    className="font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                      resetToken();
                    }}
                  >
                    reset
                  </button>{" "}
                  /{" "}
                  <button
                    className="font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    disable
                  </button>{" "}
                  your token. Resetting your token will result in duplicate
                  questions
                </h2>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;
