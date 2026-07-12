"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { decode } from "he";
import CardSlider from "../components/cardSlider";
import fetchData from "../tools/fetchData";

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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [displayContent, setDisplayContent] = useState<DisplayContent[]>([]);
  const [score, setScore] = useState<number>(0);

  async function getQuestions() {
    const params = {
      amount: searchParams.get("amount"),
      category: searchParams.get("category"),
      difficulty: searchParams.get("difficulty"),
      type: searchParams.get("type"),
    };

    const amountParameter = `?amount=${params.amount}`;
    const categoryParameter = `&category=${params.category}`;
    const difficultyParameter =
      params.difficulty != null ? `&difficulty=${params.difficulty}` : "";
    const typeParameter = params.type != null ? `&type=${params.type}` : "";

    const data = await fetchData(
      `https://opentdb.com/api.php${amountParameter}${categoryParameter}${difficultyParameter}${typeParameter}`,
    );

    if (Array.isArray(data?.results)) {
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
    }
  }

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

  console.log(currentIndex, displayContent.length);

  return (
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
  );
};

export default Quiz;
