import { RoutesTab } from '@components/elements/Tab/RoutesTab';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { useEffect } from 'react';
import Header from '../../../Home/components/Header';
import PoolAnalyticsTable from './PoolAnalyticsTable';

const PoolAnalytics = () => {
  // for language translation
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

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
          title="Pool Analytics"
          description="Click on the column name to sort pairs by its volume or APR"
        />
      </section>

      <section className="mt-10">
        <PoolAnalyticsTable />
      </section>
    </section>
  );
};

export default PoolAnalytics;
