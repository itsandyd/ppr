import { Plugin, PluginCategory } from "@prisma/client";
import { PluginCard } from "./PluginCard";

interface PluginWithCategory extends Plugin {
  category: PluginCategory | null; // Extend Plugin with category relation
}

interface PluginsListProps {
  items: PluginWithCategory[]; // Use the extended interface
}

export const PluginList = ({
  items
}: PluginsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <PluginCard
            key={item.id}
            id={item.id}
            name={item.name} 
            imageUrl={item.image || 'placeholder.svg' as string} // Assuming 'image' is the correct field for the plugin's image URL
            description={item.description}
            category={item.category?.name || 'No Category'} // Handle possibly undefined category
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No plugins found
        </div>
      )}
    </div>
  );
}