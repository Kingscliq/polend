import React from 'react';
import SidebarMenuItem from '../../../components/elements/Menu/SidebarMenuItem';
import {
  homeActive,
  homeBase,
  hotIcon,
  lendingBase,
  liquidityActive,
  liquidityBase,
  logo,
  lotteryBase,
  portfolioActive,
  portfolioBase,
  stakingActive,
  stakingBase,
  swapActive,
  swapBase,
  trending,
} from '../../../assets/icons';
import AllVerse from '../allverse';
import { useLocation } from 'react-router-dom';
import Socials from '../socials';

const SideNav = () => {
  const location = useLocation();

  return (
    <div
      className={`bg-neutral-black-700 px-8 py-8 w-96 md:w-72 h-full hidden lg:flex flex-col justify-between fixed overflow-y-auto z-50 transition-all ease-in-out duration-300`}
    >
      <div>
        <img src={logo} alt="light logo" />
      </div>
      <aside className="mt-10">
        <div className="mb-2">
          <SidebarMenuItem
            baseIcon={homeBase}
            activeIcon={homeActive}
            title="Home"
            url="/"
            active={location.pathname === '/'}
          />
        </div>

        <div className="mb-2">
          <SidebarMenuItem
            baseIcon={swapBase}
            activeIcon={swapActive}
            title="Swap"
            url="/swap"
            active={location.pathname === '/swap'}
          />
        </div>

        <div className="mb-2">
          <SidebarMenuItem
            baseIcon={stakingBase}
            activeIcon={stakingActive}
            title="Stake"
            url="/stake"
            active={location.pathname === '/stake'}
            optionalIcon={hotIcon}
          />
        </div>

        <div className="mb-2">
          <SidebarMenuItem
            baseIcon={liquidityBase}
            activeIcon={liquidityActive}
            title="Liquidity"
            url="/liquidity"
            active={location.pathname === '/liquidity'}
            optionalIcon={trending}
          />
        </div>

        <div className="mb-2">
          <SidebarMenuItem
            baseIcon={portfolioBase}
            activeIcon={portfolioActive}
            title="Portfolio"
            url="/portfolio_pool"
            active={location.pathname === '/portfolio_pool'}
          />
        </div>

        <div className="mb-2">
          <SidebarMenuItem
            baseIcon={lotteryBase}
            activeIcon={lotteryBase}
            title="Lottery"
            url="/lottery"
            active={location.pathname === '/lottery'}
          />
        </div>

        <div className="mb-2">
          <SidebarMenuItem
            baseIcon={lendingBase}
            activeIcon={lendingBase}
            title="Loan"
            url="/loan"
            active={location.pathname === '/loan'}
          />
        </div>
      </aside>

      <div className="mt-auto">
        <AllVerse />
        <div className="my-5">
          <Socials />
        </div>
      </div>
    </div>
  );
};

export default SideNav;
