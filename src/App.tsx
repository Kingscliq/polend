import { useAuthActions } from '@features/Auth/hooks/useAuthActions';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect } from 'react';
import Layout from './components/layout';
import AppRoutes from './components/router';
import { Translator } from 'react-translator-component';
import AlertModal from '@components/elements/Alert';

const App: React.FC<{}> = () => {
  const { account, library } = useWeb3React();
  const { setUser } = useAuthActions();

  useEffect(() => {
    if (account && library) {
      const user = { address: account, provider: library };
      setUser(user);
    }
    return () => { };
  }, [account, library, setUser]);

  return (
    <Translator>
      <Layout>
        <AlertModal />
        <AppRoutes />
      </Layout>
    </Translator>
  );
};

export default App;
