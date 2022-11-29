import {
  BSC_SCAN_URL,
  CONTRACT_ADDRESS,
  PA_DEPOSIT,
  TOKENS,
} from '@config/constants';
import { minABI } from '@config/TiFi_min_abi';
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
import React, { useCallback, useEffect, useState } from 'react';
import { T } from 'react-translator-component';
import LendingABI from '@config/abi/LendingPool.json';
import { useNavigate } from 'react-router-dom';
import LiquidityWidget from '@features/Liquidity/widgets/LiquidityWidget';
import { arrowLeft, qMark } from '@assets/icons';
import TooltipComponent from '@components/elements/TooltipComponent';
import Deposit from '@features/Lottery/components/LotteryDeposit';
import Notice from '@features/Stake/components/Notice';
import Button from '@components/elements/Button';
import { BounceLoader } from '@components/elements/Loaders';

const DepositPage = () => {
  const { account: address, library: provider } = useWeb3React();

  const navigate = useNavigate();

  const { tokenAddress, tokenName, data, poolAction } = useLoan();
  const { setAlert } = useAlertActions();
  const { setPoolInfo } = useLoanActions();

  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState<number | string>(0);
  const [availableBalance, setAvailableBalance] = useState(true);
  const [selectedToken, setSelectedToken] = useState<any>();
  const [status, setStatus] = useState(false);
  const [allowAmount, setAllowAmount] = useState<number | string>(0);

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

  const checkAllowance = useCallback(async () => {
    const contract = new ethers.Contract(
      tokenAddress,
      minABI,
      provider.getSigner(),
    );
    const allow = await contract.allowance(
      address,
      CONTRACT_ADDRESS.LENDING_POOL_ADDRESS,
    );
    setAllowAmount(ethers.utils.formatEther(allow));
  }, [address, provider, tokenAddress]);

  const handleApprove = async () => {
    setStatus(true);
    try {
      const contract = new ethers.Contract(
        tokenAddress,
        minABI,
        provider.getSigner(),
      );
      const tx = await contract.approve(
        CONTRACT_ADDRESS.LENDING_POOL_ADDRESS,
        '1000000000000000000000000000000000000',
      );
      await tx.wait();
      setAlert({
        message: 'Approved! Now you can deposit.',
        type: 'success',
        url: {
          link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
          text: 'Check Transaction on BSCScan',
        },
      });

      await checkAllowance();
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

  const getBalance = useCallback(async () => {
    try {
      const contract = new ethers.Contract(
        tokenAddress,
        minABI,
        provider.getSigner(),
      );
      const bal = await contract.balanceOf(address);
      setBalance(ethers.utils.formatEther(bal));
    } catch (error) {
      return 0;
    }
  }, [address, provider, tokenAddress]);

  const handleMax = async () => {
    setAvailableBalance(true);
    setAmount(Number(balance));
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
    setAvailableBalance(tmpval <= balance);
    setAmount(tmpval);
  };

  const handleDeposit = async () => {
    setStatus(true);
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS.LENDING_POOL_ADDRESS,
        LendingABI.abi,
        provider.getSigner(),
      );
      const tx = await contract.deposit(
        tokenAddress,
        extendToBigNumber(amount),
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

      setAlert({
        message: 'Deposit Success!',
        type: 'success',
        url: {
          link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
          text: 'Check Transaction on BSCScan',
        },
      });

      const _amount = Number(amount);
      const borrow_info = {
        tokenName: tokenName,
        tokenAddress: tokenAddress,
        poolAction: PA_DEPOSIT,
        data: {
          rate: data.rate,
          lent: Number(data.lent) + _amount,
          available: Number(data.available) + _amount,
          healthLevel: data.healthLevel,
        },
      };
      setPoolInfo(borrow_info);

      setAmount(0);
      await getBalance();
    } catch (error: any) {
      const depositError = error.data ? error.data.message : error.message;
      setAlert({
        message: depositError,
        type: 'error',
        url: { link: '', text: '' },
      });
    }
    setStatus(false);
  };

  useEffect(() => {
    if (address && provider && tokenAddress) {
      setAmount(0);
      getBalance();
      checkAllowance();
    }
  }, [provider, tokenAddress, getBalance, checkAllowance, address]);

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
        <h1 className="ml-5 text-white"> Deposit Asset</h1>
      </div>

      {address && poolAction === PA_DEPOSIT ? (
        <>
          <div className="mb-10 py-8 px-4 grid md:grid-cols-2 xl:grid-cols-3 gap-y-10 bg-neutral-black-500 rounded bg-gradient-to-r from-tifi-dark via-tifi-dark to-[#0027374a] bg-opacity-30 backdrop-blur-xl">
            <div className="w-fit mx-auto">
              <div className="flex items-center">
                <span className="text-white">{T('Credit')}</span>
                <TooltipComponent
                  content={'The balance of amount of token you have lent.'}
                  // position="right"
                  children={<img src={qMark} alt="Create" />}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-white text-lg font-medium">
                  {toFixed(data.lent)} {tokenName}
                </span>
              </div>
            </div>

            <div className="w-fit mx-auto">
              <div className="flex items-center">
                <span className="text-white">{T('Available in Pool')}</span>
                <TooltipComponent
                  content={'The current balance in lending pool.'}
                  // position="right"
                  children={<img src={qMark} alt="Create" />}
                />
              </div>
              <div className="text-center mt-2">
                <span className="text-white text-lg font-medium">
                  {toFixed(data.available)} {tokenName}
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
                inputValue={
                  amount === balance ? toFixed(Number(amount)) : amount
                }
                selectedCurrency={selectedToken}
                balance={toFixed(Number(balance))}
                handleInputChange={(e) => handleChange(e)}
                handleMax={() => handleMax()}
                fromText=""
              />

              <div className="mt-5 p-5 bg-neutral-black-400 flex items-center justify-between text-white rounded-lg">
                <span className="text-sm">Current Interest Rate:</span>
                <span>{toFixed(data.rate * 100)} %</span>
              </div>

              {allowAmount < amount && availableBalance && (
                <Button
                  onClick={() => handleApprove()}
                  className="text-white text-xs rounded-lg border border-primary mt-5"
                  label={
                    status ? (
                      <BounceLoader />
                    ) : (
                      `${T('Enable Deposit for')} ${tokenName}`
                    )
                  }
                  disabled={status}
                />
              )}

              <Button
                onClick={() => handleDeposit()}
                className="text-white text-xs rounded-lg bg-gradient-to-r from-[#047CFD] to-primary mt-5"
                label={
                  !availableBalance ? (
                    T('Insufficient balance')
                  ) : status && allowAmount >= amount ? (
                    <BounceLoader />
                  ) : (
                    T('Deposit')
                  )
                }
                disabled={!availableBalance || status || amount === 0}
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

export default DepositPage;
