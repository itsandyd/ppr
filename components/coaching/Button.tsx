'use client';

import { IconType } from "react-icons";
import React, { ReactNode } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";

interface ButtonProps {
  label: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled, 
  outline,
  small,
  icon: Icon,
  className = '',
}) => {
  return ( 
    <ShadcnButton
      disabled={disabled}
      onClick={onClick}
      variant={outline ? "outline" : "default"}
      size={small ? "sm" : "default"}
      className={`
        ${Icon ? "flex items-center gap-2" : ""}
        ${className}
      `}
    >
      {Icon && <Icon size={small ? 16 : 20} />}
      {label}
    </ShadcnButton>
   );
}
 
export default Button;