"use client";

import useCountries from "@/hooks/useCountries";
import Select from "react-select";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    region: string;
    value: string;
}

interface CountrySelectProps {
    value?: CountrySelectValue
    onChange: (value: CountrySelectValue) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
    value,
    onChange,
}) => {
    const { getAll } = useCountries();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Wait for theme to be available on client-side
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="p-3 border-2 rounded-md h-[48px]"></div>;

    const isDark = theme === 'dark';
    
    return (
        <div className="z-[200]"> 
            <Select 
                placeholder="Anywhere"
                isClearable
                options={getAll()}
                value={value}
                onChange={(value) => onChange(value as CountrySelectValue)}
                formatOptionLabel={(option: any) => (
                    <div className="flex flex-row items-center gap-3 z-[1000]">
                        <div>{option.flag}</div>
                        <div>
                            {option.label}, 
                            <span className={`${isDark ? 'text-neutral-400' : 'text-neutral-500'} ml-1`}> 
                                {option.region}
                            </span>
                        </div>
                    </div>
                )}
                classNames={{
                    control: (state) => `p-3 border-2 ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-200'} ${state.isFocused ? (isDark ? 'border-white' : 'border-black') : ''}`,
                    placeholder: () => isDark ? 'text-neutral-400' : 'text-neutral-500',
                    input: () => `text-lg ${isDark ? 'text-white' : 'text-black'}`,
                    option: (state) => `text-lg ${
                        isDark 
                            ? state.isSelected ? 'bg-blue-900 text-white' : state.isFocused ? 'bg-neutral-700 text-white' : 'text-white'
                            : state.isSelected ? 'bg-blue-100' : state.isFocused ? 'bg-neutral-100' : ''
                    }`,
                    menu: () => isDark ? 'bg-neutral-800 border border-neutral-700' : 'bg-white',
                    singleValue: () => isDark ? 'text-white' : 'text-black',
                }}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                        ...theme.colors,
                        primary: isDark ? '#ffffff' : '#000000',
                        primary25: isDark ? '#334155' : '#ffe4e6',
                        primary50: isDark ? '#1e293b' : '#f8fafc',
                        neutral0: isDark ? '#262626' : '#ffffff',
                        neutral10: isDark ? '#404040' : '#f5f5f5',
                        neutral20: isDark ? '#525252' : '#e5e5e5',
                        neutral30: isDark ? '#737373' : '#d4d4d4',
                        neutral40: isDark ? '#a3a3a3' : '#a3a3a3',
                        neutral50: isDark ? '#d4d4d4' : '#737373',
                        neutral60: isDark ? '#d4d4d4' : '#525252',
                        neutral70: isDark ? '#e5e5e5' : '#404040',
                        neutral80: isDark ? '#f5f5f5' : '#262626',
                        neutral90: isDark ? '#ffffff' : '#171717',
                    },
                })}
            />
        </div>
    );
};

export default CountrySelect;