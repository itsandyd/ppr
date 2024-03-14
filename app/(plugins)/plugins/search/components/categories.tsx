"use client";

import { CourseCategory, PluginCategory } from "@prisma/client";

import { IconType } from "react-icons"
import { PLuginCategoryItem } from "./category-item";


interface CategoriesProps {
    items: PluginCategory[];
}

const iconMap: Record<PluginCategory["name"], IconType> = {

};

export const PluginCategories = ({
    items,
}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <PLuginCategoryItem 
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    )
}