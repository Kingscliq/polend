import React from 'react';
import SidebarMenuItem from '../../../components/elements/Menu/SidebarMenuItem';
import {
  close,
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

const MobileSideNav = ({ openNav, setOpenNav }: any) => {
  const location = useLocation();

  return (
    <>
      <div
        className={`bg-neutral-black-700 px-8 py-8 w-80 md:w-96 h-full flex lg:hidden flex-col justify-between fixed overflow-y-auto z-[100] transition-all ease-in-out duration-300 scrollbar-hide ${
          openNav ? 'left-0' : '-left-96'
        }`}
      >
        <div className="flex items-center">
          <button onClick={setOpenNav} className="p-2 mr-3 lg:hidden">
            <img src={close} height={20} width={20} alt="close light" />
          </button>
          <div>
            <img src={logo} alt="light logo" />
          </div>
        </div>

        <aside className="mt-10">
          <div className="mb-2">
            <SidebarMenuItem
              onClick={setOpenNav}
              baseIcon={homeBase}
              activeIcon={homeActive}
              title="Home"
              url="/"
              active={location.pathname === '/'}
            />
          </div>

          <div className="mb-2">
            <SidebarMenuItem
              onClick={setOpenNav}
              baseIcon={swapBase}
              activeIcon={swapActive}
              title="Swap"
              url="/swap"
              active={location.pathname === '/swap'}
            />
          </div>

          <div className="mb-2">
            <SidebarMenuItem
              onClick={setOpenNav}
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
              onClick={setOpenNav}
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
              onClick={setOpenNav}
              baseIcon={portfolioBase}
              activeIcon={portfolioActive}
              title="Portfolio"
              url="/portfolio_pool"
              active={location.pathname === '/portfolio_pool'}
            />
          </div>

          <div className="mb-2">
            <SidebarMenuItem
              onClick={setOpenNav}
              baseIcon={lotteryBase}
              activeIcon={lotteryBase}
              title="Lottery"
              url="/lottery"
              active={location.pathname === '/lottery'}
            />
          </div>

          <div className="mb-2">
            <SidebarMenuItem
              onClick={setOpenNav}
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

      <div
        className={
          openNav
            ? 'fixed bg-black bg-opacity-50 overflow-y-auto top-0 left-0 h-full w-full z-30'
            : ''
        }
      ></div>
    </>
  );
};

export default MobileSideNav;
