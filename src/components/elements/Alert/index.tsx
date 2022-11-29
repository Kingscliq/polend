import { arrowRightWhite, close, noticeIcon, successIcon } from '@assets/icons';
import { useAlert, useAlertActions } from '@hooks/useAlert';
import { useLanguage, useLanguageActions } from '@hooks/useLanguage';
import { Alert } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { T } from 'react-translator-component';
import { useReward } from 'react-rewards';

const AlertModal = () => {
  const { message, type, url } = useAlert();
  const { removeAlert } = useAlertActions();

  const [alertOpen, setAlertOpen] = useState(false);

  const toggleAlert = () => {
    removeAlert({ message: '', type: '', url: { link: '', text: '' } });
    setAlertOpen(false);
  };

  useEffect(() => {
    if (message.length > 1 && type.length > 1 && url) {
      setAlertOpen(true);
    }
  }, [message.length, type.length, url]);

  // language translator
  const { language } = useLanguage();
  const { setLanguage } = useLanguageActions();

  useEffect(() => {
    setLanguage({ language: language });
  }, [language, setLanguage]);

  // confetti animation on success
  const { reward } = useReward('confettiAlert', 'confetti', {
    lifetime: 1000,
    elementCount: 50,
  });

  useEffect(() => {
    if (type === 'success') {
      reward();
    }
  });

  return (
    <div
      className={
        alertOpen
          ? 'block fixed inset-0 bg-black bg-opacity-50 h-full w-full z-[100]'
          : 'hidden'
      }
    >
      <Alert
        show={alertOpen}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
        className={`w-11/12 sm:w-3/5 lg:w-1/3 top-1/3 mx-auto bg-neutral-black bg-gradient-to-bl from-tifi-dark/80 via-tifi-dark/80 to-[#05a7ec20]`}
        dismissible={{
          onClose: () => toggleAlert(),
        }}
        children={
          <div className="w-full text-center ml-5">
            {type === 'error' || type === 'notice' || type === 'success' ? (
              <div
                className={`w-20 md:w-24 h-20 md:h-24 mx-auto mb-5 rounded-full flex items-center justify-center ${
                  type === 'error'
                    ? 'bg-red-400'
                    : type === 'notice'
                    ? 'bg-primary'
                    : type === 'success'
                    ? 'bg-green-600'
                    : ''
                }`}
              >
                <img
                  src={
                    type === 'error'
                      ? close
                      : type === 'notice'
                      ? noticeIcon
                      : successIcon
                  }
                  height={50}
                  width={50}
                  alt="alert icon"
                />
              </div>
            ) : (
              ''
            )}
            <div>
              <div className="mb-2">
                <span className="text-lg"> {T(message)} </span>
              </div>

              {type !== 'error' && (
                <div className="flex items-center justify-center cursor-pointer">
                  <a
                    href={url.link}
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="flex items-center">
                      <span>{T(url.text)}</span>
                      <span className="-rotate-45">
                        <img
                          src={arrowRightWhite}
                          alt=""
                          height={20}
                          width={20}
                        />
                      </span>
                    </div>
                  </a>
                </div>
              )}

              {/* confetti animation */}
              {type === 'success' && <span id="confettiAlert" />}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default AlertModal;
