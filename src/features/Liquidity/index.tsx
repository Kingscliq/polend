import { useCallback, useEffect, useState } from 'react';
import AddLiquidity from './components/AddLiquidity';
import LiquidityList from './components/LiquidityList';
import RemoveLiquidity from './components/RemoveLiquidity';
import { T } from 'react-translator-component';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '@config/constants';
import getPrice from '@config/abi/GetPrice.json';
import {
  useReserveActions,
  useReserves,
} from '@features/Swap/hooks/useReserveActions';
import { getTokenPriceUsingAmount, toFixed } from '@utils/tifi';
import { useAuth } from '@features/Auth/hooks/useAuthActions';
import WalletConnector from '@components/widget/connect-wallet/wallet-connector';
import LiquidityWidget from './widgets/LiquidityWidget';
import { minABI } from '@config/TiFi_min_abi';
import { useLiquidity, useLiquidityActions } from './hooks/useLiquidityActions';
import { useAlertActions } from '@hooks/useAlert';

const Liquidity = () => {
  // for language translation
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  // states for toggling widgets
  const [addLiquidity, setAddLiquidity] = useState(false);
  const [removeLiquidity, setRemoveLiquidity] = useState(false);

  // states for live stuff
  const { address, provider } = useAuth();
  const { account } = useWeb3React();
  const { reserve0, reserve1 } = useReserves();
  const { setReserves } = useReserveActions();
  const { selectedCurrency, selectedCurrency1 } = useLiquidity();

  const { setAlert } = useAlertActions();

  const {
    setPrice0,
    setPrice1,
    setAllow1,
    setBalance,
    setBalance1,
    setPerPrice,
    setAllowPrice0,
    setAllowPrice1,
    setAllow0,
  } = useLiquidityActions();

  const getTokenReserves = useCallback(
    async (address0: any, address1: any) => {
      if (provider) {
        const signer = provider.getSigner();
        let contractPrice = new ethers.Contract(
          CONTRACT_ADDRESS.GET_PRICE_ADDRESS,
          getPrice.abi,
          signer,
        );
        if (address1 && address0 && address !== null) {
          try {
            const PriveVal = await contractPrice.getReserves(
              address0,
              address1,
            );
            const reserves = {
              reserve0: PriveVal[0] / 10 ** 18,
              reserve1: PriveVal[1] / 10 ** 18,
            };
            setReserves(reserves);
            console.log(reserves);
          } catch (error) {
            setAlert({
              message: 'CALL_EXCEPTION',
              type: 'error',
              url: {
                link: '',
                text: '',
              },
            });
          }
        }
      }
    },
    [provider, address, setReserves, setAlert],
  );

  const getBalance = useCallback(
    async (token: { address?: any; title?: any }, index: number) => {
      if (Object.keys(token).length === 0) {
        if (index === 0) {
          setBalance(0);
        } else {
          setBalance1(0);
        }
        return 0;
      }
      const signer = provider.getSigner();
      let contract = new ethers.Contract(token.address, minABI, signer);
      try {
        if (address != null) {
          const token0Bal = await contract.balanceOf(address);
          const token0Decimals = await contract.decimals();
          if (token.title === 'BNB') {
            const bnbBalbuf = await provider.getBalance(address);
            const balBNB = ethers.utils.formatUnits(bnbBalbuf, 'ether');
            if (index === 0) {
              setBalance(Number(balBNB));
            } else {
              setBalance1(Number(balBNB));
            }
            return Number(balBNB);
          } else {
            if (index === 0) {
              setBalance(Number(token0Bal._hex) / Number(10 ** token0Decimals));
            } else {
              setBalance1(
                Number(token0Bal._hex) / Number(10 ** token0Decimals),
              );
            }
            return Number(token0Bal._hex) / Number(10 ** token0Decimals);
          }
        } else {
          return 0;
        }
      } catch (error) {
        return 0;
      }
    },
    [address, provider, setBalance, setBalance1],
  );

  const getPerPrice = useCallback(
    (reserve0: number, reserve1: number) => {
      const perPrice0 = getTokenPriceUsingAmount(reserve0, reserve1, 1);
      const perPrice1 = getTokenPriceUsingAmount(reserve1, reserve0, 1);
      setPerPrice([toFixed(perPrice0), toFixed(perPrice1)]);
    },
    [setPerPrice],
  );

  const checkAllowance = useCallback(
    async (address0: string, address1: string) => {
      if (
        Object.keys(selectedCurrency).length === 0 ||
        Object.keys(selectedCurrency1).length === 0
      ) {
        setAllow0(false);
        setAllow1(false);
        setAllowPrice0(0);
        setAllowPrice1(1);
        return;
      }
      const signer = provider.getSigner();
      if (selectedCurrency.title === 'BNB') {
        setAllow0(false);
        setAllowPrice0(0);
      } else {
        let contract0 = new ethers.Contract(address0, minABI, signer);
        const allow_price0 = await contract0.allowance(
          address,
          CONTRACT_ADDRESS.ROUTER_ADDRESS,
        );
        setAllowPrice0(allow_price0 / 10 ** 18);
      }
      if (selectedCurrency1.title === 'BNB') {
        setAllow1(false);
        setAllowPrice1(0);
      } else {
        let contract1 = new ethers.Contract(address1, minABI, signer);

        const allow_price1 = await contract1.allowance(
          address,
          CONTRACT_ADDRESS.ROUTER_ADDRESS,
        );
        setAllowPrice1(allow_price1 / 10 ** 18);
      }
    },
    [
      address,
      provider,
      selectedCurrency,
      selectedCurrency1,
      setAllow0,
      setAllow1,
      setAllowPrice0,
      setAllowPrice1,
    ],
  );

  useEffect(() => {
    const getData = async () => {
      setPrice0('0');
      setPrice1('0');
      setAllow0(false);
      setAllow1(false);
      await getBalance(selectedCurrency, 0);
      await getBalance(selectedCurrency1, 1);
      await getTokenReserves(
        selectedCurrency.address,
        selectedCurrency1.address,
      );
      await checkAllowance(selectedCurrency.address, selectedCurrency1.address);
      getPerPrice(reserve0, reserve1);
    };
    if (address && provider) {
      getData();
    }
  }, [
    address,
    provider,
    reserve0,
    reserve1,
    checkAllowance,
    getBalance,
    getTokenReserves,
    selectedCurrency,
    selectedCurrency1,
    setPrice0,
    setPrice1,
    setAllow0,
    setAllow1,
    getPerPrice,
  ]);

  // const handleTooltipClose = () => {
  //   setCopy(false);
  // };

  return (
    <div className="container w-full md:w-[558px] mx-auto">
      <div className="mb-10">
        <h1 className="text-white text-2xl font-semibold mb-3">
          {T('Your Liquidity')}
        </h1>
        <p className="text-neutral-black-0 text-sm">
          Provide liquidity to earn transaction fees.
        </p>
      </div>
      {account ? (
        <div>
          {addLiquidity ? (
            <AddLiquidity back={() => setAddLiquidity(false)} />
          ) : removeLiquidity ? (
            <RemoveLiquidity back={() => setRemoveLiquidity(false)} />
          ) : (
            <div>
              <LiquidityList
                showRemove={() => setRemoveLiquidity(true)}
                showAdd={() => setAddLiquidity(true)}
              />
            </div>
          )}
        </div>
      ) : (
        <LiquidityWidget>
          <div className="text-center mb-10">
            <span className="text-neutral-black-0 text-sm">
              {T('Connect to a wallet to add liquidity.')}
            </span>
          </div>
          <WalletConnector />
        </LiquidityWidget>
      )}
    </div>
  );
};

export default Liquidity;
