"use client";

import { IoMdClose } from "react-icons/io";
import { X } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';

import Button from "../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] isolate">
      <div
        className="
          fixed
          inset-0
          bg-neutral-800/70
          dark:bg-black/80
          backdrop-blur-sm
        "
        onClick={handleClose}
      ></div>
      <div
        className="
          fixed
          inset-0
          z-[101]
          flex
          items-center
          justify-center
          overflow-y-auto
          overflow-x-hidden
          outline-none
          focus:outline-none
        "
      >
        <div
          className="
            relative 
            w-full 
            md:w-4/6 
            lg:w-3/6 
            xl:w-2/5 
            my-6 
            mx-auto 
            h-auto
            max-h-[90vh]
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/*content*/}
          <div
            className={`
              translate
              duration-300
              h-full
              ${showModal ? 'translate-y-0' : 'translate-y-full'}
              ${showModal ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <div className="translate border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-neutral-900 outline-none focus:outline-none theme-transition overflow-hidden">
              {/*header*/}
              <div className="flex items-center justify-center p-6 rounded-t relative border-b-[1px] border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={handleClose}
                  className="
                    p-1 
                    border-0 
                    hover:opacity-70 
                    transition 
                    absolute 
                    right-4
                    dark:text-white
                  "
                >
                  <X size={20} />
                </button>
                <div className="text-lg font-semibold text-center dark:text-white">
                  {title}
                </div>
              </div>
              {/*body*/}
              <div className="
                relative
                p-6
                flex-auto
                dark:text-neutral-200
                overflow-auto
                max-h-[calc(90vh-180px)]
              ">
                {body}
              </div> 
              {/*footer*/}
              <div className="flex flex-col gap-2 p-6 border-t-[1px] border-neutral-200 dark:border-neutral-700">
                <div className="flex flex-row items-center gap-4 w-full justify-center">
                  {secondaryAction && secondaryActionLabel && (
                  <Button 
                    disabled={disabled}
                    label={secondaryActionLabel}
                    onClick={handleSecondaryAction}
                    outline
                    small
                    />
                    )}
                  <Button 
                    disabled={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                    />
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
