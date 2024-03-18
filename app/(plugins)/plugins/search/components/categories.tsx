"use client";

import { CourseCategory, PluginCategory } from "@prisma/client";

import { IconType } from "react-icons"
import { PluginCategoryItem } from "./category-item";


interface CategoriesProps {
    items: PluginCategory[];
}

const iconMap: Record<PluginCategory["name"], IconType> = {

};

export const PluginCategories = ({
    items,
}: CategoriesProps) => {
    return (
        <div className="flex flex-wrap items-center gap-y-4 gap-x-2 pb-2">
            <PluginCategoryItem 
                key="all"
                label="All"
                // No value means this represents all categories
            />
            {items.map((item) => (
                <PluginCategoryItem 
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}