import React, { ChangeEvent, useEffect, useState, useCallback } from 'react';

import { SelectedProps } from '@components/elements/DropdownModal';
import {
  BSC_SCAN_URL,
  CONTRACT_ADDRESS,
  STAKE_BNB_FEE,
  TIFI_ADDRESS,
  TOKENS,
} from '@config/constants';
import SwapCard from '@features/Swap/components/SwapCard';
import Button from '@components/elements/Button';
import { useWeb3React } from '@web3-react/core';
import ConnectWallet from '@components/widget/connect-wallet';
import { ethers } from 'ethers';
import { minABI } from '@config/TiFi_min_abi';
import { toast } from 'react-toastify';
import { T } from 'react-translator-component';
import { extendToBigNumber, getErrorMessage } from '@utils/tifi';
import StakeABI from '@config/abi/TiFiReservior.json';
import StakeWidget from '../components/StakeWidget';
import { useNavigate } from 'react-router-dom';
import { useAlertActions } from '@hooks/useAlert';

const StakeAdd = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState<SelectedProps>(
    TOKENS[2],
  );
  const [openConnectModal, setOpenConnectModal] = useState<boolean>(false);
  const { account: address, library: provider } = useWeb3React();
  const [amount, setAmount] = useState<string>('0');
  const [balance, setBalance] = useState<number>(0);
  const [allowAmount, setAllowAmount] = useState<number>(0);
  const [availableBalance, setAvailableBalance] = useState(true);
  const [status, setStatus] = useState(false);
  const { setAlert } = useAlertActions();

  // HandleChange
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let tmpval: any = e.target.value ? e.target.value : 0;
    if (tmpval < 0 || isNaN(tmpval)) {
      tmpval = amount;
    } else if (
      !(
        typeof tmpval === 'string' &&
        (tmpval.endsWith('.') || tmpval.startsWith('.'))
      )
    ) {
      tmpval = Number(e.target.value.toString());
    }
    setAvailableBalance(tmpval <= balance);
    setAmount(tmpval);
  };
  // Get Balance
  const getBalance = useCallback(async () => {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(TIFI_ADDRESS, minABI, signer);
    try {
      if (address != null) {
        const tifiBal = await contract.balanceOf(address);
        setBalance(Math.floor(Number(tifiBal._hex) / Number(10 ** 18))); // TiFi Decimal is 18
      } else {
        return 0;
      }
    } catch (error) {
      return 0;
    }
  }, [address, provider]);

  // Check Allowance
  const checkAllowance = useCallback(async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(TIFI_ADDRESS, minABI, signer);
    const amount = await contract.allowance(
      address,
      CONTRACT_ADDRESS.RESERVIOR_ADDRESS,
    );
    setAllowAmount(amount / 10 ** 18);
  }, [address, provider]);

  // Handle Add Token
  // const handleAddToken = async () => {
  //     const provider: any = window.ethereum
  //     try {
  //         const wasAdded = await provider?.request({
  //             method: "wallet_watchAsset",
  //             param: {
  //                 type: "ERC20",
  //                 options: {
  //                     address: TIFI_ADDRESS,
  //                     symbol: "TIFI",
  //                     decimals: 18,
  //                 },
  //             },
  //         });
  //         if (wasAdded) {
  //             setAlert({
  //                 message: `TiFi Token ${T("Added")}`,
  //                 type: 'success',
  //                 url: {
  //                     link: ``,
  //                     text: '',
  //                 },
  //             });
  //         } else {

  //             setAlert({
  //                 message: `TiFi Token ${T("add failed")}`,
  //                 type: 'error',
  //                 url: {
  //                     link: ``,
  //                     text: '',
  //                 },
  //             });
  //         }
  //     } catch (error: any) {
  //         const supplyError = error?.error ? error.error : getErrorMessage(error);
  //         setAlert({
  //             message: supplyError,
  //             type: 'error',
  //             url: {
  //                 link: '',
  //                 text: '',
  //             },
  //         });
  //     }
  // };

  // Handle Approve
  const handleApprove = async () => {
    setStatus(true);
    try {
      const contract = new ethers.Contract(
        TIFI_ADDRESS,
        minABI,
        provider.getSigner(),
      );
      const tx = await contract.approve(
        CONTRACT_ADDRESS.RESERVIOR_ADDRESS,
        '1000000000000000000000000000000000000',
      );
      await tx.wait();

      setAlert({
        message: T('Approved! Now you can stake.'),
        type: 'success',
        url: {
          link: `${BSC_SCAN_URL} /tx/${tx.hash}`,
          text: 'Check Transaction on BSCScan',
        },
      });
      await checkAllowance();
    } catch (error: any) {
      const supplyError = error?.error ? error.error : getErrorMessage(error);
      setAlert({
        message: supplyError,
        type: 'error',
        url: {
          link: '',
          text: '',
        },
      });
    }
    setStatus(false);
  };

  // Handle Stake
  const handleStake = async () => {
    setStatus(true);
    if (address != null) {
      try {
        const stakeContract = new ethers.Contract(
          CONTRACT_ADDRESS.RESERVIOR_ADDRESS,
          StakeABI.abi,
          provider.getSigner(),
        );
        const tx = await stakeContract.deposit(extendToBigNumber(amount), {
          value: ethers.utils.parseUnits(STAKE_BNB_FEE, 'ether')._hex,
        });

        setAlert({
          message: T('Approved! Now you can stake.'),
          type: 'success',
          url: {
            link: `${BSC_SCAN_URL} /tx/${tx.hash}`,
            text: 'Check Transaction on BSCScan',
          },
        });
        await tx.wait();

        setAlert({
          message: 'Stake Success!',
          type: 'success',
          url: {
            link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on BSCScan',
          },
        });
        setAmount('0');
        await getBalance();
        navigate('/stake');
      } catch (error) {
        toast.error(getErrorMessage(error as any));
      }
      setStatus(false);
    }
  };

  useEffect(() => {
    if (address && provider) {
      setAmount('0');
      getBalance();
      checkAllowance();
    }
  }, [address, provider, getBalance, checkAllowance]);
  return (
    <StakeWidget title="Stake Tifi" onClick={() => navigate(-1)}>
      <div>
        {openConnectModal && (
          <ConnectWallet modalClose={() => setOpenConnectModal(false)} />
        )}
        <div className="mb-4">
          <SwapCard
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            fromText="Input"
            balance={balance}
            handleInputChange={(e) => handleChange(e)}
            amount={0}
          />
        </div>
        {address ? (
          <div>
            {allowAmount < Number(amount) && availableBalance && (
              <Button
                className="bg-primary text-white"
                label={'Enable TiFi'}
                onClick={() => handleApprove()}
              />
            )}
            <div className="my-4">
              <Button
                disabled={
                  !availableBalance ||
                  status ||
                  allowAmount < Number(amount) ||
                  Number(amount) === 0
                }
                className="bg-primary text-white"
                label={
                  !availableBalance
                    ? T('Insufficient balance')
                    : status && allowAmount >= Number(amount)
                    ? 'Loading'
                    : T('Stake')
                }
                onClick={() => handleStake()}
                loading={status}
              />
            </div>
          </div>
        ) : (
          <Button
            className="bg-primary text-white"
            label={'Connect Wallet'}
            onClick={() => setOpenConnectModal(true)}
          />
        )}
      </div>
    </StakeWidget>
  );
};

export default StakeAdd;
