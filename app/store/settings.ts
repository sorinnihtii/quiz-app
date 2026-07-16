import { create } from "zustand";
import getToken from "../tools/getToken";

type AppSettings = {
    amount: number;
    setAmount: (newAmount: number) => void;
    disableToken: boolean;
    setDisableToken: (newValue: boolean) => void
    token: any
}

const amount =
  typeof window !== "undefined"
    ? Number(localStorage.getItem("amount")) || 10
    : 10;

const disableToken =
  typeof window !== "undefined"
    ? localStorage.getItem("disableToken") === "true"
    : false;

const token = disableToken ? "" : typeof window !== "undefined"
    ? localStorage.getItem("token") ? localStorage.getItem("token") : await getToken() : await getToken();

export const useSettings = create<AppSettings>((set) => ({
    amount: amount,
    setAmount: (newAmount) =>
        set({ amount: newAmount }),
    disableToken: disableToken,
    setDisableToken: (newValue) =>
        set({ disableToken: newValue}),
    token: token,
}))