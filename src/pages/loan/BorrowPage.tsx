import {
  BSC_SCAN_URL,
  CONTRACT_ADDRESS,
  PA_BORROW,
  TOKENS,
} from '@config/constants';
import { minABI } from '@config/TiFi_min_abi';
import getPrice from '@config/abi/GetPrice.json';
import LendingABI from '@config/abi/LendingPool.json';
import { useLoan, useLoanActions } from '@features/Loan/hooks/useLoanActions';
import { useAlertActions } from '@hooks/useAlert';
import {
  ACCOUNT_HEALTH,
  extendToBigNumber,
  getErrorMessage,
  toFixed,
} from '@utils/tifi';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { T } from 'react-translator-component';
import { arrowLeft, qMark } from '@assets/icons';
import TooltipComponent from '@components/elements/TooltipComponent';
import LiquidityWidget from '@features/Liquidity/widgets/LiquidityWidget';
import Notice from '@features/Stake/components/Notice';
import Deposit from '@features/Lottery/components/LotteryDeposit';
import Button from '@components/elements/Button';
import { BounceLoader } from '@components/elements/Loaders';

const BorrowPage = () => {
  const { account: address, library: provider } = useWeb3React();

  const { tokenAddress, tokenName, data, poolAction } = useLoan();
  const { setAlert } = useAlertActions();
  const { setPoolInfo } = useLoanActions();

  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState(false);
  const [quota, setQuota] = useState(0);
  const [price, setPrice] = useState(0);
  const [userQuota, setUserQuota] = useState(0);
  const [available, setAvailable] = useState(true);
  const [selectedToken, setSelectedToken] = useState<any>();

  const handleAddToken = async () => {
    if (!provider) {
      setAlert({
        message: T('Please connect to wallet first!'),
        type: 'error',
        url: { link: '', text: '' },
      });
      return;
    }
    try {
      let decimal;
      let contract;
      const signer = provider.getSigner();
      contract = new ethers.Contract(tokenAddress, minABI, signer);
      decimal = await contract.decimals();
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress,
            symbol: tokenName,
            decimals: decimal,
          },
        },
      });
      if (wasAdded) {
        setAlert({
          message: `${tokenName} ${T('successful added')}`,
          type: 'success',
          url: { link: '', text: '' },
        });
      } else {
        setAlert({
          message: `${tokenName} ${T('added failed')}`,
          type: 'error',
          url: { link: '', text: '' },
        });
      }
    } catch (error: any) {
      const tokenError = error?.error ? error.error : getErrorMessage(error);
      setAlert({
        message: tokenError,
        type: 'error',
        url: { link: '', text: '' },
      });
    }
  };

  const getQuota = useCallback(async () => {
    let tokenPrice = 1;
    if (tokenName !== 'WBNB') {
      try {
        const price = new ethers.Contract(
          CONTRACT_ADDRESS.GET_PRICE_ADDRESS,
          getPrice.abi,
          provider.getSigner(),
        );
        tokenPrice = await price.getTokenToBNBPrice(tokenAddress);
        tokenPrice = Number(ethers.utils.formatEther(tokenPrice));
      } catch (error: any) {
        const quotaError = error?.error ? error.error : getErrorMessage(error);
        setAlert({
          message: quotaError,
          type: 'error',
          url: { link: '', text: '' },
        });
      }
    }
    let quota = (data.maxBorrow - data.curBorrow) / tokenPrice;
    setPrice(tokenPrice);
    quota = quota < 0 ? 0 : quota;
    setUserQuota(quota);
    setQuota(quota > data.available ? data.available : quota);
  }, [
    data.available,
    data.curBorrow,
    data.maxBorrow,
    provider,
    setAlert,
    tokenAddress,
    tokenName,
  ]);

  const handleMax = async () => {
    setAvailable(true);
    setAmount(Number(quota));
  };

  const handleChange = (e: any) => {
    let tmpval = e.target.value ? e.target.value : 0;
    if (tmpval < 0 || isNaN(tmpval)) {
      tmpval = amount;
    } else if (
      !(
        typeof tmpval === 'string' &&
        (tmpval.endsWith('.') || tmpval.startsWith('.') || tmpval.endsWith('0'))
      )
    ) {
      tmpval = Number(e.target.value.toString());
    }
    setAvailable(tmpval <= quota);
    setAmount(tmpval);
  };

  const handleBorrow = async () => {
    setStatus(true);
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS.LENDING_POOL_ADDRESS,
        LendingABI.abi,
        provider.getSigner(),
      );
      const tx = await contract.borrow(tokenAddress, extendToBigNumber(amount));

      setAlert({
        message: 'Transaction Submitted!',
        type: 'notice',
        url: {
          link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
          text: 'Check Transaction on BSCScan',
        },
      });

      await tx.wait();

      setAlert({
        message: 'Borrow Success!',
        type: 'success',
        url: {
          link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
          text: 'Check Transaction on BSCScan',
        },
      });

      const _amount = Number(amount);
      const available = data.available - _amount,
        maxBorrow = Number(data.maxBorrow),
        curBorrow = Number(data.curBorrow) + _amount * price;
      const healthLevel =
        curBorrow > 0 && maxBorrow / curBorrow < 4
          ? Math.floor(maxBorrow / curBorrow)
          : 4;

      const info = {
        tokenName: tokenName,
        tokenAddress: tokenAddress,
        poolAction: PA_BORROW,
        data: {
          rate: data.rate,
          borrowed: data.borrowed + _amount,
          available,
          maxBorrow,
          curBorrow,
          healthLevel,
        },
      };
      setPoolInfo(info);

      setAmount(0);
      let quota = (maxBorrow - curBorrow) / price;
      quota = quota < 0 ? 0 : quota;
      setUserQuota(quota);
      setQuota((quota > available ? available : quota) * 0.99);
    } catch (error: any) {
      const borrowError = error.data ? error.data.message : error.message;
      setAlert({
        message: borrowError,
        type: 'error',
        url: { link: '', text: '' },
      });
    }
    setStatus(false);
  };

  useEffect(() => {
    if (address && provider && tokenAddress) {
      setAmount(0);
      getQuota();
    }
  }, [address, provider, tokenAddress, getQuota]);

  useEffect(() => {
    const setToken = () => {
      const token = TOKENS.find((currency) => currency.title === tokenName);
      setSelectedToken(token);
    };

    if (tokenName) {
      setToken();
    }
  }, [tokenName]);

  return (
    <div className="mb-10 transition-all ease-linear duration-300 container mx-auto">
      <div className="mb-10 flex items-center">
        <img
          className="cursor-pointer"
          src={arrowLeft}
          alt="back icon"
          onClick={() => {
            navigate(`/loan`, { replace: true });
          }}
        />
        <h1 className="ml-5 text-white"> Borrow Asset</h1>
      </div>

      {address && poolAction === PA_BORROW ? (
        <>
          <div className="mb-10 py-8 px-4 grid md:grid-cols-2 xl:grid-cols-4 gap-y-10 bg-neutral-black-500 rounded bg-gradient-to-r from-tifi-dark via-tifi-dark to-[#0027374a] bg-opacity-30 backdrop-blur-xl">
            <div className="w-fit mx-auto">
              <div className="flex items-center">
                <span className="text-white">{T('Debt')}</span>
                <TooltipComponent
                  content={
                    <div className="w-80">
                      {T(
                        'The balance of the amount of token you have borrowed.',
                      )}
                    </div>
                  }
                  // position="right"
                  children={<img src={qMark} alt="Create" />}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-white text-lg font-medium">
                  {toFixed(Number(data.borrowed))} {tokenName}
                </span>
              </div>
            </div>

            <div className="w-fit mx-auto">
              <div className="flex items-center">
                <span className="text-white">{T('Borrow Quota')}</span>
                <TooltipComponent
                  content={
                    <div className="w-80">
                      {T(
                        'The maxium value of assets you can borrow in the selected token.',
                      )}
                    </div>
                  }
                  // position="right"
                  children={<img src={qMark} alt="Create" />}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-white text-lg font-medium">
                  {toFixed(userQuota)} {tokenName}
                </span>
              </div>
            </div>

            <div className="w-fit mx-auto">
              <div className="flex items-center">
                <span className="text-white">{T('Pool Balance')}</span>
                <TooltipComponent
                  content={
                    <div className="w-80">
                      {T('The current balance in lending pool.')}
                    </div>
                  }
                  // position="right"
                  children={<img src={qMark} alt="Create" />}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-white text-lg font-medium">
                  {toFixed(Number(data.available))} {tokenName}
                </span>
              </div>
            </div>

            <div className="w-fit mx-auto">
              <div className="flex items-center">
                <span className="text-white">{T('Health Level')}</span>
                <TooltipComponent
                  content={
                    <div className="w-80">
                      {T(
                        'The health level of your account. You need pay attention to your health level all the time. If your health level is WARNING or UNHEALTHY, you need pay your debts as soon as possible. If health level is UNHEALTHY, you cannot borrow any assets from this platform.',
                      )}
                    </div>
                  }
                  // position="right"
                  children={<img src={qMark} alt="Create" />}
                />
              </div>
              <div className="text-center mt-2">
                <span
                  className={`health-${data.healthLevel} text-lg font-medium`}
                >
                  {ACCOUNT_HEALTH[data.healthLevel]}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[558px] mx-auto">
            <LiquidityWidget>
              {tokenName !== 'WBNB' && (
                <div className="mb-5">
                  <Notice
                    handleClose={function (
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ): void {
                      throw new Error('Function not implemented.');
                    }}
                    text={
                      <span>
                        {T(
                          'WBNB is the wrapper token of BNB, you can convert between BNB and WBNB without transaction fee at ',
                        )}
                        <a href={`/swap?action=1`} className="text-primary">
                          {T('here')}
                        </a>
                        .
                      </span>
                    }
                  />
                </div>
              )}
              <Deposit
                inputValue={amount === quota ? toFixed(Number(amount)) : amount}
                selectedCurrency={selectedToken}
                balance={toFixed(Number(quota))}
                handleInputChange={(e) => handleChange(e)}
                handleMax={() => handleMax()}
                fromText=""
              />

              <div className="mt-5 p-5 bg-neutral-black-400 flex items-center justify-between text-white rounded-lg">
                <span className="text-sm">Current Interest Rate:</span>
                <span>{toFixed(data.rate * 100)} %</span>
              </div>

              <Button
                onClick={() => handleBorrow()}
                className="text-white text-xs rounded-lg bg-gradient-to-r from-[#047CFD] to-primary mt-5"
                label={
                  !available ? (
                    T('Exceed the quota')
                  ) : status ? (
                    <BounceLoader />
                  ) : (
                    T('Borrow')
                  )
                }
                disabled={!available || status || amount === 0}
              />
            </LiquidityWidget>
          </div>
        </>
      ) : (
        <div className="w-full md:w-[558px] mx-auto">
          <LiquidityWidget>
            <span className="text-white">
              {T('Please go back to select an action you want to take.')}
            </span>
          </LiquidityWidget>
        </div>
      )}
    </div>
  );
};

export default BorrowPage;
