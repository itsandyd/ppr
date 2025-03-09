'use client';

import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled, 
  outline,
  small,
  icon: Icon,
}) => {
  return ( 
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-80
        transition
        w-full
        theme-transition
        ${outline 
          ? 'bg-white dark:bg-neutral-800' 
          : 'bg-[#3B97D8] dark:bg-[#3B97D8]'
        }
        ${outline 
          ? 'border-black dark:border-neutral-300' 
          : 'border-[#3B97D8] dark:border-[#3B97D8]'
        }
        ${outline 
          ? 'text-black dark:text-white' 
          : 'text-white'
        }
        ${small ? 'text-sm' : 'text-md'}
        ${small ? 'py-2 px-4' : 'py-3'}
        ${small ? 'font-medium' : 'font-semibold'}
        ${small ? 'border-[1px]' : 'border-0'}
      `}
    >
      {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )}
      {label}
    </button>
   );
}
 
export default Button;