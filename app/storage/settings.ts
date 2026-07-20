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

const preferredCategory = storageAvailable
  ? Number(localStorage.getItem("preferredCategory"))
    ? Number(localStorage.getItem("preferredCategory"))
    : 9
  : 9;

const questionAmount = storageAvailable
  ? Number(localStorage.getItem("questionAmount"))
    ? Number(localStorage.getItem("questionAmount"))
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

const disableSessionToken = storageAvailable
  ? localStorage.getItem("disableSessionToken") === "true"
  : false;

export const useSettings = create<AppSettings>((set) => ({
  preferredCategory: preferredCategory,
  setPreferredCategory: (newValue) => set({ preferredCategory: newValue }),

  questionAmount: questionAmount,
  setQuestionAmount: (newValue) => set({ questionAmount: newValue }),

  questionDifficulty: questionDifficulty,
  setQuestionDifficulty: (newValue) => set({ questionDifficulty: newValue }),

  questionType: questionType,
  setQuestionType: (newValue) => set({ questionType: newValue }),

  disableSessionToken: disableSessionToken,
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
