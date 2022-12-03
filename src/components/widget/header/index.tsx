import React, { useState } from 'react';

// import Button from '@components/elements/Button';
import { useLocation } from 'react-router-dom';

import ConnectWallet from '../connect-wallet';
import { useWeb3React } from '@web3-react/core';
import 'react-dropdown/style.css';
import { homeActive, homeBase, logo, menuIcon, user } from '../../../assets/icons';
import Button from '../../elements/Button';
import { shorten } from '../../../utils/formatters';
import useAuthConnect from '../../../features/Auth/hooks/useAuthConnect';
import en from '@config/locale/en';
import ar from '@config/locale/ar';
import de from '@config/locale/de';
import zhcn from '@config/locale/zhcn';
import zhtw from '@config/locale/zhtw';
import { arIcon, deIcon, enIcon, zhcnIcon, zhtwIcon } from '@config/flag';
import { T, Config, LanguageList } from 'react-translator-component';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import SelectComponent from '@components/elements/SelectComponent';
import { useEffect } from 'react';
import SidebarMenuItem from '@components/elements/Menu/SidebarMenuItem';

const Header = ({ openNav }: any) => {
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  /* Default Language */
  Config.default = language;

  /* Language List */
  Config.list = {
    de: {
      text: 'Deutsch',
      icon: deIcon,
      file: de,
    },
    en: {
      text: 'English',
      icon: enIcon,
      file: en,
    },
    ar: {
      text: 'العربية',
      icon: arIcon,
      file: ar,
    },
    zhcn: {
      text: '简体中文',
      icon: zhcnIcon,
      file: zhcn,
    },
    zhtw: {
      text: '繁體中文',
      icon: zhtwIcon,
      file: zhtw,
    },
  };

  const options = [
    { value: 'en', label: 'English', icon: enIcon },
    { value: 'de', label: 'Deustch', icon: deIcon },
    { value: 'ar', label: 'العربية', icon: arIcon },
    { value: 'zhcn', label: '简体中文', icon: zhcnIcon },
    { value: 'zhtw', label: '繁體中文', icon: zhtwIcon },
  ];

  const [selectedValue, setSelectedValue] = useState(options[0]);

  useEffect(() => {
    setLanguage({ language: selectedValue?.value });
  }, [selectedValue, setLanguage]);

  const location = useLocation();
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const { logout } = useAuthConnect();
  const { account } = useWeb3React();

  return (
    <nav>
      <section className="flex items-center justify-between">

        <div className='flex items-center'>
          <div className="flex items-center">
            <button onClick={openNav} className="block lg:hidden">
              <img src={menuIcon} alt="menu" />
            </button>

            <div className="block w-8 h-8">
              <img src={logo} className="h-full" alt="Logo" />
            </div>
          </div>
          <div className="hidden mr-auto">
            <h2 className="font-semibold md:text-xl text-white capitalize">
              {location?.pathname.split('/')[1].replaceAll('_', ' ')}
            </h2>
          </div>
          <div className='flex items-center ml-24'>
            <SidebarMenuItem
              // onClick={setOpenNav}
              baseIcon={homeBase}
              activeIcon={homeActive}
              title="Home"
              url="/"
              active={location.pathname === '/'} />
            <SidebarMenuItem
              // onClick={setOpenNav}
              baseIcon={homeBase}
              activeIcon={homeActive}
              title="Market"
              url="/market"
              active={location.pathname === '/market'} />
            <SidebarMenuItem
              // onClick={setOpenNav}
              baseIcon={homeBase}
              activeIcon={homeActive}
              title="Learn More"
              url="/learn-more"
              active={location.pathname === '/learn-more'} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="hidden md:block w-40">
            <LanguageList Language={language} />

            <SelectComponent
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              options={options}
            />
          </div>
          <div className="ml-4">
            <div>
              {account && (
                <div className="text-white flex items-center cursor-pointer">
                  <img src={user} alt="User profile" />
                  <span className="ml-2">{shorten(account)}</span>
                </div>
              )}
            </div>
            {!account && (
              <Button
                onClick={() => !account && setOpenConnectModal(true)}
                className="transition-all duration-600 ease-in-out text-white text-xs lg:text-base hover:bg-gradient-to-r hover:from-[#047CFD] hover:to-primary rounded-lg lg:rounded-xl"
                label={account ? shorten(account) : T('Connect Wallet')}
              />
            )}
          </div>
          {account && (
            <div className="ml-4">
              <Button
                onClick={() => logout()}
                className="transition-all duration-600 hidden lg:block ease-in-out text-white text-xs lg:text-base bg-primary rounded-lg lg:rounded-xl"
                label="Logout"
              />
            </div>
          )}
        </div>
      </section>
      {openConnectModal && (
        <ConnectWallet modalClose={() => setOpenConnectModal(false)} />
      )}
    </nav>
  );
};

export default Header;
