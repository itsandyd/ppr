import { Plugin, PluginCategory, PluginType } from "@prisma/client";
import { PluginCard } from "./PluginCard";

interface PluginWithType extends Plugin {
  pluginType: PluginType | null; // Extend Plugin with type relation
}

interface PluginsListProps {
  items: PluginWithType[]; // Use the extended interface
}

export const PluginList = ({
  items
}: PluginsListProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-6">
        {items.map((item) => (
          <PluginCard
            key={item.id}
            id={item.id}
            slug={item.slug || item.id}
            name={item.name}
            price={item.price || 0}
            imageUrl={item.image || '/placeholder.svg'}
            description={item.description}
            type={item.pluginType?.name || 'No Type'}
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