// import { Reserves } from '../types/User';
import { StakeRecord, StakeRecords } from '@/types/StakeRecords';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface StakeRecordsState {
    records: StakeRecords[] | null;
    unStakeItem: StakeRecord | null
}

const initialState: StakeRecordsState = {
    records: [],
    unStakeItem: null
}

export const StakeSlice = createSlice({
    name: 'stakeRecords',
    initialState,
    reducers: {
        setStakeRecords: (state: StakeRecordsState, action: PayloadAction<StakeRecords[]>) => {
            state.records = action.payload
        },
        setUnStakeItem: (state: StakeRecordsState, action: PayloadAction<StakeRecords>) => {
            state.unStakeItem = action.payload
        },
        updateStakeRecords: (state: StakeRecordsState, action: PayloadAction<StakeRecords>) => {
            state.records?.push(action.payload)
        }
    },
});

export const { setStakeRecords, setUnStakeItem, updateStakeRecords } = StakeSlice.actions;
export default StakeSlice;