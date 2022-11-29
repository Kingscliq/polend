import React from 'react';
import { fire } from '../../../assets/icons';
import Button from '../../../components/elements/Button';
import Card from '../../../components/elements/Card';
import { T } from 'react-translator-component';

interface HomeCardProps {
  icon: string;
  title: string;
  description: string;
  btnLabel: string;
  apy?: boolean;
  onClick?: () => void
}

const HomeCard: React.FC<HomeCardProps> = ({
  icon,
  title,
  description,
  btnLabel,
  apy,
  onClick
}) => {
  return (
    <section>
      <Card className="rounded-2xl bg-gradient-to-tr from-tifi-dark via-tifi-dark to-[#05a7ec4a] relative bg-opacity-30 backdrop-blur-xl lg:h-[350px]">
        <section className="text-white">
          {apy && (
            <aside className="rounded-l-3xl absolute flex items-center justify-between p-2 right-0 top-4 bg-fire">
              <div className="text-xs">APY 397%</div>
              <div>
                <img src={fire} alt="Fire" />
              </div>
            </aside>
          )}
          <div className="mt-6">
            <img src={icon} alt="Swap" />
          </div>
          <div className="mb-2 mt-8">
            <h3 className="text-lg font-medium">{T(title)}</h3>
          </div>
          <div className="mb-6">
            <p className="text-light-60 font-light text-[.875rem] leading-6">
              {T(description)}
            </p>
          </div>
          <div>
            <Button
              label={btnLabel}
              className="bg-primary text-white rounded-lg text-center"
              onClick={onClick}
            />
          </div>
        </section>
      </Card>
    </section>
  );
};

export default HomeCard;
