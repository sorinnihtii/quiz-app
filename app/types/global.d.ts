type QuestionDifficulty = "any" | "easy" | "medium" | "hard";

type QuestionType = "any" | "boolean" | "multiple";

type Question = {
  category: string;
  correct_answer: string;
  difficulty: Difficulty;
  incorrect_answers: string[];
  question: string;
  type: QuestionsType;
};

type Answer = {
  value: string;
  correct: boolean;
};

type DisplayContent = {
  name: string;
  id?: number;
  answers?: Answer[];
  subtitle?: string;
};

type Animating = {
  state: boolean;
  direction: "left" | "right";
};
