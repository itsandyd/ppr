import { Plugin, PluginType } from "@prisma/client";
import { PluginCard } from "./PluginCard";

type PluginWithType = Plugin & {
  pluginType: PluginType | null;
};

interface PluginsListProps {
  items: PluginWithType[];
}

export const PluginList = ({
  items
}: PluginsListProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <PluginCard
            key={item.id}
            id={item.id}
            slug={item.slug ?? ""}
            name={item.name}
            price={item.price || 0}
            imageUrl={item.image || '/placeholder.svg'}
            description={item.description || ''}
            type={item.pluginType?.name || 'No Type'}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-zinc-400 mt-10">
          No plugins found. Try adjusting your search.
        </div>
      )}
    </div>
  );
}