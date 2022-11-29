import { caretDownGrey, close, tooltipIcon } from '@assets/icons';
import { lotteryImg } from '@assets/images';
import { SelectedProps } from '@components/elements/DropdownModal';
import TooltipComponent from '@components/elements/TooltipComponent';
import {
  BSC_SCAN_URL,
  CONTRACT_ADDRESS,
  TIFI_ADDRESS,
  TOKENS,
} from '@config/constants';
import React, { useCallback, useEffect, useState } from 'react';
import LotteryWidget from '../widgets/LotteryWidget';
import Deposit from './LotteryDeposit';
import LotteryTab from './LotteryTab';
import LotteryWithdrawal from './LotteryWithdrawal';
import CountUp from 'react-countup';
import { useQuery } from '@tanstack/react-query';
import { getLuckyBagsStats } from '@features/Portfolio/api';
import { BounceLoader } from '@components/elements/Loaders';
import WalletConnector from '@components/widget/connect-wallet/wallet-connector';
import { T } from 'react-translator-component';
import { getTiFiPrice } from '@features/Stake/api';
import { ethers } from 'ethers';
import { minABI } from '@config/TiFi_min_abi';
import { extendToBigNumber, getErrorMessage, toFixed } from '@utils/tifi';
import { useWeb3React } from '@web3-react/core';
import Button from '@components/elements/Button';
import { Link } from 'react-router-dom';
import {
  getPrizeRate,
  PRIZE_JACKPOT,
  STAGE_CLOSED,
  STAGE_PENDING,
  STAGE_PRESELECT,
  STAGE_REVEALED,
} from '../constants/constant';
import LuckyBagModal from './LuckyBagModal';
import LotteryABI from '@config/abi/LuckyTiFiLottery.json';
import { useAlertActions } from '@hooks/useAlert';

type LotteryCountProps = {
  count: number;
  styles: string;
  onClick: () => void;
};

const LotteryCount = ({ count, styles, onClick }: LotteryCountProps) => {
  return (
    <button
      onClick={onClick}
      className={`h-10 w-10 text-white p-2 font-medium flex items-center justify-center ${styles} ${
        count === 1 ? 'rounded-l' : count === 100 ? 'rounded-r' : ''
      }`}
    >
      <span className="text-sm drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]">
        {count}x
      </span>
    </button>
  );
};

