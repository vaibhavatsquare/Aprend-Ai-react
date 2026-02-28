import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserLanguage } from '@/src/libs/types';

type LangState = {
  language: UserLanguage;
  setLanguage: (l: UserLanguage) => void;
  initializeLanguage: (userLanguage?: UserLanguage) => void;
};

export const useLanguageStore = create<LangState>()(
  persist(
    (set, get) => ({
      language: 'ENGLISH',
      setLanguage: (l) => {
        set({ language: l });
        // Also update localStorage for immediate access
        if (typeof window !== 'undefined') {
          localStorage.setItem('language', l);
        }
      },
      initializeLanguage: (userLanguage) => {
        // Priority: userLanguage > localStorage > default (ENGLISH)
        const currentLanguage = userLanguage ||
          (typeof window !== 'undefined' ? localStorage.getItem('language') as UserLanguage : null) ||
          'ENGLISH';

        set({ language: currentLanguage });

        // Ensure localStorage is set
        if (typeof window !== 'undefined') {
          localStorage.setItem('language', currentLanguage);
        }
      },
    }),
    {
      name: 'language-storage',
      partialize: (state) => ({ language: state.language }),
    }
  )
);
