"use client";

import { CourseCategory, PluginCategory, PluginType } from "@prisma/client";

import { IconType } from "react-icons"
import { PluginCategoryItem } from "./category-item";
import { PluginTypeItem } from "./type-item";
import { PluginCategories } from "./categories";


interface TypesProps {
    items: PluginType[];
    onTypeSelect?: (typeId: string | null) => void; // Add this prop
}

const iconMap: Record<PluginType["name"], IconType> = {

};

export const PluginTypes = ({
    items,
}: TypesProps) => {
    return (
        <div className="flex flex-wrap items-center gap-y-4 gap-x-2 pb-2">
            <PluginTypeItem 
                key="all"
                label="All"
                // No value means this represents all categories
            />
            {items.map((item) => (
                <PluginTypeItem 
                key={item.id}
                label={item.name}
                icon={iconMap[item.name]}
                value={item.id}
                name={item.name} // Pass the name as a prop
            />
            ))}
        </div>
    )
}