import React, { useState } from 'react';
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from '@material-tailwind/react';
import { bnb, busd, tifi, usdt } from '@assets/icons/currencies';
import { T } from 'react-translator-component';
import { toFixed } from '@utils/tifi';
import TooltipComponent from '@components/elements/TooltipComponent';
import { qMark } from '@assets/icons';
import { useNavigate } from 'react-router-dom';
import Button from '@components/elements/Button';
import {
  PA_BORROW,
  PA_DEPOSIT,
  PA_REPAY,
  PA_WITHDRAW,
} from '@config/constants';
import { useLoanActions } from '../hooks/useLoanActions';
import { BounceLoader } from '@components/elements/Loaders';

interface AssetRecordsType {
  loading: boolean;
  records: [];
  profile: {
    totalLiquidity: number;
    maxBorrow: number;
    curBorrow: number;
    healthLevel: number;
    wbnbPrice: number;
  };
}

interface AssetsCardType {
  title: string;
  tooltip: string;
  figure: number;
}

const Icon = ({ id, open }: { id: number; open: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${
        id === open ? 'rotate-180' : ''
      } h-4 w-4 transition-transform`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
};

const AssetsCard = ({ title, tooltip, figure }: AssetsCardType) => {
  return (
    <div className="whitespace-nowrap">
      <div className="flex items-center">
        <span className="text-white">{T(title)}</span>
        <TooltipComponent
          content={<div className="w-80">{T(tooltip)}</div>}
          children={<img src={qMark} alt="tooltip icon" />}
        />
      </div>
      <div className="mt-2">
        <span className="text-white text-lg font-medium">
          {toFixed(figure)}
        </span>
      </div>
    </div>
  );
};

const AssetRecords = ({ loading, records, profile }: AssetRecordsType) => {
  const navigate = useNavigate();

  const { setPoolInfo } = useLoanActions();

  const images = [
    { name: 'BNB', src: bnb },
    { name: 'BUSD', src: busd },
    { name: 'TIFI', src: tifi },
    { name: 'USDT', src: usdt },
  ];
  const imageSrc = (item: any) => {
    const src = images.find((image) => image?.name === item.token);
    return src;
  };

  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div>
      <div className="mb-5">
        <span className="text-white lg:text-lg"> Assets</span>
      </div>

      {records.length > 0 ? (
        records.map((item: any, index) => (
          <Accordion
            key={index + 1}
            open={open === index + 1}
            icon={<Icon id={index + 1} open={open} />}
          >
            <AccordionHeader
              className="text-white border-b border-neutral-black-200 font-medium hover:text-white text-left overflow-x-auto whitespace-nowrap"
              onClick={() => handleOpen(index + 1)}
            >
              <div className="w-[540px] sm:w-full grid grid-cols-3 gap-x-5">
                <div className="flex items-center">
                  <img
                    className="mr-2"
                    src={imageSrc(item)?.src}
                    alt={imageSrc(item)?.name}
                    width="30px"
                  />
                  <span className="text-xs md:text-base">{item?.token}</span>
                </div>
                <div className="mx-5 text-xs md:text-base">
                  <div>
                    <div className="text-white/50 mb-2">{T('Lending APY')}</div>
                    <div className="text-lg font-semibold">
                      {toFixed(Math.round(item.lendRate * 10000) / 100, 4)} %
                    </div>
                  </div>
                </div>
                <div className="text-xs md:text-base">
                  <div>
                    <div className="text-white/50 mb-2">
                      {T('Borrowing APY')}
                    </div>
                    <div className="text-lg font-semibold">
                      {toFixed(Math.round(item.borrowRate * 10000) / 100, 4)} %
                    </div>
                  </div>
                </div>
              </div>
            </AccordionHeader>
            <AccordionBody>
              <div className="w-full py-5 overflow-x-auto whitespace-nowrap">
                <div className="w-[540px] sm:w-full mb-5 grid grid-cols-4 gap-x-10">
                  <AssetsCard
                    title="Liquidity"
                    tooltip="This value is estimation of the maximum asset value you can borrow. Because of fluctuated market, you may not be able to borrow so much."
                    figure={item.total}
                  />
                  <AssetsCard
                    title="Available"
                    tooltip="The maximum amount of tokens that users can borrow from the pool."
                    figure={item.available}
                  />
                  <AssetsCard
                    title="Credit"
                    tooltip="The balance of amount of token you have lent."
                    figure={item.lent}
                  />
                  <AssetsCard
                    title="Debt"
                    tooltip="The balance of the amount of token you have borrowed."
                    figure={item.borrowed}
                  />
                </div>

                <div className="w-[540px] sm:w-full grid grid-cols-4 gap-x-10">
                  <Button
                    onClick={() => {
                      const deposit_info = {
                        tokenName: item.token,
                        tokenAddress: item.address,
                        poolAction: PA_DEPOSIT,
                        data: {
                          rate: item.lendRate,
                          lent: item.lent,
                          available: item.available,
                          ...profile,
                        },
                      };
                      setPoolInfo(deposit_info);
                      navigate(`/loan/deposit`);
                    }}
                    className="text-white text-xs py-1 rounded-lg bg-gradient-to-r from-[#047CFD] to-primary w-full"
                    label={T('Deposit')}
                  />

                  <Button
                    onClick={() => {
                      const lend_info = {
                        tokenName: item.token,
                        tokenAddress: item.address,
                        poolAction: PA_WITHDRAW,
                        data: {
                          rate: item.lendRate,
                          lent: item.lent,
                          available: item.available,
                          stAddress: item.stAddress,
                          ...profile,
                        },
                      };
                      setPoolInfo(lend_info);
                      navigate(`/loan/withdraw`);
                    }}
                    className="text-white text-xs py-1 rounded-lg bg-gradient-to-r from-[#047CFD] to-primary"
                    label={T('Withdraw')}
                    disabled={
                      profile.maxBorrow <= 0 ||
                      item.lent <= 0 ||
                      profile.healthLevel < 1 ||
                      item.available <= 0
                    }
                  />

                  <Button
                    onClick={() => {
                      const borrow_info = {
                        tokenName: item.token,
                        tokenAddress: item.address,
                        poolAction: PA_BORROW,
                        data: {
                          rate: item.borrowRate,
                          borrowed: item.borrowed,
                          available: item.available,
                          ...profile,
                        },
                      };
                      setPoolInfo(borrow_info);
                      navigate(`/loan/borrow`);
                    }}
                    className="text-white text-xs py-1 rounded-lg bg-gradient-to-r from-[#047CFD] to-primary"
                    label={T('Borrow')}
                    disabled={
                      profile.maxBorrow <= 0 ||
                      profile.healthLevel < 1 ||
                      item.available <= 0
                    }
                  />

                  <Button
                    onClick={() => {
                      const borrow_info = {
                        tokenName: item.token,
                        tokenAddress: item.address,
                        poolAction: PA_REPAY,
                        data: {
                          rate: item.borrowRate,
                          borrowed: item.borrowed,
                          lent: item.lent,
                          available: item.available,
                          stAddress: item.stAddress,
                          ...profile,
                        },
                      };
                      setPoolInfo(borrow_info);
                      navigate(`/loan/repay`);
                    }}
                    className="text-white text-xs py-1 rounded-lg bg-gradient-to-r from-[#047CFD] to-primary"
                    label={T('Repay')}
                    disabled={item.borrowed <= 0}
                  />
                </div>
              </div>
            </AccordionBody>
          </Accordion>
        ))
      ) : (
        <div>
          {loading ? (
            <BounceLoader />
          ) : (
            <span className="text-white text-sm md:text-base">
              {T('No lending pool found')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetRecords;
