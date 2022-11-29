import { caretDown } from '@assets/icons';
import React, { useState } from 'react';
// import { useEffect } from 'react';

export type SelectComponentProps = {
  selectedValue?: { value?: string; label?: string; icon?: string };
  setSelectedValue?: React.Dispatch<React.SetStateAction<string>> | any;
  options: { value?: string; label?: string; icon?: string }[];
};

const SelectComponent = ({
  selectedValue,
  setSelectedValue,

  options,
}: SelectComponentProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  //   useEffect(() => {},[])

  return (
    <div className="z-[9999] relative">
      <div
        onClick={() => setOpenDropdown(!openDropdown)}
        className="rounded flex items-center justify-between px-3 py-2 bg-tifi-dark text-white cursor-pointer"
      >
        <div className="flex items-center">
          {selectedValue?.icon && (
            <img src={selectedValue?.icon} className="w-5 h-5" alt="Selected" />
          )}
          <span className="mx-3">{selectedValue?.label}</span>
        </div>
        <img
          className={`${
            openDropdown ? 'rotate-180' : 'rotate-0'
          } transition-all ease-in-out duration-300`}
          src={caretDown}
          alt="Caret Down"
        />
      </div>

      {openDropdown && (
        <ul
          onClick={() => setOpenDropdown(false)}
          className="z-[999] absolute overflow-auto w-full max-h-56"
        >
          {options?.map((option) => (
            <li
              key={option.label}
              onClick={() => setSelectedValue(option)}
              className="flex items-center px-3 py-2 cursor-pointer text-white bg-[#0C0C17] hover:text-black hover:bg-white"
            >
              {option?.icon && (
                <img src={option?.icon} className="w-5 h-5" alt="option icon" />
              )}
              <span className="mx-3 whitespace-nowrap">{option?.label}</span>
            </li>
          ))}
        </ul>
      )}

      {openDropdown && (
        <div
          className="fixed z-10 left-0 top-0 h-full w-full bg-transparent"
          onClick={() => setOpenDropdown(false)}
        ></div>
      )}
    </div>
  );
};

export default SelectComponent;
