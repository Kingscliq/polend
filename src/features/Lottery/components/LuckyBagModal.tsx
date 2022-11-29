import React, { SetStateAction, useEffect, useState } from 'react';
import {
  luckyBagIcon,
  bronzeBag,
  silverBag,
  goldBag,
  blueSapphireBag,
  redRubyBag,
  tifiJackpot,
} from '@assets/icons';
import Button from '@components/elements/Button';
import Modal from '@components/elements/Modal';
import { T } from 'react-translator-component';
import { useReward } from 'react-rewards';
import {
  REWARD_NAMES,
  STAGE_PENDING,
  STAGE_PRESELECT,
  STAGE_REVEALED,
} from '../constants/constant';
import { toFixed } from '@utils/tifi';

type ModalProps = {
  modalClose?: any;
  lotteryBagCount: {
    count: number;
    style: string;
  };
  bagId: number;
  setBagId: React.Dispatch<SetStateAction<number>>;
  handleSelect: () => void;
  handleClose: () => void;
  betAmount: number;
  rate: number;
  prizeAmount: number;
  prizeRate: number;
  stage: number;
};

type BagImageTypes = {
  num: number;
  onClick?: () => void;
};

const BagImage = ({ num, onClick }: BagImageTypes) => {
  return (
    <button
      className="relative w-fit py-2 px-4 transition-all duration-500 ease-linear hover:bg-primary rounded"
      onClick={onClick}
    >
      <img src={luckyBagIcon} className="relative" alt="bag icon" />
      <span className="bottom-2 right-0 absolute py-[1px] px-2 text-white text-xs bg-[#454550] rounded-2xl">
        #{num}
      </span>
    </button>
  );
};

const LuckyBagModal = ({
  modalClose,
  lotteryBagCount,
  bagId,
  setBagId,
  handleSelect,
  betAmount,
  handleClose,
  rate,
  prizeAmount,
  prizeRate,
  stage,
}: ModalProps) => {
  const bagList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const prizeBags = [
    bronzeBag,
    silverBag,
    goldBag,
    blueSapphireBag,
    redRubyBag,
    tifiJackpot,
  ];

  const [selectedBag, setSelectedBag] = useState();
  const [loading, setLoading] = useState(false);

  const pickBag = (num: any) => {
    setBagId(num + 1);
    setTimeout(() => {
      handleSelect();
    }, 1000);

    setTimeout(() => {
      setLoading(true);
    }, 1000);

    const newBag: any = bagList.filter((bag: any) => bag === num);
    setSelectedBag(newBag);
  };

  const pickAnother = () => {
    setLoading(false);
    setBagId(0);
    modalClose();
    handleClose();
  };

  const { reward } = useReward('confettiReward', 'confetti', {
    lifetime: 1000,
    elementCount: 20 * prizeRate,
  });

  useEffect(() => {
    if (stage === STAGE_REVEALED && prizeRate > 0) {
      reward();
    }
  });

  return (
    <>
      <Modal
        modalClose={modalClose}
        title={
          stage === STAGE_PENDING
            ? T('You have selected the bag:')
            : stage === STAGE_PRESELECT
            ? T('Please select your Lucky Bag!')
            : T('Congratulations!')
        }
        modalBody={
          <div className="mt-8">
            {loading ? (
              <>
                {stage === STAGE_REVEALED && prizeRate > 0 && (
                  <div className="text-center">
                    <h2 className="text-grey-100 text-xl">
                      You have won a {REWARD_NAMES[prizeRate]}!
                    </h2>
                    <div className="w-fit mx-auto my-5">
                      <img
                        src={prizeBags[prizeRate - 1]}
                        alt={`Prize Bag ${prizeRate}`}
                        height={100}
                        width={78}
                      />
                    </div>

                    <div className="w-fit mb-8 mx-auto flex items-center">
                      <span className="text-grey-100 text-sm">
                        You’ve won {`${toFixed(prizeAmount, 10)} TiFi`}
                      </span>
                      <span
                        className={`ml-2 w-8 h-8 text-white flex items-center justify-center ${lotteryBagCount.style} rounded-full`}
                      >
                        {lotteryBagCount.count}x
                      </span>
                      <span id="confettiReward" />
                    </div>

                    <div className="w-5/6 mx-auto">
                      <Button
                        onClick={() => pickAnother()}
                        label={T('Bet Again')}
                        className="text-xs bg-primary rounded-[10px] text-white"
                      />
                    </div>
                  </div>
                )}
                {stage === STAGE_PENDING && bagId > 0 && (
                  <div>
                    <div className="relative w-fit mx-auto mb-10 animate-bounce">
                      <img
                        src={luckyBagIcon}
                        className="relative"
                        alt="bag icon"
                      />
                      <span className="-bottom-1 -right-2 absolute py-[1px] px-2 text-white text-xs bg-[#454550] rounded-2xl">
                        #{selectedBag}
                      </span>
                    </div>

                    <span className="block text-center text-sm text-grey-100">
                      {T(
                        'Hold on! Your lucky bag will be revealed in a few seconds!',
                      )}
                    </span>

                    <div className="w-fit mt-8 mx-auto flex items-center">
                      <span className="text-grey-100 text-sm">
                        {T('You are paying')} {`${toFixed(betAmount, 10)} TIFI`}
                        {T(' for a Lucky Bag!')}
                      </span>
                      <span
                        className={`ml-2 w-8 h-8 text-white flex items-center justify-center ${lotteryBagCount.style} rounded-full`}
                      >
                        {lotteryBagCount.count}x
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-fit mx-auto grid grid-cols-3 md:grid-cols-4 gap-x-12 gap-y-12">
                  {bagList?.map((bag, i) => (
                    <BagImage key={i} num={bag} onClick={() => pickBag(bag)} />
                  ))}
                </div>

                <div className="w-fit mt-8 mx-auto flex items-center">
                  <span className="text-grey-100 text-sm">
                    You are paying {`${toFixed(betAmount, 10)} TiFi`} for a
                    Lucky Bag!
                  </span>
                  <span
                    className={`ml-2 w-8 h-8 text-white flex items-center justify-center ${lotteryBagCount.style} rounded-full`}
                  >
                    {lotteryBagCount.count}x
                  </span>
                </div>
              </>
            )}
          </div>
        }
      />
    </>
  );
};

export default LuckyBagModal;
