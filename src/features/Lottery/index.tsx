import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { useEffect } from 'react';
import { T } from 'react-translator-component';
import LotteryMain from './components/LotteryMain';

const Lottery = () => {
  // for language translation
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  return (
    <div className="container w-full md:w-[558px] mx-auto">
      <div className="mb-10">
        <h1 className="text-white text-2xl font-semibold mb-3">
          {T('Lucky Bags')}
        </h1>
        <p className="text-neutral-black-0 text-sm">
          Buy mystery shopping bags and win TiFi!
        </p>
      </div>

      <LotteryMain />
    </div>
  );
};

export default Lottery;
