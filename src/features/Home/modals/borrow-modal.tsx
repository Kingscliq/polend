import Button from '@components/elements/Button';
import Modal from '@components/elements/Modal';
import React, { SetStateAction } from 'react';
import CustomTextField from '../components/CustomTextField';

interface BorrowModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
  borrowAmount: string | number;
  setBorrowAmount: React.Dispatch<SetStateAction<string | number>>;
}

const BorrowModal: React.FC<BorrowModalProps> = ({
  openModal,
  setOpenModal,
  borrowAmount,
  setBorrowAmount,
}) => {
  return (
    <Modal
      title="Borrow"
      modalClose={() => setOpenModal(false)}
      modalBody={
        <div className="my-5 text-white/75">
          <div>
            <CustomTextField
              label="Amount"
              placeholder="$0.00"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
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
            <Button label="Enter Amount" className="bg-primary" />
          </div>
        </div>
      }
    />
  );
};

export default BorrowModal;
