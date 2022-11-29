// import ComingSoon from '@components/elements/ComingSoon';
import WalletConnector from '@components/widget/connect-wallet/wallet-connector';
import LiquidityWidget from '@features/Liquidity/widgets/LiquidityWidget';
import { T } from 'react-translator-component';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { useCallback, useEffect, useState } from 'react';
import TooltipComponent from '@components/elements/TooltipComponent';
import { qMark } from '@assets/icons';
import { useWeb3React } from '@web3-react/core';
import { ACCOUNT_HEALTH, getErrorMessage, nFormatter } from '@utils/tifi';
import { useLoan, useLoanActions } from './hooks/useLoanActions';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, TOKENS } from '@config/constants';
import LendingABI from '@config/abi/LendingPool.json';
import { setAlert } from 'slices/alertSlice';
import { useQuery } from '@tanstack/react-query';
import { getWBNBPrice } from './api';
import AssetRecords from './components/AssetRecords';

const Loan = () => {
  // for language translation
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  const { account: address, library: provider } = useWeb3React();

  const { setUserInfo, setwbnbPrice } = useLoanActions();
  const { wbnbPrice, totalLiquidity, maxBorrow, curBorrow, healthLevel } =
    useLoan();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any>([]);

  const { data: WBNBData } = useQuery(['tvl-data'], getWBNBPrice);

  const getUserAccount = useCallback(async () => {
    setLoading(true);
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS.LENDING_POOL_ADDRESS,
        LendingABI.abi,
        provider.getSigner(),
      );
      const resp = await contract.getUserAccount(address);
      const collateralValue = Number(
        ethers.utils.formatEther(resp.totalCollateralBalanceBase),
      );
      const borrowValue = Number(
        ethers.utils.formatEther(resp.totalBorrowBalanceBase),
      );

      const infoData = {
        totalLiquidity: ethers.utils.formatEther(
          resp.totalLiquidityBalanceBase,
        ),
        maxBorrow: collateralValue,
        curBorrow: borrowValue,
        healthLevel:
          borrowValue > 0 && collateralValue / borrowValue < 4
            ? Math.floor(collateralValue / borrowValue)
            : 4,
        address: address,
      };

      setUserInfo(infoData);

      const p = TOKENS.filter((item) => item.hasLendingPool).map((token) => [
        token,
        contract.getPool(token.address),
        contract.getUserPoolData(address, token.address),
      ]);
      let temp = [];
      for (let i = 0; i < p.length; i++) {
        let res1 = await p[i][1];
        let res2 = await p[i][2];
        let tl = Number(ethers.utils.formatEther(res1.totalLiquidity)),
          tb = Number(ethers.utils.formatEther(res1.totalBorrows));
        temp.push({
          token: p[i][0].title,
          address: p[i][0].address,
          lendRate: Number(ethers.utils.formatEther(res1.lendRate)),
          borrowRate: Number(ethers.utils.formatEther(res1.borrowRate)),
          stAddress: res1.shareTokenAddress,
          available: tl > tb ? tl - tb : 0, // Availabel to borrow
          total: tl,
          borrowed: Number(
            ethers.utils.formatEther(res2.compoundedBorrowBalance),
          ),
          lent: Number(
            ethers.utils.formatEther(res2.compoundedLiquidityBalance),
          ),
          // collateralEnabled: res2.userUsePoolAsCollateral,
        });
      }
      setRows(temp);
    } catch (error: any) {
      const accountError = error?.error ? error.error : getErrorMessage(error);
      setAlert({
        message: accountError,
        type: 'error',
        url: { link: '', text: '' },
      });
      console.error(error);
    }
    setLoading(false);
  }, [provider, address, setUserInfo]);

  useEffect(() => {
    setwbnbPrice(WBNBData);
    if (address && provider) {
      getUserAccount();
    }
  }, [WBNBData, address, getUserAccount, provider, setwbnbPrice]);

  return (
    <div className="mb-10 container mx-auto">
      <div className="mb-10">
        <h1 className="text-white text-2xl font-semibold mb-3">
          {T('Crypto Loan')}
        </h1>
        <p className="text-neutral-black-0 text-sm">
          Supply crypto assets to earn interests and get fast loan without
          credit check.
        </p>
      </div>

      <div className="mb-10 py-8 px-4 grid md:grid-cols-2 xl:grid-cols-4 gap-y-10 bg-neutral-black-500 rounded bg-gradient-to-r from-tifi-dark via-tifi-dark to-[#0027374a] bg-opacity-30 backdrop-blur-xl">
        <div className="px-12 w-fit mx-auto lg:border-r lg:border-r-light-60">
          <div className="flex items-center">
            <span className="text-white">{T('Supplied Assets')}</span>
            <TooltipComponent
              content={'Total value of your supplied assets.'}
              // position="right"
              children={<img src={qMark} alt="Create" />}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-white text-lg font-medium">
              {address
                ? `$${nFormatter(totalLiquidity * wbnbPrice, 2)}`
                : T('N/A')}
            </span>
          </div>
        </div>

        <div className="px-12 w-fit mx-auto xl:border-r lg:border-r-light-60">
          <div className="flex items-center">
            <span className="text-white">{T('Max. Borrow')}</span>
            <TooltipComponent
              content={
                <div className="w-80">
                  This value is estimation of the maximum asset value you can
                  borrow. Because of fluctuated market, you may not be able to
                  borrow so much.
                </div>
              }
              children={<img src={qMark} alt="Create" />}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-white text-lg font-medium">
              {address ? `$${nFormatter(maxBorrow * wbnbPrice, 2)}` : T('N/A')}
            </span>
          </div>
        </div>

        <div className="px-12 w-fit mx-auto lg:border-r lg:border-r-light-60">
          <div className="flex items-center">
            <span className="text-white">{T('Current Borrow')}</span>
            <TooltipComponent
              content={'The current value of assets you have borrowed.'}
              children={<img src={qMark} alt="Create" />}
            />
          </div>
          <div className="text-center mt-2">
            <span className="text-white text-lg font-medium">
              {address ? `$${nFormatter(curBorrow * wbnbPrice, 2)}` : T('N/A')}
            </span>
          </div>
        </div>

        <div className="px-12 w-fit mx-auto">
          <div className="flex items-center">
            <span className="text-white">{T('Health Level')}</span>
            <TooltipComponent
              content={
                <div className="w-80">
                  The health level of your account. You need pay attention to
                  your health level all the time. If your health level is
                  WARNING or UNHEALTHY, you need pay your debts as soon as
                  possible. If health level is UNHEALTHY, you cannot borrow any
                  assets from this platform.
                </div>
              }
              children={<img src={qMark} alt="Create" />}
            />
          </div>
          <div className="text-center mt-2">
            <span
              className={`text-white text-lg font-medium ${
                address ? `health-${healthLevel}` : 'na'
              }`}
            >
              {address ? T(ACCOUNT_HEALTH[healthLevel]) : T('N/A')}
            </span>
          </div>
        </div>
      </div>

      {address ? (
        <div className="w-full md:w-2/3 mx-auto">
          <LiquidityWidget>
            <AssetRecords
              loading={loading}
              records={rows}
              profile={{
                totalLiquidity,
                maxBorrow,
                curBorrow,
                healthLevel,
                wbnbPrice,
              }}
            />
          </LiquidityWidget>
        </div>
      ) : (
        <div className="w-full md:w-[558px] mx-auto">
          <LiquidityWidget>
            <div className="text-center mb-5">
              <span className="text-neutral-black-0 text-sm">
                {T('Connect to a wallet to view assets.')}
              </span>
            </div>
            <WalletConnector />
          </LiquidityWidget>
        </div>
      )}
    </div>
  );
};

export default Loan;
