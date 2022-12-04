export interface Loan {

    address: string;
    totalLiquidity: number;
    maxBorrow: number;
    curBorrow: number;
    healthLevel: number;


    tokenName: string;
    tokenAddress: string;
    poolAction: number;
    data: {} | any;

    wbnbPrice: number;
}

export interface SupplyProps {
    totalLiquidity: number;
    maxBorrow: number;
    curBorrow: number;
    healthLevel: number;
    tokenName: string;
    tokenAddress: string;
    poolAction: number;
}
export interface BorrowProps {
    totalLiquidity: number;
    maxBorrow: number;
    curBorrow: number;
    healthLevel: number;
    tokenName: string;
    tokenAddress: string;
    poolAction: number;
}