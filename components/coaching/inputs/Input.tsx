"use client"

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";
import { useState } from "react";

interface InputProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    rows?: number; // For textarea
    isTextArea?: boolean; // To determine if it's a textarea
    placeholder?: string; // Add placeholder prop
}

const Input: React.FC<InputProps> = ({
    id,
    label,
    type = 'text',
    disabled,
    formatPrice,
    required,
    register,
    errors,
    rows = 4,
    isTextArea = false,
    placeholder = " "
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  
  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    setIsNotEmpty(!!e.target.value);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsNotEmpty(!!e.target.value);
  };
  
  // Shared input/textarea properties
  const inputProps = {
    id,
    disabled,
    ...register(id, {
      required,
      onChange: handleChange
    }),
    placeholder: "",  // Empty placeholder to avoid native placeholder display
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
  
  const baseClasses = `
    peer
    w-full
    p-4
    pt-6
    pb-2
    font-light
    bg-white
    dark:bg-neutral-900
    dark:text-white
    border
    rounded-md
    outline-none
    transition
    theme-transition
    disabled:opacity-70
    disabled:cursor-not-allowed
    ${formatPrice ? 'pl-9' : 'pl-4'}
    ${errors[id] ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'}
    ${errors[id] ? 'focus:border-red-500' : 'focus:border-black dark:focus:border-white'}
  `;
  
  return (
    <div className="w-full relative">
        {formatPrice && (
            <BiDollar 
                size={24}
                className="
                    text-neutral-700
                    dark:text-neutral-300
                    absolute
                    top-5
                    left-2
                    z-10
                "
            />
        )}
        
        {!isTextArea ? (
            <input
                type={type}
                className={baseClasses}
                {...inputProps}
            />
        ) : (
            <textarea
                rows={rows}
                className={`${baseClasses} resize-none`}
                {...inputProps}
            />
        )}
        
        {/* Label always floats above when focused or not empty */}
        <label
            className={`
                absolute
                text-md
                duration-150
                transform
                z-10
                origin-[0]
                ${formatPrice ? 'left-9' : 'left-4'}
                ${(isFocused || isNotEmpty) 
                  ? 'top-2 scale-75 -translate-y-0 text-zinc-500 dark:text-neutral-400' 
                  : 'top-5 scale-100 translate-y-0 text-zinc-400 dark:text-neutral-500'}
                ${errors[id] ? 'text-rose-500' : ''}
            `}>
            {label}
        </label>
        
        {/* Placeholder text only shown when focused and not typing */}
        {(isFocused && !isNotEmpty && placeholder !== " ") && (
            <div className="absolute text-sm text-neutral-500 dark:text-neutral-400 top-[34px] left-4 pointer-events-none">
                {placeholder}
            </div>
        )}
    </div>
  );
}

export default Input;