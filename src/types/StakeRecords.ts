export interface StakeRecords {
    timestamp: number | string,
    stakeAmount: number,
    curAmount: number,
    wbnbAmount: number,
    rewardType?: number
}


export interface StakeRecord {
    timestamp: number | string,
    stakeAmount: number,
    curAmount: number,
    wbnbAmount: number,
    rewardType?: number
}
