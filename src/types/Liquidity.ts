import { SelectedProps } from "@components/elements/DropdownModal";

export interface Liquidity {
    selectedCurrency: SelectedProps;
    selectedCurrency1: SelectedProps;
    price0: string;
    price1: string;
    balance: number;
    balance1: number;
    perPrice: number[];
    allowPrice0: number;
    allowPrice1: number;
    allow0: boolean;
    allow1: boolean;
    availableBalance: boolean;
    status: boolean; 
    liquidityBalances: LiquidityBalancesProp[];
    remove: RemoveProps | any;
    pool0: number;
    pool1: number;
    totalPool: number;
}

export interface RemoveProps {
    pairAddress: string;
    address: string;
    balance: number;
    pool0?: number;
    pool1?: number;
    token0Address: string;
    token0Title: string;
    token1Address: string;
    token1Title: string;
    total?: number;
}

export interface LiquidityBalancesProp {
    balance: number,
    token0Title: string,
    token1Title: string,
    address: string,
    token0Address: string,
    token1Address: string
}