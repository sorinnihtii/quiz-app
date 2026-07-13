import { create } from "zustand";

type AppSettings = {
    amount: number;
    setAmount: (newAmount: number) => void;
    disableToken: boolean;
    setDisableToken: (newValue: boolean) => void
}

const amount =
  typeof window !== "undefined"
    ? Number(localStorage.getItem("amount")) || 10
    : 10;

const disableToken =
  typeof window !== "undefined"
    ? localStorage.getItem("disableToken") === "true"
    : false;

export const useSettings = create<AppSettings>((set) => ({
    amount: amount,
    setAmount: (newAmount) =>
        set({ amount: newAmount }),
    disableToken: disableToken,
    setDisableToken: (newValue) =>
        set({ disableToken: newValue})
}))