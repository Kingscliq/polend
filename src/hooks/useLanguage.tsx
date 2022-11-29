import { useCallback } from 'react';
import { setLanguage } from '../slices/languageSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store/types';
import { Language } from '../types/Language';

export const language = (state: RootState) => state.language;

export const useLanguageActions = () => {
  const dispatch = useAppDispatch();

  // Set language State
  return {
    setLanguage: useCallback(
      (language: Language) => dispatch(setLanguage(language)),
      [dispatch],
    ),
  };
};

// get language State
export const useLanguage = () => {
  return useAppSelector(language);
};
