import React, { ReactNode } from 'react';
import { T } from 'react-translator-component';

interface HeaderProps {
  title: ReactNode;
  description?: string;
  descriptionProp?: ReactNode;
}
const Header: React.FC<HeaderProps> = ({
  title,
  description,
  descriptionProp,
}) => {
  return (
    <header className="mb-4 z-50">
      <h2 className="text-white font-bold text-2xl md:text-3xl mb-2">
        {T(title)}
      </h2>
      <p className="text-tifi-grey text-sm">
        {descriptionProp || T(description)}
      </p>
    </header>
  );
};

export default Header;
