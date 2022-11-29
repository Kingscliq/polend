import { toast } from "react-toastify";
import axios from 'axios'

const publicUrl = 'http://127.0.0.1:5173';

export const LS_KEY = "tifi_language";

export const fetchLocale = async (locale: string) => {
    const response = await fetch(`${publicUrl}/config/localization/${locale}.json`);
    const data = await response.json();
    return data;
};


// prices: [], market_caps: [], total_volumes: []
// Function to get Chart Data
export const getChartData =
    async (token0: any, token1: any, day: any, interval: any) => {
        let prices = [];
        try {
            if (token0.apiId === "bnb" || token1.apiId === "bnb") {
                const res = await axios(
                    `https://api.coingecko.com/api/v3/coins/${token0.apiId === "bnb" ? token1.apiId : token0.apiId
                    }/market_chart?vs_currency=bnb&days=${day}&interval=${interval}`
                );
                // return res.data;
                token1?.apiId !== "bnb" ? prices = res?.data?.prices.map((array: any) => [array[0], 1 / array[1]]) : prices = res?.data?.prices
                return prices;
            } else {
                const resp1 = await axios(`https://api.coingecko.com/api/v3/coins/${token0.apiId
                    }/market_chart?vs_currency=bnb&days=${day}&interval=${interval}`
                );
                const resp2 = await axios(`https://api.coingecko.com/api/v3/coins/${token1.apiId
                    }/market_chart?vs_currency=bnb&days=${day}&interval=${interval}`
                );
                prices = resp1?.data?.prices.map((array: any, i: number) => [array[0], array[1] / resp2?.data?.prices[i][1]]);
                return prices
            }
        } catch (error) {
            toast.error("Failed to get Chart Data! Please check your internet connection")
            // console.error('Failed to fetch chart data', error);
        }
    };

