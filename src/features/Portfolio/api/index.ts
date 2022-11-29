import axios from 'axios'

export interface Stats {
  jackpot_amount: number,
  jackpot_record: [],
  n_winners: number,
  top_winners: [][]
}

export const getLuckyBagsStats = async () => {
  let stats: Stats = {
    jackpot_amount: 0,
    jackpot_record: [],
    n_winners: 0,
    top_winners: []
  };
  try {
    const response = await axios.get("https://tifi.net/api/dex/luckybags");
    stats = response.data
    return stats
  } catch (error) {
    console.error('Failed to get Lucky Bags stats', error);
  }
}