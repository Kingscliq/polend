
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector, WalletConnectConnectorArguments } from "@web3-react/walletconnect-connector";
import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers";
import { BloctoConnector } from "@blocto/blocto-connector";
import { ConnectorNames } from "./config";
import { BscConnector } from '@binance-chain/bsc-connector';
import { CHAIN_ID } from '../../../config/constants';
import BitkeepConnector from './BitkeepConnector';

const POLLING_INTERVAL = 12000;
// const rpcUrl = getNodeUrl();
const rpcUrl = "https://mainnet.infura.io/v3/007a9f0a933c4e03b5ab7cc9ad4928cb";

const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 80001] });
const walletconnect = new WalletConnectConnector({
    rpcUrl: rpcUrl,
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
} as WalletConnectConnectorArguments);

const bscConnector = new BscConnector({ supportedChainIds: [CHAIN_ID] });
const bitkeepConnector = new BitkeepConnector({ supportedChainIds: [CHAIN_ID] });
const bloctoConnector = new BloctoConnector({ chainId: CHAIN_ID, rpc: rpcUrl } as any);
// https://mainnet.infura.io/v3/007a9f0a933c4e03b5ab7cc9ad4928cb
const walletLinkConnector = new WalletLinkConnector({
    rpc: rpcUrl,
    appName: "Polend",
    supportedChainIds: [1, 3, 4, 5, 42, 80001],
    url: `https://mainnet.infura.io/v3/007a9f0a933c4e03b5ab7cc9ad4928cb`,
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