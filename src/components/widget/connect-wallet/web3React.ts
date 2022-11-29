
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector, WalletConnectConnectorArguments } from "@web3-react/walletconnect-connector";
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers";
// import BitkeepConnector from "./BitkeepConnector";
import { BloctoConnector } from "@blocto/blocto-connector";
// import { WalletLinkConnector } from "@web3-react/coinbase-wallet";
import getNodeUrl from "./getRpcUrl";
// import { CHAIN_ID } from "@//config/constants";
import { ConnectorNames } from "./config";
import { BscConnector } from '@binance-chain/bsc-connector';
import { CHAIN_ID } from '../../../config/constants';
import BitkeepConnector from './BitkeepConnector';

// const POLLING_INTERVAL = 12000;
// const rpcUrl = getNodeUrl();

// const injected = new InjectedConnector({ supportedChainIds: [CHAIN_ID] });
// const bloctoConnector = new BloctoConnector({ chainId: CHAIN_ID, rpc: rpcUrl as string });
// const coinbaseWallet = new WalletLinkConnector({ url: rpcUrl, supportedChainIds: [CHAIN_ID], appName: "Web3-react Demo" } as any);
// const walletconnect = new WalletConnectConnector({
//     rpc: { [CHAIN_ID]: rpcUrl },
//     qrcode: true,
//     pollingInterval: POLLING_INTERVAL,
// } as WalletConnectConnectorArguments);

// const metamask = new MetaMask({ supportedChainIds: [CHAIN_ID] } as any);
// // const bitkeepConnector = new BitkeepConnector({ supportedChainIds: [CHAIN_ID] });

// export const connectorsByName = {
//     [ConnectorNames.Injected]: injected,
//     [ConnectorNames.WalletConnect]: walletconnect,
//     [ConnectorNames.Blocto]: bloctoConnector,
//     [ConnectorNames.WalletLink]: coinbaseWallet,
//     [ConnectorNames.MetaMask]: metamask,
// };

// export const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) => {
//     const library = new Web3Provider(provider);
//     library.pollingInterval = POLLING_INTERVAL;
//     return library;
// };





// const POLLING_INTERVAL = 12000;
// const rpcUrl = getNodeUrl();

// const injected = new InjectedConnector({ supportedChainIds: [CHAIN_ID] });
// const walletconnect = new WalletConnectConnector({
//     rpc: { [CHAIN_ID]: rpcUrl },
//     qrcode: true,
//     pollingInterval: POLLING_INTERVAL,
// } as WalletConnectConnectorArguments);
// // const bscConnector = new BscConnector({ supportedChainIds: [CHAIN_ID] });
// // const bitkeepConnector = new BitkeepConnector({ supportedChainIds: [CHAIN_ID] });
// const bloctoConnector = new BloctoConnector({ chainId: CHAIN_ID, rpc: rpcUrl } as any);
// const walletLinkConnector = new WalletLinkConnector({
//     rpc: rpcUrl,
//     appName: "TiFiBank",
//     appLogoUrl: "https://tifi.net/img/logo192.png",
//     supportedChainIds: [CHAIN_ID]
// } as any);

// export const connectorsByName = {
//     [ConnectorNames.Injected]: injected,
//     [ConnectorNames.WalletConnect]: walletconnect,
//     // [ConnectorNames.BSC]: bscConnector,
//     [ConnectorNames.Blocto]: bloctoConnector,
//     // [ConnectorNames.BitKeep]: bitkeepConnector,
//     [ConnectorNames.WalletLink]: walletLinkConnector,
// };

// export const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) => {
//     const library = new Web3Provider(provider);
//     library.pollingInterval = POLLING_INTERVAL;
//     return library;
// };





// import getNodeUrl from "./getRpcUrl";
const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();

const injected = new InjectedConnector({ supportedChainIds: [CHAIN_ID] });
const walletconnect = new WalletConnectConnector({
    rpc: { [CHAIN_ID]: rpcUrl },
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
} as WalletConnectConnectorArguments);
const bscConnector = new BscConnector({ supportedChainIds: [CHAIN_ID] });
const bitkeepConnector = new BitkeepConnector({ supportedChainIds: [CHAIN_ID] });
const bloctoConnector = new BloctoConnector({ chainId: CHAIN_ID, rpc: rpcUrl } as any);

const walletLinkConnector = new WalletLinkConnector({
    rpc: rpcUrl,
    appName: "TiFiBank",
    appLogoUrl: "https://tifi.net/img/logo192.png",
    supportedChainIds: [CHAIN_ID]
} as any);

export const connectorsByName = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.WalletConnect]: walletconnect,
    [ConnectorNames.BSC]: bscConnector,
    [ConnectorNames.Blocto]: bloctoConnector,
    [ConnectorNames.BitKeep]: bitkeepConnector,
    [ConnectorNames.WalletLink]: walletLinkConnector,
};

export const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) => {
    const library = new Web3Provider(provider);
    library.pollingInterval = POLLING_INTERVAL;
    return library;
};