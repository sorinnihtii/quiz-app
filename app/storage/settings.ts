import { create } from "zustand";
import getToken from "../tools/getSessionToken";

type AppSettings = {
  theme: Theme;
  setTheme: (newValue: Theme) => void;
  questionCategory: number;
  setQuestionCategory: (newValue: number) => void;
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

const cachedTheme = storageAvailable ? localStorage.getItem("theme") : "";
let valid = cachedTheme === "light" || cachedTheme === "dark";
const theme = storageAvailable
  ? valid
    ? (cachedTheme as Theme)
    : "light"
  : "light";
if (!valid && storageAvailable) localStorage.removeItem("theme");

const cachedCategory = storageAvailable
  ? localStorage.getItem("questionCategory")
  : "";
valid = Boolean(Number(cachedCategory));
const questionCategory = storageAvailable
  ? valid
    ? Number(cachedCategory)
    : 0
  : 0;
if (!valid && storageAvailable) localStorage.removeItem("questionCategory");

const cachedAmount = storageAvailable
  ? localStorage.getItem("questionAmount")
  : "";
valid = Boolean(Number(cachedAmount) >= 5 && Number(cachedAmount) <= 50);
const questionAmount = storageAvailable
  ? valid
    ? Number(cachedAmount)
    : 10
  : 10;
if (!valid && storageAvailable) localStorage.removeItem("questionAmount");

const cachedDifficulty = storageAvailable
  ? localStorage.getItem("questionDifficulty")
  : "";
valid =
  cachedDifficulty === "any" ||
  cachedDifficulty === "easy" ||
  cachedDifficulty === "medium" ||
  cachedDifficulty === "hard";
const questionDifficulty = storageAvailable
  ? valid
    ? (cachedDifficulty as QuestionDifficulty)
    : "any"
  : "any";
if (!valid && storageAvailable) localStorage.removeItem("questionDifficulty");

const cachedType = storageAvailable ? localStorage.getItem("questionType") : "";
valid =
  cachedType === "any" || cachedType === "boolean" || cachedType === "multiple";
const questionType = storageAvailable
  ? valid
    ? (cachedType as QuestionType)
    : "any"
  : "any";
if (!valid && storageAvailable) localStorage.removeItem("questionType");

const cachedDisableToken = storageAvailable
  ? localStorage.getItem("disableSessionToken")
  : "";
valid = cachedDisableToken === "true" || cachedDisableToken === "false";
const disableSessionToken = storageAvailable
  ? cachedDisableToken === "true"
  : false;
if (!valid && storageAvailable) localStorage.removeItem("disableSessionToken");

export const useSettings = create<AppSettings>((set) => ({
  theme: theme,
  setTheme: (newValue: Theme) => set({ theme: newValue }),

  questionCategory: questionCategory,
  setQuestionCategory: (newValue) => set({ questionCategory: newValue }),

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
