import { TOKENS } from '@config/constants';
import React, { useState } from 'react';
import { caretDown, searchIcon } from '../../../assets/icons';
import { busd, mfx, tifi, usdt } from '../../../assets/icons/currencies';
import Modal from '../Modal';

export type SelectedProps = {
  address: string;
  title: string;
  icon?: string;
  value?: number;
  description?: string;
  apiId?: string;
};

interface DropdownModalProp {
  selectedCurrency: SelectedProps;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<string>> | any;
  disabled?: boolean;
}

export const currencies = [
  { currency: 'BUSD', title: 'BUSD Token', icon: busd, value: 0 },
  {
    currency: 'TiFi',
    title: 'TiFi',
    icon: tifi,
    value: 4805070000,
  },
  { currency: 'USDT', title: 'Tether', icon: usdt, value: 0 },
  { currency: 'MFX', title: 'MetFX Watch to Earn', icon: mfx, value: 0 },
];

const DropdownModal: React.FC<DropdownModalProp> = ({
  selectedCurrency,
  setSelectedCurrency,
  disabled,
}) => {

  const [openModal, setOpenModal] = useState(false);

  const selectCurrency = (value: string) => {
    const selected = TOKENS?.find(
      (currency: SelectedProps): boolean => currency?.description === value,
    );
    setOpenModal(false);
    setSelectedCurrency(selected);
  };
  return (
    <div className="w-full">
      <button
        onClick={() => (disabled ? null : setOpenModal(true))}
        className="flex items-center px-3 py-2 bg-neutral-black-400 rounded-lg"
      >
        <img src={selectedCurrency?.icon || TOKENS[0]?.icon} alt="Selected" />
        <span className="mx-3">
          {selectedCurrency?.title || TOKENS[0]?.title}
        </span>
        <img src={caretDown} alt="Caret Down" />
      </button>
      {openModal && (
        <Modal
          title="Select a token"
          modalClose={() => setOpenModal(false)}
          modalBody={
            <div>
              <div className="mt-5 bg-neutral-black-600 border border-white/[13%] flex items-center py-3 px-4 rounded-lg">
                <img src={searchIcon} alt="search Icon" />
                <input
                  className="ml-5 outline-none border-none w-full bg-transparent text-sm text-white placeholder:text-neutral-black-0"
                  placeholder="Enter the token symbol or address"
                />
              </div>

              <p className="mt-4 text-sm text-neutral-black-0">
                The following tokens are listed in TiFi Bank
              </p>

              <div className="mt-10">
                {TOKENS?.map((currency) => (
                  <div
                    onClick={() => selectCurrency(currency?.description)}
                    key={currency?.title}
                    className="flex items-center justify-between my-5 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <img src={currency?.icon} alt="Currency" />
                      <div className="ml-3">
                        <h4 className="text-xs text-neutral-black-0">
                          {currency?.description}
                        </h4>
                        <span className="text-white font-semibold">
                          {currency?.title}
                        </span>
                      </div>
                    </div>
                    <span className="text-white text-sm">
                      {currency?.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default DropdownModal;
