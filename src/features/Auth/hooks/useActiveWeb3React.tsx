import { useWeb3React } from '@web3-react/core';

import { StaticJsonRpcProvider } from '@ethersproject/providers';
import getNodeUrl from '../../../components/widget/connect-wallet/getRpcUrl';
import { CHAIN_ID } from '../../../config/constants';
// import { CHAIN_ID } from '@//config/constants';
// import getNodeUrl from '@//components/widget/connect-wallet/getRpcUrl';

const RPC_URL = getNodeUrl();

export const simpleRpcProvider = new StaticJsonRpcProvider(RPC_URL);

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */

const useActiveWeb3React = () => {
  const { library, chainId, ...web3React } = useWeb3React();
  // console.log(CHAIN_ID, chainId)
  return {
    library: library || simpleRpcProvider,
    chainId: chainId ?? CHAIN_ID,
    ...web3React,
  };
};

export default useActiveWeb3React;
