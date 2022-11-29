import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

interface SelectDropdownProps {
  className?: string;
  controlClassName?: string;
  menuClassName?: string;
  onChange: () => void | any;
  options: [] | any;
  value?: any;
  placeholder: string;
}

const SelectDropdown = ({
  className,
  controlClassName,
  menuClassName,
  onChange,
  options,
  value,
  placeholder,
}: SelectDropdownProps) => {
  return (
    <Dropdown
      className={className}
      controlClassName={
        controlClassName ||
        'bg-neutral-black text-white cursor-pointer border-0'
      }
      menuClassName={
        menuClassName || 'bg-neutral-black-700 border-0 text-white'
      }
      onChange={onChange}
      options={options}
      value={value}
      placeholder={placeholder || 'Select an option'}
    />
  );
};

export default SelectDropdown;
