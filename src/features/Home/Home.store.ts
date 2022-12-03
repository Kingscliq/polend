import { BorrowProps, SupplyProps } from '@/types/Loan';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface LoanState {
    supplyData: SupplyProps | null;
    borrowData: BorrowProps | null
}

const initialState: LoanState = {
    supplyData: {
        totalLiquidity: "" as unknown as number,
        maxBorrow: "" as unknown as number,
        curBorrow: "" as unknown as number,
        healthLevel: "" as unknown as number,
        tokenName: "",
        tokenAddress: "",
        poolAction: "" as unknown as number,
    },
    borrowData: {
        totalLiquidity: "" as unknown as number,
        maxBorrow: "" as unknown as number,
        curBorrow: "" as unknown as number,
        healthLevel: "" as unknown as number,
        tokenName: "",
        tokenAddress: "",
        poolAction: "" as unknown as number,
    }
}

export const LoanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        setSupplyData: (state: LoanState, action: PayloadAction<SupplyProps>) => {
            state.supplyData = action.payload
        },
        setBorrowData: (state: LoanState, action: PayloadAction<BorrowProps>) => {
            state.borrowData = action.payload
        },
    },
});

export const { setSupplyData, setBorrowData } = LoanSlice.actions;
export default LoanSlice;