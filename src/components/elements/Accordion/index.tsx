import { caretDown } from '@assets/icons';
import React, { ReactNode, useState } from 'react';

type AccordionProps = {
  number: number;
  title: ReactNode;
  body: ReactNode;
  onClick?: () => void;
};

const Accordion = ({ number, title, body, onClick }: AccordionProps) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="p-4 mb-4 rounded-lg bg-neutral-black-600">
      <div className="flex justify-between items-center">
        {title}

        <div className="flex items-center">
          <span className="text-white mr-2 font-semibold">{number}</span>
          <button
            onClick={onClick}
            className="bg-neutral-black-400 p-3 rounded-sm"
          >
            <img
              onClick={() => setShowMore(!showMore)}
              className={`transition ease-in-out duration-300 ${
                showMore ? 'rotate-180' : 'rotate-0'
              }`}
              src={caretDown}
              alt="CaretDown"
            />
          </button>
        </div>
      </div>

      {showMore && (
        <div
          data-aos="fade-down"
          data-aos-duration="3000"
          className="border-t border-neutral-black-400 mt-4 pt-4"
        >
          {body}
        </div>
      )}
    </div>
  );
};

export default Accordion;
