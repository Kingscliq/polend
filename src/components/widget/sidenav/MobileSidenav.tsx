import React from 'react';
import SidebarMenuItem from '../../../components/elements/Menu/SidebarMenuItem';
import {
  close,
  homeActive,
  homeBase,
  lendingBase,
  logo,
} from '../../../assets/icons';
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
              baseIcon={lendingBase}
              activeIcon={lendingBase}
              title="Market"
              url="/market"
              active={location.pathname === '/market'}
            />
          </div>

          <div className="mb-2">
            <SidebarMenuItem
              onClick={setOpenNav}
              baseIcon={lendingBase}
              activeIcon={lendingBase}
              title="Learn More"
              url="/learn-more"
              active={location.pathname === '/learn-more'}
            />
          </div>
        </aside>

        <div className="mt-auto">
          <Socials />
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
