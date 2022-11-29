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
// import { connectorsByName } from '@//components/widget/connect-wallet/web3React';
import { setupNetwork } from '../config/wallet';
// import { connectorLocalStorageKey } from '@//components/widget/connect-wallet/config';
import { toast } from 'react-toastify'
import { connectorsByName } from '../../../components/widget/connect-wallet/web3React';

const useAuthConnect = () => {
  const { activate, deactivate } = useActiveWeb3React();

  const login = useCallback(
    (config: { connectorId: any; title: any }) => {
      const connectorId = config.connectorId;
      const title = config.title;
      const connector = connectorsByName[connectorId];
      if (connector) {
        activate(connector as any, async (error: { name: any; message: any }) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork();
            if (hasSetup) {
              activate(connector as any);
            } else {
              // FIXME:Clear Current Connected Wallet
              // window.localStorage.removeItem(connectorLocalStorageKe);
              if (
                error instanceof NoEthereumProviderError
                // ||
                // error instanceof NoBscProviderError
              ) {
                console.log('Provider Erorr');
                toast.warn('Please install ' + title + ' extension and refresh the page.')
                // alert(
                //   'Please install ' + title + ' extension and refresh the page.'
                // );
              } else if (
                error instanceof UserRejectedRequestErrorInjected ||
                error instanceof UserRejectedRequestErrorWalletConnect
              ) {
                if (connector instanceof WalletConnectConnector) {
                  const walletConnector = connector;

                  (walletConnector.walletConnectProvider as any) = null;
                }
                toast.error('Authorization Error')
                console.log('Authorization Error');
              } else {
                toast.warn('Please check ' + title + ' extention and refresh page.')
                // alert('Please check ' + title + ' extention and refresh page.');
                console.log('error=', error.name, error.message);
              }
            }
          }
        }).then(res => console.log(res))
      } else {
        toast.error('Unable to Find Connector')
        console.log('Unable to find connector');
      }
    },
    [activate]
  );

  const logout = useCallback(() => {
    deactivate();
    // FIXME:use redux state to handle logout function
    // if (window.localStorage.getItem('walletconnect')) {
    //   connectorsByName.walletconnect.close();
    //   (connectorsByName.walletconnect.walletConnectProvider as any) = null;
    // }
  }, [deactivate]);

  return { login, logout };
};

export default useAuthConnect;
