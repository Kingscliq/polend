import { Loan } from "@/types/Loan"
import { createSlice } from "@reduxjs/toolkit"

const initialState: Loan = {
    
    totalLiquidity: 0,
    maxBorrow: 0,
    curBorrow: 0,
    healthLevel: 4,
    address: "",

    tokenName: "",
    tokenAddress: "",
    poolAction: 0,
    data: {},

    wbnbPrice: 0,
}

export const LoanSlice =  createSlice({ 
    name: 'loan', 
    initialState, 
    reducers: {
        setUserInfo: (state: Loan, action) => {
        state.totalLiquidity = action.payload.totalLiquidity;
        state.maxBorrow = action.payload.maxBorrow;
        state.curBorrow = action.payload.curBorrow;
        state.healthLevel = action.payload.healthLevel;
        state.address = action.payload.address;
    },
    setPoolInfo: (state: Loan, action) => {
        state.tokenName = action.payload.tokenName;
        state.tokenAddress = action.payload.tokenAddress;
        state.poolAction = action.payload.poolAction;
        state.data = action.payload.data;
    },
    setwbnbPrice: (state: Loan, action) => {
        state.wbnbPrice = action.payload
    }
    }});

    export const {setUserInfo, setPoolInfo, setwbnbPrice} = LoanSlice.actions

export default LoanSlice;