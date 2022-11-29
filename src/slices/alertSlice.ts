import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface AlertState {
    type: string;
    message: string | any;
    url: { text: string; link: string };
}

const initialState: AlertState = {
    type: 'success',
    message: 'This is a smaple message',
    url: { text: 'Hey', link: 'https://bscan.com' }
}

export const AlertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        setAlert: (state: AlertState, action: PayloadAction<AlertState>) => {
            return action.payload
        },
        removeAlert: (state: AlertState, action: PayloadAction<AlertState>) => {
            return action.payload
        },

    },
});

export const { setAlert, removeAlert } = AlertSlice.actions;
export default AlertSlice;