import { create } from "zustand";

type AppSettings = {
    amount: number;
    setAmount: (newAmount: number) => void;
}

export const useSettings = create<AppSettings>((set) => ({
    amount: 10,
    setAmount: (newAmount) =>
        set({ amount: newAmount })
}))