// import Button from '@//components/elements/Button';
// import { fire } from '@//assets/icons';

import { fire } from '../../assets/icons';
import Button from '../elements/Button';

const AllVerse = () => {
  return (
    <section className="rounded-3xl bg-neutral-black-500 shadow p-5 lg:p-6 m-auto">
      <section className="flex items-center justify-center">
        <div>
          <h3 className="text-2xl font-semibold text-white text-center mb-4">
            Allverse
          </h3>
          <Button
            className="text-sm bg-gradient-to-r from-[#047CFD] to-primary text-white rounded-3xl"
            btnRightIcon={fire}
            label="Coming Soon"
          />
        </div>
      </section>
    </section>
  );
};

export default AllVerse;
