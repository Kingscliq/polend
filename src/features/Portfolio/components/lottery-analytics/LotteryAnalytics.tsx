import { Tab } from '@components/elements/Tab';
import Header from '@features/Home/components/Header';
import { getLuckyBagsStats } from '@features/Portfolio/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import JackpotWinnersTable from './JackpotWinnersTable';
import TopWinnersTable from './TopWinnersTable';
import CountUp from 'react-countup';
import { BounceLoader } from '@components/elements/Loaders';
import { RoutesTab } from '@components/elements/Tab/RoutesTab';

const LotteryAnalytics = () => {
  const [activeTab, setActiveTab] = useState<string>('top winners');

  const [rows1, setRows1] = useState<
    { address: string; winAmount: number | undefined }[]
  >([]);
  const [rows2, setRows2] = useState<
    { address: string; jackpotPrize: any; timestamp: string }[]
  >([]);

  const { data: stats } = useQuery(['stats-data'], getLuckyBagsStats);

  useEffect(() => {
    if (stats && stats.n_winners > 0) {
      setRows1(
        stats.top_winners.map((w: any) => {
          return {
            address: `${w[1].substring(0, 6)}...${w[1].substring(38)}`,
            winAmount: w[0],
          };
        }),
      );
      setRows2(
        stats.jackpot_record.map((j: any) => {
          return {
            address: `${j.winner.substring(0, 6)}...${j.winner.substring(38)}`,
            jackpotPrize: j.amount,
            timestamp: new Date(j.timestamp * 1000).toLocaleDateString(),
          };
        }),
      );
    } else {
      getLuckyBagsStats();
    }
  }, [stats?.jackpot_record, stats?.top_winners, stats?.n_winners, stats]);

  return (
    <section className="py-8 relative">
      <section className="mb-8">
        <RoutesTab
          data={[
            { id: 1, name: 'Pools', href: '/portfolio_pool' },
            { id: 2, name: 'Stake', href: '/portfolio_stake' },
            { id: 3, name: 'Lottery', href: '/portfolio_lucky_bags' },
          ]}
        />
      </section>

      <section>
        <Header
          title="Lucky Bags Statistics"
          description="The statistics about Top Winners and Jackpot Winners"
        />
      </section>

      <section className="mt-10 py-4 px-6 bg-neutral-black-700 grid grid-cols-1 gap-y-5 md:grid-cols-2 rounded-lg">
        <div className="px-4">
          <h3 className="text-neutral-black-0 text-base md:text-lg font-medium">
            Total Prize Winners
          </h3>
          <p className="text-[#D9D9D9] text-xl md:text-2xl font-semibold">
            {stats && stats.n_winners ? (
              <CountUp
                start={0}
                end={stats.n_winners}
                duration={1}
                decimal="."
                separator=","
              />
            ) : (
              <BounceLoader />
            )}
          </p>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-white/50 pt-4 md:pt-0 px-4 md:px-8">
          <h3 className="text-neutral-black-0 text-base md:text-lg font-medium">
            Jackpot Prize Pool
          </h3>
          <p className="text-[#D9D9D9] text-xl md:text-2xl font-semibold">
            {stats && stats.jackpot_amount ? (
              <>
                <CountUp
                  start={0}
                  end={stats.jackpot_amount}
                  duration={2}
                  decimal="."
                  separator=","
                />{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-grade-1 to-grade-2">
                  TIFI
                </span>
              </>
            ) : (
              <BounceLoader />
            )}
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5">
          <Tab
            active={activeTab}
            setActive={setActiveTab}
            data={[
              { id: 1, name: 'top winners' },
              { id: 2, name: 'jackpot winners' },
            ]}
          />
        </div>

        {activeTab === 'top winners' && <TopWinnersTable rows={rows1} />}
        {activeTab === 'jackpot winners' && (
          <JackpotWinnersTable rows={rows2} />
        )}
      </section>
    </section>
  );
};

export default LotteryAnalytics;
