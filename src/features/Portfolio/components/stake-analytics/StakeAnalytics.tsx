import React, { useCallback, useEffect, useState } from 'react';
import Card from '../../../../components/elements/Card';
import { Tab } from '../../../../components/elements/Tab';
import Header from '../../../Home/components/Header';
import Notice from '../../../Stake/components/Notice';
import StakingStatCard from '../../../Stake/components/StakingStatsCard';
import _ from 'lodash';
import TifiChart from '../../../../components/widget/Chart';
import { T } from 'react-translator-component';
import { useQuery } from '@tanstack/react-query';
import { getStakApy } from '@features/Stake/api';
import { RoutesTab } from '@components/elements/Tab/RoutesTab';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';

const secondPerDay = 3600 * 24;
const formatter = Intl.NumberFormat('en', { maximumFractionDigits: 2 });

const options = {
  chart: {
    type: 'area',
    height: '300px',
    background: 'transparent',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: true,
    },
  },
  theme: {
    mode: 'dark',
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    tooltip: {
      enabled: true,
    },
    axisBorder: {
      show: false,
    },
    labels: {
      datetimeUTC: false,
    },
  },
  tooltip: {
    style: {
      fontFamily: 'Poppins',
    },
    x: {
      format: 'dd MMM yyyy',
    },
  },

  yaxis: {
    axisBorder: {
      show: false,
    },
    labels: {
      show: true,
      align: 'right',
      minWidth: 0,
      maxWidth: 200,
      style: {
        colors: [],
        fontSize: '12px',
        fontFamily: 'Poppins',
        fontWeight: 400,
        cssClass: 'apexcharts-yaxis-label',
      },
      offsetX: 0,
      offsetY: 0,
      rotate: 0,
      formatter: (value: number | bigint) => formatter.format(value) + ' %',
    },
  },
  markers: {
    size: 0,
    strokeWidth: 1.5,
    strokeOpacity: 1,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: 'circle',
    radius: 1,
    hover: {
      size: 2,
    },
  },
  fill: {
    type: 'solid',
    opacity: 0.7,
    gradient: {
      shadeIntensity: 0.4,
      opacityFrom: 1,
      opacityTo: 0.5,
      stops: [30, 100, 100],
    },
  },
  grid: {
    show: true,
    strokeDashArray: 3,
    position: 'back',
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  stroke: {
    show: true,
    curve: 'smooth',
    lineCap: 'butt',
    width: 1.5,
    dashArray: 0,
  },
};

const StakeAnalytics = () => {
  // for language translation
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  const [activeTab, setActiveTab] = useState<string>('tifi apy');
  const [series, setSeries] = useState<{ name: any; data: any }[]>([]);
  const [rApy, setRApy] = useState<number[][]>([]);

  // Fetch Chart Data
  const { data: apy } = useQuery(['apy-data'], getStakApy);

  const getRApy = useCallback(async () => {
    try {
      let response = await fetch('https://tifi.net/api/tifi_chart');
      let data = await response.text();
      let rapy = data
        .split('\n')
        .slice(-90)
        .map((item) => {
          let parts = item.split(',');
          return [Date.parse(parts[0]), 100 * Number(parts[1])];
        });
      setRApy(rapy);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // _.setWith(options, "fill.colors", ["", ""]);
  _.setWith(options, 'markers.colors', ['#00875A', '#33B8F0']);
  _.setWith(options, 'stroke.colors', ['#00875A', '#33B8F0']);
  _.setWith(options, 'markers.strokeColors', ['#00875A', '#33B8F0']);
  _.setWith(options, 'grid.borderColor', '#8F92A1');

  useEffect(() => {
    getStakApy();
    if (activeTab === 'tifi apy') {
      getRApy();
    }
  }, [activeTab, getRApy]);

  useEffect(() => {
    if (apy) {
      if (activeTab === 'tifi apy') {
        const tempSeries = [
          {
            name: T('TIFI Stake Reward APY'),
            data: apy.map((t: { timestamp: number; tifiApy: any }) => [
              Math.floor(t.timestamp / secondPerDay) * secondPerDay * 1000,
              t.tifiApy,
            ]),
          },
          { name: T('TIFI Reflection Reward APY'), data: rApy },
        ];
        setSeries(tempSeries);
      } else if (rApy) {
        const tempSeries = [
          {
            name: T('WBNB Stake Reward APY'),
            data: apy.map((t: { timestamp: number; wbnbApy: any }) => [
              Math.floor(t.timestamp / secondPerDay) * secondPerDay * 1000,
              t.wbnbApy,
            ]),
          },
        ];
        setSeries(tempSeries);
      }
    }
  }, [activeTab, apy, rApy]);

  // from here and below isn mock data

  const stats = [
    {
      id: 1,
      title: 'TVL',
      value: '$2.8077M',
    },
    {
      id: 2,
      title: 'TiFi APY',
      value: '397.5%',
    },
    {
      id: 3,
      title: 'WBNB APY',
      value: '5.055%',
    },
  ];

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
          title="Stake Analytics"
          description="Click on the column name to sort pairs by its volume or APR"
        />
      </section>

      <section>
        <section className="mt-6">
          <Card className="rounded-lg bg-gradient-to-r from-tifi-dark via-tifi-dark to-[#0027374a] bg-opacity-30 backdrop-blur-xl">
            <section className="grid lg:grid-cols-3 grid-cols-1 gap-4">
              {stats.length > 0 &&
                stats.map((st, idx) => (
                  <div
                    key={st.id}
                    className={`${
                      stats.length - 1 !== idx &&
                      'lg:border-r lg:border-r-light-60'
                    } lg:pl-4`}
                  >
                    <StakingStatCard title={st.title} desc={st.value} />
                  </div>
                ))}
            </section>
          </Card>
        </section>
      </section>

      <section>
        <section className="mt-8 w-fit">
          <Tab
            active={activeTab}
            setActive={setActiveTab}
            data={[
              { id: 1, name: 'TIFI APY' },
              { id: 2, name: 'WBNB APY' },
            ]}
          />
        </section>
      </section>
      {activeTab === 'tifi apy' && (
        <>
          <div className="mt-5 p-2 md:p-5 bg-tifi-dark rounded-lg">
            <TifiChart
              type="line"
              options={options}
              series={series}
              setSeries={setSeries}
            />
          </div>

          <section className="mt-6">
            <Notice
              handleClose={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ): void {
                throw new Error('Function not implemented.');
              }}
              text={T(
                'Note: The TIFI APY chart shows the comparison of TIFI reflection rate (holding TIFI in wallet) and TIFI staking rate. Both APY rates are determined by trading volume, but the staking takes extra trading fees to pay the earnings.',
              )}
            />
          </section>
        </>
      )}
      {activeTab === 'wbnb apy' && (
        <>
          <div className="mt-5 p-2 md:p-5 bg-tifi-dark rounded-lg">
            <TifiChart
              type="line"
              options={options}
              series={series}
              setSeries={setSeries}
            />
          </div>

          <section className="mt-6">
            <Notice
              handleClose={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
              ): void {
                throw new Error('Function not implemented.');
              }}
              text={T(
                'Note: The WBNB APY chart shows the APY earning rate for average users. You can only get the WBNB earning after your have staked TIFI for more than 180 days.',
              )}
            />
          </section>
        </>
      )}
    </section>
  );
};

export default StakeAnalytics;
