import { CHAIN_ID, TIFI_ADDRESS } from "@config/constants";
import axios from "axios";

export const circulationSupply = async () => {
    try {
        const { data } = await axios.get("https://tifi.net/api/tifi_circulation_supply")
        return data;

    } catch (error) {
        console.error('Failed to get APY data', error);
    }
};

// https://www.covalenthq.com/docs/api/#get-/v1/{}/tokens/{address}/token_holders/
export const getTotalHolders = async () => {
    try {
        // const { data } = await axios.get("https://bscscan.com/token/0x17E65E6b9B166Fb8e7c59432F0db126711246BC0 ")
        const { data } = await axios.get(`https://api.covalenthq.com/v1/${CHAIN_ID}/tokens/${TIFI_ADDRESS}/token_holders/?key=ckey_f1edb8904264443daf6b3707825`)
        // const lines = data.split('\n').slice(-91);
        console.log(data)
        return data;
    } catch (error) {
        console.error('Failed to get APY data', error);
    }
};