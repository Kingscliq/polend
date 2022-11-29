import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface LanguageState {
    language: string
}

const initialState: LanguageState = {
    language: 'en'
}

export const LanguageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state: LanguageState, action: PayloadAction<LanguageState>) => {
            return action.payload
        },
    },
});

export const { setLanguage } = LanguageSlice.actions;
export default LanguageSlice;