"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SkillLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SkillLevelSelector: React.FC<SkillLevelSelectorProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Skill Level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Beginner">Beginner</SelectItem>
        <SelectItem value="Intermediate">Intermediate</SelectItem>
        <SelectItem value="Advanced">Advanced</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default SkillLevelSelector;