
// import { Reserves } from '../types/User';
import { Reserves } from '@/types/Reserves';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState: Reserves = { reserve0: 0, reserve1: 0 }

export const ReserveSlice = createSlice({
    name: 'reserves',
    initialState,
    reducers: {
        setReserves: (state: Reserves, action: PayloadAction<Reserves>) => {
            return action.payload
        },
    },
});

export const { setReserves } = ReserveSlice.actions;
export default ReserveSlice;
