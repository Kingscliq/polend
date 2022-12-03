import { useCallback } from 'react';
import { UnsupportedChainIdError } from '@web3-react/core';
// import { NoBscxProviderError } from '@binance-chain/bsc-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector';
import useActiveWeb3React from './useActiveWeb3React';
import { toast } from 'react-toastify'
import { connectorsByName } from '../../../components/widget/connect-wallet/web3React';

const useAuthConnect = () => {
  const { activate, deactivate } = useActiveWeb3React();

  const login = useCallback(
    (config: { connectorId: any; title: any }) => {
      const connectorId = config.connectorId;
      const title = config.title;
      const connector = connectorsByName[connectorId];
      if (connector) activate(connector)
      // activate(connector as any, async (error: { name: any; message: any })
    },
    [activate]
  );

  const logout = useCallback(() => {
    deactivate();
  }, [deactivate]);

  return { login, logout };
};

export default useAuthConnect;
