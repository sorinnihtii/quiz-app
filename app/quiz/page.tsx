"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useFetch from "../tools/useFetch";
import { decode } from "he";
import CardSlider from "../components/cardSlider";

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

  const params = {
    amount: searchParams.get("amount"),
    category: searchParams.get("category"),
    difficulty: searchParams.get("difficulty"),
    type: searchParams.get("type"),
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [displayQuestions, setDisplayQuestions] = useState<DisplayContent[]>(
    [],
  );
  const [isAnimating, setIsAnimating] = useState<Animating>({
    state: false,
    direction: "left",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(currentIndex); // for animation

  async function getQuestions() {
    const amountParameter = `?amount=${params.amount}`;
    const categoryParameter = `&category=${params.category}`;
    const difficultyParameter =
      params.difficulty != null ? `&difficulty=${params.difficulty}` : "";
    const typeParameter = params.type != null ? `&type=${params.type}` : "";

    const url = `https://opentdb.com/api.php${amountParameter}${categoryParameter}${difficultyParameter}${typeParameter}`;
    const data = await useFetch(url);
    if (Array.isArray(data?.results)) {
      setQuestions(data.results);
      let questionsList = [] as DisplayContent[];
      data.results.map((question: Question, index: number) => {
        const entry: DisplayContent[] = [
          {
            id: index,
            name: question.question,
          },
        ];
        questionsList = [...questionsList, ...entry];
      });
      setDisplayQuestions(questionsList);
    }
  }

  useEffect(() => {
    getQuestions();
  }, []);

  const previousQuestion: undefined | Question = questions[previousIndex]; // for animation

  const currentAnswers = useMemo(() => {
    if (!previousQuestion) return [];

    const incorrectAnswers: Answer[] = previousQuestion.incorrect_answers.map(
      (answer) => ({
        value: answer,
        correct: false,
      }),
    );
    const correctAnswer = [
      {
        value: previousQuestion.correct_answer,
        correct: true,
      },
    ];

    if (previousQuestion.type === "boolean") {
      return previousQuestion.correct_answer === "True"
        ? [...correctAnswer, ...incorrectAnswers]
        : [...incorrectAnswers, ...correctAnswer];
    }
    return shuffle([...incorrectAnswers, ...correctAnswer]);
  }, [previousQuestion]);

  console.log("questions:", questions);

  return (
    <div className="grid grid-rows-[80%_20%] w-screen h-full overflow-x-hidden">
      <CardSlider
        content={displayQuestions}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        currentIndex={currentIndex}
        previousIndex={previousIndex}
        setPreviousIndex={setPreviousIndex}
      />
      <section className="flex w-[80vw] h-full items-center justify-center ml-[10vw] gap-10">
        {currentAnswers &&
          currentAnswers.map((answer) => (
            <button
              className={`px-4 py-1.5 rounded-md font-semibold hover:scale-110 ${isAnimating.state === true ? (answer.correct ? "bg-green-500" : "bg-red-500") : "bg-white"}`}
              key={answer.value}
              onClick={() => {
                if (isAnimating.state) return;
                setCurrentIndex((prev) => {
                  if (prev < questions.length - 1) return prev + 1;
                  else return prev;
                });
                setIsAnimating({
                  state: true,
                  direction: "right",
                });
              }}
            >
              {decode(answer.value)}
            </button>
          ))}
      </section>
    </div>
  );
};

export default Quiz;
