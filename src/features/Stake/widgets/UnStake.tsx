import React, { useState } from 'react';
import {
  BSC_SCAN_URL,
  CONTRACT_ADDRESS,
  STAKE_FULL_REWARD,
  STAKE_NO_REWARD,
} from '@config/constants';
import Button from '@components/elements/Button';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { T } from 'react-translator-component';
import { extendToBigNumber, getErrorMessage, toFixed } from '@utils/tifi';
import StakeABI from '@config/abi/TiFiReservior.json';
import { useStake, useStakeActions } from '../hooks/useGetStakeRecords';
import StakeWidget from '../components/StakeWidget';
import { bnb, tifi } from '@assets/icons/currencies';
import Notice from '../components/Notice';
import { useNavigate } from 'react-router-dom';
import { getDateTime } from '@utils/formatters';
import { StakeRecord } from '@/types/StakeRecords';
import { useAlertActions } from '@hooks/useAlert';

export const RangeButton: React.FC<{
  val?: number;
  onClick?: () => void;
  bg?: string;
}> = ({ onClick, val, bg }) => {
  return (
    <button
      onClick={onClick}
      className={`${bg} hover:bg-primary-400 hover:text-white text-sm py-2 px-4 border rounded-md w-full`}
    >
      {val === 100 ? 'Max' : `${val}%`}
    </button>
  );
};

