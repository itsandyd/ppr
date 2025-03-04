"use client";

import { SoundsCategory } from "@prisma/client";
import { CategoryCard } from "./CategoryCard";

interface SoundCategoriesProps {
  items: SoundsCategory[];
}

export const SoundCategories = ({
  items
}: SoundCategoriesProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2">
      {items.map((category) => (
        <CategoryCard
          key={category.id}
          id={category.id}
          name={category.name}
        />
      ))}
    </div>
  );
};