"use client";

import React, { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface ToolsSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const tools = [
  "Ableton Live", "FL Studio", "Logic Pro", "Pro Tools", "Cubase", "GarageBand", 
  "Audacity", "Reaper", "Reason", "Bitwig Studio", "Studio One", "Other"
];

const ToolsSelector: React.FC<ToolsSelectorProps> = ({ value, onChange }) => {
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
  }, [checkedItems]);

  return (
    <div>
      {tools.map((tool) => (
        <div key={tool}>
          <Checkbox 
            checked={checkedItems.includes(tool)}
            onCheckedChange={(checked) => handleCheckboxChange(Boolean(checked), tool)}
            name={tool}
          />
          <label htmlFor={tool}>{tool}</label>
        </div>
      ))}
    </div>
  );
}

export default ToolsSelector;