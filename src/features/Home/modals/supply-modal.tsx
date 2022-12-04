import Button from '@components/elements/Button';
import Modal from '@components/elements/Modal';
import React, { SetStateAction } from 'react';
import CustomTextField from '../components/CustomTextField';

interface SupplyModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
  supplyAmount: number | string;
  setSupplyAmount: React.Dispatch<SetStateAction<string | number>>;
  handleSupply: () => void;
  supplyLoading: boolean;
  balance: number;
}

const SupplyModal: React.FC<SupplyModalProps> = ({
  openModal,
  setOpenModal,
  supplyAmount,
  setSupplyAmount,
  handleSupply,
  supplyLoading,
  balance,
}) => {
  return (
    <Modal
      title="Supply"
      modalClose={() => setOpenModal(false)}
      modalBody={
        <div className="my-5 text-white/75">
          <div>
            <CustomTextField
              className="appearance-none outline-none"
              inputClass="w-full lg:w-[400px]"
              type="number"
              label="Amount"
              placeholder="0.00"
              value={supplyAmount}
              onChange={(e) => setSupplyAmount(e.target.value)}
              balance={balance}
            />
          </div>
          <div className="my-8">
            <h3 className="mb-2">Transaction Summary</h3>
            <div className="border-purple-50/40 opacity-40 border p-2">
              <div className="flex items-center justify-between">
                <div>
                  <small>Supply APY</small>
                </div>
                <div>{'< 0.01 %'}</div>
              </div>
              <div className="my-3 flex items-center justify-between">
                <div>
                  <small>Collaterization</small>
                </div>
                <div className="text-green-400">
                  <small>Enabled</small>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <small>Health Factor</small>
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div>
            <Button
              label={`${
                supplyAmount <= 0 || supplyAmount === ''
                  ? 'Enter Amount'
                  : 'Supply'
              }`}
              className="bg-primary"
              disabled={supplyAmount <= 0}
              onClick={handleSupply}
              loading={supplyLoading}
            />
          </div>
        </div>
      }
    />
  );
};

export default SupplyModal;
