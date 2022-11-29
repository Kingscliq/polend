import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';
import { ethers } from 'ethers';
import Button from '../../components/elements/Button';
import SwapCard from './components/SwapCard';
import TifiChart from '@components/widget/Chart';
import SwapWidget from './widgets/SwapWidget';
import { ChartTab } from '@components/elements/ChartTab';
import { SelectedProps } from '@components/elements/DropdownModal';
import { BSC_SCAN_URL, CONTRACT_ADDRESS, TOKENS } from '@config/constants';
import { useQuery } from '@tanstack/react-query';
import { getChartData } from '@utils/helpers';
import { chartOptions } from '@utils/chartOptions';
import { useAuth } from '@features/Auth/hooks/useAuthActions';
import { T } from 'react-translator-component';
import {
  calculatePriceImpact,
  getErrorMessage,
  getSwapPath,
  getTokenPath,
  getTokenPriceUsingAmount,
  toFixed,
  tokenMap,
} from '@utils/tifi';
import getNodeUrl from '@components/widget/connect-wallet/getRpcUrl';
import getPrice from '@config/abi/GetPrice.json';
import RouterABI from '@config/abi/TiFiRouter.json';
import { minABI } from '@config/TiFi_min_abi';
import { useReserveActions, useReserves } from './hooks/useReserveActions';
import ConnectWallet from '@components/widget/connect-wallet';
import SwapSummary from '@features/Stake/widgets/SwapSummary';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { useAlertActions } from '@hooks/useAlert';

type ChartData = {
  id: number;
  title: string;
  day: number;
  interval: string;
};

