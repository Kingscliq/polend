import { T } from 'react-translator-component';
import { useState } from 'react';
import { arIcon, deIcon, enIcon } from '@config/flag';
import { caretDown } from '@assets/icons';

export type SelectComponentProps = {
  value?: string;
  label?: string;
  icon?: string;
};

const Test = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState<SelectComponentProps>({
    value: 'en',
    label: 'English',
    icon: enIcon,
  });

  const options = [
    { value: 'en', label: 'English', icon: enIcon },
    { value: 'de', label: 'Deustch', icon: deIcon },
    { value: 'ar', label: 'Arabic', icon: arIcon },
  ];

  console.log(selectedValue);

  return (
    <div className="bg-red-300 h-full">
      <h6 className="text-white">{T('Home')}</h6>

      <div className="bg-yellow-200 relative">
        <div
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center justify-between px-3 py-2 bg-neutral-black-400 text-white cursor-pointer"
        >
          <div className="flex items-center">
            <img src={selectedValue?.icon} className="w-5 h-5" alt="Selected" />
            <span className="mx-3">{selectedValue?.label}</span>
          </div>
          <img
            className={`${openDropdown ? 'rotate-180' : 'rotate-0'
              } transition-all ease-in-out duration-300`}
            src={caretDown}
            alt="Caret Down"
          />
        </div>

        {openDropdown && (
          <ul
            onClick={() => setOpenDropdown(false)}
            className="bg-green-200 z-50 absolute overflow-auto w-full max-h-40"
          >
            {options?.map((option) => (
              <li
                onClick={() => setSelectedValue(option)}
                className="flex items-center px-3 py-2 cursor-pointer bg-red-400/50 hover:bg-red-400"
              >
                <img src={option?.icon} className="w-5 h-5" alt="Selected" />
                <span className="mx-3">{option?.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-white"> Text to test the select dropdown</p>
    </div>
  );
};

export default Test;
