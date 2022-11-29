// import { metamask } from '@//assets/icons';
import {
  binance,
  bitkeep,
  brave,
  coin98,
  coinbase,
  mathWallet,
  metamask,
  portis,
  safepal,
  tokenPocket,
  trustWallet,
  walletConnect,
} from '../../../assets/icons/wallets';

export const ConnectorNames = {
  Injected: 'injected',
  WalletConnect: 'walletconnect',
  BSC: 'bsc',
  Blocto: 'blocto',
  WalletLink: 'walletlink',
  BitKeep: 'bitkeep',
  MetaMask: 'metamask'
};

export const connectors_data = [
  {
    title: 'Metamask',
    icon: metamask,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'Binance Chain',
    icon: binance,
    connectorId: ConnectorNames.BSC,
  },
  {
    title: 'Coin98',
    icon: coin98,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'Token Pocket',
    icon: tokenPocket,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'Coinbase',
    icon: coinbase,
    connectorId: ConnectorNames.WalletLink,
  },
  {
    title: 'Safepal',
    icon: safepal,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'Wallet Connect',
    icon: walletConnect,
    connectorId: ConnectorNames.WalletConnect,
  },
  {
    title: 'Trustwallet',
    icon: trustWallet,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'Brave',
    icon: brave,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'MathWallet',
    icon: mathWallet,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'Portis',
    icon: portis,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'Bitkeep',
    icon: bitkeep,
    connectorId: ConnectorNames.BitKeep,
  },
];

// export default connectors;
export const connectorLocalStorageKey = 'connectorId';

// import Metamask from "./icons/Metamask";
// import MathWallet from "./icons/MathWallet";
// import TokenPocket from "./icons/TokenPocket";
// import TrustWallet from "./icons/TrustWallet";
// import WalletConnect from "./icons/WalletConnect";
// import BinanceChain from "./icons/BinanceChain";
// import SafePalWallet from "./icons/SafePalWallet";
// import Coinbase from "./icons/Coinbase";
// import Blocto from "./icons/Blocto";
// import Bitkeep from "./icons/Bitkeep";

// export const ConnectorNames = {
//     Injected: "injected",
//     WalletConnect: "walletconnect",
//     BSC: "bsc",
//     Blocto: "blocto",
//     WalletLink: "walletlink",
//     BitKeep: "bitkeep",
// };

// export const connectors_data = [
//     {
//         title: "Metamask",
//         icon: Metamask,
//         connectorId: ConnectorNames.Injected,
//     },
//     {
//         title: "Trust Wallet",
//         icon: TrustWallet,
//         connectorId: ConnectorNames.Injected,
//     },
//     {
//         title: "MathWallet",
//         icon: MathWallet,
//         connectorId: ConnectorNames.Injected,
//     },
//     {
//         title: "TokenPocket",
//         icon: TokenPocket,
//         connectorId: ConnectorNames.Injected,
//     },
//     {
//         title: "WalletConnect",
//         icon: WalletConnect,
//         connectorId: ConnectorNames.WalletConnect,
//     },
//     {
//         title: "Binance Chain",
//         icon: BinanceChain,
//         connectorId: ConnectorNames.BSC,
//     },
//     {
//         title: "SafePal",
//         icon: SafePalWallet,
//         connectorId: ConnectorNames.Injected,
//     },
//     {
//         title: "Blocto",
//         icon: Blocto,
//         connectorId: ConnectorNames.Blocto,
//     },
//     {
//         title: "Coinbase",
//         icon: Coinbase,
//         connectorId: ConnectorNames.WalletLink,
//     },
//     {
//         title: "Bitkeep",
//         icon: Bitkeep,
//         connectorId: ConnectorNames.BitKeep,
//     },
// ];
