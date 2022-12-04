import { wallet } from '@assets/icons';

const ComingSoon = () => {
  return (
    <section className="py-8 w-full flex items-center justify-center px-3">
      <div>
        <div className="flex items-center justify-center">
          <img src={wallet} className="w-32 h-32" alt="Tifi Logo Band" />
        </div>
        <div className="mt-6">
          <h5 className="text-white font-light uppercase text-lg text-center">
            Market
          </h5>
        </div>
        <div>
          <h1 className="text-[3rem] text-white font-semibol  text-center ">
            Coming Soon
          </h1>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;
