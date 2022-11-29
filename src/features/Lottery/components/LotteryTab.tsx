import { downloadIcon } from '@assets/icons';
import Button from '@components/elements/Button';
import { Dispatch, SetStateAction } from 'react';
import CountUp from 'react-countup';

type LotteryTabProps = {
  setActiveTab: Dispatch<SetStateAction<string>>;
  activeTab: string;
  totalWin: number;
  bagBal: number;
};

const LotteryTab = ({
  setActiveTab,
  activeTab,
  totalWin,
  bagBal,
}: LotteryTabProps) => {
  return (
    <section>
      <div className="mt-10 px-4 md:px-0 py-6 bg-neutral-black-700 grid grid-cols-1 gap-y-5 md:grid-cols-2 rounded-xl">
        <div className="px-4">
          <h3 className="text-neutral-black-0 text-xs md:text-sm font-medium mb-2">
            You have won
          </h3>
          <p className="text-[#D9D9D9] text-lg md:text-xl font-semibold">
            <CountUp
              start={0}
              end={totalWin}
              duration={2}
              decimal="."
              suffix=" TiFi"
              separator=","
            />
          </p>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-white/50 pt-4 md:pt-0 px-4">
          <h3 className="text-neutral-black-0 text-xs md:text-sm font-medium mb-2">
            Bag Balance
          </h3>
          <p className="text-[#D9D9D9] text-lg md:text-xl font-semibold">
            <CountUp
              start={0}
              end={bagBal}
              duration={2}
              decimal="."
              suffix=" TiFi"
              separator=","
            />
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xs md:text-sm text-neutral-black-0 text-center">
          Click Deposit Button Below to Add TIFI & Play!
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <Button
              onClick={() => setActiveTab('1')}
              btnLeftIcon={downloadIcon}
              label={'Deposit'}
              className={`border rounded-[10px] text-white ${
                activeTab === '1'
                  ? 'bg-primary border-primary py-2'
                  : 'bg-transparent border-white'
              }`}
            />
          </div>

          <div>
            <Button
              onClick={() => setActiveTab('2')}
              btnLeftIcon={downloadIcon}
              label={'Withdraw'}
              className={`border rounded-[10px] text-white ${
                activeTab === '2'
                  ? 'bg-primary border-primary py-2'
                  : 'bg-transparent border-white'
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LotteryTab;
