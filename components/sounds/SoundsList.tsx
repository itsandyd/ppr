import { Plugin, PluginCategory, Sounds, SoundsCategory } from "@prisma/client";
import { SoundsCard } from "./SoundsCard";

interface SoundsWithCategory extends Sounds {
  category: SoundsCategory | null; // Extend Plugin with category relation
}

interface SoundsListProps {
  items: SoundsWithCategory[]; // Use the extended interface
}

export const SoundsList = ({
  items
}: SoundsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <SoundsCard
            key={item.id}
            id={item.id}
            slug={item.slug}
            name={item.name} 
            imageUrl={item.image || 'placeholder.svg' as string} // Assuming 'image' is the correct field for the plugin's image URL
            description={item.description}
            category={item.category?.name || 'No Category'} // Handle possibly undefined category
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No sounds found
        </div>
      )}
    </div>
  );
}