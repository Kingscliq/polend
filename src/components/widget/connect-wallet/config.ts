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

