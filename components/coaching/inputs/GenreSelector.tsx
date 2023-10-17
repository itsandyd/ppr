// components/coaching/inputs/GenreSelector.tsx
"use client";

import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface GenreSelectorProps {
    value: string[];
    onChange: (value: string[]) => void;
}

const genres = [
    "Rock", "Pop", "Jazz", "Classical", "Hip-Hop", "Country", "Electronic",
    "Folk", "Reggae", "Blues", "R&B", "Soul", "Metal", "Punk", "Indie", "Other"
];

const GenreSelector: React.FC<GenreSelectorProps> = ({ value, onChange }) => {
    const [checkedItems, setCheckedItems] = useState<string[]>(value);

    const handleCheckboxChange = (checked: boolean, name: string) => {
        if (checked) {
            setCheckedItems([...checkedItems, name]);
        } else {
            setCheckedItems(checkedItems.filter(item => item !== name));
        }
    };

    React.useEffect(() => {
        onChange(checkedItems);
    }, [checkedItems, onChange]);

    return (
        <div>
            {genres.map((genre) => (
                <div key={genre}>
                    <Checkbox
                        checked={checkedItems.includes(genre)}
                        onCheckedChange={(checked) => handleCheckboxChange(Boolean(checked), genre)}
                        name={genre}
                    />
                    <label htmlFor={genre}>{genre}</label>
                </div>
            ))}
        </div>
    );
}

export default GenreSelector;