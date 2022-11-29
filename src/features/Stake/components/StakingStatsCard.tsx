// import { qMark } from '@//assets/icons';
// import TooltipComponent from '@//components/elements/TooltipComponent';
import React from 'react';
import { qMark } from '../../../assets/icons';
import TooltipComponent from '../../../components/elements/TooltipComponent';

interface StakingStatCardProps {
  title: string;
  desc: string | number;
  loading?: boolean
}

const StakingStatCard: React.FC<StakingStatCardProps> = ({ title, desc, loading }) => {
  return (
    <section className="mb-6 lg:mb-auto">
      <div className="flex items-center mb-4">
        {loading ? <div className="animate-pulse h-6 mb-2 w-36 my-2 bg-neutral-black-600"></div> : <h2 className="font-light lg:text-base text-xs text-tifi-grey">
          {title}
        </h2>}
        <TooltipComponent
          content={
            <>
              <p>hello kitty hi kitty</p>
              <p>hello kitty hi kitty how are yo</p>
              <p>kitty kitty kitty kitty</p>
            </>
          }
          position="right"
          children={<img src={qMark} alt="Create" />}
        />
      </div>
      {loading ? <div className="animate-pulse h-6 mb-2 w-36 my-2 bg-neutral-black-600"></div> : <p className="font-[600] text-white text-2xl">{desc}</p>}

    </section>
  );
};

export default StakingStatCard;
