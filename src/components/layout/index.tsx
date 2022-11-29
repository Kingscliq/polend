import MobileSideNav from '@components/widget/sidenav/MobileSidenav';
import React, { ReactNode, useState } from 'react';
import Header from '../widget/header';
// import SideNav from '../widget/sidenav';

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [openMobileNav, setOpenMobileNav] = useState(false);

  return (
    <section>
      {/* desktop sidebar */}
      {/* <SideNav /> */}

      {/* mobile sidebar */}
      <MobileSideNav
        openNav={openMobileNav}
        setOpenNav={() => setOpenMobileNav(false)}
      />

      {/* main content */}
      <main className="">
        <header className="bg-[#0C0C17]/80 py-5 px-5 md:px-10">
          <Header openNav={() => setOpenMobileNav(true)} />
        </header>
        <section className="py-5 px-5 md:px-10">{children}</section>
      </main>
    </section>
  );
};

export default Layout;
