import { Tooltip } from '@material-tailwind/react';
// import { qMark } from '@//assets/icons';
import { placement } from '@material-tailwind/react/types/components/menu';
import { ReactNode } from 'react';

type tooltipProps = {
  content: string | ReactNode;
  position?: placement;
  children?: ReactNode;
  classname?: string;
};

const TooltipComponent = ({
  content,
  position,
  children,
  classname,
}: tooltipProps) => {
  return (
    <Tooltip
      content={content}
      placement={position}
      className={
        classname || 'bg-gradient-to-r from-[#047CFD]/70 to-primary/70'
      }
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
    >
      <span className="ml-2 hover:cursor-pointer">{children}</span>
    </Tooltip>
  );
};

export default TooltipComponent;
