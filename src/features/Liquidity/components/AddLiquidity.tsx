import { BounceLoader } from '@components/elements/Loaders';
import { BSC_SCAN_URL, CONTRACT_ADDRESS } from '@config/constants';
import { useAuth } from '@features/Auth/hooks/useAuthActions';
import SwapCard from '@features/Swap/components/SwapCard';
import {
  useReserveActions,
  useReserves,
} from '@features/Swap/hooks/useReserveActions';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import {
  extendToBigNumber,
  getErrorMessage,
  getTokenPriceUsingAmount,
  toFixed,
} from '@utils/tifi';
import { ethers } from 'ethers';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { T } from 'react-translator-component';
import { arrowLeft, plusIcon } from '../../../assets/icons';
import Button from '../../../components/elements/Button';
import {
  useLiquidity,
  useLiquidityActions,
} from '../hooks/useLiquidityActions';
import LiquidityWidget from '../widgets/LiquidityWidget';
import getPrice from '@config/abi/GetPrice.json';
import RouterABI from '@config/abi/TiFiRouter.json';
import { minABI } from '@config/TiFi_min_abi';
import { useAlertActions } from '@hooks/useAlert';

const AddLiquidity = ({ back }: any) => {
  // for language translation
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  const { address, provider } = useAuth();
  // const [enableTifi, setEnableTifi] = useState(false);
  const { reserve0, reserve1 } = useReserves();
  const { setReserves } = useReserveActions();
  const { setAlert } = useAlertActions();

  const {
    selectedCurrency,
    selectedCurrency1,
    price0,
    price1,
    balance,
    allowPrice0,
    allowPrice1,
    balance1,
    perPrice,
    allow0,
    allow1,
    availableBalance,
    status,
  } = useLiquidity();

  const {
    setSelectedCurrency,
    setAvailableBalance,
    setPrice0,
    setPrice1,
    setAllow1,
    setAllow0,
    setBalance,
    setBalance1,
    setPerPrice,
    setSelectedCurrency1,
    setStatus,
  } = useLiquidityActions();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: any) => {
    let tmpval: any = e.target.value ? e.target.value : 0;
    if (tmpval < 0 || isNaN(tmpval)) {
      tmpval = index === 0 ? price0 : price1;
    } else if (
      !(
        typeof tmpval === 'string' &&
        (tmpval.endsWith('.') || tmpval.startsWith('.'))
      )
    ) {
      tmpval = Number(e.target.value.toString());
    }

    if (index === 0) {
      if (tmpval > balance) {
        setAvailableBalance(false);
      } else {
        setAvailableBalance(true);
      }
      setPrice0(tmpval);
      setPrice1(toFixed((tmpval * reserve1) / reserve0));
      if (allowPrice0 > tmpval || selectedCurrency.title === 'BNB') {
        setAllow0(false);
      } else {
        setAllow0(true);
      }
      if (
        allowPrice1 > (tmpval * reserve1) / reserve0 ||
        selectedCurrency1.title === 'BNB'
      ) {
        setAllow1(false);
      } else {
        setAllow1(true);
      }
    } else {
      if (tmpval > balance1) {
        setAvailableBalance(false);
      } else {
        setAvailableBalance(true);
      }
      setPrice1(tmpval);
      setPrice0(toFixed((tmpval * reserve0) / reserve1));
      if (allowPrice1 > tmpval || selectedCurrency1.title === 'BNB') {
        setAllow1(false);
      } else {
        setAllow1(true);
      }
      if (
        allowPrice0 > (tmpval * reserve0) / reserve1 ||
        selectedCurrency.title === 'BNB'
      ) {
        setAllow0(false);
      } else {
        setAllow0(true);
      }
    }
  };

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
          } catch (error: any) {
            const reservesError = error?.error
              ? error.error
              : getErrorMessage(error);
            setAlert({
              message: reservesError,
              type: 'error',
              url: { link: '', text: '' },
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

  const getPerPrice = (reserve0: number, reserve1: number) => {
    const perPrice0 = getTokenPriceUsingAmount(reserve0, reserve1, 1);
    const perPrice1 = getTokenPriceUsingAmount(reserve1, reserve0, 1);
    setPerPrice([toFixed(perPrice0), toFixed(perPrice1)]);
  };

  const handleSupply = async () => {
    setStatus(true);
    const signer = provider.getSigner();
    let contractPrice = new ethers.Contract(
      CONTRACT_ADDRESS.ROUTER_ADDRESS,
      RouterABI.abi,
      signer,
    );
    let dateInAWeek = new Date();
    const deadline = Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
    if (address != null) {
      try {
        let tx: { hash: string; wait: () => any };
        if (selectedCurrency.title === 'BNB') {
          let _amount = extendToBigNumber(price1);
          tx = await contractPrice.addLiquidityETH(
            selectedCurrency1.address,
            _amount,
            0,
            0,
            address,
            deadline,
            {
              value: ethers.utils.parseUnits(Number(price0).toString(), 'ether')
                ._hex,
            },
          );
        } else if (selectedCurrency1.title === 'BNB') {
          let _amount = extendToBigNumber(price0);
          tx = await contractPrice.addLiquidityETH(
            selectedCurrency.address,
            _amount,
            0,
            0,
            address,
            deadline,
            {
              value: ethers.utils.parseUnits(Number(price1).toString(), 'ether')
                ._hex,
            },
          );
        } else {
          let _amount = extendToBigNumber(price0);
          let _amount1 = extendToBigNumber(price1);
          tx = await contractPrice.addLiquidity(
            selectedCurrency.address,
            selectedCurrency1.address,
            _amount,
            _amount1,
            0,
            0,
            address,
            deadline,
          );
        }
        setAlert({
          message: 'Transaction Submitted!',
          type: 'notice',
          url: {
            link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on BSCScan',
          },
        });

        await tx.wait();
        setPrice0('0');
        setPrice1('0');

        setAlert({
          message: 'Liquidity Provision Success!',
          type: 'success',
          url: {
            link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on BSCScan',
          },
        });

        await getBalance(selectedCurrency, 0);
        await getBalance(selectedCurrency1, 1);
        await getTokenReserves(
          selectedCurrency.address,
          selectedCurrency1.address,
        );
        getPerPrice(reserve0, reserve1);
        setStatus(false);
      } catch (error: any) {
        setPrice0('0');
        setPrice1('0');
        const supplyError = error?.error ? error.error : getErrorMessage(error);
        setAlert({
          message: supplyError,
          type: 'error',
          url: { link: '', text: '' },
        });
        setStatus(false);
      }
    }
  };

  const handleApprove = async (address: string, index: number) => {
    setStatus(true);
    try {
      const signer = provider.getSigner();
      let contract0 = new ethers.Contract(address, minABI, signer);

      let tx = await contract0.approve(
        CONTRACT_ADDRESS.ROUTER_ADDRESS,
        '1000000000000000000000000000000000000',
      );
      await tx.wait();
      setAlert({
        message: 'Approved! Now you can add liquidity.',
        type: 'success',
        url: {
          link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
          text: 'Check Transaction on BSCScan',
        },
      });

      if (index === 0) {
        setAllow0(false);
      } else {
        setAllow1(false);
      }
    } catch (error: any) {
      const approveError = error?.error ? error.error : getErrorMessage(error);
      setAlert({
        message: approveError,
        type: 'error',
        url: { link: '', text: '' },
      });
    }
    setStatus(false);
  };

  let sharePercent = (Number(price0) / (reserve0 + Number(price0))) * 100;
  sharePercent = isNaN(sharePercent) ? 0 : sharePercent;

  return (
    <>
      <LiquidityWidget>
        <section className="flex items-center mb-4">
          <img
            onClick={back}
            src={arrowLeft}
            className="cursor-pointer"
            alt="Tifi add liquidity"
          />
          <h2 className="ml-5 text-lg font-semibold text-white">
            {T('Add Liquidity')}
          </h2>
        </section>

        <div>
          <SwapCard
            inputValue={isNaN(Number(price0)) ? 0 : price0}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            balance={Math.round(balance * 1000000000) / 1000000000 || 0}
            amount={0}
            fromText={'From'}
            handleInputChange={(e) => handleChange(e, 0)}
          />
        </div>

        <div className="-my-2 relative z-50 rounded-full mx-auto h-10 w-10 bg-tifi-dark flex items-center justify-center">
          <div className="rounded-full h-6 w-6 bg-neutral-black-500 flex items-center justify-center">
            <img
              src={plusIcon}
              className="h-4 w-4 mt-[2px] ml-[2px] rounded-full"
              alt="plus icon"
            />
          </div>
        </div>

        <div className="mb-4">
          <SwapCard
            inputValue={isNaN(Number(price1)) ? 0 : price1}
            selectedCurrency={selectedCurrency1}
            setSelectedCurrency={setSelectedCurrency1}
            balance={Math.round(balance1 * 1000000000) / 1000000000 || 0}
            amount={0}
            fromText={'To'}
            handleInputChange={(e) => handleChange(e, 1)}
          />
        </div>
        <div>
          <p className="font-semibold text-[#CCCCD0] text-sm">
            {T('Price and pool share')}
          </p>
          <div className="grid lg:grid-cols-3 grid-cols-1 bg-neutral-black-600 bg-opacity-80 p-3 my-4 rounded-lg">
            <div className="text-neutral-black-0 lg:text-sm text-xs lg:text-center ">
              <span className="block mb-1 text-white">{perPrice[1]}</span>
              <span className="block">
                {selectedCurrency.title} {T('per')} {selectedCurrency1.title}
              </span>
            </div>

            <div className="text-neutral-black-0 lg:text-sm text-xs lg:text-center lg:my-0 my-4">
              <span className="block mb-1 text-white">{perPrice[0]}</span>
              <span className="block">
                {selectedCurrency1.title} {T('per')} {selectedCurrency.title}
              </span>
            </div>
            <div className="text-neutral-black-0 text-xs lg:text-sm lg:text-center">
              <span className="block mb-1 text-white">
                {sharePercent > 100
                  ? 100
                  : sharePercent < 0.01
                  ? '< 0.01'
                  : toFixed(sharePercent)}
                %
              </span>
              <span className="block">{T('Share of pool')}</span>
            </div>
          </div>
        </div>

        <div>
          {allow0 && availableBalance && (
            <Button
              onClick={() => handleApprove(selectedCurrency.address, 0)}
              label={`${T('Enable')} ${selectedCurrency.title}`}
              className="rounded-lg bg-neutral-black-600 text-neutral-black-0 mb-3"
            />
          )}

          {allow1 && availableBalance && (
            <Button
              onClick={() => handleApprove(selectedCurrency1.address, 1)}
              label={`${T('Enable')} ${selectedCurrency1.title}`}
              className="rounded-lg bg-neutral-black-600 text-neutral-black-0 mb-3"
            />
          )}

          <Button
            onClick={() => handleSupply()}
            label={
              !availableBalance ? (
                T('Insufficent balance')
              ) : status ? (
                <BounceLoader />
              ) : (
                T('Supply')
              )
            }
            className={`${
              status ? 'bg-primary/50' : 'bg-primary'
            } rounded-lg text-white`}
            disabled={
              allow0 ||
              allow1 ||
              !availableBalance ||
              Number(price0) <= 0 ||
              Number(price1) <= 0
            }
          />
        </div>
      </LiquidityWidget>

      {/* {enableTifi && (
        <div
          data-aos="fade-down"
          data-aos-duration="3000"
          className="bg-neutral-black-700 bg-opacity-80 mt-4 py-4 px-6 rounded-lg"
        >
          <h3 className="text-sm text-[#CCCCD0] font-medium">
            LP Token Breakdown
          </h3>

          <div className="flex items-center justify-between my-4 text-sm text-white">
            <div className="flex items-center">
              <img src={bnb} className="relative -mr-2" alt="BnB" />
              <img src={tifi} alt="tifi" />
              <span className="ml-3">BNB - TiFi</span>
            </div>
            <span>0.01233</span>
          </div>

          <div className="text-neutral-black-10 flex items-center justify-between mb-2 text-xs">
            <div className="flex items-center">
              <img src={bnb} className="mx-2" alt="tifi" />
              <span>BNB</span>
            </div>
            <span> 1 </span>
          </div>

          <div className="text-neutral-black-10 flex items-center justify-between mb-2 text-xs">
            <div className="flex items-center">
              <img src={tifi} className="mx-2" alt="tifi" />
              <span>TiFi</span>
            </div>
            <span> 4805070000 </span>
          </div>
        </div>
      )} */}
    </>
  );
};

export default AddLiquidity;
