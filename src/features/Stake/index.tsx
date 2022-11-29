
import { CONTRACT_ADDRESS } from '@config/constants';
import StakeABI from '@config/abi/TiFiReservior.json';
import { useAuth } from '@features/Auth/hooks/useAuthActions';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { blueFire } from '../../assets/icons';
import { stackBg } from '../../assets/images';
import Card from '../../components/elements/Card';
import Header from '../Home/components/Header';
import { getStakApy, getTvl } from './api';
import StakeWidget from './components/StakeWidget';
import StakingStatCard from './components/StakingStatsCard';
import { useStake, useStakeActions } from './hooks/useGetStakeRecords';
import { ethers } from 'ethers';
import { toFixed } from '@utils/tifi';
import { T } from 'react-translator-component';
import Button from '@components/elements/Button';
import EmptyState from '@components/widget/empty-state';
import { useWeb3React } from '@web3-react/core';
import ConnectWallet from '@components/widget/connect-wallet';
import StakeRecords from './widgets/StakeRecords';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StakeAdd from './widgets/StakeAdd';
import UnStake from './widgets/UnStake';


const Stake = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const { address, provider } = useAuth()
  const { account, library } = useWeb3React()
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();
  const { setStakeRecords } = useStakeActions()
  const { records } = useStake()
  const [openConnectModal, setOpenConnectModal] = useState<boolean>(false);
  const [query] = useSearchParams()
  const action = query.get('action')
  const navigate = useNavigate()

  // Fetch Chart Data
  const { data: apy, isLoading } = useQuery(['apy-data'], getStakApy);
  const { data: tvl, isLoading: isTvlLoading } = useQuery(['tvl-data'], getTvl);

  // Fetch Stake Records
  const getStakeRecords = useCallback(async () => {
    setLoading(true);

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS.RESERVIOR_ADDRESS,
        StakeABI.abi,
        library.getSigner()
      );
      const response = await contract.getDepositRecords({ from: account });

      const records = response[0].map((t: any, i: string | number) => {
        return {
          timestamp: Number(t) * 1000,
          stakeAmount: toFixed(response[1][i] / 10 ** 18, 10),
          curAmount: toFixed(response[2][i] / 10 ** 18, 10),
          wbnbAmount: toFixed(response[3][i] / 10 ** 18, 10),
        };
      });
      //   dispatch stake Records
      setStakeRecords(records)
    } catch (error) {
      console.error('Cannot get stake records', error);
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, provider, records]);


  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  useEffect(() => {
    if (address !== "" && provider) {
      getStakeRecords()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, provider])

  const stats = useMemo(() => [
    {
      id: 1,
      title: T('TVL'),
      value: tvl?.stakes && `$${toFixed(tvl.stakes[0].tvl / 1000000, 4)}M`,
    },
    {
      id: 2,
      title: T('TiFi APY'),
      value: apy && `${apy?.length === 0 ? 0 : toFixed(apy[apy?.length - 1].tifiApy, 4)}%`,
    },
    {
      id: 3,
      title: T('WBNB APY'),
      value: apy && `${apy?.length === 0 ? 0 : toFixed(apy[apy?.length - 1].wbnbApy, 4)}%`,
    },
  ], [apy, tvl?.stakes])

  return (
    <section className="py-8 relative">
      {openConnectModal && (
        <ConnectWallet modalClose={() => setOpenConnectModal(false)} />
      )}
      <div className="absolute right-0 top-0 -z-30">
        <img src={stackBg} alt="ChatBall" />
      </div>
      <Header
        title="Stake and Earn"
        descriptionProp={
          <div className="flex items-center">
            <p>
              Stake Tifi for 180days and Receive both TiFi and WBNB Rewards upto{' '}
            </p>{' '}
            <div className="text-primary flex items-center">
              <div className="ml-2">400%APY</div>
              <div className="ml-2">
                <img src={blueFire} alt="blue fire" />
              </div>
            </div>{' '}
          </div>
        }
      />
      <section className="mt-6">
        <Card className="rounded-lg bg-gradient-to-r from-tifi-dark via-tifi-dark to-[#0027374a] bg-opacity-30 backdrop-blur-xl">
          <section className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            {stats.length > 0 &&
              stats.map((st, idx) => (
                <div
                  key={st.id}
                  className={`${stats.length - 1 !== idx &&
                    'lg:border-r lg:border-r-light-60'
                    } lg:pl-4`}
                >
                  <StakingStatCard title={st.title} desc={st.value} loading={isLoading || isTvlLoading} />
                </div>
              ))}
          </section>
        </Card>
      </section>

      {action === "unstake" ? <UnStake /> : (
        <section className="mt-6 container w-full md:w-[558px] mx-auto">
          {action === "add" ? (
            <StakeAdd />
          ) : (
            <StakeWidget>
              <>
                {account ? (
                  <>
                    {records && records?.length > 0 ?
                      <div className='mb-5'>
                        <StakeRecords />
                      </div>
                      : <EmptyState label={'No Stake Records Found'} />}
                  </>
                ) : <EmptyState label={'Connect to a wallet to view your stake records.'} />
                }
                {account ?
                  <div>
                    <Button
                      className='bg-primary text-white' label={"Stake Tifi"} onClick={() => navigate('/stake?action=add')} />
                  </div> :
                  <Button
                    className='bg-primary text-white' label={"Connect Wallet"} onClick={() => setOpenConnectModal(true)} loading={loading} />
                }
              </>
            </StakeWidget>
          )}
        </section>
      )}
    </section >
  );
};

export default Stake;
