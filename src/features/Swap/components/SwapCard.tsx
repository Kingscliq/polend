import { copy, metamask } from '@assets/icons';
import CopyComponent from '@components/elements/CopyComponent';
import IconBadge from '@components/elements/IconBadge';
import React from 'react';
import DropdownModal, {
  SelectedProps,
} from '../../../components/elements/DropdownModal';
import TextField from '../../../components/elements/TextField';
import { T } from 'react-translator-component';

interface SwapCardProps {
  balance: number;
  amount: number;
  fromText: string;
  selectedCurrency: SelectedProps;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<string>> | any;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputValue?: string | number;
  handleMax?: () => void;
}

const SwapCard: React.FC<SwapCardProps> = ({
  balance,
  amount,
  fromText,
  selectedCurrency,
  setSelectedCurrency,
  handleInputChange,
  inputValue,
  handleMax,
}) => {
  return (
    <section className="bg-neutral-black-500 p-4 text-white rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <small className="text-neutral-black-0 text-xs">{fromText}</small>
        </div>
        <div>
          <small className="text-neutral-black-0 text-xs">
            Balance: {balance}
          </small>
        </div>
      </div>
      <div className="flex items-center lg:flex-row flex-col lg:justify-between my-2">
        <div className="w-full">
          <DropdownModal
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
        </div>
        <div>
          <TextField
            placeholder="0.00"
            className="bg-tifi-dark mr-[-2] lg:w-[250px] bg-opacity-60 px-2"
            inputClass="text-3xl text-white lg:text-right"
            onChange={handleInputChange}
            value={inputValue}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        {selectedCurrency?.title === 'TIFI' && (
          <div className="flex items-center">
            <CopyComponent
              copyText={selectedCurrency?.address}
              copyBody={<IconBadge icon={copy} />}
            />
            <div>
              <img src={metamask} alt="meta icon" />
            </div>
          </div>
        )}
        <div
          onClick={handleMax}
          className="ml-auto border border-primary rounded-lg px-1 cursor-pointer"
        >
          <small className="text-xs">{T('Max')}</small>
        </div>
      </div>
    </section>
  );
};

export default SwapCard;
