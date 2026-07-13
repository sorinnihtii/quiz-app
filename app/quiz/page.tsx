"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { decode } from "he";
import CardSlider from "../components/cardSlider";
import { useSettings } from "../store/settings";
import ErrorDisplay from "../components/errorDisplay";

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
    category: searchParams.get("category"),
    difficulty: searchParams.get("difficulty"),
    type: searchParams.get("type"),
    token: searchParams.get("token"),
  };

  const [responseCode, setResponseCode] = useState(0);
  const [error, setError] = useState<Error>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [displayContent, setDisplayContent] = useState<DisplayContent[]>([]);
  const [score, setScore] = useState<number>(0);

  const [isAnimating, setIsAnimating] = useState<Animating>({
    state: false,
    direction: "left",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [delayedIndex, setDelayedIndex] = useState(currentIndex); // for animation

  async function getQuestions() {
    const amountParameter = `?amount=${params.amount}`;
    const categoryParameter = `&category=${params.category}`;
    const difficultyParameter =
      params.difficulty != null ? `&difficulty=${params.difficulty}` : "";
    const typeParameter = params.type != null ? `&type=${params.type}` : "";
    const tokenParameter = disableToken ? "" : `&token=${params.token}`;

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

  console.log("questions and displayed content:", questions, displayContent);

  useEffect(() => {
    getQuestions();
  }, []);

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

  function getErrorMessage() {
    if (responseCode === 1)
      return "No Results Could not return results. The API doesn't have enough questions for your query.";
    if (responseCode === 2)
      return "Arguements passed in aren't valid. (Ex. Amount = Five)";
    if (responseCode === 3)
      return "Your Session Token does not exist. Try resetting or disabling it. Node: this might result in duplicate questions";
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
  }, [isAnimating.state, startNewQuiz]);

  async function startNewQuiz() {
    await getQuestions();
    setStartedNewQuiz(true);
    setCurrentIndex(0);
    setIsAnimating({
      state: true,
      direction: "right",
    });
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
            {currentIndex === displayContent.length && !isAnimating.state && (
              <button
                className="px-4 py-1.5 rounded-md font-semibold hover:scale-110 bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  startNewQuiz();
                }}
              >
                New Quiz
              </button>
            )}
          </section>
        </div>
      ) : (
        error && (
          <ErrorDisplay title={error.message} message={getErrorMessage()} />
        )
      )}
    </>
  );
};

export default Quiz;
