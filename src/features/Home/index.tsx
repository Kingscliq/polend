import { useCallback, useEffect, useState } from 'react';
import { wallet } from '../../assets/icons';
import { chartBall } from '../../assets/images';
import Card from '../../components/elements/Card';
import Header from './components/Header';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { CONTRACT_ADDRESS, SCAN_URL, TOKEN_ADDRESS } from '@config/constants';
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
import { useAlertActions } from '@hooks/useAlert';
import { getErrorMessage } from '@utils/formatters';
import { extendToBigNumber } from '@utils/converters';

const Home = () => {
  const { setAlert } = useAlertActions();
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();
  const [balance, setBalance] = useState<number>(0);
  const [collateralAmount, setCollateralAmount] = useState<number>(0);
  const [debtAmount, setDebtAmount] = useState<number>(0);
  const { account: address, library: provider } = useWeb3React();
  const [supplyModal, setSupplyModal] = useState<boolean>(false);
  const [borrowModal, setBorrowModal] = useState<boolean>(false);
  const [repayModal, setRepayModal] = useState<boolean>(false);
  const [withdrawModal, setWithdrawModal] = useState<boolean>(false);
  const [supplyAmount, setSupplyAmount] = useState<number | string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>('');
  const [borrowAmount, setBorrowAmount] = useState<number | string>('');
  const [repayAmount, setRepayAmount] = useState<number | string>('');
  const [borrowLoading, setBorrowLoading] = useState<boolean>(false)
  const [repayLoading, setRepayLoading] = useState<boolean>(false)


  // loading states
  const [supplyLoading, setSupplyLoading] = useState<boolean>(false);
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);

  const handleSupply = async () => {
    setSupplyLoading(true);
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        PolendAbi,
        provider.getSigner(),
      );

      const tx = await contract.deposit(extendToBigNumber(supplyAmount), { value: ethers.utils.parseEther(supplyAmount.toString()) });

      setAlert({
        message: 'Transaction Submitted!',
        type: 'notice',
        url: {
          link: `${SCAN_URL}/tx/${tx.hash}`,
          text: 'Check Transaction on PolygonScan',
        },
      });



      setAlert({
        message: 'Transaction Succesful!',
        type: 'success',
        url: {
          link: `${SCAN_URL}/tx/${tx.hash}`,
          text: 'Check Transaction on PolygonScan',
        },
      });

    } catch (error: any) {
      setSupplyLoading(false);
      const suppleError = error?.error
        ? error.error.data.message
        : getErrorMessage(error.error.code);

      setAlert({
        message: suppleError,
        type: 'error',
        url: {
          link: '',
          text: '',
        },
      });
    }
  };

  const handleBorrow = async () => {
    setBorrowLoading(true)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PolendAbi, provider.getSigner())
    try {
      if (address != null) {
        const tx = await contract.borrow(TOKEN_ADDRESS, extendToBigNumber(borrowAmount))
        setAlert({
          message: 'Transaction Submitted!',
          type: 'notice',
          url: {
            link: `${SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on PolygonScan',
          },
        });

        setAlert({
          message: 'Transaction Succesful!',
          type: 'success',
          url: {
            link: `${SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on PolygonScan',
          },
        });
      }
    } catch (error: any) {
      setBorrowLoading(false);
      const borrowError = error?.error
        ? error.error.data.message
        : getErrorMessage(error.error.code);

      setAlert({
        message: borrowError,
        type: 'error',
        url: {
          link: '',
          text: '',
        },
      });

    }
  }

  const handleWithdraw = async () => {
    setWithdrawLoading(true);

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        PolendAbi,
        provider.getSigner(),
      );

      const tx = await contract.repay(extendToBigNumber(repayAmount));

      setWithdrawLoading(false);
    } catch (error: any) {
      setWithdrawLoading(false);
      setWithdrawModal(false);
      const withdrawError = error?.error
        ? error.error.data.message
        : getErrorMessage(error.error.code);

      setAlert({
        message: withdrawError,
        type: 'error',
        url: {
          link: '',
          text: '',
        },
      });
    }
  };

  const handleRepay = async () => {
    setRepayLoading(true);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      PolendAbi,
      provider.getSigner(),
    );

    try {

      if (address != null) {
        const tx = await contract.repay(repayAmount)

        setAlert({
          message: 'Transaction Submitted!',
          type: 'notice',
          url: {
            link: `${SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on PolygonScan',
          },
        });

        contract.on("Repayed", () => {
          setAlert({
            message: 'Transaction Succesful!',
            type: 'success',
            url: {
              link: `${SCAN_URL}/tx/${tx.hash}`,
              text: 'Check Transaction on PolygonScan',
            },
          });
        })


      }
      setRepayModal(false)
    } catch (error: any) {
      setRepayLoading(false)
      const repayError = error?.error
        ? error.error.data.message
        : getErrorMessage(error.error.code);
      setAlert({
        message: repayError,
        type: 'error',
        url: {
          link: '',
          text: '',
        },
      });
    }
  };

  const getUserAccount = useCallback(async () => {
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      PolendAbi,
      provider.getSigner(),
    );
    try {
      const response = await contract.getPrice();
      const price = ethers.utils.formatEther(response._hex);
      setBalance(Number(price));

      const resp = await contract.loanDets(address);
      const collateralAmount = ethers.utils.formatEther(
        resp?.collateralAmount._hex,
      );
      setCollateralAmount(Number(collateralAmount));

      const debt = ethers.utils.formatEther(resp?.debt._hex);
      setRepayAmount(resp?.debt)
      setDebtAmount(Number(debt));

      const coin = ethers.utils.formatEther(resp?.coin);

      console.log({ coin, collateralAmount, debt });
    } catch (error) {
      console.log(error);
    }
  }, [address, provider]);

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  useEffect(() => {
    if (address && provider) {
      getUserAccount();
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
    //   value: `$${ tvl?.stakes && toFixed(tvl.stakes[0].tvl / 1000000, 4)}M`,
    // },
  ];

  return (
    <section className="py-8 relative">
      {supplyModal && (
        <SupplyModal
          openModal={supplyModal}
          setOpenModal={setSupplyModal}
          supplyAmount={supplyAmount}
          setSupplyAmount={setSupplyAmount}
          handleSupply={handleSupply}
          supplyLoading={supplyLoading}
        />
      )}
      {borrowModal && (
        <BorrowModal
          openModal={borrowModal}
          setOpenModal={setBorrowModal}
          borrowAmount={borrowAmount}
          setBorrowAmount={setBorrowAmount}
          loading={borrowLoading}
          handleBorrow={handleBorrow}
        />
      )}

      {repayModal && (
        <RepayModal
          openModal={repayModal}
          setOpenModal={setRepayModal}
          repayAmount={repayAmount}
          setRepayAmount={setRepayAmount}
          handleRepay={handleRepay}
          loading={repayLoading}
        />
      )}
      {withdrawModal && (
        <WithdrawModal
          openModal={withdrawModal}
          setOpenModal={setWithdrawModal}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          handleWithdraw={handleWithdraw}
          withdrawLoading={withdrawLoading}
        />
      )}

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
                      } ${idx === stats.length - 1 && `ml-4`} lg: pl - 4 pr - 4`}
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
        <section className="m-auto w-full lg:w-[580px] bg-tifi-dark text-tifi-light-grey h-auto flex items-center justify-center flex-col py-6">
          <div className="h-20 w-20 rounded-full">
            <img src={wallet} alt="Wallet connect notice" />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-medium text-center mb-2">
              Please, connect your wallet
            </h2>
            <p className="text-xs text-center text-tifi-grey">
              Please connect your wallet to see your supplies, borrowings, and
              open positions.
            </p>
          </div>
          <div>
            <WalletConnector />
          </div>
        </section>
      )}
      {address && (
        <section className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
            <Card className="w-full bg-dark-grey">
              <div className="text-white mb-4">
                <h3 className="text-xl font-bold">Your Supplies</h3>
              </div>
              <div className="flex items-center">
                <div className="border-purple-300/30 border p-1">
                  <span className="font-medium text-sm text-tifi-grey">
                    Balance
                  </span>{' '}
                  <span className="text-white">
                    ${collateralAmount - debtAmount}
                  </span>
                </div>
                <div className="border-purple-300/30 border p-1 ml-3">
                  <span className="font-medium text-sm text-tifi-grey">
                    APY
                  </span>{' '}
                  <span className="text-white">{'< '}0.01%</span>
                </div>
                <div className="border-purple-300/30 border p-1 ml-3">
                  <span className="font-medium text-sm text-tifi-grey">
                    Collateral
                  </span>{' '}
                  <span className="text-white">${collateralAmount}</span>
                </div>
              </div>
              <div className="mt-6">
                <SupplyTable
                  openModal={supplyModal}
                  setOpenModal={setSupplyModal}
                  setWithdrawModal={setWithdrawModal}
                  balance={balance}
                />
              </div>
            </Card>
            <Card className="w-full bg-dark-grey">
              <div className="text-white mb-4">
                <h3 className="text-xl font-bold">Your Borrows</h3>
              </div>
              <div className="flex items-center">
                <div className="border-purple-300/30 border p-1 mr-3">
                  <span className="font-medium text-sm text-tifi-grey">
                    Debt
                  </span>{' '}
                  <span className="text-white">${debtAmount}</span>
                </div>
                <div className="border-purple-300/30 border p-1">
                  <span className="font-medium text-sm text-tifi-grey">
                    APY
                  </span>{' '}
                  <span className="text-white">{'< '}0.01%</span>
                </div>
              </div>
              <div className="mt-6">
                <BorrowTable
                  openModal={supplyModal}
                  setOpenModal={setBorrowModal}
                  setRepayModal={setRepayModal}
                  balance={0}
                  handleRepay={handleRepay}
                  repayLoading={false} />
              </div>
            </Card>
          </div>
          <div className="mt-6">
            <Card className="w-full bg-dark-grey">
              <div className="text-white mb-4">
                <h3 className="text-xl font-bold">Assets</h3>
              </div>
              <AssetsTable
                openModal={borrowModal}
                setOpenModal={setBorrowModal}
              />
            </Card>
          </div>
        </section>
      )}
    </section>
  );
};

export default Home;
