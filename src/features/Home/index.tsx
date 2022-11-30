import { useCallback, useEffect, useState } from 'react';
import {
  homeLiquidity,
  homePortfolio,
  homeStake,
  homeSwap,
  wallet,
} from '../../assets/icons';
import { chartBall } from '../../assets/images';
import Card from '../../components/elements/Card';
import StakingStatCard from '../Stake/components/StakingStatsCard';
import Header from './components/Header';
import HomeStatCard from './components/HomeStatCard';
import HomeCard from './widgets/HomeCard';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { circulationSupply, getTotalHolders } from './api';
import { TIFI_ADDRESS, TOTAL_HOLDERS } from '@config/constants';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { minABI } from '@config/TiFi_min_abi';
import { getTvl } from '@features/Stake/api';
import { convertNumber, toFixed } from '@utils/tifi';
import WalletConnector from '@components/widget/connect-wallet/wallet-connector';
import { tifiTokenAbi } from '@config/Tifi_token_abi';
import Button from '@components/elements/Button';
import SupplyTable from './table/SuppliesTable';
import BorrowPage from '@pages/loan/BorrowPage';
import BorrowTable from './table/BorrowTable';

const Home = () => {
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [totalBurn, setTotalBurn] = useState<number>(0);
  const { account: address, library: provider } = useWeb3React();

  // Get Balance
  const getBalance = useCallback(async () => {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(TIFI_ADDRESS, minABI, signer);
    try {
      if (address != null) {
        const tifiBal = await contract.balanceOf(address);
        setBalance(Math.floor(Number(tifiBal._hex) / Number(10 ** 18))); // TiFi Decimal is 18
        return Math.floor(Number(tifiBal._hex) / Number(10 ** 18));
      } else {
        return 0;
      }
    } catch (error) {
      return 0;
    }
  }, [address, provider]);

  const getTotalSupply = useCallback(async () => {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(TIFI_ADDRESS, tifiTokenAbi, signer);
    const total = await contract.totalBurn();
    setTotalBurn(Math.floor(Number(total._hex) / Number(10 ** 18)));
    return Math.floor(Number(total._hex) / Number(10 ** 18));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, provider]);

  const { data: tifiCirculationSupply, isLoading } = useQuery(
    ['tifi-circulation-supply'],
    circulationSupply,
  );
  const { data: tvl, isLoading: isTvlLoading } = useQuery(['tvl-data'], getTvl);
  // const { data: holders, isLoading: isHolderLoading } = useQuery(['hold-data'], getTotalHolders);

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  useEffect(() => {
    if (address && provider) {
      getBalance();
      getTotalSupply();
      getTotalHolders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, provider]);

  const stats = [
    {
      id: 1,
      title: 'Your Net Worth',
      value: `${convertNumber(balance)} TiFi`,
    },
    {
      id: 2,
      title: 'Net APY',
      value: `$${tvl?.stakes && toFixed(tvl.stakes[0].tvl / 1000000, 4)}M`,
    },
  ];

  return (
    <section className="py-8 relative">
      <div className="absolute -z-30 top-8 lg:right-0 lg:top-0 lg:opacity-100 opacity-20">
        <img src={chartBall} alt="ChatBall" />
      </div>
      <div className="static z-10">
        <Header
          title="Polend Market!"
          description="Get Loan in any cryptocurrency of your choice"
        />
      </div>
      {/* Wallet is Connected Render Stats*/}
      {/* {!address && (
        <div className="lg:w-96 my-8 w-full">
          {' '}
          <WalletConnector label="Connect Wallet to View Stats" />
        </div>
      )} */}
      {address && (
        <section className="my-6">
          <Card className="rounded-lg bg-opacity-30 backdrop-blur-xl">
            <section className="flex items-center">
              {stats.length > 0 &&
                stats.map((st, idx) => (
                  <div
                    key={st.id}
                    className={`${stats.length - 1 !== idx &&
                      'lg:border-r lg:border-r-light-60'
                      } ${idx === stats.length - 1 && `ml-4`} lg:pl-4 pr-4`}
                  >
                    {!address ? (
                      <WalletConnector />
                    ) : (
                      <StakingStatCard
                        loading={isLoading || isTvlLoading}
                        title={st.title}
                        desc={st?.value as string}
                      />
                    )}
                  </div>
                ))}
            </section>
          </Card>
        </section>
      )}
      {!address && (
        <section className='m-auto w-full lg:w-[580px] bg-tifi-dark text-tifi-light-grey h-auto flex items-center justify-center flex-col py-6'>
          <div className='h-20 w-20 rounded-full'>
            <img src={wallet} alt="Wallet connect notice" />
          </div>
          <div className='mb-4'>

            <h2 className='text-xl font-medium text-center mb-2'>Please, connect your wallet</h2>
            <p className='text-xs text-center text-tifi-grey'>Please connect your wallet to see your supplies, borrowings, and open positions.</p>
          </div>
          <div>
            <WalletConnector />
          </div>
        </section>
      )
      }
      {address && (
        <section className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 w-full">
            <Card className='w-full bg-dark-grey'>
              <div className='text-white mb-4'>
                <h3 className='text-xl font-bold'>Your Supplies</h3>
              </div>
              <div className='flex items-center'>
                <div className='border-purple-300/30 border p-1'>
                  <span className='font-medium text-sm text-tifi-grey'>Balance</span> <span className='text-white'>$200</span>
                </div>
                <div className='border-purple-300/30 border p-1 ml-3'>
                  <span className='font-medium text-sm text-tifi-grey'>APY</span> <span className='text-white'>{"< "}0.01%</span>
                </div>
                <div className='border-purple-300/30 border p-1 ml-3'>
                  <span className='font-medium text-sm text-tifi-grey'>Collateral</span> <span className='text-white'>$200</span>
                </div>

              </div>
              <div className='mt-6'>
                <SupplyTable />
              </div>
            </Card>
            <Card className='w-full bg-dark-grey'>
              <div className='text-white mb-4'>
                <h3 className='text-xl font-bold'>Your Borrows</h3>
              </div>
              <div className='flex items-center'>
                <div className='border-purple-300/30 border p-1'>
                  <span className='font-medium text-sm text-tifi-grey'>Balance</span> <span className='text-white'>$200</span>
                </div>
                <div className='border-purple-300/30 border p-1 ml-3'>
                  <span className='font-medium text-sm text-tifi-grey'>APY</span> <span className='text-white'>{"< "}0.01%</span>
                </div>
                <div className='border-purple-300/30 border p-1 ml-3'>
                  <span className='font-medium text-sm text-tifi-grey'>Collateral</span> <span className='text-white'>$200</span>
                </div>

              </div>
              <div className='mt-6'>
                <BorrowTable />
              </div>
            </Card>
          </div>
        </section>
      )}

    </section>
  );
};

export default Home;
