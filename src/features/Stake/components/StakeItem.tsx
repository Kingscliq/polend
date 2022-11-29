import { bnb, tifi } from "@assets/icons/currencies";
import Accordion from "@components/elements/Accordion";
import Button from "@components/elements/Button";
import { getDateTime } from "@utils/formatters";
import { MouseEvent } from "react";
import Notice from "../components/Notice";
import { T } from 'react-translator-component'
import { toFixed } from "@utils/tifi";
import { useMemo } from "react";
import { useStakeActions } from "../hooks/useGetStakeRecords";
import { useNavigate } from "react-router-dom";
import { STAKE_FULL_REWARD, STAKE_HALF_REWARD, STAKE_NO_REWARD } from "@config/constants";

interface StakeItemProps {
    timestamp: number | string,
    stakeAmount: number,
    curAmount: number,
    wbnbAmount: number,
}

const day30 = 1000 * 3600 * 24 * 30;
const day180 = day30 * 6;

export const StakeItem: React.FC<StakeItemProps> = ({ stakeAmount, timestamp, curAmount, wbnbAmount }) => {

    const record = useMemo(() => { return { stakeAmount, timestamp, curAmount, wbnbAmount } }, [stakeAmount, timestamp, curAmount, wbnbAmount])
    const nowTs = Date.now();
    const { setUnStakeItem } = useStakeActions()
    const navigate = useNavigate()

    const rewardType = useMemo(() => Number(timestamp) + day30 > nowTs ? STAKE_NO_REWARD : Number(timestamp) + day180 > nowTs ? STAKE_HALF_REWARD : STAKE_FULL_REWARD, [nowTs, timestamp])

    return (
        <>
            <Accordion
                number={stakeAmount}
                title={
                    <div className="flex items-center">
                        <div className="mr-2 flex">
                            <img src={tifi} alt="Tifi" />
                        </div>
                        <span className="text-white text-sm lg:text-base">TIFI</span>
                    </div>
                }
                body={
                    <>
                        <div className="flex item-center lg:justify-between lg:flex-row flex-col">
                            <div>
                                <small className="text-neutral-black-10">Staked On</small>
                            </div>
                            <div>
                                <small className="text-neutral-black-10">{getDateTime(timestamp)}</small>
                            </div>
                        </div>
                        {
                            Number(timestamp) + day180 > nowTs && (
                                <div className="my-4">
                                    <Notice text={"The amounts showing below is based on the rewards TiFi Bank collected so far. It is accumulating as more transactions that will happen on blockchain network."} handleClose={function (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
                                        throw new Error("Function not implemented.");
                                    }} />
                                </div>
                            )
                        }
                        <div>
                            <h3 className="text-neutral-black-10 lg:text-base text-sm">Rewards</h3>
                        </div>

                        <div className="flex items-center lg:justify-between flex-col lg:flex-row my-4 text-neutral-black-10">
                            <div className="lg:text-xs text-[.64rem]">{Number(timestamp) + day180 > nowTs ? `${T("After")} ${getDateTime(Number(timestamp) + day180)}  - ${T("at least")}` : `${T('Unstake now')}`}</div>
                            <div className="flex lg:items-center lg:flex-row flex-col">
                                <div className="flex items-center lg:justify-between">
                                    <div>
                                        <img src={tifi} alt="Tifi Currency" />
                                    </div>
                                    <div className="text-xs ml-2">{curAmount} TiFi</div>
                                </div>
                                <div className="flex items-center justify-between ml-0 lg:ml-4">
                                    <div>
                                        <img src={bnb} alt="Tifi Currency" />
                                    </div>
                                    <div className="text-xs ml-2">{wbnbAmount}WBNB</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between my-4 text-neutral-black-10">
                            <div className="text-xs text-[.64rem]">{Number(timestamp) + day180 > nowTs ? `${T("After")} ${getDateTime(Number(timestamp) + day30)} - at least` : T("Unstake Now")} </div>
                            <div className="flex items-center ">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <img src={tifi} alt="Tifi Currency" />
                                    </div>
                                    <div className="text-xs ml-2"> {toFixed(
                                        stakeAmount / 2 + curAmount / 2,
                                        10
                                    )} TiFi</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between my-4 text-neutral-black-10">
                            <div className="text-xs">{Number(timestamp) + day30 > nowTs ? `Unstake now, you will get` : ""}</div>
                            <div className="flex items-center ">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <img src={tifi} alt="Tifi Currency" />
                                    </div>
                                    <div className="text-xs ml-2">{stakeAmount}TiFi</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            <Button
                                label="Unstake"
                                className="bg-transparent border-2 border-white rounded-xl text-white"
                                onClick={() => {
                                    setUnStakeItem({ ...record, rewardType })
                                    navigate('/stake?action=unstake')
                                }}
                            />
                        </div>
                    </>
                }
            />
        </>
    );
};