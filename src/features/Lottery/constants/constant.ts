export const STAGE_CLOSED = 0;
export const STAGE_PRESELECT = 1;
export const STAGE_PENDING = 2;
export const STAGE_REVEALED = 3;

export const PRIZE_BRONZE = 1;
export const PRIZE_SILVER = 2;
export const PRIZE_GOLD = 3;
export const PRIZE_SAPPHIRE = 4;
export const PRIZE_RUBY = 5;
export const PRIZE_JACKPOT = 6;

export const REWARD_NAMES = ['', 'Bronze Bag', 'Silver Bag', 'Golden Bag', 'Sapphire Blue Bag', 'Ruby Red Bag', 'Jackpot'];

export const getPrizeRate = (amountBet: number, amountWin: number) => {
  switch (Math.round(amountWin * 10 / amountBet)) {
    case 1: return PRIZE_BRONZE;
    case 5: return PRIZE_SILVER;
    case 20: return PRIZE_GOLD;
    case 50: return PRIZE_SAPPHIRE;
    case 100: return PRIZE_RUBY;
    default:
      if (amountWin > amountBet * 10) {
        return PRIZE_JACKPOT;
      }
  }
  return 0; // INVALID
}