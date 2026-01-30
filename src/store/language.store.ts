import { create } from "zustand";

type LangState = {
  language: string;
  setLanguage: (l: string) => void;
};

export const useLanguageStore = create<LangState>((set) => ({
  language: "ENGLISH",
  setLanguage: (l) => set({ language: l }),
}));
