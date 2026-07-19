import { create } from "zustand";
import getToken from "../tools/getToken";

type AppSettings = {
  preferredCategory: number;
  setPreferredCategory: (newValue: number) => void;
  questionAmount: number;
  setQuestionAmount: (newValue: number) => void;
  questionDifficulty: QuestionDifficulty;
  setQuestionDifficulty: (newValue: QuestionDifficulty) => void;
  questionType: QuestionType;
  setQuestionType: (newValue: QuestionType) => void;
  disableSessionToken: boolean;
  setDisableSessionToken: (newValue: boolean) => void;
  sessionToken: string;
  setSessionToken: (newValue: string) => void;
  initSessionToken: () => void;
};

const storageAvailable: boolean = typeof window !== "undefined";

const category = storageAvailable
  ? Number(localStorage.getItem("category"))
    ? Number(localStorage.getItem("category"))
    : 9
  : 9;

const amount = storageAvailable
  ? Number(localStorage.getItem("amount"))
    ? Number(localStorage.getItem("amount"))
    : 10
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
  preferredCategory: category,
  setPreferredCategory: (newValue) => set({ preferredCategory: newValue }),

  questionAmount: amount,
  setQuestionAmount: (newValue) => set({ questionAmount: newValue }),

  questionDifficulty: questionDifficulty,
  setQuestionDifficulty: (newValue) => set({ questionDifficulty: newValue }),

  questionType: questionType,
  setQuestionType: (newValue) => set({ questionType: newValue }),

  disableSessionToken: disableToken,
  setDisableSessionToken: (newValue) => set({ disableSessionToken: newValue }),

  sessionToken: "",
  setSessionToken: (newValue) => set({ sessionToken: newValue }),

  initSessionToken: async () => {
    let sessionToken = localStorage.getItem("sessionToken");
    if (!sessionToken) {
      sessionToken = await getToken();
    }

    if (sessionToken) {
      set({ sessionToken });
    }
  },
}));
