import axios from "axios";

export const getWBNBPrice = async () => {
    
    try {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&vs_currencies=usd',
      );
      
    const price = data['0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'].usd
      return price;
    } catch (error) {
      console.error('Failed to get WBNB price from CG.', error);
    }
  };