import Accordion from '@components/elements/Accordion';
import _ from 'lodash';
import { LP_TOKENS, TOKENS } from '@config/constants';
import { minABI } from '@config/TiFi_min_abi';
import { useAuth } from '@features/Auth/hooks/useAuthActions';
import { ethers } from 'ethers';
import { useCallback, useEffect } from 'react';
import Button from '../../../components/elements/Button';
import LiquidityWidget from '../widgets/LiquidityWidget';
import {
  useLiquidity,
  useLiquidityActions,
} from '../hooks/useLiquidityActions';
import { toFixed } from '@utils/tifi';
import { T } from 'react-translator-component';

export const LiquidityItem = ({ item, showRemove }: any) => {
  const { pool0, pool1, totalPool, remove, liquidityBalances } = useLiquidity();

  const { setPool0, setPool1, setTotalPool, setRemove } = useLiquidityActions();
  const { provider } = useAuth();

  const handleClick = async (pair: any) => {
    // setExpanded(isExpanded ? pair.address : false);

    const signer = provider.getSigner();
    let contract = new ethers.Contract(pair.address, minABI, signer);

    let totalLp = await contract.totalSupply();
    setTotalPool(totalLp / 10 ** 18);
    let contaract0 = new ethers.Contract(pair.token0Address, minABI, signer);
    let contaract1 = new ethers.Contract(pair.token1Address, minABI, signer);
    let pooledToken0 = await contaract0.balanceOf(pair.address);
    let pooledToken1 = await contaract1.balanceOf(pair.address);
    setPool0(pooledToken0 / 10 ** 18);
    setPool1(pooledToken1 / 10 ** 18);

    console.log({ remove }, { liquidityBalances });
  };

  const updateRemove = async (obj: any) => {
    const data = { ...obj, pool0: pool0, pool1: pool1, total: totalPool };

    try {
      setRemove(data);
      showRemove();
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Accordion
        onClick={() => handleClick(item)}
        number={toFixed(item.balance)}
        title={
          <div className="flex items-center lg:text-sm text-xs">
            <div className="mr-2 flex lg:text-sm text-xs">
              <img
                src={
                  TOKENS[
                    _.findIndex(TOKENS, function (o) {
                      return o.title === item.token0Title;
                    })
                  ]?.icon
                }
                className="relative -mr-2"
                alt="coins"
              />
              <img
                src={
                  TOKENS[
                    _.findIndex(TOKENS, function (o) {
                      return o.title === item.token1Title;
                    })
                  ]?.icon
                }
                alt="coins1"
              />
            </div>
            <span className="text-white text-xs lg:text-base">
              {item.token0Title}-{item.token1Title}
            </span>
          </div>
        }
        body={
          <>
            <div className="text-neutral-black-10 flex items-center  lg:text-sm text-xs justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={
                    TOKENS[
                      _.findIndex(TOKENS, function (o) {
                        return o.title === item.token0Title;
                      })
                    ]?.icon
                  }
                  className="mx-2"
                  alt="coin1"
                />
                <span className="lg:text-sm text-xs">
                  {T('Pooled')} {item.token0Title}
                </span>
              </div>
              <span> {toFixed((pool0 * item.balance) / totalPool)} </span>
            </div>

            <div className="text-neutral-black-10 flex items-center lg:text-sm text-xs justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={
                    TOKENS[
                      _.findIndex(TOKENS, function (o) {
                        return o.title === item.token1Title;
                      })
                    ]?.icon
                  }
                  className="mx-2"
                  alt="coin2"
                />
                <span className="lg:text-sm text-xs">
                  {T('Pooled')} {item.token1Title}
                </span>
              </div>
              <span> {toFixed((pool1 * item.balance) / totalPool)} </span>
            </div>

            <div className="text-neutral-black-10 flex lg:items-center flex-col lg:flex-row justify-between mb-4 lg:text-sm text-xs">
              <span className="text-sm font-semibold">
                {T('Share of pool')}
              </span>

              <span> {toFixed((100 * item.balance) / totalPool) + '%'} </span>
            </div>
            <div className="mt-10">
              <Button
                disabled={!pool0 || !pool1}
                onClick={() => updateRemove(item)}
                label="Remove Liquidity"
                className="bg-transparent hover:bg-blue-gray-700 border-2 border-white rounded-xl text-white"
              />
            </div>
          </>
        }
      />
    </>
  );
};

const LiquidityList = ({ showRemove, showAdd }: any) => {
  // actual code
  const { address, provider } = useAuth();

  const { liquidityBalances } = useLiquidity();
  const { setLiquidityBalances } = useLiquidityActions();

  const getBalance = useCallback(async () => {
    let tmp: {
      balance: number;
      token0Title: string;
      token1Title: string;
      address: string;
      token0Address: any;
      token1Address: any;
    }[] = [];
    const signer = provider.getSigner();
    try {
      if (address != null) {
        await Promise.all(
          LP_TOKENS.map(async (item, index) => {
            let contract = new ethers.Contract(item.address, minABI, signer);
            const lp_val0 = await contract.balanceOf(address);
            const temp_val = lp_val0 / 10 ** 18;
            if (temp_val > 0) {
              tmp.push({
                balance: temp_val,
                token0Title: item.token0_name,
                token1Title: item.token1_name,
                address: item.address,
                token0Address:
                  TOKENS[
                    _.findIndex(TOKENS, (o) => o.title === item.token0_name)
                  ].address,
                token1Address:
                  TOKENS[
                    _.findIndex(TOKENS, (o) => o.title === item.token1_name)
                  ].address,
              });
            }
          }),
        );
        setLiquidityBalances(tmp);
      }
    } catch (error) {
      throw error;
    }
  }, [address, provider, setLiquidityBalances]);

  useEffect(() => {
    const getData = async () => {
      await getBalance();
    };
    if (address && provider) {
      getData();
    }
  }, [address, provider, getBalance]);

  return (
    <LiquidityWidget>
      <div className="h-96 overflow-y-auto">
        {liquidityBalances && liquidityBalances.length > 0 ? (
          liquidityBalances.map((item, i) => (
            <LiquidityItem key={i} item={item} showRemove={showRemove} />
          ))
        ) : (
          <div className="bg-neutral-black-500 text-white p-2 rounded-2xl h-24 flex items-center justify-center my-28 lg:my-32">
            <span className="text-base lg:text-2xl font-medium">
              No Liquidity Found
            </span>
          </div>
        )}
      </div>
      <div>
        <Button
          onClick={showAdd}
          label="Add Liquidity"
          className="bg-primary rounded-lg text-white"
        />
      </div>
    </LiquidityWidget>
  );
};

export default LiquidityList;
