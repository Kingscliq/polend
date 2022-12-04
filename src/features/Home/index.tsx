import { useCallback, useEffect, useState } from 'react';
import {
  wallet,
} from '../../assets/icons';
import { chartBall } from '../../assets/images';
import Card from '../../components/elements/Card';
import Header from './components/Header';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { CONTRACT_ADDRESS } from '@config/constants';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import WalletConnector from '@components/widget/connect-wallet/wallet-connector';
import PolendAbi from '@config/abi/PolendAbi.json';
import SupplyTable from './table/SuppliesTable';
import BorrowTable from './table/BorrowTable';
import SupplyModal from './modals/supply-modal';
import BorrowModal from './modals/borrow-modal';
import RepayModal from './modals/repay-modal';
import WithdrawModal from './modals/withdraw-modal';
import StatCard from './components/StatsCard';
import AssetsTable from './table/Assets';

const Home = () => {
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();
  const [balance, setBalance] = useState<number>(0);
  const { account: address, library: provider } = useWeb3React();
  const [supplyModal, setSupplyModal] = useState<boolean>(false)
  const [borrowModal, setBorrowModal] = useState<boolean>(false)
  const [repayModal, setRepayModal] = useState<boolean>(false)
  const [withdrawModal, setWithdrawModal] = useState<boolean>(false)
  const [supplyAmount, setSupplyAmount] = useState<number | string>("")
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>("")
  const [borrowAmount, setBorrowAmount] = useState<number | string>("")
  const [repayAmount, setRepayAmount] = useState<number | string>("")
  const [supplyLoading, setSupplyLoading] = useState<boolean>(false)

  // Get Balance
  const getBalance = useCallback(async () => {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(CONTRACT_ADDRESS, PolendAbi, signer);
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

  // const { data: holders, isLoading: isHolderLoading } = useQuery(['hold-data'], getTotalHolders);

  console.log(borrowAmount)

  const handleDeposit = () => {
    setSupplyLoading(true)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PolendAbi, provider.getSigner())

    console.log(contract)
  }
  const getUserAccount = useCallback(async () => {
    // setLoading(true);
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        PolendAbi,
        provider.getSigner(),
      );
      // console.log({ CONTRACT_ADDRESS }, { provider }, { address }, { contract })
      const addr = await contract.getPrice();
      const price = ethers.utils.formatEther(addr._hex)
      console.log({ addr }, { price })
      const resp = await contract.loanDets(address);

      console.log(resp)
      // const collateralValue = Number(
      //   ethers.utils.formatEther(resp.loanDets()),
      // );

      // const infoData = {
      //   totalLiquidity: ethers.utils.formatEther(
      //     resp.totalLiquidityBalanceBase,
      //   ),
      //   maxBorrow: collateralValue,
      //   curBorrow: borrowValue,
      //   healthLevel:
      //     borrowValue > 0 && collateralValue / borrowValue < 4
      //       ? Math.floor(collateralValue / borrowValue)
      //       : 4,
      //   address: address,
      // };

    } catch (error: any) {
      // const accountError = error?.error ? error.error : getErrorMessage(error);
      // setAlert({
      //   message: accountError,
      //   type: 'error',
      //   url: { link: '', text: '' },

      console.log(error)
      // });
    }
    // setLoading(false);
  }, [provider, address]);

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  useEffect(() => {
    if (address && provider) {
      getBalance();
      getUserAccount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, provider]);

  const stats = [
    {
      id: 1,
      title: 'Your Net Worth',
      value: `${balance} MATIC`,
    },
    // {
    //   id: 2,
    //   title: 'Net APY',
    //   value: `$${tvl?.stakes && toFixed(tvl.stakes[0].tvl / 1000000, 4)}M`,
    // },
  ];

  return (
    <section className="py-8 relative">
      {supplyModal && <SupplyModal openModal={supplyModal} setOpenModal={setSupplyModal} supplyAmount={supplyAmount} setSupplyAmount={setSupplyAmount} />}
      {borrowModal && <BorrowModal openModal={borrowModal} setOpenModal={setBorrowModal} borrowAmount={borrowAmount} setBorrowAmount={setBorrowAmount} />}
      {repayModal && <RepayModal openModal={repayModal} setOpenModal={setRepayModal} repayAmount={repayAmount} setRepayAmount={setRepayAmount} />}
      {withdrawModal && <WithdrawModal openModal={withdrawModal} setOpenModal={setWithdrawModal} withdrawAmount={withdrawAmount} setWithdrawAmount={setWithdrawAmount} />}

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
                      <StatCard
                        loading={false}
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
                <SupplyTable openModal={supplyModal} setOpenModal={setSupplyModal} setWithdrawModal={setWithdrawModal} />
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
                <BorrowTable openModal={supplyModal} setOpenModal={setBorrowModal} setRepayModal={setRepayModal} />
              </div>
            </Card>
          </div>
          <div className='mt-6'>
            <Card className='w-full bg-dark-grey'>
              <div className='text-white mb-4'>
                <h3 className='text-xl font-bold'>Assets</h3>
              </div>
              <AssetsTable openModal={borrowModal} setOpenModal={setBorrowModal} />
            </Card>
          </div>
        </section>
      )}

    </section>
  );
};

export default Home;
