// import { arrowLeft } from '@//assets/icons';
import React from 'react';
import { ReactNode } from 'react';

interface AddLiquidityWidgetProps {
  children: ReactNode;
}
const LiquidityWidget: React.FC<AddLiquidityWidgetProps> = ({ children }) => {
  return (
    <section className="bg-tifi-dark rounded-xl p-6 lg:p-8 bg-opacity-80">
      {children}
    </section>
  );
};

export default LiquidityWidget;