const Swap = () => {
  // for language translation
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  const [balance, setBalance] = useState(0);
  const [balance1, setBalance1] = useState<number>(0);
  const [price0, setPrice0] = useState<any>('');
  const [price1, setPrice1] = useState<any>('');
  // const [reserve0, setReserve0] = useState<any>('')
  // const [reserve1, setReserve1] = useState<any>('')
  // const [token_index, setTokenIndex] = useState(0);
  const [reserve_available, setReserveAvailable] = useState(false);
  const [balance_avaliable, setBalanceAvailable] = useState(false);
  const [status, setStatus] = useState(false);
  const [perPrice, setPerPrice] = useState<number[]>([]);
  // const [refresh, setRefresh] = useState<boolean>(false);
  // const [hoverOnSwitch, setHoverOnSwitch] = useState(false);
  // const [settingModal, setSettingModal] = useState(false);
  const [priceImpact, setPriceImpact] = useState<any>('');
  const [swapPath, setSwapPath] = useState<any[]>([]);
  const [extraReserve, setExtraReserve] = useState<number[]>([]);

  const [activeChartTab, setActiveChartTab] = useState<string>('24h');
  const [selectedCurrency, setSelectedCurrency] = useState<SelectedProps>(
    TOKENS[0],
  );
  const [selectedCurrency1, setSelectedCurrency1] = useState<SelectedProps>(
    TOKENS[2],
  );
  const [openConnectModal, setOpenConnectModal] = useState<boolean>(false);

  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    {
      name: 'series-1',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ]);

  // Append more configurations for Chats
  _.setWith(chartOptions, 'fill.colors', ['#005bcf']);
  _.setWith(chartOptions, 'markers.colors', ['#ccc']);
  _.setWith(chartOptions, 'stroke.colors', ['#fff']);
  _.setWith(chartOptions, 'markers.strokeColors', ['#fff']);

  const tabs: ChartData[] = useMemo(
    () => [
      { id: 1, title: '24H', day: 1, interval: 'hourly' },
      { id: 2, title: '7D', day: 7, interval: 'hourly' },
      { id: 3, title: '14D', day: 14, interval: 'daily' },
      { id: 4, title: '30D', day: 30, interval: 'daily' },
      { id: 5, title: '1Y', day: 365, interval: 'daily' },
    ],
    [],
  );

  // Get the activeTab Object
  const getActiveChartTab = useCallback(() => {
    return tabs.find(
      (activeTab) => activeChartTab.toLocaleUpperCase() === activeTab.title,
    );
  }, [activeChartTab, tabs]);

  const { address, provider } = useAuth();
  const { reserve0, reserve1 } = useReserves();
  const { setReserves } = useReserveActions();
  const activeChart = getActiveChartTab();
  const { setAlert } = useAlertActions();
  console.log(reserve_available, balance_avaliable);

  // Fetch Chart Data
  const { data: prices } = useQuery(
    ['chart-data', selectedCurrency, selectedCurrency1, activeChart],
    () =>
      getChartData(
        selectedCurrency,
        selectedCurrency1,
        activeChart?.day,
        activeChart?.interval,
      ),
  );

  // Handle Input Change
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: any) => {
    if (e.target.value === '' || e.target.value === '0') {
      index === 0 ? setPrice1('') : setPrice0('');
    }
    const rgx = /^[0-9]*(\.\d{0,9})?$/;
    let result = e.target.value.toString().match(rgx);
    if (!result) {
      return;
    }

    let tmpValue2 = result[0];

    if (tmpValue2[0] === '0') {
      if (tmpValue2.length < 2) {
        console.log(tmpValue2[1]);
      } else {
        if (tmpValue2[1] === '.') {
          console.log(tmpValue2[1]);
        } else {
          tmpValue2 = tmpValue2.substring(1);
        }
      }
    }

    if (index === 0) {
      setPrice0(tmpValue2);
      getTokenPrices(selectedCurrency.address, tmpValue2);
      let balanceBuf = balance;
      if (selectedCurrency.title === 'BNB') {
        balanceBuf -= 0.01;

        // console.log(balanceBuf)
      }
      if (Number(tmpValue2) > balanceBuf) {
        // console.log(tmpValue2, reserve0 * 0.9)
        setBalanceAvailable(false);
      } else {
        setBalanceAvailable(true);
        if (Number(tmpValue2) > reserve0 * 0.9) {
          // console.log(reserve0)
          setReserveAvailable(false);
        } else {
          setReserveAvailable(true);
        }
      }
    } else {
      setPrice1(tmpValue2.toString());
      let token0AmountBuf = getTokenPrices(
        selectedCurrency1.address,
        tmpValue2,
      );
      console.log(token0AmountBuf);
      let balanceBuf = balance;
      if (selectedCurrency.title === 'BNB') {
        balanceBuf -= 0.01;
      }
      if (token0AmountBuf > balanceBuf) {
        setBalanceAvailable(false);
      } else {
        setBalanceAvailable(true);
        if (token0AmountBuf > reserve0 * 0.9) {
          setReserveAvailable(false);
        } else {
          setReserveAvailable(true);
        }
      }
    }
    getPerPrice(reserve0, reserve1);
  };

  // Get Per price
  const getPerPrice = useCallback(
    (reserve0: any, reserve1: any, reserve2?: any, reserve3?: any) => {
      const route = getTokenPath(
        selectedCurrency.title,
        selectedCurrency1.title,
      );
      let perPrice0 = getTokenPriceUsingAmount(reserve0, reserve1, 1);
      let perPrice1;
      if (route.length === 2) {
        perPrice1 = getTokenPriceUsingAmount(reserve1, reserve0, 1);
      } else {
        perPrice0 = getTokenPriceUsingAmount(
          reserve2 ? reserve2 : extraReserve[0],
          reserve3 ? reserve3 : extraReserve[1],
          perPrice0,
        );
        perPrice1 = getTokenPriceUsingAmount(
          reserve3 ? reserve3 : extraReserve[1],
          reserve2 ? reserve2 : extraReserve[0],
          1,
        );
        perPrice1 = getTokenPriceUsingAmount(reserve1, reserve0, perPrice1);
      }
      setPerPrice([toFixed(perPrice0), toFixed(perPrice1)]);
    },
    [extraReserve, selectedCurrency.title, selectedCurrency1.title],
  );

  // Get Token Prices
  const getTokenPrices = (addresfrom: string | undefined, amount: any) => {
    if (amount <= 0 || isNaN(amount)) {
      if (
        amount === 0 ||
        (typeof amount === 'string' && amount.trim() === '0')
      ) {
        setPrice0(0);
        setPrice1(0);
      }
      return 0;
    }
    let route = getTokenPath(selectedCurrency.title, selectedCurrency1.title);
    if (addresfrom === selectedCurrency.address) {
      console.log('Reserves:');
      console.log(reserve0, reserve1);
      let token1AmountBuf;
      let highImpact = amount / reserve0 <= 10 && amount / reserve0 >= 0.1;
      if (route.length === 2) {
        token1AmountBuf = toFixed(
          getTokenPriceUsingAmount(reserve0, reserve1, amount),
        );
      } else {
        let bnbBuf = toFixed(
          getTokenPriceUsingAmount(reserve0, reserve1, amount),
        );
        token1AmountBuf = toFixed(
          getTokenPriceUsingAmount(extraReserve[0], extraReserve[1], bnbBuf),
        );
      }
      setPrice1(token1AmountBuf);
      setPriceImpact(
        calculatePriceImpact(
          token1AmountBuf / amount / perPrice[0],
          amount / token1AmountBuf / perPrice[1],
          highImpact,
        ),
      );
      return token1AmountBuf;
    } else {
      let token0AmountBuf;
      let highImpact = amount / reserve1 <= 10 && amount / reserve1 >= 0.1;
      if (route.length === 2) {
        token0AmountBuf = toFixed(
          getTokenPriceUsingAmount(reserve1, reserve0, amount),
        );
      } else {
        let bnbBuf = toFixed(
          getTokenPriceUsingAmount(extraReserve[1], extraReserve[0], amount),
        );
        token0AmountBuf = toFixed(
          getTokenPriceUsingAmount(reserve1, reserve0, bnbBuf),
        );
      }
      setPrice0(token0AmountBuf);
      setPriceImpact(
        calculatePriceImpact(
          token0AmountBuf / amount / perPrice[1],
          amount / token0AmountBuf / perPrice[0],
          highImpact,
        ),
      );
      return token0AmountBuf;
    }
  };

  // Get Token Reserves
  const getTokenReserves = React.useCallback(
    async (address0: any, address1: any) => {
      let route = getTokenPath(selectedCurrency.title, selectedCurrency1.title);
      let _provider = provider
        ? provider.getSigner()
        : new ethers.providers.JsonRpcProvider(getNodeUrl());
      let contractPrice = new ethers.Contract(
        CONTRACT_ADDRESS.GET_PRICE_ADDRESS,
        getPrice.abi,
        _provider,
      );

      let r0, r1, r2, r3;
      if (address1 && address0) {
        try {
          if (route.length === 2) {
            console.log('Routes', route);
            setExtraReserve([]);
            console.log('Reserve Values Before:');
            console.log(address0, address1);
            const val = await contractPrice.getReserves(address0, address1);
            // const val3 = await contractPrice.address
            // console.log("Reserve Values:", val3)
            r0 = val[0] / 10 ** 18;
            r1 = val[1] / 10 ** 18;

            console.log('Reserve0: ', r0, 'Reserve1: ', r1);
            const reserves = {
              reserve0: r0,
              reserve1: r1,
            };

            console.log(reserves);
            setReserves(reserves);
            // dispatch(fuseActions.getReserves(r0, r1));
          } else if (route.length === 3) {
            const rVal1 = await contractPrice.getReserves(
              address0,
              tokenMap.get('BNB'),
            );
            const rVal2 = await contractPrice.getReserves(
              tokenMap.get('BNB'),
              address1,
            );
            r0 = rVal1[0] / 10 ** 18;
            r1 = rVal1[1] / 10 ** 18;
            r2 = rVal2[0] / 10 ** 18;
            r3 = rVal2[1] / 10 ** 18;

            setReserves({ reserve0: r0, reserve1: r1 });
            // setReserve0(r0)
            // setReserve1(r1)
            // dispatch(fuseActions.getReserves(r0, r1));
            setExtraReserve([r2, r3]);
          } else {
            setAlert({
              message: 'CALL_EXCEPTION',
              type: 'error',
              url: {
                link: '',
                text: '',
              },
            });
          }
          getPerPrice(r0, r1, r2, r3);
        } catch (error: any) {
          const supplyError = error?.error
            ? error.error
            : getErrorMessage(error);
          setAlert({
            message: supplyError,
            type: 'error',
            url: {
              link: '',
              text: '',
            },
          });
        }
      }
    },
    [
      getPerPrice,
      provider,
      selectedCurrency.title,
      selectedCurrency1.title,
      setAlert,
      setReserves,
    ],
  );

  // Get Balance
  const getBalance = React.useCallback(
    async (token: SelectedProps, index: number) => {
      // const providers = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        token.address as string,
        minABI,
        signer,
      );
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
    [address, provider],
  );

  // Handle Swap
  const handleSwap = async () => {
    setStatus(true);
    const signer = provider.getSigner();
    let contractPrice = new ethers.Contract(
      CONTRACT_ADDRESS.ROUTER_ADDRESS,
      RouterABI.abi,
      signer,
    );

    let contract0 = new ethers.Contract(
      selectedCurrency.address as string,
      minABI,
      signer,
    );
    let dateInAWeek = new Date();
    const deadline = Math.floor(dateInAWeek.getTime() / 1000) + 1000000;

    try {
      if (address != null) {
        if (selectedCurrency.title === 'BNB') {
          try {
            let tx =
              await contractPrice.swapExactETHForTokensSupportingFeeOnTransferTokens(
                0,
                [selectedCurrency.address, selectedCurrency1.address],
                address,
                deadline,
                {
                  value: ethers.utils.parseUnits(
                    Number(price0).toString(),
                    'ether',
                  )._hex,
                },
              );

            setAlert({
              message: 'Transaction Submitted!',
              type: 'notice',
              url: {
                link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
                text: 'Check Transaction on BSCScan',
              },
            });
            await tx.wait();
            setPrice0(0);
            setPrice1(0);

            setAlert({
              message: 'Swap Success!',
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
            setStatus(false);
          } catch (error: any) {
            setPrice0(0);
            setPrice1(0);
            const supplyError = error?.error
              ? error.error
              : getErrorMessage(error);
            setAlert({
              message: supplyError,
              type: 'error',
              url: {
                link: '',
                text: '',
              },
            });

            console.log(error);
            console.log(supplyError);
            setStatus(false);
          }
        } else {
          if (selectedCurrency1.title === 'BNB') {
            try {
              let _amount;
              if (Number(price0) < 100) {
                _amount = (Number(price0) * 10 ** 18).toString();
              } else {
                _amount = parseInt(price0).toString() + '000000000000000000';
              }
              const PriveVal = await contract0.allowance(
                address,
                CONTRACT_ADDRESS.ROUTER_ADDRESS,
              );
              let tx: { wait: () => void; hash: string };

              if (Number(PriveVal._hex) / 10 ** 18 < Number(price0)) {
                tx = await contract0.approve(
                  CONTRACT_ADDRESS.ROUTER_ADDRESS,
                  '1000000000000000000000000000000000000',
                );
                tx.wait();
                let _interVal = setInterval(async () => {
                  const PriveValBuf = await contract0.allowance(
                    address,
                    CONTRACT_ADDRESS.ROUTER_ADDRESS,
                  );
                  if (Number(PriveValBuf._hex) / 10 ** 18 > Number(price0)) {
                    clearInterval(_interVal);
                    setStatus(false);

                    setAlert({
                      message: 'Approved, now you can swap!',
                      type: 'success',
                      url: {
                        link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
                        text: 'Check Transaction on BSCScan',
                      },
                    });
                  }
                }, 10000);

                setAlert({
                  message: 'Approval Request submitted. Please hold on.',
                  type: 'notice',
                  url: {
                    link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
                    text: 'Check Transaction on BSCScan',
                  },
                });
                return;
              } else {
                tx =
                  await contractPrice.swapExactTokensForETHSupportingFeeOnTransferTokens(
                    _amount,
                    0,
                    [selectedCurrency.address, selectedCurrency1.address],
                    address,
                    deadline,
                  );
                setAlert({
                  message: 'Transaction Submitted!',
                  type: 'notice',
                  url: {
                    link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
                    text: 'Check Transaction on BSCScan',
                  },
                });

                await tx.wait();
              }
              setPrice0(0);
              setPrice1(0);
              setAlert({
                message: 'Swap Success!',
                type: 'notice',
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
              setStatus(false);
            } catch (error: any) {
              setPrice0(0);
              setPrice1(0);

              const supplyError = error?.error
                ? error.error
                : getErrorMessage(error);
              setAlert({
                message: supplyError,
                type: 'error',
                url: {
                  link: '',
                  text: '',
                },
              });

              console.log({ supplyError }, { error });

              setStatus(false);
            }
          } else {
            try {
              let _amount;
              if (Number(price0) < 100) {
                _amount = (Number(price0) * 10 ** 18).toString();
              } else {
                _amount = parseInt(price0).toString() + '000000000000000000';
              }
              const PriveVal = await contract0.allowance(
                address,
                CONTRACT_ADDRESS.ROUTER_ADDRESS,
              );
              let tx: { wait: () => void; hash: string };
              if (Number(PriveVal._hex) / 10 ** 18 < Number(price0)) {
                tx = await contract0.approve(
                  CONTRACT_ADDRESS.ROUTER_ADDRESS,
                  '1000000000000000000000000000000000000',
                );
                tx.wait();
                let _interVal = setInterval(async () => {
                  const PriveValBuf = await contract0.allowance(
                    address,
                    CONTRACT_ADDRESS.ROUTER_ADDRESS,
                  );
                  if (Number(PriveValBuf._hex) / 10 ** 18 > Number(price0)) {
                    clearInterval(_interVal);
                    setStatus(false);
                    setAlert({
                      message: T('Approved, now you can swap!'),
                      type: 'success',
                      url: {
                        link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
                        text: 'Check Transaction on BSCScan',
                      },
                    });
                  }
                }, 10000);

                setAlert({
                  message: 'Approval Request Submitted. Please hold on.',
                  type: 'success',
                  url: {
                    link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
                    text: 'Check Transaction on BSCScan',
                  },
                });

                return;
              } else {
                tx =
                  await contractPrice.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                    _amount,
                    0,
                    getSwapPath(selectedCurrency, selectedCurrency1),
                    address,
                    deadline,
                  );
                setAlert({
                  message: 'Transaction Submitted!',
                  type: 'notice',
                  url: {
                    link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
                    text: 'Check Transaction on BSCScan',
                  },
                });
                await tx.wait();
              }
              setPrice0(0);
              setPrice1(0);

              setAlert({
                message: 'Swap Success!',
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
              setStatus(false);
            } catch (error: any) {
              setPrice0(0);
              setPrice1(0);

              const supplyError = error?.error
                ? error.error
                : getErrorMessage(error);

              console.log({ supplyError }, { error });
              setAlert({
                message: supplyError,
                type: 'error',
                url: {
                  link: '',
                  text: '',
                },
              });
              setStatus(false);
            }
          }
        }
      }
    } catch (error: any) {
      setPrice0(0);
      setPrice1(0);
      const supplyError = error?.error ? error.error : getErrorMessage(error);
      setAlert({
        message: supplyError,
        type: 'error',
        url: {
          link: '',
          text: '',
        },
      });
      setStatus(false);
    }
  };

  // Get Swap Fee
  const getSwapFee = () => {
    let fee = price0 / 500;
    if (extraReserve.length > 0) {
      fee *= 1.998;
    }
    return toFixed(fee);
  };

  // Get Per Price
  const price = useMemo(() => perPrice[1], [perPrice]);

  useEffect(() => {
    if (prices) {
      const tempSeries = [{ name: selectedCurrency1.title, data: prices }];
      console.log(tempSeries);
      setSeries(tempSeries as any);
    }
  }, [prices, selectedCurrency1.title]);

  useEffect(
    () => {
      const getData = async () => {
        await getBalance(selectedCurrency, 0);
        await getBalance(selectedCurrency1, 1);
      };
      setPrice0(0);
      setPrice1(0);
      setSwapPath(
        getTokenPath(selectedCurrency.title, selectedCurrency1.title),
      );
      getTokenReserves(selectedCurrency.address, selectedCurrency1.address);
      if (address && provider) {
        getData();
      } else {
        setBalance(0);
        setBalance1(0);
      }

      return () => { };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // address,
      // provider,
      selectedCurrency,
      selectedCurrency1,
      // getBalance,
      reserve0,
      reserve1,
    ],
  );

  const handleMax = async (index: number) => {
    if (index === 0) {
      setBalanceAvailable(true);
      if (selectedCurrency.title === 'BNB') {
        setPrice0(balance - 0.01 <= 0 ? 0 : balance - 0.01);

        if (balance - 0.01 > reserve0 * 0.9) {
          setReserveAvailable(false);
        } else {
          setReserveAvailable(true);
        }

        getTokenPrices(
          selectedCurrency.address,
          balance - 0.01 <= 0 ? 0 : balance - 0.01,
        );
      } else {
        setPrice0(balance);
        if (balance > reserve0 * 0.9) {
          setReserveAvailable(false);
        } else {
          setReserveAvailable(true);
        }
        getTokenPrices(selectedCurrency.address, balance);
      }
    } else if (index === 1) {
      let priceBuf;
      if (selectedCurrency1.title === 'BNB') {
        setPrice1(balance1 - 0.01 <= 0 ? 0 : balance1 - 0.01);
        priceBuf = getTokenPrices(
          selectedCurrency1.address,
          balance1 - 0.01 <= 0 ? 0 : balance1 - 0.01,
        );
      } else {
        setPrice1(balance1);
        priceBuf = getTokenPrices(selectedCurrency1.address, balance1);
      }
      if (selectedCurrency.title === 'BNB') {
        if (priceBuf > balance - 0.01) {
          setBalanceAvailable(false);
        } else {
          setBalanceAvailable(true);
        }
      } else {
        if (priceBuf > balance) {
          setBalanceAvailable(false);
        } else {
          setBalanceAvailable(true);
        }
      }
      if (priceBuf > reserve0 * 0.9) {
        setReserveAvailable(false);
      } else {
        setReserveAvailable(true);
      }
    }
  };

  return (
    <section className="py-8 relative">
      {openConnectModal && (
        <ConnectWallet modalClose={() => setOpenConnectModal(false)} />
      )}
      <div className="grid grid-cols-1 xl:grid-cols-9 gap-4">
        <div className="xl:col-span-5 h-fit p-5 bg-tifi-dark rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-medium text-xl">BNB/TIFI</h3>
            </div>
            <div>
              <ChartTab
                active={activeChartTab}
                setActive={setActiveChartTab}
                data={tabs}
              />
            </div>
          </div>
          <TifiChart
            type="line"
            options={chartOptions}
            series={series}
            setSeries={setSeries}
          />
        </div>

        <aside className="xl:col-span-4">
          <SwapWidget>
            {/* SELETED CURRENCY ONE */}
            <div className="mb-6">
              <SwapCard
                inputValue={isNaN(price0) ? 0 : price0}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                balance={Math.round(balance * 1000000000) / 1000000000 || 0}
                amount={0}
                fromText="From"
                handleInputChange={(e) => handleChange(e, 0)}
                handleMax={() => handleMax(0)}
              />
            </div>

            {/* SELETED CURRENCY TWO */}
            <div className="mb-4">
              <SwapCard
                inputValue={isNaN(price1) ? 0 : price1}
                selectedCurrency={selectedCurrency1}
                setSelectedCurrency={setSelectedCurrency1}
                balance={Math.round(balance1 * 1000000000) / 1000000000 || 0}
                amount={0}
                fromText={'To'}
                handleInputChange={(e) => handleChange(e, 1)}
                handleMax={() => handleMax(1)}
              />
            </div>
            <div className="flex items-center justify-between my-3">
              {!isNaN(priceImpact) && price0 > 0 && (
                <>
                  <div>
                    <h3 className="text-gray-400 text-sm">Price</h3>
                  </div>
                  <div>
                    {price && (
                      <p className="text-gray-400 text-sm">
                        {price} {selectedCurrency.title} per{' '}
                        {selectedCurrency1.title}{' '}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="mb-4">
              {address === '' && (
                <Button
                  disabled={
                    (!(price0 > 0) || priceImpact > 20) && address !== ''
                  }
                  label={'Connect Wallet'}
                  className="bg-primary rounded-lg text-white"
                  onClick={() => setOpenConnectModal(true)}
                  loading={status}
                />
              )}
              {address !== '' && (
                <Button
                  disabled={
                    (!(price0 > 0) || priceImpact > 20) && address !== ''
                  }
                  label={
                    priceImpact > 20
                      ? 'Insufficient Funds'
                      : priceImpact > 20
                        ? 'Enter Amount'
                        : 'Swap'
                  }
                  className="bg-primary rounded-lg text-white"
                  onClick={handleSwap}
                  loading={status}
                />
              )}
            </div>
          </SwapWidget>
          {/* 
          FIXME:
            1. Display different messages on the buttons
            2. Toggle between the summary display
            3. If all checks passes handleSwap should be called
          */}
          {price0 > 0 && (
            <SwapSummary
              tifi_fee={
                selectedCurrency.title === 'TIFI'
                  ? '2%'
                  : selectedCurrency1.title === 'TIFI'
                    ? '1%'
                    : ''
              }
              route={swapPath.join(' > ')}
              price_impact={
                isNaN(priceImpact)
                  ? ''
                  : `${priceImpact < 0.01 ? '< 0.01 %' : priceImpact + '%'}`
              }
              swap_fee={`${getSwapFee()} ${selectedCurrency.title}`}
            />
          )}
        </aside>
      </div>
    </section>
  );
};

export default Swap;
