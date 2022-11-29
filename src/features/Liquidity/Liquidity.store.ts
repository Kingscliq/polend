
import { Liquidity, LiquidityBalancesProp, RemoveProps } from '@/types/Liquidity';
import { SelectedProps } from '@components/elements/DropdownModal';
import { TOKENS } from '@config/constants';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const initialState: Liquidity = {
    selectedCurrency: TOKENS[0],
    selectedCurrency1: TOKENS[2],
    price1: '0',
    price0: '0',
    balance: 0,
    balance1: 0,
    perPrice: [],
    allowPrice0: 0,
    allowPrice1: 0,
    allow0: false,
    allow1: false,
    availableBalance: true,
    status: false,
    liquidityBalances: [{
        balance: 0,
        token0Title: "",
        token1Title: "",
        address: "",
        token0Address: "",
        token1Address: ""
    }],
    remove: {
        address: '',
        balance: 0,
        pool0: 0,
        pool1: 0,
        token0Address: '',
        token0Title: '',
        token1Address: '',
        token1Title: '',
        total: 0,
    },
    pool0: 0,
    pool1: 0,
    totalPool: 0,
}

export const LiquiditySlice = createSlice({
    name: 'liquidity',
    initialState,
    reducers: {
        setSelectedCurrency: (state: Liquidity, action: PayloadAction<SelectedProps>) => {
            state.selectedCurrency = action.payload
        },
        setSelectedCurrency1: (state: Liquidity, action: PayloadAction<SelectedProps>) => {
            state.selectedCurrency1 = action.payload
        },
        setPrice0: (state: Liquidity, action: PayloadAction<string>) => {
            state.price0 = action.payload
        },
        setPrice1: (state: Liquidity, action: PayloadAction<string>) => {
            state.price1 = action.payload
        },
        setBalance: (state: Liquidity, action: PayloadAction<number>) => {
            state.balance = action.payload
        },
        setBalance1: (state: Liquidity, action: PayloadAction<number>) => {
            state.balance1 = action.payload
        },
        setPerPrice: (state: Liquidity, action: PayloadAction<number[]>) => {
            state.perPrice = action.payload
        },
        setAllowPrice0: (state: Liquidity, action: PayloadAction<number>) => {
            state.allowPrice0 = action.payload
        },
        setAllowPrice1: (state: Liquidity, action: PayloadAction<number>) => {
            state.allowPrice1 = action.payload
        },
        setAllow0: (state: Liquidity, action: PayloadAction<boolean>) => {
            state.allow0 = action.payload
        },
        setAllow1: (state: Liquidity, action: PayloadAction<boolean>) => {
            state.allow1 = action.payload
        },
        setAvailableBalance: (state: Liquidity, action: PayloadAction<boolean>) => {
            state.availableBalance = action.payload
        },
        setStatus: (state: Liquidity, action: PayloadAction<boolean>) => {
            state.status = action.payload
        },
        setLiquidityBalances: (state: Liquidity, action: PayloadAction<LiquidityBalancesProp[]>) => {
            state.liquidityBalances = action.payload
        },
        setPool0: (state: Liquidity, action: PayloadAction<number>) => {
            state.pool0 = action.payload
        },
        setPool1: (state: Liquidity, action: PayloadAction<number>) => {
            state.pool1 = action.payload
        },
        setTotalPool: (state: Liquidity, action: PayloadAction<number>) => {
            state.totalPool = action.payload
        },
        setRemove: (state: Liquidity, action: PayloadAction<{}>) => {
            state.remove = action.payload
        },
        updateBalance: (state: Liquidity, action: PayloadAction<RemoveProps>) => {
            state.remove.balance = action.payload
        },
    },
});

export const { setSelectedCurrency, setSelectedCurrency1, setPrice0, setPrice1, setBalance, setBalance1, setPerPrice, setAllowPrice0, setAllowPrice1, setAllow0, setAllow1, setAvailableBalance, setStatus, setLiquidityBalances, setPool0, setPool1, setTotalPool, setRemove, updateBalance } = LiquiditySlice.actions;
export default LiquiditySlice;
