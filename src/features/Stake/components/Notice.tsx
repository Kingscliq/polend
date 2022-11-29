// import { close } from '@//assets/icons'
// import Card from '@//components/elements/Card'

import { ReactNode } from 'react';
import { close } from '../../../assets/icons';
import Card from '../../../components/elements/Card';

interface NoticeProps {
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  text: string | ReactNode;
}

const Notice: React.FC<NoticeProps> = ({ handleClose, text }) => {
  return (
    <Card className="relative">
      <section className="">
        <div className="absolute right-2 top-2">
          <button onClick={handleClose}>
            <img src={close} alt="close" />
          </button>
        </div>
        <div className="mr-4">
          <p className="text-xs text-tifi-grey leading-snug">
            <span className="font-bold">Notice:</span> {text}
          </p>
        </div>
      </section>
    </Card>
  );
};

export default Notice;
