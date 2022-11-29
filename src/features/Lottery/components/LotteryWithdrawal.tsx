import { tifi } from '@assets/icons/currencies';
import TextField from '@components/elements/TextField';
import { RangeButton } from '@features/Stake/widgets/UnStake';
import React, { SetStateAction } from 'react';

interface LotteryWithdrawalTypes {
  value: number | string;
  setValue: React.Dispatch<SetStateAction<number>>;
  bagBal: number;
}

const LotteryWithdrawal = ({
  value,
  setValue,
  bagBal,
}: LotteryWithdrawalTypes) => {
  return (
    <section>
      <div className="bg-neutral-black-500 bg-opacity-80 pt-4 px-4 pb-6 text-white rounded-lg mb-4">
        <h3 className="text-xs md:text-sm">Amount to Withdraw</h3>
        <div className="my-4 flex items-center justify-between text-lg font-semibold">
          <span>{value}%</span>
          <div className="text-sm md:text-base">
            <span>{(Number(value) * bagBal) / 100}</span>/<span>{bagBal}</span>
          </div>
        </div>

        <div className="mb-3">
          <TextField
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(Number(e.target.value))
            }
            className="bg-neutral-black-700 px-4"
            placeholder="Enter percentage value"
          />
        </div>

        <div className="grid grid-cols-4 gap-x-8">
          <RangeButton
            val={25}
            onClick={() => setValue(25)}
            bg={
              value === 25
                ? 'bg-primary-400 text-white border-primary-400'
                : 'bg-transparent text-neutral-black-0 border-neutral-black-0'
            }
          />

          <RangeButton
            val={50}
            onClick={() => setValue(50)}
            bg={
              value === 50
                ? 'bg-primary-400 text-white border-primary-400'
                : 'bg-transparent text-neutral-black-0 border-neutral-black-0'
            }
          />

          <RangeButton
            val={75}
            onClick={() => setValue(75)}
            bg={
              value === 75
                ? 'bg-primary-400 text-white border-primary-400'
                : 'bg-transparent text-neutral-black-0 border-neutral-black-0'
            }
          />

          <RangeButton
            val={100}
            onClick={() => setValue(100)}
            bg={
              value === 100
                ? 'bg-primary-400 text-white border-primary-400'
                : 'bg-transparent text-neutral-black-0 border-neutral-black-0'
            }
          />
        </div>
      </div>

      <div>
        <p className="font-semibold text-[#CCCCD0] text-sm">You will receive</p>

        <div className="bg-neutral-black-600 bg-opacity-80 p-4 my-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-neutral-black-0">
              <img src={tifi} width={16} height={16} alt="Tifi" />
              <span className="ml-3">TiFi</span>
            </div>
            <p className="text-base font-semibold text-white">
              {(Number(value) * bagBal) / 100}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LotteryWithdrawal;