const LotteryMain = () => {
  const [toggleGuide, setToggleGuide] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState<SelectedProps>(
    TOKENS[2],
  );

  const [activeTab, setActiveTab] = useState('1');

  // fetch lottery stats data
  const { data: stats } = useQuery(['stats-data'], getLuckyBagsStats);

  const { data: price } = useQuery(['price-data'], getTiFiPrice);

  const { setAlert } = useAlertActions();

  const { account: address, library: provider } = useWeb3React();

  const [amount, setAmount] = useState<any>(0);
  const [balance, setBalance] = useState(0);
  const [allowAmount, setAllowAmount] = useState(0);
  const [status, setStatus] = useState(false);

  // handlebet states
  const [totalWin, setTotalWin] = useState(0);
  const [rate, setRate] = useState(1);
  const [stage, setStage] = useState(STAGE_PRESELECT);
  const [prizeAmount, setPrizeAmount] = useState(0);
  const [prizeRate, setPrizeRate] = useState(0);
  const [bagId, setBagId] = useState(0);
  const [bagBal, setBagBal] = useState<any>(0);
  const [depositAmount, setDepositAmount] = useState<any>('0');
  const [availableBalance, setAvailableBalance] = useState(true);

  const bagsCount = [
    { style: 'bg-[#00FF73]', count: 1 },
    { style: 'bg-[#65FF00]', count: 2 },
    { style: 'bg-[#D0FF00]', count: 5 },
    { style: 'bg-[#FFFC01]', count: 10 },
    { style: 'bg-[#FACC05]', count: 20 },
    { style: 'bg-[#FFA701]', count: 50 },
    { style: 'bg-[#F95B02]', count: 100 },
  ];
  const [lotteryBagCount, setLotteryBagCount] = useState<{
    count: number;
    style: string;
  }>({ count: 0, style: '' });

  const [value, setValue] = useState<any>(50);
  const [luckyBagsModal, setLuckyBagsModal] = useState(false);

  const getBalance = useCallback(async () => {
    try {
      const contract = new ethers.Contract(
        TIFI_ADDRESS,
        minABI,
        provider.getSigner(),
      );
      if (address != null) {
        const tifiBal = await contract.balanceOf(address);
        setBalance(Number(ethers.utils.formatEther(tifiBal)));
        const allowance = await contract.allowance(
          address,
          CONTRACT_ADDRESS.LUCKYBAGS_ADDRESS,
        );
        setAllowAmount(Number(ethers.utils.formatEther(allowance)));
      }
    } catch (error) {
      console.log('Failed to get balance', error);
    }
  }, [address, provider]);

  const getTotalWin = useCallback(async () => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS.LUCKYBAGS_ADDRESS,
        LotteryABI.abi,
        provider.getSigner(),
      );

      const totalWin = await contract.getRecords([address], { from: address });
      setTotalWin(Number(ethers.utils.formatEther(totalWin[0].totalWin)));

      setBagBal(Number(ethers.utils.formatEther(totalWin[0].balance)));
    } catch (error: any) {
      const totalWinError = error?.error ? error.error : getErrorMessage(error);
      setAlert({
        message: totalWinError,
        type: 'error',
        url: { link: '', text: '' },
      });
    }
  }, [provider, address, setAlert]);

  useEffect(() => {
    if (address && provider) {
      setAmount(0);
      getBalance();
      getTotalWin();
    }
  }, [address, getBalance, getTotalWin, provider]);

  // this function fires when you try to bet
  const handleBet = async (n: number) => {
    if (!price || price <= 0) {
      setAlert({
        message: 'Network error, make sure you have internet connection!',
        type: 'error',
        url: { link: '', text: '' },
      });
      return;
    }
    if (address) {
      const betAmount = n / price;
      if (betAmount > bagBal) {
        setAlert({
          message:
            "Sorry you don't have enough TIFI for bet, please deposit more TIFI to your bag!",
          type: 'error',
          url: { link: '', text: '' },
        });

        // setShowWithdraw(false);
        // setShowDeposit(true);
        return;
      }
      setBagId(0);
      setAmount(betAmount);
      setStage(STAGE_PRESELECT);
      setRate(n);
      if (allowAmount < betAmount) {
        return;
      }
      if (betAmount > bagBal) {
        setAlert({
          message: "Sorry, you don't have sufficient balance to bet!",
          type: 'error',
          url: { link: '', text: '' },
        });
        return;
      }
      const selectedCount: any = bagsCount.find((bag) => n === bag.count);
      setLotteryBagCount(selectedCount);
      setLuckyBagsModal(true);
    } else {
      setAlert({
        message: 'Welcome! Please connect wallet first.',
        type: 'notice',
        url: { link: '', text: '' },
      });
      return;
    }
  };

  // const handleWithdrawChange = (
  //   e: any,
  //   newValue: React.SetStateAction<number>,
  // ) => {
  //   setValue(newValue);
  // };

  const handleDepositChange = (e: any) => {
    let tmpval = e.target.value ? e.target.value : 0;
    if (tmpval < 0 || isNaN(tmpval)) {
      tmpval = depositAmount;
    } else if (
      !(
        typeof tmpval === 'string' &&
        (tmpval.endsWith('.') || tmpval.startsWith('.'))
      )
    ) {
      tmpval = Number(e.target.value.toString());
    }
    setAvailableBalance(tmpval <= balance);
    setDepositAmount(tmpval);
  };

  const handleMax = async () => {
    setAvailableBalance(true);
    setDepositAmount(balance);
  };

  // const handleAddToken = async () => {
  //   const api: any = window.ethereum;
  //   try {
  //     const wasAdded = await api.request({
  //       method: 'wallet_watchAsset',
  //       param: {
  //         type: 'ERC20',
  //         options: {
  //           address: TIFI_ADDRESS,
  //           symbol: 'TIFI',
  //           decimals: 18,
  //         },
  //       },
  //     });
  //     if (wasAdded) {
  //       setAlert({
  //         message: 'TiFi Token successful added',
  //         type: 'success',
  //         url: { link: '', text: '' },
  //       });
  //     } else {
  //       setAlert({
  //         message: 'TiFi Token added failed',
  //         type: 'error',
  //         url: { link: '', text: '' },
  //       });
  //     }
  //   } catch (error: any) {
  //     const addTokenError = error?.error ? error.error : getErrorMessage(error);
  //     setAlert({
  //       message: addTokenError,
  //       type: 'error',
  //       url: { link: '', text: '' },
  //     });
  //   }
  // };

  const enter = async () => {
    setStage(STAGE_PENDING);
    try {
      let enterAmount = extendToBigNumber(amount);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS.LUCKYBAGS_ADDRESS,
        LotteryABI.abi,
        provider.getSigner(),
      );
      const gasLimit = await contract.estimateGas.enter(enterAmount);
      // Set gas limit to 1.5 times of estimation
      const tx = await contract.enter(enterAmount, {
        gasLimit: gasLimit.mul(3).div(2),
      });
      const txInfo = await tx.wait();
      const event = txInfo.events.filter(
        (i: { event: string }) => i.event === 'win',
      )[0];
      const totalWin = await contract.getRecords([address]);
      const amountWin = Number(ethers.utils.formatEther(event.args[1]));
      const isJackpot = event.args[2];
      setPrizeAmount(amountWin);
      setPrizeRate(isJackpot ? PRIZE_JACKPOT : getPrizeRate(amount, amountWin));
      setTotalWin(Number(ethers.utils.formatEther(totalWin[0].totalWin)));
      setBagBal(Number(ethers.utils.formatEther(totalWin[0].balance)));
      setStage(STAGE_REVEALED);
    } catch (error) {
      console.log('Cannot enter Lucky Bag!', error);
      setStage(STAGE_CLOSED);
      setAlert({
        message:
          'Oops! Something wrong when bet, the TIFI you have paid has been refunded.',
        type: 'error',
        url: { link: '', text: '' },
      });

      throw error;
    }
  };

  const handleApprove = async () => {
    setStatus(true);
    try {
      const contract = new ethers.Contract(
        TIFI_ADDRESS,
        minABI,
        provider.getSigner(),
      );
      const tx = await contract.approve(
        CONTRACT_ADDRESS.LUCKYBAGS_ADDRESS,
        '1000000000000000000000000000000000000',
      );
      await tx.wait();

      const approveSuccess = 'Approved! Now you can play Lucky Bags!';
      setAlert({
        message: approveSuccess,
        type: 'success',
        url: { link: '', text: '' },
      });
      await getBalance();
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

  const handleWithdraw = async () => {
    setStatus(true);
    if (address != null) {
      try {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS.LUCKYBAGS_ADDRESS,
          LotteryABI.abi,
          provider.getSigner(),
        );
        let wAmount = extendToBigNumber((Number(bagBal) * value) / 100);
        if (value >= 100) {
          const resp = await contract.getRecords([address], { from: address });
          wAmount = resp[0].balance;
        }
        const tx = await contract.withdraw(wAmount);
        setAlert({
          message: 'Withdraw Submitted!',
          type: 'notice',
          url: {
            link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on BSCScan',
          },
        });

        await tx.wait();
        setAlert({
          message: 'Withdraw Successful!',
          type: 'success',
          url: {
            link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on BSCScan',
          },
        });

        setValue(0);
        await getBalance();
        await getTotalWin();
      } catch (error: any) {
        const withdrawError = error?.error
          ? error.error
          : getErrorMessage(error);
        setAlert({
          message: withdrawError,
          type: 'error',
          url: { link: '', text: '' },
        });
      }
    }
    setStatus(false);
  };

  // this function fires when you want to deposit funds
  const handleDeposit = async () => {
    console.log(depositAmount);
    setStatus(true);
    if (address != null) {
      try {
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS.LUCKYBAGS_ADDRESS,
          LotteryABI.abi,
          provider.getSigner(),
        );

        console.log(contract);
        const tx = await contract.deposit(extendToBigNumber(depositAmount));
        setAlert({
          message: 'Deposit Submitted!',
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

        setDepositAmount('0');
        await getBalance();
        await getTotalWin();
      } catch (error: any) {
        const depositError = error?.error
          ? error.error
          : getErrorMessage(error);
        setAlert({
          message: depositError,
          type: 'error',
          url: { link: '', text: '' },
        });
      }
    }
    setStatus(false);
  };

  return (
    <>
      <LotteryWidget>
        <div>
          <img className="mx-auto" src={lotteryImg} alt="lottery pic" />
        </div>

        <div className="mt-10 py-6 px-4 bg-neutral-black-500 rounded-2xl">
          <div className="flex justify-center items-center mb-3">
            <h4 className="text-sm text-[#CCCCD0] font-medium">Jackpot</h4>

            <TooltipComponent
              classname="w-64 bg-gradient-to-r from-[#047CFD]/70 to-primary/70"
              content={T(
                'The amount TIFI in Jackpot prize pool, bet more and you will have higher chance to win!',
              )}
              children={<img src={tooltipIcon} alt="help icon" />}
            />
          </div>
          <p className="text-center text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-grade-1 to-grade-2">
            {stats && stats.jackpot_amount ? (
              <CountUp
                start={0}
                end={stats.jackpot_amount}
                duration={2}
                decimal="."
                suffix=" TIFI"
                separator=","
              />
            ) : (
              <BounceLoader />
            )}
          </p>
          {address ? (
            <LotteryTab
              setActiveTab={setActiveTab}
              activeTab={activeTab}
              totalWin={totalWin}
              bagBal={bagBal}
            />
          ) : (
            <div className="mt-6">
              <WalletConnector />
            </div>
          )}
        </div>

        {address && (
          <div className="my-10">
            {activeTab === '1' ? (
              <>
                <Deposit
                  inputValue={depositAmount}
                  selectedCurrency={selectedCurrency}
                  setSelectedCurrency={setSelectedCurrency}
                  balance={Math.round(balance * 1000000000) / 1000000000 || 0}
                  handleInputChange={(e) => handleDepositChange(e)}
                  handleMax={() => handleMax()}
                  fromText="From"
                />

                <div className="mt-6">
                  <Button
                    onClick={() => handleDeposit()}
                    label={
                      !availableBalance ? (
                        T('Insufficient balance')
                      ) : status && allowAmount >= depositAmount ? (
                        <BounceLoader />
                      ) : (
                        T('Deposit to Your Bag!')
                      )
                    }
                    className="bg-primary rounded-[10px] text-white"
                    disabled={
                      !availableBalance ||
                      status ||
                      allowAmount < depositAmount ||
                      depositAmount === 0
                    }
                  />
                </div>

                {allowAmount < amount && (
                  <div className="mt-6">
                    <Button
                      onClick={() => handleApprove()}
                      label={status ? <BounceLoader /> : T('Approve to Play!')}
                      className="bg-primary rounded-[10px] text-white"
                    />
                  </div>
                )}
              </>
            ) : (
              // withdraw component and withdraw button
              <div>
                <LotteryWithdrawal
                  value={value}
                  setValue={setValue}
                  bagBal={bagBal}
                />
                <div>
                  <Button
                    onClick={handleWithdraw}
                    disabled={bagBal === 0 || value === 0 || status}
                    label={status ? <BounceLoader /> : T('Withdraw to Wallet')}
                    className="bg-primary rounded-lg text-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {address && (
          <div className="mt-4">
            <h3 className="text-white text-center text-lg font-bold">
              Select your bet
            </h3>
            <div className="mt-2 grid grid-cols-7 gap-x-[1px] w-fit mx-auto">
              {bagsCount?.map((bag, i) => (
                <LotteryCount
                  key={i}
                  onClick={() => handleBet(bag.count)}
                  count={bag.count}
                  styles={bag.style}
                />
              ))}
            </div>
          </div>
        )}

        {/* do not touch everything from here and below */}
        <div className="mt-10 flex items-center justify-center">
          <Link
            to="/portfolio_lucky_bags"
            className="text-neutral-black-0 text-sm md:text-base py-2 px-3 border border-neutral-black-0 rounded-lg mr-4"
          >
            Top Winners
          </Link>

          <button
            className="text-neutral-black-0 text-sm md:text-base py-2 px-3 border border-neutral-black-0 rounded-lg flex items-center"
            onClick={() => setToggleGuide(!toggleGuide)}
          >
            <span>How to Play</span>
            <img
              src={caretDownGrey}
              className={`${
                toggleGuide ? 'rotate-180' : 'rotate-0'
              } ml-2 transition-all ease-in-out duration-300`}
              alt="down arrow"
            />
          </button>
        </div>

        {toggleGuide && (
          <div className="mt-10 p-6 bg-neutral-black-600 rounded-xl">
            <img
              src={close}
              onClick={() => setToggleGuide(false)}
              className="ml-auto cursor-pointer"
              alt="close icon"
            />
            <ol className="text-grey-100 text-sm font-light leading-7 list-decimal">
              <h3 className="text-white text-2xl font-bold">How To Play</h3>
              <div className="ml-4 mt-2">
                <li>Connect Wallet.</li>
                <li>
                  Deposit TiFi Token to your bag, this game will use the token
                  in your bag for bet.
                </li>
                <li>
                  Approve the deposit first (no need to do every time), enter
                  the amount and Deposit to Your Bag!
                </li>
                <li>Connect Wallet.</li>
                <li>Connect Wallet.</li>
                <li>
                  Select your bet, it cost from 1x (1 USD worth of TIFI) to 100x
                  (100 USD worth of TIFI).
                </li>
                <li>
                  Choose your Lucky Bag from 12 unrevealed bags. The prizes in
                  Lucky Bags are random.
                </li>
                <li>
                  Win prize on the spot! Everyone has the chance to win Jackpot!
                  Prizes are paid via TIFI.
                </li>
              </div>
            </ol>
            <div className="mt-4 text-grey-100 text-sm font-light leading-7 list-disc">
              <h3 className="text-white text-2xl font-bold">Bet Amount </h3>
              <div className="mt-2">
                <p>
                  Bets are paid via TIFI, 1x is 1 USD worth of TIFI, 2x is 2 USD
                  worth of TIFI, and so on.
                </p>
                <p>
                  You can bet many times as long as there are sufficient TIFI in
                  your bag. If current bet amount is less than the balance in
                  your bag, you have to deposit more TIFI to continue.
                </p>
              </div>

              {price && (
                <div className="mt-2">
                  <p>Here are the bet amounts based on current rate of TIFI:</p>
                  <div className="ml-4">
                    <li>
                      <b>1x</b> = {toFixed(1 / price, 10)} TIFI
                    </li>
                    <li>
                      <b>2x</b> = {toFixed(2 / price, 10)} TIFI
                    </li>
                    <li>
                      <b>5x</b> = {toFixed(5 / price, 10)} TIFI
                    </li>
                    <li>
                      <b>10x</b> = {toFixed(10 / price, 10)} TIFI
                    </li>
                    <li>
                      <b>20x</b> = {toFixed(20 / price, 10)} TIFI
                    </li>
                    <li>
                      <b>50x</b> = {toFixed(50 / price, 10)} TIFI
                    </li>
                    <li>
                      <b>100x</b> = {toFixed(100 / price, 10)} TIFI
                    </li>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 text-grey-100 text-sm font-light leading-7 list-decimal">
              <h3 className="text-white text-2xl font-bold">Prizes</h3>
              <div className="mt-2">
                <p>
                  Prizes are reflected in the Balance in Your Bag immediately
                  after your bet. You can withdraw TIFI from your bag to your
                  wallet any time.
                </p>
                <p>
                  Usually it takes less than 30 seconds to reveal the prize
                  after you selected the Lucky Bag.
                </p>
              </div>

              <ul className="mt-2 list-disc">
                <div className="ml-4">
                  <li>There are 6 prizes of Lucky Bags: </li>
                  <li>
                    <span className="text-orange-800 font-bold">
                      Bronze Bag:
                    </span>{' '}
                    Win 10% of bet amount.
                  </li>
                  <li>
                    <span className="font-bold text-blue-gray-100">
                      Silver Bag:
                    </span>{' '}
                    Win 50% of bet amount.
                  </li>
                  <li>
                    <span className="text-yellow-800 font-bold">
                      Golden Bag:
                    </span>{' '}
                    Win 200% of bet amount.
                  </li>
                  <li>
                    <span className="text-grade-2 font-bold">
                      Sapphire Blue Bag:
                    </span>{' '}
                    Win 500% of bet amount.
                  </li>
                  <li>
                    <span className="text-red-800 font-bold">
                      Ruby Red Bag:
                    </span>{' '}
                    Win 1000% of bet amount.
                  </li>
                  <li>
                    <span className="text-grade-1 text-lg font-bold">
                      Jackpot:
                    </span>{' '}
                    You will win all TIFI from accumulated Jackpot pool.
                  </li>
                </div>
              </ul>
            </div>
          </div>
        )}

        {/* Lucky bag modal */}
        {luckyBagsModal && (
          <LuckyBagModal
            handleSelect={() => {
              setStage(STAGE_PENDING);
              enter();
            }}
            handleClose={() => {
              setBagId(0);
              setAmount(0);
              setStage(STAGE_CLOSED);
            }}
            bagId={bagId}
            setBagId={setBagId}
            betAmount={amount}
            rate={rate}
            prizeAmount={prizeAmount}
            prizeRate={prizeRate}
            stage={stage}
            lotteryBagCount={lotteryBagCount}
            modalClose={() => setLuckyBagsModal(false)}
          />
        )}
      </LotteryWidget>
    </>
  );
};

export default LotteryMain;
