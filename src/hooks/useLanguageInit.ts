import { useEffect } from 'react';
import { useLanguageStore } from '@/src/store/language.store';
import { getStoredUser } from '@/src/libs/helpers';

export const useLanguageInit = () => {
    const { initializeLanguage } = useLanguageStore();

    useEffect(() => {
        // Get user from localStorage
        const user = getStoredUser();

        // Initialize language with user preference or fallback
        initializeLanguage(user?.user_language);
    }, [initializeLanguage]);
};
