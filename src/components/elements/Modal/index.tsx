// import { closeGrey } from '@//assets/icons';
import React, { ReactNode } from 'react';
import { closeGrey } from '../../../assets/icons';

type ModalProps = {
  modalClose?: any;
  title?: string;
  modalBody?: ReactNode;
  customStyles?: string;
};

const Modal = ({ modalClose, customStyles, title, modalBody }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-[100]">
      <div
        className={`relative md:rounded-2xl sm:top-16 lg:top-36 mx-auto px-5 lg:px-7 py-5 lg:py-7 h-full md:h-fit shadow-lg ${
          customStyles || 'bg-neutral-black-700 w-full sm:w-4/5 lg:w-2/5'
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg lg:text-xl font-semibold">
            {title}
          </h2>
          <button onClick={modalClose}>
            <img src={closeGrey} alt="close grey" />
          </button>
        </div>

        <div>{modalBody}</div>
      </div>
    </div>
  );
};

export default Modal;
