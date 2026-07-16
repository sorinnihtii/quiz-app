import { create } from "zustand";
import getToken from "../tools/getToken";

type AppSettings = {
  amount: number;
  setAmount: (newValue: number) => void;
  questionDifficulty: QuestionDifficulty;
  setQuestionDifficulty: (newValue: QuestionDifficulty) => void;
  questionType: QuestionType;
  setQuestionType: (newValue: QuestionType) => void;
  disableToken: boolean;
  setDisableToken: (newValue: boolean) => void;
  token: string;
  setToken: (newValue: string) => void;
  initToken: () => void;
};

const storageAvailable: boolean = typeof window !== "undefined";

const amount = storageAvailable
  ? Number(localStorage.getItem("amount")) || 10
  : 10;

const questionDifficulty = storageAvailable
  ? (localStorage.getItem("questionDifficulty") as QuestionDifficulty)
    ? (localStorage.getItem("questionDifficulty") as QuestionDifficulty)
    : "any"
  : "any";

const questionType = storageAvailable
  ? (localStorage.getItem("questionType") as QuestionType)
    ? (localStorage.getItem("questionType") as QuestionType)
    : "any"
  : "any";

const disableToken = storageAvailable
  ? localStorage.getItem("disableToken") === "true"
  : false;

export const useSettings = create<AppSettings>((set) => ({
  amount: amount,
  setAmount: (newValue) => set({ amount: newValue }),

  questionDifficulty: questionDifficulty,
  setQuestionDifficulty: (newValue) => set({ questionDifficulty: newValue }),

  questionType: questionType,
  setQuestionType: (newValue) => set({ questionType: newValue }),

  disableToken: disableToken,
  setDisableToken: (newValue) => set({ disableToken: newValue }),

  token: "",
  setToken: (newValue) => set({ token: newValue }),

  initToken: async () => {
    let token = localStorage.getItem("token");
    if (!token) {
      token = await getToken();
    }

    if (token) {
      set({ token });
    }
  },
}));
