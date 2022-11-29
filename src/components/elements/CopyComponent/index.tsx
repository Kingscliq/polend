import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from '@material-tailwind/react';
import React, { ReactNode } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

interface CopyComponentType {
  copyText: string;
  copyBody?: ReactNode;
}

const CopyComponent = ({ copyText, copyBody }: CopyComponentType) => {
  return (
    <Popover
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
    >
      <PopoverHandler>
        <Button className="w-fit h-fit p-0 mr-2 bg-transparent">
          <CopyToClipboard text={copyText}>
            <div className="relative">{copyBody}</div>
          </CopyToClipboard>
        </Button>
      </PopoverHandler>
      <PopoverContent className="text-xs py-1 px-2 rounded">
        Copied!
      </PopoverContent>
    </Popover>
  );
};

export default CopyComponent;
