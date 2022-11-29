// Set of helper functions to facilitate wallet setup

// import { nodes } from "@//components/widget/connect-wallet/getRpcUrl";
// import { ROOT_PATH, BSC_SCAN_URL, CHAIN_ID } from "@//config/constants";
import { toast } from "react-toastify";
import { nodes } from "../../../components/widget/connect-wallet/getRpcUrl";
import { BSC_SCAN_URL, CHAIN_ID } from "../../../config/constants";
/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
    const provider: any = window.ethereum;
    if (provider) {
        try {
            await provider?.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: `0x${CHAIN_ID.toString(16)}`,
                        chainName: "Binance Smart Chain Mainnet",
                        nativeCurrency: {
                            name: "BNB",
                            symbol: "bnb",
                            decimals: 18,
                        },
                        rpcUrls: nodes,
                        blockExplorerUrls: [`${BSC_SCAN_URL}/`],
                    },
                ],
            });
            return true;
        } catch (error) {
            toast.error('Failed to setup the network in Metamask:');
            console.error("Failed to setup the network in Metamask:", error);
            return false;
        }
    } else {
        toast.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
        return false;
    }
};

// /**
//  * Prompt the user to add a custom token to metamask
//  * @param tokenAddress
//  * @param tokenSymbol
//  * @param tokenDecimals
//  * @returns {boolean} true if the token has been added, false otherwise
//  */
// export const registerToken = async (
//     tokenAddress: any,
//     tokenSymbol: any,
//     tokenDecimals: any
// ) => {
//     const tokenAdded = await window.ethereum.request({
//         method: "wallet_watchAsset",
//         params: {
//             type: "ERC20",
//             options: {
//                 address: tokenAddress,
//                 symbol: tokenSymbol,
//                 decimals: tokenDecimals,
//                 image: `${ROOT_PATH}/images/tokens/${tokenAddress}.png`,
//             },
//         },
//     });

//     return tokenAdded;
// };