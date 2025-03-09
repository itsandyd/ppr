"use client";

import { IconType } from "react-icons";

interface CategoryInputProps {
    icon: IconType;
    label: string;
    selected?: boolean;
    onClick: (value: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
    icon: Icon,
    label,
    selected,
    onClick,
}) => {
  return (
    <div 
        onClick={() => onClick(label)}
        className={`
            rounded-xl
            border-2
            p-5
            flex
            flex-col
            items-center
            justify-center
            gap-4
            hover:border-black
            dark:hover:border-white
            transition
            cursor-pointer
            theme-transition
            ${selected ? 'border-black dark:border-white' : 'border-neutral-200 dark:border-neutral-700'}
            ${selected ? 'dark:text-white' : 'dark:text-neutral-300'}
            bg-white
            dark:bg-neutral-800
        `}>
            <Icon size={24} className="text-neutral-700 dark:text-neutral-300" />
            <div className="font-medium text-sm">
                {label}
            </div>
    </div>
  )
}

export default CategoryInput