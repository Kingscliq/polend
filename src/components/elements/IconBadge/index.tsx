import React from 'react';

const IconBadge: React.FC<{ icon: string }> = ({ icon }) => {
  return (
    <section className="bg-neutral-black-400 p-1 w-auto cursor-pointer">
      <img src={icon} alt="Icon Badge" />
    </section>
  );
};

export default IconBadge;
