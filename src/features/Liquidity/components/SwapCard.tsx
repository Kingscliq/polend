import { TOKENS } from '@config/constants';
import React, { useState } from 'react';
import { ReactNode } from 'react';
import DropdownModal, { SelectedProps } from '../../../components/elements/DropdownModal';
import TextField from '../../../components/elements/TextField';

interface SwapCardProps {
  balance: number;
  amount: number;
  copyChildren: ReactNode;
}

const SwapCard: React.FC<SwapCardProps> = ({
  balance,
  amount,
  copyChildren,
}) => {

  const [selectedCurrency, setSelectedCurrency] = useState<SelectedProps>(TOKENS[0])

  return (
    <section className="bg-neutral-black-500 p-4 text-white rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <small className="text-neutral-black-0 text-xs">From</small>
        </div>
        <div>
          <small className="text-neutral-black-0 text-xs">
            Balance: {balance || '1'}
          </small>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-full">
          <DropdownModal selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
        </div>
        <div className="w-full">
          <TextField
            placeholder="0.00"
            className="bg-transparent"
            inputClass="text-3xl text-white text-right"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>{copyChildren && copyChildren}</div>
        <div className="border border-primary rounded-lg px-1">
          <small className="text-xs">Max</small>
        </div>
      </div>
    </section>
  );
};

export default SwapCard;
