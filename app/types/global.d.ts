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

type Direction = "left" | "right";

type Animating = {
  state: boolean;
  direction: Direction;
};

interface Slider {
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;

  delayedIndex: number;
  setDelayedIndex: Dispatch<SetStateAction<number>>;

  isAnimating: Animating;
  setIsAnimating: Dispatch<SetStateAction<Animating>>;

  updateCurrentIndex: (direction: Direction) => void;
}
