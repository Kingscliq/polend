import Button from '@components/elements/Button';
import Modal from '@components/elements/Modal';
import { useAuthActions } from '@features/Auth/hooks/useAuthActions';
import { useWeb3React } from '@web3-react/core';
import React, { useState } from 'react';
import { connectors_data } from './config';
import { T } from 'react-translator-component';
import { shorten } from '@utils/formatters';
import { useAlertActions } from '@hooks/useAlert';

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
        className={`capitalize text-sm mt-3 block whitespace-normal ${
          disabled ? 'text-neutral-black-0' : 'text-white'
        }`}
      >
        {label}
      </span>
    </button>
  );
};

const WalletConnector: React.FC<{ label?: string }> = ({ label }) => {
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [accept, setAccept] = useState(false);
  const { error, account } = useWeb3React();

  const { login } = useAuthActions();

  const { setAlert } = useAlertActions();

  const connect = (item: { title: any; icon?: string; connectorId: any }) => {
    login(item);
    setTimeout(() => {
      error &&
        setAlert({
          message: 'Wallet Connection Failed',
          type: 'error',
          url: {
            link: '',
            text: '',
          },
        });
      setOpenConnectModal(false);
    }, 1500);
  };

  return (
    <div>
      <Button
        onClick={() => !account && setOpenConnectModal(true)}
        className={`transition-all duration-600 ease-in-out text-white text-xs lg:text-base rounded-lg bg-primary`}
        label={account ? shorten(account) : T(label || 'Connect Wallet')}
      />

      {/* wallet modal */}
      {openConnectModal && (
        <Modal
          modalClose={() => setOpenConnectModal(false)}
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
                    onClick={() => connect(item)}
                  />
                ))}
              </div>
            </>
          }
        />
      )}
    </div>
  );
};

export default WalletConnector;
