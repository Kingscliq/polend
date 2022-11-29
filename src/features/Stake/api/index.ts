import { Tvl } from '@/types/Tvl';
import axios from 'axios'

export const getStakApy = async () => {
    let apr = [];
    try {
        const { data } = await axios.get("https://tifi.net/api/dex/stake_stats")
        const lines = data.split('\n').slice(-91);
        let k = 1;
        while (lines[lines.length - k].trim().length <= 0) k++
        apr = lines.slice(0, lines.length - k + 1).map((item: string) => {
            let obj = item.split(',');
            return { timestamp: Number(obj[0]), tifiApy: 100 * Number(obj[1]), wbnbApy: 100 * Number(obj[2]) };
        })
        return apr
    } catch (error) {
        console.error('Failed to get APY data', error);
    }
};

export const getTvl = async () => {
    let tvl: Tvl = {
        pairs: [],
        stakes: [],
        tifi_price: 0,
        total_tvl: 0
    };
    try {
        const response = await axios.get("https://tifi.net/api/dex/tvl");
        tvl = response.data
    } catch (error) {
        console.error('Failed to get TVL', error);
    }
    return tvl
}

export const getTiFiPrice = async () => {
    let price = 0;
    try {
        let response = await axios.get(
            "https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=0x17e65e6b9b166fb8e7c59432f0db126711246bc0&vs_currencies=usd"
        );
        let data = response.data
        price = data["0x17e65e6b9b166fb8e7c59432f0db126711246bc0"].usd;
        return price
    } catch (error) {
        console.error('Failed to get TIFI price from CG.', error);
    }

    if (price <= 0) {
        // Fallback to tifi.net call
        try {
            let response = await axios.get("https://tifi.net/api/dex/tvl");
            let data = response.data
            price = data['tifi_price'];
        } catch (error) {
            console.error('Failed to get TIFI price from local.', error);
        }
    }
}
