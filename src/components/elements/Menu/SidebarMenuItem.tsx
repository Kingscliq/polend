import { Link } from 'react-router-dom';
import React from 'react';
import { T } from 'react-translator-component';

interface SideBarMenuItemProps {
  title?: string;
  url?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  activeIcon?: string | any; // any type is assigned for static image
  baseIcon?: string | any; // any type is assigned for static image
  active?: boolean;
  showNav?: boolean;
  optionalIcon?: string;
}

const SidebarMenuItem: React.FC<SideBarMenuItemProps> = ({
  active,
  baseIcon,
  activeIcon,
  url,
  title,
  className,
  onClick,
  optionalIcon,
}) => {
  return (
    <Link to={url || '/'}>
      <div className="flex items-center justify-between">
        <div
          className={[
            'flex w-full transition-all duration-500 ease-in-out items-center cursor-pointer hover:font-medium  border-primary hover:text-white px-4 py-3',
            `${active
              ? 'font-medium border-b-2 border-b-primary text-white'
              : 'font-normal text-grey-100'
            } `,
            className,
          ].join(' ')}
          onClick={onClick}
          title={title}
        >
          {/* {active ? (
            <div className={['flex items-center justify-center '].join(' ')}>
              <img
                src={activeIcon}
                alt="Merchant Portal"
                height={20}
                width={20}
              />
            </div>
          ) : (
            <div className={['flex items-center justify-center '].join(' ')}>
              <img
                src={baseIcon}
                alt="Merchant Portal"
                height={20}
                width={20}
              />
            </div>
          )} */}
          <div className="transition-all text-sm">{T(title)}</div>
          {optionalIcon && (
            <div className="ml-4">
              <img src={optionalIcon} alt="icon" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SidebarMenuItem;
