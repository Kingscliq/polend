import React, { useState } from 'react';
import Modal from '../../elements/Modal';
import { useWeb3React } from '@web3-react/core';
import { connectors_data } from './config';
import { toast } from 'react-toastify';
import { useAuthActions } from '../../../features/Auth/hooks/useAuthActions';

type ConnectWalletProps = {
  modalClose?: any;
  src?: string;
  label?: string;
  connectorId?: string;
};

type WalletButtonProps = {
  src?: string;
  label?: string;
  disabled?: boolean;
  onClick?: any;
};

export const WalletButton = ({
  src,
  label,
  disabled,
  onClick,
}: WalletButtonProps) => {
  return (
    <button
      className="text-center p-4 hover:bg-neutral-black-500"
      disabled={disabled}
      onClick={onClick}
    >
      <img
        src={src}
        className={`h-8 w-8 mx-auto ${disabled ? 'grayscale' : ''}`}
        alt="Wallet connect icon"
      />
      <span
        className={`capitalize text-sm mt-3 block whitespace-normal ${disabled ? 'text-neutral-black-0' : 'text-white'
          }`}
      >
        {label}
      </span>
    </button>
  );
};

const ConnectWallet = ({ modalClose }: ConnectWalletProps) => {
  const [accept, setAccept] = useState(false);
  const { error } = useWeb3React();
  const [selectedWallet, setSelectedWallet] = useState<ConnectWalletProps>();

  const selectWallet = (value: string) => {
    const selected = connectors_data?.find(
      (wallet: {
        icon?: string | undefined;
        title?: string | undefined;
        connectorId?: string | undefined;
      }): boolean => wallet?.title === value,
    );
    modalClose();
    setSelectedWallet(selected);
  };

  const { login } = useAuthActions();

  return (
    <div>
      <Modal
        modalClose={modalClose}
        customStyles="bg-neutral-black-700 w-full sm:w-4/5 lg:w-3/5 xl:w-2/5"
        title="Connect Wallet"
        modalBody={
          <>
            <div className="flex items-center my-5">
              <input
                type="checkbox"
                className="accent-primary"
                checked={accept}
                onChange={() => setAccept(!accept)}
              />
              <label className="ml-3 text-grey-100 text-sm font-normal">
                I have read, understand, and agree to the
                <span className="text-primary">Terms of Service.</span>
              </label>
            </div>

            <div className="mt-10 grid grid-cols-3 lg:grid-cols-4 gap-8">
              {connectors_data?.map((item) => (
                <WalletButton
                  key={item?.title}
                  src={item?.icon}
                  label={item?.title}
                  disabled={!accept}
                  // onClick={() => selectWallet(item?.title)}
                  onClick={() => {
                    console.log(item);
                    login(item);
                    setTimeout(() => {
                      error && toast.error('Wallet Connection Failed');
                      modalClose();
                    }, 1500);
                  }}
                />
              ))}
            </div>
          </>
        }
      />
    </div>
  );
};

export default ConnectWallet;
