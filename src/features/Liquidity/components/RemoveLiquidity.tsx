import { arrowLeft } from '../../../assets/icons';
import Button from '../../../components/elements/Button';
import LiquidityWidget from '../widgets/LiquidityWidget';
import _ from 'lodash';
import { T } from 'react-translator-component';
import {
  useLiquidity,
  useLiquidityActions,
} from '../hooks/useLiquidityActions';
import { BSC_SCAN_URL, CONTRACT_ADDRESS, TOKENS } from '@config/constants';
import { extendToBigNumber, getErrorMessage, toFixed } from '@utils/tifi';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@features/Auth/hooks/useAuthActions';
import { ethers } from 'ethers';
import RouterABI from '@config/abi/TiFiRouter.json';
import { minABI } from '@config/TiFi_min_abi';
import { BounceLoader } from '@components/elements/Loaders';
import { useAlertActions } from '@hooks/useAlert';

const RemoveLiquidity = ({ back }: any) => {
  const { remove } = useLiquidity();
  const { address, provider } = useAuth();

  const { liquidityBalances } = useLiquidity();

  const { updateLiquidityBalance } = useLiquidityActions();

  const { setAlert } = useAlertActions();

  const [value, setValue] = useState(30);
  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [allowance_price, setAllowancePrice] = useState(0);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const getAllowance = useCallback(
    async (pairAddress: any) => {
      if (address && pairAddress) {
        const signer = provider.getSigner();
        let contract0 = new ethers.Contract(pairAddress, minABI, signer);
        const allow_price0 = await contract0.allowance(
          address,
          CONTRACT_ADDRESS.ROUTER_ADDRESS,
        );
        setAllowancePrice(allow_price0 / 10 ** 18);
      }
    },
    [address, provider],
  );

  const updateBalance = useCallback(
    async (pairAddress: string) => {
      const signer = provider.getSigner();
      if (pairAddress) {
        let contract = new ethers.Contract(pairAddress, minABI, signer);
        const balance = await contract.balanceOf(address);

        const balanceInWei = balance / 10 ** 18;

        let selectedPair = liquidityBalances.filter(
          (item): any => item.address === pairAddress,
        )[0];
        selectedPair.balance = balanceInWei;

        updateLiquidityBalance(selectedPair);
      }
    },
    [address, liquidityBalances, provider, updateLiquidityBalance],
  );

  useEffect(() => {
    const getData = async () => {
      await getAllowance(remove.address);
    };
    if (remove.balance) {
      getData();
    }
  }, [remove, getAllowance]);

  const handleEnable = async () => {
    setLoading(true);
    try {
      const signer = provider.getSigner();
      let contract0 = new ethers.Contract(remove.address, minABI, signer);

      let tx = await contract0.approve(
        CONTRACT_ADDRESS.ROUTER_ADDRESS,
        '1000000000000000000000000000000000000',
      );
      await tx.wait();
      await getAllowance(remove.address);
      setAlert({
        message: 'Approved! Now you can remove liquidity.',
        type: 'success',
        url: {
          link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
          text: 'Check Transaction on BSCScan',
        },
      });
      setLoading(false);
    } catch (error: any) {
      const removeError = error.data ? error.data.message : error.message;
      setAlert({
        message: removeError,
        type: 'error',
        url: { link: '', text: '' },
      });
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setRemoveLoading(true);
    const signer = provider.getSigner();
    let contractPrice = new ethers.Contract(
      CONTRACT_ADDRESS.ROUTER_ADDRESS,
      RouterABI.abi,
      signer,
    );
    const price = (remove.balance * value) / 100;
    let dateInAWeek = new Date();
    const deadline = Math.floor(dateInAWeek.getTime() / 1000) + 1000000;
    if (address != null) {
      try {
        let _amount;
        if (value === 100) {
          // Remove all balance
          let contract = new ethers.Contract(remove.address, minABI, signer);
          _amount = await contract.balanceOf(address);
        } else {
          _amount = extendToBigNumber(price.toString());
        }
        let tx: { hash: string; wait: () => any };
        if (remove.token0Title === 'BNB') {
          tx = await contractPrice.removeLiquidityETH(
            remove.token1Address,
            _amount,
            0,
            0,
            address,
            deadline,
          );
        } else if (remove.token1Title === 'BNB') {
          tx = await contractPrice.removeLiquidityETH(
            remove.token0Address,
            _amount,
            0,
            0,
            address,
            deadline,
          );
        } else {
          tx = await contractPrice.removeLiquidity(
            remove.token0Address,
            remove.token1Address,
            _amount,
            0,
            0,
            address,
            deadline,
          );
        }

        setAlert({
          message: 'Transaction Submitted!',
          type: 'notice',
          url: {
            link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on BSCScan',
          },
        });

        await tx.wait();

        setAlert({
          message: 'Liquidity Removal Success!',
          type: 'success',
          url: {
            link: `${BSC_SCAN_URL}/tx/${tx.hash}`,
            text: 'Check Transaction on BSCScan',
          },
        });
        updateBalance(remove.address);
        setRemoveLoading(false);
      } catch (error: any) {
        const removeError = error?.error ? error.error : getErrorMessage(error);
        setAlert({
          message: removeError,
          type: 'error',
          url: { link: '', text: '' },
        });

        setRemoveLoading(false);
      }
    }
  };

  return (
    <>
      <LiquidityWidget>
        <div className="flex items-center mb-5">
          <img
            onClick={back}
            src={arrowLeft}
            className="cursor-pointer"
            alt="Tifi add liquidity"
          />
          <h2 className="ml-5 text-lg font-semibold text-white">
            {T('Remove')} {remove.token0Title}/{remove.token1Title}{' '}
            {T('liquidity')}
          </h2>
        </div>

        <div className="bg-neutral-black-600 bg-opacity-80 p-4 text-white rounded-lg mb-4">
          <h3 className="lg:text-sm text-xs font-medium">Your Position</h3>
          <div className="grid grid-cols-3 mt-3 gap-x-7">
            <div className="border-r border-neutral-black-400">
              <div className="flex items-center lg:text-sm text-xs text-neutral-black-0 mb-2">
                <img
                  src={
                    TOKENS[
                      _.findIndex(TOKENS, function (o) {
                        return o.title === remove.token0Title;
                      })
                    ].icon
                  }
                  width={16}
                  height={16}
                  className="relative -mr-1"
                  alt="coin"
                />
                <img
                  src={
                    TOKENS[
                      _.findIndex(TOKENS, function (o) {
                        return o.title === remove.token1Title;
                      })
                    ].icon
                  }
                  width={16}
                  height={16}
                  alt="coin"
                />
                <span className="ml-3">
                  {remove.token0Title} / {remove.token1Title}
                </span>
              </div>
              <p className="text-sm font-semibold">{remove.balance}</p>
            </div>

            <div>
              <div className="flex items-center lg:text-sm text-xs text-neutral-black-0 mb-2">
                <img
                  src={
                    TOKENS[
                      _.findIndex(TOKENS, function (o) {
                        return o.title === remove.token0Title;
                      })
                    ].icon
                  }
                  width={16}
                  height={16}
                  alt="coin"
                />
                <span className="ml-3">{remove.token0Title}</span>
              </div>
              <p className="text-sm font-semibold">{remove.pool0}</p>
            </div>

            <div>
              <div className="flex items-center lg:text-sm text-xs text-neutral-black-0 mb-2">
                <img
                  src={
                    TOKENS[
                      _.findIndex(TOKENS, function (o) {
                        return o.title === remove.token1Title;
                      })
                    ].icon
                  }
                  width={16}
                  height={16}
                  alt="coin"
                />
                <span className="ml-3">{remove.token1Title}</span>
              </div>
              <p className="text-sm font-semibold">{remove.pool1}</p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-black-600 bg-opacity-80 pt-4 px-4 pb-6 text-white rounded-lg mb-4">
          <h3 className="text-sm">Amount to Remove</h3>
          <div className="my-4 flex items-center justify-between text-lg font-semibold">
            <span>{value}%</span>
            <div>
              <span>
                {toFixed((value * remove.balance) / 100) +
                  ' / ' +
                  toFixed(remove.balance)}
              </span>
            </div>
          </div>

          <div>
            {/* FIXME change to custom component and do form validation*/}
            <input
              type="number"
              value={value}
              onChange={handleChange}
              className="p-2 w-full bg-transparent mb-3 outline-none focus:border focus:border-blue-400 rounded-md placeholder:text-sm placeholder:text-tifi-gray-500"
              min="10"
              max="100"
              placeholder="Enter percentage value"
            />
          </div>

          <div className="grid grid-cols-4 gap-x-8">
            <button
              onClick={() => setValue(25)}
              className="bg-transparent hover:bg-primary-400 text-neutral-black-0 hover:text-white text-sm py-2 px-4 border border-neutral-black-0 rounded-md w-full"
            >
              25%
            </button>

            <button
              onClick={() => setValue(50)}
              className="bg-transparent hover:bg-primary-400 text-neutral-black-0 hover:text-white text-sm py-2 px-4 border border-neutral-black-0 rounded-md w-full"
            >
              50%
            </button>

            <button
              onClick={() => setValue(75)}
              className="bg-transparent hover:bg-primary-400 text-neutral-black-0 hover:text-white text-sm py-2 px-4 border border-neutral-black-0 rounded-md w-full"
            >
              75%
            </button>

            <button
              onClick={() => setValue(100)}
              className="bg-transparent hover:bg-primary-400 text-neutral-black-0 hover:text-white text-sm py-2 px-4 border border-neutral-black-0 rounded-md w-full"
            >
              Max
            </button>
          </div>
        </div>

        <div>
          <p className="font-semibold text-[#CCCCD0] text-sm">
            {T('You will Receive')}
          </p>

          <div className="bg-neutral-black-600 bg-opacity-80 p-4 my-4 rounded-lg">
            <div className="flex items-center lg:justify-between lg:flex-row flex-col mb-2">
              <div className="flex items-center text-sm  text-neutral-black-0 mb-2">
                <img
                  src={
                    TOKENS[
                      _.findIndex(TOKENS, function (o) {
                        return o.title === remove.token0Title;
                      })
                    ].icon
                  }
                  width={16}
                  height={16}
                  alt="coin"
                />
                <span className="ml-3">
                  {T('Pooled')} {remove.token0Title}
                </span>
              </div>
              <p className="text-base font-semibold text-white">
                {(remove.pool0 * remove.balance * value) / (remove.total * 100)}
              </p>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-neutral-black-0 mb-2 lg:justify-between lg:flex-row flex-col">
                <img
                  src={
                    TOKENS[
                      _.findIndex(TOKENS, function (o) {
                        return o.title === remove.token1Title;
                      })
                    ].icon
                  }
                  width={16}
                  height={16}
                  alt="coin"
                />
                <span className="ml-3">
                  {T('Pooled')} {remove.token1Title}
                </span>
              </div>
              <p className="text-base font-semibold text-white">
                {(remove.pool1 * remove.balance * value) / (remove.total * 100)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleEnable}
            label={loading ? <BounceLoader /> : T('Enable')}
            className={`${loading ? 'bg-primary/10' : 'bg-primary'
              } rounded-lg text-white`}
            disabled={allowance_price > (remove.balance * value) / 100}
          />

          <Button
            onClick={handleRemove}
            label={removeLoading ? <BounceLoader /> : T('Remove')}
            className={`${removeLoading ? 'bg-primary/10' : 'bg-primary'
              } rounded-lg text-white`}
            disabled={allowance_price <= (remove.balance * value) / 100}
          />
        </div>
      </LiquidityWidget>
    </>
  );
};

export default RemoveLiquidity;