const UnStake = () => {
  const [value, setValue] = useState(50);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const { account: address, library: provider } = useWeb3React();
  const { unStakeItem } = useStake();
  const { updateStakeRecords } = useStakeActions();
  const navigate = useNavigate();
  const { setAlert } = useAlertActions();

  // Handle Unstake
  const handleRemove = async () => {
    setUnstakeLoading(true);
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS.RESERVIOR_ADDRESS,
        StakeABI.abi,
        provider.getSigner(),
      );
      let amount = extendToBigNumber(
        `${(Number(unStakeItem?.stakeAmount) * value) / 100}`,
      );
      if (value === 100) {
        // Need to withdraw in full
        const response = await contract.getDepositRecords({ from: address });
        for (let i = 0; i < response[0].length; i++) {
          if (response[0][i] * 1000 === unStakeItem?.timestamp) {
            amount = response[1][i];
            break;
          }
        }
      }

      const tx = await contract.withdraw(
        amount,
        Number(unStakeItem?.timestamp) / 1000,
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
      const response = await contract.getDepositRecords({ from: address });
      const records = response[0].map((t: any, i: string | number) => {
        return {
          timestamp: Number(t) * 1000,
          stakeAmount: toFixed(response[1][i] / 10 ** 18),
          curAmount: toFixed(response[2][i] / 10 ** 18),
          wbnbAmount: toFixed(response[3][i] / 10 ** 18),
        };
      });

      setAlert({
        message: T('Unstake Success!'),
        type: 'success',
        url: {
          link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
          text: 'Check Transaction on BSCScan',
        },
      });

      let record = records.find(
        (item: StakeRecord) => item.timestamp === unStakeItem?.timestamp,
      );

      updateStakeRecords(record);
      navigate('/stake');
    } catch (error: any) {
      const supplyError = error?.error ? error.error : getErrorMessage(error);
      setAlert({
        message: supplyError,
        type: 'error',
        url: { link: '', text: '' },
      });
    }
    setUnstakeLoading(false);
  };

  return (
    <section className="mt-6 container w-full md:w-[558px] mx-auto">
      <StakeWidget title="UnStake" onClick={() => navigate(-1)}>
        <div className="bg-neutral-black-600 bg-opacity-80 pt-4 px-4 pb-6 text-white rounded-lg mb-4">
          <h3 className="text-sm">Staked</h3>
          <div className="flex items-center justify-between my-4">
            <div>
              <small className="text-xs text-neutral-black-0">Staked on</small>
            </div>
            <div>
              <small className="text-xs text-neutral-black-0">
                {getDateTime(Number(unStakeItem?.timestamp))}
              </small>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <img src={tifi} alt="" />
              </div>
              <h3 className="ml-3">TiFi</h3>
            </div>
            <h1 className="text-xs text-neutral-black-0">
              {unStakeItem?.curAmount}
            </h1>
          </div>
        </div>
        <div className="mb-4">
          <div className="bg-neutral-black-600 bg-opacity-80 pt-4 px-4 pb-6 text-white rounded-lg mb-4">
            <h3 className="text-sm">Amount to Unstake</h3>
            <div className="my-6 flex items-center justify-between text-lg font-semibold">
              <span>{value}%</span>
              <div>
                <span>
                  {unStakeItem &&
                    `${toFixed(
                      (value * Number(unStakeItem?.stakeAmount)) / 100,
                    )} / ${toFixed(Number(unStakeItem?.curAmount))}`}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="number"
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue(Number(e.target.value))
                }
                className="p-2 w-full bg-tifi-dark mb-3 outline-none focus:border focus:border-blue-400 rounded-md placeholder:text-sm placeholder:text-tifi-gray-500"
                min="10"
                max="100"
                placeholder="Enter percentage value"
              />
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-8">
              <RangeButton
                val={25}
                onClick={() => setValue(25)}
                bg={
                  value === 25
                    ? 'bg-primary-400 text-white border-white'
                    : 'bg-transparent text-neutral-black-0 border-neutral-black-0'
                }
              />
              <RangeButton
                val={50}
                onClick={() => setValue(50)}
                bg={
                  value === 50
                    ? 'bg-primary-400 text-white border-white'
                    : 'bg-transparent text-neutral-black-0 border-neutral-black-0'
                }
              />
              <RangeButton
                val={75}
                onClick={() => setValue(75)}
                bg={
                  value === 75
                    ? 'bg-primary-400 text-white border-white'
                    : 'bg-transparent text-neutral-black-0 border-neutral-black-0'
                }
              />
              <RangeButton
                val={100}
                onClick={() => setValue(100)}
                bg={
                  value === 100
                    ? 'bg-primary-400 text-white border-white'
                    : 'bg-transparent text-neutral-black-0 border-neutral-black-0'
                }
              />
            </div>
          </div>
        </div>
        <div className="my-4">
          <h3 className="text-sm text-white">You will receive</h3>
        </div>
        <div className="bg-neutral-black-600 bg-opacity-80 pt-4 px-4 pb-6 text-white rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <img src={tifi} alt="" />
              </div>
              <h3 className="ml-3">TiFi</h3>
            </div>
            <h1 className="text-xs text-neutral-black-0">
              {/* {(Number(unStakeItem?.curAmount) - (Number(unStakeItem?.stakeAmount))) * value / 100 / (unStakeItem?.rewardType === STAKE_FULL_REWARD ? 1 : 2)} */}
              {(Number(unStakeItem?.stakeAmount) * value) / 100}
            </h1>
          </div>
        </div>
        {unStakeItem?.rewardType !== STAKE_NO_REWARD && (
          <div className="bg-neutral-black-600 bg-opacity-80 pt-4 px-4 pb-6 text-white rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div>
                  <img src={tifi} alt="" />
                </div>
                <h3 className="ml-3">TiFi {T('Reward')}</h3>
              </div>
              <h1 className="text-xs text-neutral-black-0">
                {((Number(unStakeItem?.curAmount) -
                  Number(unStakeItem?.stakeAmount)) *
                  value) /
                  100 /
                  (Number(unStakeItem?.rewardType) === STAKE_FULL_REWARD
                    ? 1
                    : 2)}
              </h1>
            </div>
          </div>
        )}

        {unStakeItem?.rewardType === STAKE_FULL_REWARD && (
          <div className="bg-neutral-black-600 bg-opacity-80 pt-4 px-4 pb-6 text-white rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div>
                  <img src={bnb} alt="" />
                </div>
                <h3 className="ml-3">BNB</h3>
              </div>
              <h1 className="text-xs text-neutral-black-0">
                {(Number(unStakeItem?.wbnbAmount) * value) / 100}
              </h1>
            </div>
          </div>
        )}

        <div className="my-4 bg-neutral-black-600">
          <Notice
            text={
              'You are not getting the full reward of extra TIFI and WBNB because the staking time is less than 180 days!'
            }
            handleClose={() => console.log('close')}
          />
        </div>
        <div>
          <Button
            label="Unstake"
            className="bg-primary text-white"
            loading={unstakeLoading}
            onClick={handleRemove}
          />
        </div>
      </StakeWidget>
    </section>
  );
};

export default UnStake;
