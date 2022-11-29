import React from 'react';
import { T } from 'react-translator-component';

interface HomeStatCardProps {
  title: string;
  desc: string;
}

const HomeStatCard: React.FC<HomeStatCardProps> = ({ title, desc }) => {
  return (
    <section className="text-center">
      <h2 className="font-light lg:text-base text-xs text-tifi-grey mb-5">
        {T(title)}
      </h2>
      <p className="font-[600] text-white text-2xl">{T(desc)}</p>
    </section>
  );
};

export default HomeStatCard;
